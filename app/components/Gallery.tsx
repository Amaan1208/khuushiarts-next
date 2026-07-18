"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useCircleNav } from "./CircleTransition";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { artworks, Artwork } from "../data/artworks";

type ViewMode = "sphere" | "cylinder";

// Phone screens get a thinned-out gallery so the sphere/cylinder don't feel
// overcrowded on a small viewport. PHONE_BREAKPOINT matches the md: breakpoint
// used elsewhere in this file for phone-specific styling.
const PHONE_BREAKPOINT = "(max-width: 767px)";
const PHONE_ARTWORK_COUNT = 17;

function useIsPhone(): boolean {
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(PHONE_BREAKPOINT);
    const update = () => setIsPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isPhone;
}

// Evenly samples `count` items across the full list by index (rather than
// just truncating the tail) so the trimmed set still reads as evenly spaced
// once fed into the sphere/cylinder position math, which distributes purely
// by index order and total count.
function sampleEvenly<T>(list: T[], count: number): T[] {
  if (list.length <= count) return list;
  const step = list.length / count;
  return Array.from({ length: count }, (_, i) => list[Math.floor(i * step)]);
}

// Camera sits well outside the structure (see CAMERA_Z below) so these
// radii are kept tight — the cluster reads as one compact, cohesive
// gallery in the middle of the viewport instead of sprawling off-screen.
const SPHERE_RADIUS = 5.5;
const CYLINDER_RADIUS = 4.2;
const CAMERA_Z = 11;
const CAMERA_FOV = 55;

// Focal (click-to-expand) layout — the selected piece is fit inside a
// left-hand column computed from the camera's actual visible frustum at
// this depth, not a hardcoded world coordinate, so it can never clip
// off-screen regardless of viewport aspect ratio.
const FOCAL_Z = 7;
const FOCAL_WIDTH_FRACTION = 0.4;
const FOCAL_HEIGHT_FRACTION = 0.7;
const FOCAL_LEFT_MARGIN_FRACTION = 0.08;
const FOCAL_X_FALLBACK = -3;
// Slower lerp factor used only while a click state (focal/peripheral) is
// active, so the expand/collapse transition reads as a deliberate glide
// rather than a snap. Hover and idle motion keep their normal (faster) pace.
const CLICK_LERP_SPEED = 0.035;

function getSpherePosition(i: number, total: number): [number, number, number] {
  const phi = Math.acos(-1 + (2 * i) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  const r = SPHERE_RADIUS;
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

// Helix: each item advances by a fixed angle and steps up a fixed
// amount, winding around like a spiral staircase. The angle step is
// derived from a target total-turns count spread across every item
// (not a small integer "items per turn"), so no two items ever land on
// the exact same azimuth — with a small integer divisor (e.g. 6), items
// i and i+6 coincide exactly and stack into visible discrete columns
// instead of reading as one continuous coil. The group itself (not
// these per-item coordinates) is what animates on scroll — see
// CYLINDER_SCROLL_ROTATE_RATE / CYLINDER_SCROLL_RISE_RATE below.
const CYLINDER_TOTAL_TURNS = 2.5;
const CYLINDER_HEIGHT_STEP = 0.75;
const CYLINDER_SCROLL_ROTATE_RATE = 0.0025;
const CYLINDER_SCROLL_RISE_RATE = 0.01;
// Touch drag pixels are much smaller per-event than wheel deltaY, so scale
// them up to feel comparably responsive when swiping the helix.
const CYLINDER_DRAG_SCROLL_SCALE = 4;

function getCylinderPosition(i: number, total: number): [number, number, number] {
  const angleStep = (Math.PI * 2 * CYLINDER_TOTAL_TURNS) / total;
  const theta = i * angleStep;
  const r = CYLINDER_RADIUS;
  const verticalCenterOffset = ((total - 1) * CYLINDER_HEIGHT_STEP) / 2;
  const y = i * CYLINDER_HEIGHT_STEP - verticalCenterOffset;
  return [r * Math.cos(theta), y, r * Math.sin(theta)];
}

interface ImageMeshProps {
  artwork: Artwork;
  index: number;
  total: number;
  viewMode: ViewMode;
  clicked: number | null;
  onSelect: (id: number | null) => void;
  hovered: number | null;
  onHover: (id: number | null) => void;
  revealed: boolean;
}

// World-unit drop below each mesh's true target — while unrevealed, meshes
// mount this far below their spot so the intro reveal reads as photos
// sliding up from the bottom instead of just fading in place.
const REVEAL_DROP = 5;

function ImageMesh({ artwork, index, total, viewMode, clicked, onSelect, hovered, onHover, revealed }: ImageMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(artwork.src);
  const isSelected = clicked === artwork.id;
  const isOther = clicked !== null && !isSelected;
  const isHoveredSelf = clicked === null && hovered === artwork.id;
  const isOtherHovered = clicked === null && hovered !== null && !isHoveredSelf;

  const targetSphere = getSpherePosition(index, total);
  const targetCylinder = getCylinderPosition(index, total);
  const target = viewMode === "sphere" ? targetSphere : targetCylinder;

  const posRef = useRef(new THREE.Vector3(...target));
  const opRef = useRef(1);
  const scaleRef = useRef(1);
  const worldPos = useRef(new THREE.Vector3());
  const camForward = useRef(new THREE.Vector3());
  const toCamera = useRef(new THREE.Vector3());

  // Set the starting position once on mount only — it must never be a
  // reactive JSX prop, or every viewMode/clicked change would snap the
  // mesh straight to its new target instead of letting useFrame lerp it.
  // If the intro splash hasn't revealed yet, start dropped below the true
  // target so the normal per-frame lerp (below) carries it upward into
  // place once revealed flips true — that's the whole "slide up" effect.
  useEffect(() => {
    if (!meshRef.current) return;
    const start = revealed
      ? posRef.current
      : posRef.current.clone().setY(posRef.current.y - REVEAL_DROP);
    meshRef.current.position.copy(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const FOCAL_TARGET = useRef(new THREE.Vector3(FOCAL_X_FALLBACK, 0, FOCAL_Z));

  // Aspect ratio for texture — computed up front so the focal-fit math
  // below (which needs the mesh's true unscaled width/height) can use it.
  const img = texture.image as HTMLImageElement | undefined;
  const imgW = img?.naturalWidth || img?.width || 1;
  const imgH = img?.naturalHeight || img?.height || 1;
  const aspect = imgW / imgH;
  const planeW = aspect >= 1 ? 1.5 : 1.5 * aspect;
  const planeH = aspect >= 1 ? 1.5 / aspect : 1.5;

  useFrame(({ camera }) => {
    if (!meshRef.current || !revealed) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;

    let targetOpacity: number;
    let scaleMul = 1;

    if (isSelected) {
      // Fit the focused artwork inside a left-hand column sized from the
      // camera's *actual* visible frustum at the focal depth — not a
      // hardcoded world coordinate — so it can never clip off-screen and
      // always leaves clean whitespace on both sides of it.
      const cam = camera as THREE.PerspectiveCamera;
      const vFOV = THREE.MathUtils.degToRad(cam.fov);
      const depthFromCamera = camera.position.z - FOCAL_Z;
      const visibleHeight = 2 * Math.tan(vFOV / 2) * depthFromCamera;
      const visibleWidth = visibleHeight * cam.aspect;

      const maxWidth = visibleWidth * FOCAL_WIDTH_FRACTION;
      const maxHeight = visibleHeight * FOCAL_HEIGHT_FRACTION;
      const fitScale = Math.min(maxWidth / planeW, maxHeight / planeH);

      const renderedWidth = planeW * fitScale;
      const leftEdgeX = -visibleWidth / 2 + FOCAL_LEFT_MARGIN_FRACTION * visibleWidth;
      const centerX = leftEdgeX + renderedWidth / 2;

      FOCAL_TARGET.current.set(centerX, 0, FOCAL_Z);
      meshRef.current.position.lerp(FOCAL_TARGET.current, CLICK_LERP_SPEED);
      // Orientation snaps flat immediately (no lerp) — only position and
      // scale animate, so the click reads as a pure zoom-into-place with
      // no rotating/spinning motion.
      meshRef.current.rotation.set(0, 0, 0);
      targetOpacity = 1;
      scaleMul = fitScale;
    } else if (isOther) {
      // Peripheral: dimmed to invisible — only the focused piece reads.
      const t = new THREE.Vector3(...target);
      meshRef.current.position.lerp(t.multiplyScalar(1.4), CLICK_LERP_SPEED);
      meshRef.current.lookAt(camera.position);
      targetOpacity = 0;
      scaleMul = 0.6;
    } else if (isOtherHovered) {
      // A sibling is hovered — recede into translucency.
      const t = new THREE.Vector3(...target);
      meshRef.current.position.lerp(t, 0.06);
      meshRef.current.lookAt(camera.position);
      targetOpacity = 0.35;
    } else {
      // Normal position — curve inward, always facing the camera
      const t = new THREE.Vector3(...target);
      meshRef.current.position.lerp(t, 0.06);
      meshRef.current.lookAt(camera.position);
      targetOpacity = 1;
      if (isHoveredSelf) scaleMul = 1.15;
    }

    // Depth-based fade: panels rotating behind the camera dissolve
    // seamlessly instead of popping. Suspended while a click state is
    // active — the focal/peripheral opacities above own it fully then.
    meshRef.current.updateWorldMatrix(true, false);
    meshRef.current.getWorldPosition(worldPos.current);
    camera.getWorldDirection(camForward.current);
    toCamera.current.subVectors(worldPos.current, camera.position);
    const depth = toCamera.current.dot(camForward.current);
    const depthFade =
      clicked === null ? THREE.MathUtils.smoothstep(depth, -0.5, 1.5) : 1;

    const fadeScaleSpeed = clicked !== null ? CLICK_LERP_SPEED : 0.08;

    opRef.current = THREE.MathUtils.lerp(
      opRef.current,
      targetOpacity * depthFade,
      fadeScaleSpeed
    );
    mat.opacity = opRef.current;

    const scaleTarget =
      isSelected || isOther
        ? scaleMul
        : THREE.MathUtils.clamp(CAMERA_Z / worldPos.current.distanceTo(camera.position), 0.75, 1.25) * scaleMul;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, scaleTarget, fadeScaleSpeed);
    meshRef.current.scale.setScalar(scaleRef.current);
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(isSelected ? null : artwork.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(artwork.id);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
    >
      <planeGeometry args={[planeW, planeH]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
        opacity={1}
      />
    </mesh>
  );
}

function Scene({
  items,
  viewMode,
  clicked,
  onSelect,
  revealed,
}: {
  items: Artwork[];
  viewMode: ViewMode;
  clicked: number | null;
  onSelect: (id: number | null) => void;
  revealed: boolean;
}) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });
  const scrollAccum = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    // Camera sits well inside the sphere/cylinder radius (6 / 5.5) so the
    // structure wraps around the viewport instead of reading as a flat wall.
    (camera as THREE.PerspectiveCamera).fov = CAMERA_FOV;
    camera.position.set(0, 0, CAMERA_Z);
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(() => {
    // Hold the whole group still (no auto-rotate, no scroll-driven helix)
    // while the intro splash is still up — nothing should be spinning
    // behind a black screen the user can't see yet.
    if (!groupRef.current || !revealed) return;

    if (clicked !== null) {
      // Return the group to a neutral pose while a piece is focused so
      // the selected mesh's fixed left-screen local target actually
      // lands on the left of the screen instead of wherever the group
      // happened to be rotated/scrolled to.
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, CLICK_LERP_SPEED);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, CLICK_LERP_SPEED);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, CLICK_LERP_SPEED);
      return;
    }

    // Hovering freezes all ambient motion so the piece under the cursor
    // doesn't drift out from under it.
    if (hovered !== null) return;

    if (viewMode === "cylinder") {
      // Scroll-driven helix: the camera never moves — scrolling twists
      // and lifts the whole spiral group, feeding new paintings into the
      // fixed viewing frame like a conveyor belt.
      const rotTarget = scrollAccum.current * CYLINDER_SCROLL_ROTATE_RATE;
      const yTarget = scrollAccum.current * CYLINDER_SCROLL_RISE_RATE;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotTarget, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, yTarget, 0.08);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
      return;
    }

    // Sphere mode: drag / auto-rotate / wheel-tilt orbit
    if (!isDragging.current) {
      velocity.current.x *= 0.93;
      velocity.current.y *= 0.93;
      // Auto-rotate when not dragging
      rotation.current.y += 0.0015;
    }
    rotation.current.y += velocity.current.x;
    rotation.current.x += velocity.current.y;
    rotation.current.x = THREE.MathUtils.clamp(rotation.current.x, -0.6, 0.6);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      rotation.current.y,
      0.1
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      rotation.current.x,
      0.1
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
  });

  const handlePointerDown = useCallback((e: { clientX: number; clientY: number }) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
  }, []);

  const handlePointerMove = useCallback((e: { clientX: number; clientY: number }) => {
    if (!isDragging.current || clicked !== null) return;

    if (viewMode === "cylinder") {
      // Touchscreens never emit wheel events, so drag/swipe has to drive the
      // same scroll accumulator wheel does — otherwise the helix is
      // completely inert on touch. Dragging up feeds new photos in, matching
      // the "swipe up to scroll down" convention.
      const maxScrollAccum =
        (((items.length - 1) * CYLINDER_HEIGHT_STEP) / 2) / CYLINDER_SCROLL_RISE_RATE;
      scrollAccum.current = THREE.MathUtils.clamp(
        scrollAccum.current - (e.clientY - lastMouse.current.y) * CYLINDER_DRAG_SCROLL_SCALE,
        -maxScrollAccum,
        maxScrollAccum
      );
    } else {
      const dx = (e.clientX - lastMouse.current.x) * 0.003;
      const dy = (e.clientY - lastMouse.current.y) * 0.003;
      velocity.current.x = dx;
      velocity.current.y = dy;
    }
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, [clicked, viewMode, items.length]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (clicked !== null) return;
      if (viewMode === "cylinder") {
        // Clamp to the spiral's actual extent so scrolling past the first
        // or last photo just locks in place instead of drifting into
        // empty space beyond the ends.
        const maxScrollAccum =
          (((items.length - 1) * CYLINDER_HEIGHT_STEP) / 2) / CYLINDER_SCROLL_RISE_RATE;
        scrollAccum.current = THREE.MathUtils.clamp(
          scrollAccum.current + e.deltaY,
          -maxScrollAccum,
          maxScrollAccum
        );
      } else {
        // Both wheel axes drive rotation so the sphere tumbles fully in
        // whichever direction the user scrolls, instead of only spinning
        // flat on one axis. Idle auto-rotate (yaw-only) is unaffected.
        velocity.current.x += e.deltaY * 0.0002;
        velocity.current.y += e.deltaY * 0.00012;
      }
    },
    [clicked, viewMode, items.length]
  );

  useEffect(() => {
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp, handleWheel]);

  return (
    <group ref={groupRef}>
      {items.map((art, i) => (
        <ImageMesh
          key={art.id}
          artwork={art}
          index={i}
          total={items.length}
          viewMode={viewMode}
          clicked={clicked}
          onSelect={onSelect}
          hovered={hovered}
          onHover={setHovered}
          revealed={revealed}
        />
      ))}
    </group>
  );
}

export default function Gallery({ revealed = true }: { revealed?: boolean }) {
  const navigate = useCircleNav();
  const [viewMode, setViewMode] = useState<ViewMode>("sphere");
  const [clicked, setClicked] = useState<number | null>(null);
  const [detailArt, setDetailArt] = useState<Artwork | null>(null);
  const [prevClicked, setPrevClicked] = useState<number | null>(null);
  const isPhone = useIsPhone();
  const sceneArtworks = useMemo(
    () => (isPhone ? sampleEvenly(artworks, PHONE_ARTWORK_COUNT) : artworks),
    [isPhone]
  );

  // detailArt intentionally lags behind `clicked` on close — it keeps the
  // last-selected artwork's text in the DOM while the container's opacity
  // transitions out, instead of the text vanishing instantly. Adjusted
  // during render (React's documented pattern for derived state) rather
  // than in an effect, since it must never run for stale `clicked` values.
  if (clicked !== prevClicked) {
    setPrevClicked(clicked);
    if (clicked !== null) {
      setDetailArt(artworks.find((a) => a.id === clicked) ?? null);
    }
  }

  const handleSelect = useCallback((id: number | null) => {
    setClicked(id);
  }, []);

  const handleClose = useCallback(() => {
    setClicked(null);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Hero background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-img.png)" }}
      />

      {/* 3D Canvas */}
      <Canvas
        className="absolute inset-0"
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={handleClose}
      >
        <ambientLight intensity={1} />
        <Scene items={sceneArtworks} viewMode={viewMode} clicked={clicked} onSelect={handleSelect} revealed={revealed} />
      </Canvas>

      {/* HUD Overlay — fixed framework, all children re-declare the same
          padding since absolutely-positioned elements don't inherit it. */}
      <div className="fixed inset-0 pointer-events-none p-5 md:p-8 z-50">
        {/* Top navbar */}
        <div className="absolute top-0 left-0 right-0 pl-4 md:pl-8 pr-4 md:pr-8 pt-4 md:pt-6 pb-4 md:pb-8 flex justify-between items-center gap-3 md:gap-0 bg-[#E7D8BC] md:bg-transparent pointer-events-auto">
          <div className="pointer-events-auto shrink-0">
            <h1
              className="text-lg md:text-2xl font-black leading-none tracking-tight text-[#2C2520]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              KhuushiArts
            </h1>
          </div>
          <nav
            className="flex gap-3 md:gap-8 items-center pointer-events-auto text-[0.6rem] tracking-[0.1em] md:text-[0.72rem] md:tracking-[0.15em]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {[
              { label: "Collection", href: "/collection" },
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                  e.preventDefault();
                  navigate(href, e.currentTarget);
                }}
                className="uppercase no-underline whitespace-nowrap text-[#2C2520] transition-colors duration-300 hover:text-stone-500"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom-right view toggles */}
        <div
          className="absolute bottom-0 right-0 p-5 md:p-8 text-right flex flex-col items-end pointer-events-auto"
          style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.12em" }}
        >
          <p className="uppercase tracking-widest leading-relaxed text-[#2C2520] mb-2">Change the View</p>
          <div className="flex gap-3 justify-end">
            {(["sphere", "cylinder"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`uppercase cursor-pointer transition-colors duration-300 px-0 bg-transparent border-none outline-none text-[#2C2520] hover:text-stone-500 ${
                  viewMode === v ? "opacity-100 underline underline-offset-4" : "opacity-80"
                }`}
                style={{ fontFamily: "var(--font-inter)", fontSize: "0.68rem", letterSpacing: "0.12em" }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detail overlay — a locked right-hand column (w-1/3) that balances
          the left-anchored focal painting, with generous padding so text
          never floats toward center. Content (detailArt) lags behind
          `clicked` on close so it stays in the DOM through the fade-out
          instead of popping. */}
      <div
        className={`absolute top-0 right-0 h-full w-1/2 md:w-1/3 p-6 sm:p-14 md:p-24 flex flex-col justify-center items-start text-left gap-4 transition-opacity duration-500 ${
          clicked !== null ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ zIndex: 10 }}
      >
        {detailArt && (
          <>
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-[#2C2520] break-words"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {detailArt.title}
            </h2>
            <p
              className="hidden sm:block text-xs uppercase tracking-widest text-[#2C2520]/60"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              {detailArt.year}
            </p>
            <p
              className="hidden sm:block text-sm leading-relaxed text-[#2C2520]/80"
              style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
            >
              {detailArt.description}
            </p>
            <button
              onClick={handleClose}
              className="mt-2 self-start text-xs uppercase tracking-widest text-[#2C2520]/70 hover:text-[#2C2520] transition-colors duration-300 bg-transparent border-none outline-none cursor-pointer"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              ✕ Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
