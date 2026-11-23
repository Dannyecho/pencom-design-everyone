"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bell, BookOpen, ChevronRight, FileCheck, Landmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { focus } from "@/views/theme/ui";
import { journeys } from "@/views/services/data";
import type { notifications as seed, ScreenName } from "./data";
import { Body, stagger } from "./screens";
import { ScreenTitle, sk } from "./skin";

/**
 * The app's home screen in the everyone look: a light header on soft colour fields (mint and gold blurs, dot grid)
 * with a big title whose last word gets the gold highlighter, an "ask a question" field that opens the assistant,
 * a numbered bento of tasks (Services as a framed panel on the offset dark-green frame), a swipeable row of popular
 * guides, and the latest updates. Public: no sign-in, no account data.
 */

const tones: Record<string, string> = { critical: "bg-[#B52026]", warning: "bg-[#CB9615]", info: "bg-[#14892A]", success: "bg-[#105D1D]" };

export function HomeScreen({ go, items, unread }: { go: (s: ScreenName) => void; items: typeof seed; unread: number }) {
  const small = [
    { label: "Service Guide", icon: FileCheck, screen: "guidance" as const },
    { label: "Publications", icon: BookOpen, screen: "publications" as const },
    { label: "Find a PFA", icon: Landmark, screen: "pfa" as const },
    { label: "Notifications", icon: Bell, screen: "notifications" as const },
  ];
  return (
    <Body label="Home" className={sk.appBg}>
      {/* light header on soft colour fields */}
      <div className="relative isolate overflow-hidden bg-[#E8F5E9] px-5 pb-6 pt-3">
        <motion.div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-10 -z-10 h-52 w-52 rounded-full bg-[#BFE3C4] blur-3xl" animate={{ x: [0, 30, 0], y: [0, 16, 0] }} transition={{ duration: 12, repeat: 2, ease: "easeInOut" }} />
        <div aria-hidden="true" className="pointer-events-none absolute -right-14 top-16 -z-10 h-48 w-48 rounded-full bg-[#F8E2A8] blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_1px_1px,rgba(16,93,29,0.12)_1px,transparent_0)] [background-size:16px_16px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/pencom-logo.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-bold text-[#0E2414]">PenCom</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#105D1D]">For everyone</span>
            </span>
          </span>
          <button type="button" onClick={() => go("notifications")} aria-label={`Notifications, ${unread} new`} className={cn("relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#105D1D] shadow-sm ring-1 ring-black/10 transition active:scale-95", focus)}>
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unread > 0 && <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#105D1D] px-1 text-[11px] font-bold text-[#F4D27A] ring-2 ring-[#E8F5E9]">{unread}</span>}
          </button>
        </div>
        <h2 className="mt-6 text-[30px] font-bold leading-[1.05] tracking-tight text-[#0E2414]">
          Pensions made{" "}
          <span className="relative isolate inline-block text-[#105D1D]">
            clear
            <motion.span aria-hidden="true" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-x-[-3px] bottom-1 -z-10 h-3 origin-left rounded-sm bg-[#F4D27A]" />
          </span>
        </h2>
        <p className="mt-2 text-[15px] leading-snug text-gray-700">Guides, publications and PFA contacts from the National Pension Commission.</p>
        <button type="button" onClick={() => go("chat")} className={cn("group mt-4 flex min-h-14 w-full items-center gap-3 rounded-2xl bg-white py-2 pl-4 pr-2 text-left text-[15px] text-gray-600 shadow-[0_14px_30px_-20px_rgba(16,93,29,0.7)] ring-1 ring-black/10 transition active:scale-[0.98]", focus)}>
          <span className="flex-1">Ask a question about pensions</span>
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4D27A] text-[#1A1206] transition-transform group-hover:-rotate-12"><Sparkles className="h-5 w-5" /></span>
        </button>
      </div>

      {/* 01: bento of tasks */}
      <div className="mt-5 px-4">
        <ScreenTitle n={1}>What would you like to do?</ScreenTitle>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <motion.div {...stagger(0)} className="relative col-span-2 mb-1.5 mr-1.5">
            <span aria-hidden="true" className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-2xl bg-[#105D1D]" />
            <button type="button" onClick={() => go("services")} className={cn("group relative flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left ring-1 ring-black/10 transition active:translate-x-1 active:translate-y-1", focus)}>
              <span className={cn(sk.tile, "h-12 w-12", sk.tileHover)}><FileCheck className="h-6 w-6" aria-hidden="true" /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-xs font-bold text-[#B07E0C]">{String(journeys.length).padStart(2, "0")} services</span>
                <span className="block text-lg font-bold leading-tight text-[#0E2414]">Services</span>
                <span className="block text-sm leading-snug text-gray-700">Open an RSA, transfer, retire and more</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#105D1D] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </motion.div>
          {small.map((a, i) => (
            <motion.button key={a.label} {...stagger(i + 1)} type="button" onClick={() => go(a.screen)} className={cn(sk.card, sk.cardHover, "group relative flex min-h-[6rem] flex-col items-start justify-between gap-2 p-3.5 text-left", focus)}>
              <span aria-hidden="true" className="absolute right-3 top-3 font-mono text-[11px] font-bold text-[#B07E0C]">{String(i + 2).padStart(2, "0")}</span>
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", sk.softColors, "transition-transform group-hover:-rotate-6")}><a.icon className="h-5 w-5" aria-hidden="true" /></span>
              <span className="text-base font-bold leading-snug text-[#0E2414]">{a.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 02: swipeable guides */}
      <div className="mt-6">
        <div className="px-4"><ScreenTitle n={2}>Popular guides</ScreenTitle></div>
        <ul className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {journeys.slice(0, 5).map((j, i) => (
            <li key={j.id} className="w-[72%] shrink-0 snap-start">
              <button type="button" onClick={() => go("services")} className={cn("group flex h-full w-full flex-col rounded-2xl p-4 text-left ring-1 ring-black/10 transition active:scale-[0.98]", i % 2 ? "bg-[#FFF6DA]" : "bg-white", focus)}>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A5200]">{j.audience}</span>
                <span className="mt-1 flex-1 text-base font-bold leading-snug text-[#0E2414]">{j.short}</span>
                <span className="mt-3 flex items-center justify-between text-sm font-semibold text-[#105D1D]">
                  {j.steps.length} steps
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 03: latest */}
      <div className="mt-4 px-4 pb-5">
        <ScreenTitle n={3} aside={<span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider", sk.muted, sk.eyebrow)}>Sample</span>}>Latest from PenCom</ScreenTitle>
        <ul className={cn(sk.card, "mt-3 divide-y divide-black/5")}>
          {items.map((n, i) => (
            <motion.li key={n.title} {...stagger(i)} className="flex items-start gap-3 p-3.5">
              <span aria-hidden="true" className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", n.read ? "bg-gray-300" : tones[n.type])} />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-[#0E2414]">{n.title}</span>
                <span className="block text-sm leading-snug text-gray-700">{n.body}</span>
              </span>
              <span className="shrink-0 text-[13px] text-gray-600">{n.time}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </Body>
  );
}
