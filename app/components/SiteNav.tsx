"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCircleNav } from "./CircleTransition";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/collection", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav({ variant = "light" }: { variant?: "light" | "dark" }) {
  const pathname = usePathname();
  const navigate = useCircleNav();
  const dark = variant === "dark";

  const handleClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let ctrl/cmd/middle-click open in a new tab normally.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    navigate(href, e.currentTarget);
  };

  const textColor = dark ? "text-[#ede0c4]" : "text-[#000000]";
  const hoverColor = dark ? "hover:text-[#ede0c4]/60" : "hover:text-stone-500";

  return (
    <header
      className={`relative z-40 flex items-center justify-between gap-3 px-4 pt-4 pb-4 md:gap-0 md:px-8 md:pt-6 md:pb-8 ${
        dark ? "bg-black" : ""
      }`}
    >
      <Link
        href="/"
        onClick={handleClick("/")}
        className={`shrink-0 text-lg md:text-2xl font-black leading-none tracking-tight no-underline ${textColor}`}
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        KhuushiArts
      </Link>
      <nav
        className="flex items-center gap-3 md:gap-8 text-[0.6rem] tracking-[0.1em] md:text-[0.72rem] md:tracking-[0.15em]"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        {LINKS.map(({ href, label }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={handleClick(href)}
              className={`uppercase no-underline whitespace-nowrap transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${textColor} ${hoverColor} ${
                active ? "underline underline-offset-4" : ""
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
