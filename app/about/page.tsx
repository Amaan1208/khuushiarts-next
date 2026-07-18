"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion";
import SiteNav from "../components/SiteNav";
import { useCircleNav } from "../components/CircleTransition";

const EASE = [0.32, 0.72, 0, 1] as const;

function Journals() {
  const reduce = useReducedMotion();
  return (
    <div>
      <h2
        className="text-3xl md:text-4xl font-black text-[#000000] mb-14"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Journals
      </h2>
      <div className="grid grid-cols-12 gap-x-6 gap-y-16">
        <motion.article
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="col-span-12 md:col-span-7"
        >
          <div className="relative aspect-[16/10] overflow-hidden mb-6">
            <Image
              src="/photos/download-7.jpg"
              alt="Detail of gold leaf work on a Tanjore panel"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <h3
            className="text-2xl font-bold text-[#000000] mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Gold that outlives its maker
          </h3>
          <p
            className="text-sm leading-relaxed text-[#000000]/80 max-w-[65ch]"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            A Tanjore panel begins as cloth pasted to wood, coated in chalk gesso and
            raised, layer by layer, into low relief. Only then does the gold arrive:
            22 karat leaf pressed onto the raised lines so the surface holds light the
            way a temple lamp does. Done properly, the gold survives centuries. The
            notes here record how each panel in this collection was built, and how to
            keep it: away from direct sun, wiped only with a dry cotton cloth, never
            with water.
          </p>
        </motion.article>

        <motion.article
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="col-span-12 md:col-span-4 md:col-start-9 md:mt-24"
        >
          <h3
            className="text-2xl font-bold text-[#000000] mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Painting for the lord of Nathdwara
          </h3>
          <p
            className="text-sm leading-relaxed text-[#000000]/80"
            style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
          >
            Pichwai means, literally, that which hangs behind. For four centuries the
            painters of Nathdwara have made vast cloth backdrops for the shrine of
            Shrinathji, changing them with the seasons and festivals. The lotus for
            summer, the cows for Gopashtami. Working in this tradition means learning
            its calendar as much as its brushwork: every motif belongs to a moment in
            the year.
          </p>
        </motion.article>
      </div>
    </div>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "The Tanjore piece we commissioned sits in our living room and every guest asks about it. The gold work is finer than pieces we have seen in galleries twice the price.",
    name: "Meera & Arjun S.",
    place: "Dubai",
  },
  {
    quote:
      "Khuushi took a vague idea, a deity, a color, a wall, and returned a painting that felt like it had always belonged to our family.",
    name: "Priya R.",
    place: "Bengaluru",
  },
  {
    quote:
      "I bought a miniature as a wedding gift. The detail up close is astonishing; you can see individual strands in the peacock feathers.",
    name: "Daniel K.",
    place: "London",
  },
];

function Testimonials() {
  const reduce = useReducedMotion();
  // Two copies back to back so the loop reads as continuous — the track
  // animates from -50% to 0%, i.e. the second copy slides left to right
  // into the first copy's position with no visible seam.
  const track = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div>
      <h2
        className="text-3xl md:text-4xl font-black text-[#000000] mb-14"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Collectors
      </h2>
      <div className="relative -mx-5 md:-mx-8 lg:-mx-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div
          className={`flex w-max gap-10 px-5 md:px-8 lg:px-16 ${reduce ? "" : "animate-ticker"}`}
        >
          {track.map((t, i) => (
            <blockquote
              key={`${t.name}-${i}`}
              className="m-0 w-[320px] md:w-[380px] shrink-0 border-t border-[#000000]/25 pt-6"
            >
              <p
                className="text-base leading-relaxed text-[#000000] mb-4"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                “{t.quote}”
              </p>
              <footer
                className="text-xs uppercase tracking-widest text-[#000000]/70"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {t.name} · {t.place}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StoryStep {
  id: string;
  number: string;
  title: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  cta?: { label: string; href: string };
}

const STORY: StoryStep[] = [
  {
    id: "heritage",
    number: "01",
    title: "The Heritage",
    image: "/photos/download-5.jpg",
    imageAlt: "Contemporary canvas painting of three figures by the water",
    paragraphs: [
      "These art forms carry centuries. Tanjore painting grew in the courts of Thanjavur in the 1600s, its gold relief made to glow in oil-lamp shrines. Pichwai has hung behind the deity at Nathdwara since the 17th century, repainted for every season and festival. Miniature painting traveled from Persian ateliers into the courts of Rajasthan and the Punjab hills, where it became something entirely Indian.",
      "Working in them today is an act of preservation. Not preservation under glass, but the living kind: grinding the pigment, laying the gesso, repeating the forms until the hand knows them. The tradition survives by being practiced.",
    ],
  },
  {
    id: "visionary",
    number: "02",
    title: "The Visionary",
    image: "/photos/download-11.jpg",
    imageAlt: "Pichwai work in progress in the studio",
    paragraphs: [
      "Khuushi curates this collection the way a gallerist hangs a retrospective: each wing of the site is a school of painting, each piece annotated with its year and its story. The intent is simple. A visitor should leave knowing the difference between a Pichwai and a Tanjore, and why that difference matters.",
    ],
  },
  {
    id: "commission",
    number: "03",
    title: "The Commission",
    image: "/photos/download-2.jpg",
    imageAlt: "Miniature court scene in mineral pigment",
    paragraphs: [
      "Commissions are taken in all four forms. Some collectors arrive with a deity and a wall in mind; others bring only a feeling. Both are good starting points. The studio works from reference images, room photographs, and long conversations, and no two commissioned pieces have ever been alike.",
    ],
    cta: { label: "Request a commission", href: "/contact" },
  },
];

function AnimatedLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className="group relative mt-8 inline-flex items-center gap-3 no-underline text-[#000000]"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <span className="relative text-xs uppercase tracking-widest">
        {children}
        <span className="absolute left-0 -bottom-1 h-px w-full bg-black origin-left transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-x-0" />
        <span className="absolute left-0 -bottom-1 h-px w-full bg-black origin-right scale-x-0 transition-transform duration-500 delay-150 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-x-100" />
      </span>
      <span className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-xs transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

function StickyImageStack({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="sticky top-0 h-screen w-full flex items-center justify-center p-10 md:p-16">
      <div className="relative w-full max-w-sm md:max-w-md aspect-[3/4] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
        {STORY.map((step, i) => (
          <motion.div
            key={step.id}
            className="absolute inset-0"
            style={{ zIndex: i }}
            initial={false}
            animate={{ clipPath: i <= activeIndex ? "inset(0 0 0 0)" : "inset(0 0 0 100%)" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <motion.div
              className="absolute inset-0"
              initial={false}
              animate={{ scale: i === activeIndex ? 1.06 : 1 }}
              transition={{ duration: 1.4, ease: EASE }}
            >
              <Image
                src={step.image}
                alt={step.imageAlt}
                fill
                sizes="(max-width: 768px) 60vw, 28vw"
                className="object-cover"
                priority={i === 0}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StorySection({
  step,
  index,
  onEnter,
  navigate,
}: {
  step: StoryStep;
  index: number;
  onEnter: () => void;
  navigate: (href: string, el: HTMLElement) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      className="min-h-screen flex flex-col justify-center px-8 lg:px-16 py-24"
      onViewportEnter={onEnter}
      viewport={{ amount: 0.5 }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-lg"
      >
        <div
          className="text-7xl font-light text-[#000000]/15 leading-none mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {step.number}
        </div>
        <h2
          className="text-5xl font-black text-[#000000] mb-6"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {step.title}
        </h2>
        <div
          className="space-y-5 text-base leading-relaxed text-[#000000]/80"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
        >
          {step.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {step.cta && (
          <AnimatedLink
            href={step.cta.href}
            onNavigate={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey) return;
              e.preventDefault();
              navigate(step.cta!.href, e.currentTarget);
            }}
          >
            {step.cta.label}
          </AnimatedLink>
        )}
      </motion.div>

      <div className="mt-16 text-[10px] uppercase tracking-widest text-[#000000]/40" style={{ fontFamily: "var(--font-inter)" }}>
        {String(index + 1).padStart(2, "0")} / {String(STORY.length).padStart(2, "0")}
      </div>
    </motion.section>
  );
}

function MobileStoryPin({
  navigate,
}: {
  navigate: (href: string, el: HTMLElement) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(STORY.length - 1, Math.floor(v * STORY.length));
    setActive(Math.max(0, idx));
  });

  return (
    <div ref={containerRef} className="relative" style={{ height: `${STORY.length * 150}svh` }}>
      <div className="sticky top-0 h-[100svh] flex flex-col justify-center px-5 pt-20 pb-8 overflow-hidden">
        {/* Panel-wipe image stack */}
        <div className="relative w-full aspect-[16/10] overflow-hidden mb-8 shrink-0">
          {STORY.map((step, i) => (
            <motion.div
              key={step.id}
              className="absolute inset-0"
              style={{ zIndex: i }}
              initial={false}
              animate={{ clipPath: i <= active ? "inset(0 0 0 0)" : "inset(0 0 0 100%)" }}
              transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
            >
              <Image
                src={step.image}
                alt={step.imageAlt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i === 0}
              />
            </motion.div>
          ))}
        </div>

        {/* Cross-fading text per step */}
        <div className="relative flex-1 min-h-0">
          {STORY.map((step, i) => (
            <motion.div
              key={step.id}
              className="absolute inset-0 flex flex-col"
              initial={false}
              animate={{ opacity: i === active ? 1 : 0, y: i === active ? 0 : reduce ? 0 : 16 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              style={{ pointerEvents: i === active ? "auto" : "none" }}
              aria-hidden={i !== active}
            >
              <div
                className="text-3xl font-light text-[#000000]/15 leading-none mb-1 shrink-0"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {step.number}
              </div>
              <h2
                className="text-xl font-black text-[#000000] mb-2 shrink-0"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {step.title}
              </h2>
              <div
                className="space-y-2 text-xs leading-relaxed text-[#000000]/80 overflow-y-auto"
                style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
              >
                {step.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
              {step.cta && (
                <div className="shrink-0">
                  <AnimatedLink
                    href={step.cta.href}
                    onNavigate={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                      e.preventDefault();
                      navigate(step.cta!.href, e.currentTarget);
                    }}
                  >
                    {step.cta.label}
                  </AnimatedLink>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="shrink-0 mt-3 text-[10px] uppercase tracking-widest text-[#000000]/40" style={{ fontFamily: "var(--font-inter)" }}>
          {String(active + 1).padStart(2, "0")} / {String(STORY.length).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

function StickyNav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    if (latest > previous && latest > 120) {
      setHidden(true);
    } else if (latest < previous) {
      setHidden(false);
    }
  });

  return (
    <motion.div
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled ? "bg-[#ede0c4]/95 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.06)]" : "bg-transparent"
      }`}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
    >
      <SiteNav />
    </motion.div>
  );
}

export default function AboutPage() {
  const navigate = useCircleNav();
  const [active, setActive] = useState(0);

  return (
    <div
      className="relative min-h-[100dvh] bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "linear-gradient(rgba(237,224,196,0.5), rgba(237,224,196,0.5)), url(/images/aboutus-img.png)",
      }}
    >
      <StickyNav />

      {/* Hero — one huge opening statement before the sequence begins */}
      <section className="min-h-[100dvh] md:min-h-screen flex flex-col justify-center px-5 md:px-8 lg:px-16">
        <h1
          className="max-w-3xl text-5xl md:text-7xl font-black leading-[1.02] text-[#000000]"
          style={{ fontFamily: "var(--font-playfair)", textWrap: "balance" }}
        >
          Old disciplines, kept alive by hand.
        </h1>
        <p
          className="max-w-lg mt-8 text-sm md:text-base leading-relaxed text-[#000000]/80"
          style={{ fontFamily: "var(--font-inter)", fontWeight: 300 }}
        >
          KhuushiArts is the studio and gallery of a single artist working in four
          traditional Indian art forms: Tanjore, Pichwai, miniature, and canvas
          painting. Every piece here was made slowly, with the materials and
          methods each tradition demands. Scroll to walk through the story.
        </p>
      </section>

      {/* Desktop: sticky-image storytelling sequence */}
      <div className="hidden md:grid md:grid-cols-2 relative">
        <div className="flex flex-col">
          {STORY.map((step, i) => (
            <StorySection
              key={step.id}
              step={step}
              index={i}
              onEnter={() => setActive(i)}
              navigate={navigate}
            />
          ))}
        </div>
        <div className="hidden md:block">
          <StickyImageStack activeIndex={active} />
        </div>
      </div>

      {/* Mobile: pinned section, panel-wipe images, cross-fading text through steps 01-03 */}
      <div className="md:hidden">
        <MobileStoryPin navigate={navigate} />
      </div>

      {/* Journals & Collectors — moved here from the Collection page */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-16 py-24 md:py-32 space-y-24 md:space-y-32">
        <Journals />
        <Testimonials />
      </div>
    </div>
  );
}
