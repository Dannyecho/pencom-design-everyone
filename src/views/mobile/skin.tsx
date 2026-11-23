"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { focus } from "@/views/theme/ui";

/**
 * The app preview's design tokens for the everyone theme. `screens.tsx` and `Phone.tsx` are the same file in every
 * theme and read all their colours, radii and flourishes from here, so a theme restyles the app by editing this file.
 *
 * Everyone look: soft colour fields, cream app background, white cards with a hairline ring, dark-green icon tiles with
 * gold icons, numbered section titles with a gold highlighter stroke, framed panels (offset dark-green frame).
 */

const green = "#105D1D";

export const sk = {
  /* Type and text colours */
  ink: "text-[#0E2414]",
  accent: "text-[#105D1D]",
  eyebrow: "text-[#7A5200]",
  check: "text-[#14892A]",
  /* Surfaces */
  appBg: "bg-[#F6F8F3]",
  muted: "bg-[#EEF2EA]",
  softColors: "bg-[#E8F5E9] text-[#105D1D]",
  hoverSoft: "hover:bg-[#E8F5E9]",
  card: "rounded-2xl bg-white ring-1 ring-black/10",
  cardHover: "transition hover:-translate-y-0.5 hover:ring-2 hover:ring-[#14892A] hover:shadow-[0_18px_30px_-22px_rgba(16,93,29,0.7)]",
  cardOn: "ring-2 ring-[#14892A]",
  tile: "flex shrink-0 items-center justify-center rounded-xl bg-[#105D1D] text-[#F4D27A]",
  tileHover: "transition-transform group-hover:-rotate-6",
  bar: "border-b border-black/5 bg-gradient-to-b from-[#E8F5E9] via-[#F6F8F3] to-[#F6F8F3]",
  barMuted: "text-gray-700",
  barBack: "text-[#105D1D] hover:bg-white/70",
  barTitle: "font-bold text-[#0E2414]",
  composer: "border-t border-black/10 bg-white",
  toast: "bg-[#0E2414] text-[#F4D27A]",
  /* Controls */
  goldBtn: cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#F4D27A] px-4 text-[15px] font-bold text-[#1A1206] transition hover:bg-[#FFE08F]", focus),
  outlineBtn: cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#14892A] px-4 text-[15px] font-semibold text-[#105D1D] transition hover:bg-[#14892A] hover:text-white", focus),
  savedBtn: cn("inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#E8F5E9] px-4 text-[15px] font-bold text-[#105D1D] ring-1 ring-[#14892A]/25", focus),
  field: "w-full rounded-xl bg-[#EEF2EA] px-4 py-3 text-base text-[#0E2414] ring-1 ring-black/10 placeholder:text-gray-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#14892A]",
  chipOn: "bg-[#105D1D] text-[#F4D27A] ring-[#105D1D]",
  chipOff: "bg-white text-[#105D1D] ring-[#14892A]/40 hover:bg-[#E8F5E9]",
  solid: "bg-[#14892A]",
  range: "accent-[#14892A]",
  promptBtn: "bg-white text-[#0E2414] ring-1 ring-[#14892A]/30 hover:bg-[#105D1D] hover:text-white",
  dashed: "border-[#14892A]/40 text-[#105D1D] hover:border-[#14892A] hover:bg-[#E8F5E9]",
  /* Home screen header */
  hero: "rounded-b-[2rem] bg-[#105D1D] text-white",
  heroTitle: "text-[24px] font-bold leading-tight tracking-tight",
  heroBell: "bg-white/10 ring-1 ring-white/20 hover:bg-white/20",
  heroBellIcon: "text-[#F4D27A]",
  heroBadge: "bg-[#F4D27A] text-[#1A1206] ring-[#105D1D]",
  /* Lists, steps, notices, chat */
  stepDot: "bg-[#105D1D] text-[#F4D27A] ring-4 ring-white",
  stepLine: "bg-gradient-to-b from-[#14892A] to-[#CB9615]/60",
  unread: "bg-[#E8F5E9]/70 ring-[#14892A]/30",
  newBadge: "bg-[#105D1D] text-[#F4D27A]",
  /** "dot": a coloured dot per notice; "bar": a coloured bar down the left edge (classic notices). */
  notice: "dot" as "dot" | "bar",
  bubbleUser: "rounded-tr-md bg-[#105D1D] text-white",
  bubbleBot: "rounded-tl-md bg-white text-[#0E2414] ring-1 ring-black/10",
  success: "bg-[#E8F5E9] ring-8 ring-[#E8F5E9]/50",

  /* Phone shell (Phone.tsx) */
  statusHome: "bg-[#E8F5E9] text-[#0E2414]",
  statusInner: "bg-[#E8F5E9] text-[#0E2414]",
  island: "bg-[#0E2414]",
  homeBar: "bg-[#0E2414]",
  /** Floating white pill tab bar with a dark-green pill that slides between tabs. */
  navFloat: true,
  navIndicator: "pill" as "pill" | "line",
  nav: "bg-white/95 ring-1 ring-black/10 shadow-[0_18px_40px_-18px_rgba(16,93,29,0.55)] backdrop-blur",
  navOn: "text-[#F4D27A]",
  navPill: "bg-[#105D1D]",
  navOff: "text-gray-600",
  navText: "text-[13px]",
  navLabelOn: "font-bold text-[#105D1D]",
  navLabelOff: "font-medium text-gray-700",
  navDot: "bg-[#CB9615] ring-white",
  fab: "bg-[#105D1D] text-white ring-2 ring-white shadow-[0_18px_36px_-14px_rgba(16,93,29,0.9)] hover:bg-[#14892A]",
  fabIcon: "bg-[#F4D27A] text-[#1A1206]",
  fabPulse: "ring-[#F4D27A]",
  backdrop: "bg-[#0E2414]/40",
  sheet: "rounded-t-[1.75rem] bg-[#F6F8F3] shadow-[0_-20px_40px_-24px_rgba(16,93,29,0.6)]",
  sheetTitle: "font-bold text-[#0E2414]",
  sheetList: "rounded-2xl bg-white ring-1 ring-black/10 divide-black/5",
  sheetRowOn: "bg-[#E8F5E9]",
  sheetBadge: "bg-[#F4D27A] text-[#1A1206]",
  closeBtn: "text-[#0E2414] ring-1 ring-black/15 hover:bg-[#105D1D] hover:text-white",
};

/** Section title inside the app (home screen): numbered, with a gold highlighter stroke drawn under the words. */
export function ScreenTitle({ n, children, aside }: { n?: number; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="flex items-baseline gap-2 text-lg font-bold text-[#0E2414]">
        {n != null && <span aria-hidden="true" className="font-mono text-[13px] font-bold tabular-nums" style={{ color: green }}>{String(n).padStart(2, "0")}</span>}
        <span className="relative isolate">
          {children}
          <motion.span
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-[-2px] bottom-[2px] -z-10 h-[7px] origin-left rounded-sm bg-[#F4D27A]/70"
          />
        </span>
      </h2>
      {aside}
    </div>
  );
}
