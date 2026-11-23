"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { Accessibility, ArrowRight, Bot, Info, Pause, Play, Smartphone, UserRoundCheck, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHero, Rise, ease, focus, sectionCls } from "@/views/theme/ui";
import { SectionHeading } from "@/views/theme/heading";
import { features, type ScreenName } from "./data";
import { Phone, titles } from "./Phone";

/**
 * /mobile in the everyone look: a working preview of the planned PenCom app. The hero carries a numbered feature
 * list (mint pill slides to the chosen row, gold highlighter sweeps under its label) and a "Take the tour" button
 * that steps through the features with a progress line; the phone sits in the theme's offset dark-green frame over
 * soft colour fields, with a floating "Now showing" tag. A numbered section below lists what the app is built for,
 * each card switching the phone to that feature. Screens: ./screens + ./Phone, tokens: ./skin.
 */

const TOUR_MS = 5000;

const builtFor: { title: string; body: string; icon: typeof Bot; screen: ScreenName }[] = [
  { title: "No sign-in", body: "Everything in the app is public. Open it and start reading, with no account and no password.", icon: UserRoundCheck, screen: "dashboard" },
  { title: "Saved for offline reading", body: "Download circulars and reports once, then read them where the network is weak.", icon: WifiOff, screen: "publications" },
  { title: "Answers show their source", body: "The assistant names the PenCom document each answer comes from.", icon: Bot, screen: "chat" },
  { title: "Text size, contrast and motion", body: "Make words bigger, raise the contrast or turn movement off.", icon: Accessibility, screen: "accessibility" },
];

export default function MobilePage() {
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState<ScreenName>("dashboard");
  const [touring, setTouring] = useState(false);
  const phoneRef = useRef<HTMLDivElement>(null);
  const at = features.findIndex((f) => f.screen === screen);

  // Tour: move to the next feature every few seconds; stops at the last one.
  useEffect(() => {
    if (!touring) return;
    const id = window.setTimeout(() => {
      if (at >= features.length - 1) setTouring(false);
      else setScreen(features[at + 1].screen);
    }, TOUR_MS);
    return () => window.clearTimeout(id);
  }, [touring, at]);

  // Feature list: switch the phone, and on narrow screens bring the phone into view.
  const pick = (s: ScreenName) => {
    setTouring(false);
    setScreen(s);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      phoneRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  };
  const tour = () => {
    if (touring) return setTouring(false);
    if (at >= features.length - 1) setScreen(features[0].screen);
    setTouring(true);
  };

  const featureList = (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-[#1C4226]">Choose a feature to try</h2>
        <button
          type="button"
          aria-pressed={touring}
          onClick={tour}
          className={cn("inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-base font-bold transition", touring ? "bg-[#105D1D] text-white hover:bg-[#14892A]" : "bg-[#F4D27A] text-[#1A1206] hover:bg-[#FFE08F]", focus)}
        >
          {touring ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {touring ? "Pause the tour" : "Take the tour"}
        </button>
      </div>
      <ol className="mt-4 grid gap-1.5 rounded-[1.75rem] bg-white/80 p-2 ring-1 ring-black/10 backdrop-blur sm:grid-cols-2">
        {features.map((f, i) => {
          const on = screen === f.screen;
          return (
            <li key={f.screen}>
              <button
                type="button"
                aria-pressed={on}
                aria-controls="app-screen"
                onClick={() => pick(f.screen)}
                className={cn("group relative flex h-full w-full items-center gap-3 overflow-hidden rounded-2xl p-3 text-left transition-colors", !on && "hover:bg-[#F6F8F3]", focus)}
              >
                {on && <motion.span layoutId="feature-pill" transition={{ type: "spring", stiffness: 380, damping: 34 }} className="absolute inset-0 rounded-2xl bg-[#E8F5E9] ring-2 ring-[#14892A]" />}
                <span aria-hidden="true" className={cn("relative w-6 shrink-0 font-mono text-sm font-bold tabular-nums", on ? "text-[#105D1D]" : "text-[#B07E0C]")}>{String(i + 1).padStart(2, "0")}</span>
                <span className={cn("relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6", on ? "bg-[#105D1D] text-[#F4D27A]" : "bg-[#E8F5E9] text-[#105D1D]")}>
                  <f.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="relative min-w-0">
                  <span className="relative isolate inline-block text-base font-bold leading-tight text-[#1C4226]">
                    {f.label}
                    {on && (
                      <motion.span
                        aria-hidden="true"
                        initial={{ scaleX: reduce ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, ease }}
                        className="absolute inset-x-[-3px] bottom-[1px] -z-10 h-2 origin-left rounded-sm bg-[#F4D27A]"
                      />
                    )}
                  </span>
                  <span className="mt-0.5 block text-[15px] leading-snug text-gray-700">{f.desc}</span>
                </span>
                {on && touring && (
                  <motion.span
                    key={`tour-${f.screen}`}
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: TOUR_MS / 1000, ease: "linear" }}
                    className="absolute inset-x-3 bottom-1.5 h-[3px] origin-left rounded-full bg-[#CB9615]"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#EEF2EA] p-4 text-base leading-relaxed text-gray-800">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#105D1D]" aria-hidden="true" />
        <span>This is a design preview. The app is open to everyone, with no sign-in. Updates shown in it are sample content.</span>
      </p>
    </div>
  );

  const phone = (
    <div ref={phoneRef} className="relative mx-auto w-full max-w-[392px] scroll-mt-[110px]">
      {/* soft colour fields behind the device */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-x-12 bottom-6 top-10 -z-20 rounded-full bg-[#BFE3C4]/60 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-6 -z-20 h-56 w-56 rounded-full bg-[#F8E2A8]/80 blur-3xl" />
      {/* the theme's framed panel: an offset dark-green frame behind the phone */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[3.25rem] bg-[#105D1D]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-[3.25rem] bg-[radial-gradient(circle_at_1px_1px,rgba(244,210,122,0.35)_1px,transparent_0)] [background-size:16px_16px]" />
      <div className="rounded-[3.25rem] bg-[#0E2414] p-2.5 shadow-[0_40px_80px_-40px_rgba(16,93,29,0.75)]">
        <Phone
          screen={screen}
          setScreen={(s) => { setTouring(false); setScreen(s); }}
          className="h-[calc(100svh-210px)] max-h-[780px] min-h-[600px] rounded-[2.6rem] bg-[#F6F8F3] lg:h-[calc(100svh-150px)] lg:min-h-[620px]"
        />
      </div>
      {/* "Now showing" tag, hanging off the frame */}
      <div aria-hidden="true" className="absolute left-0 top-[38%] hidden -translate-x-[88%] lg:block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={screen}
            initial={{ opacity: 0, y: 8, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease }}
            className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-[#1C4226] shadow-[0_14px_30px_-14px_rgba(16,93,29,0.6)] ring-1 ring-black/10"
          >
            <span className="font-mono text-[#B07E0C]">{String(Math.max(at, 0) + 1).padStart(2, "0")}</span>
            <span className="relative isolate">
              {titles[screen]}
              <span className="absolute inset-x-[-2px] bottom-0 -z-10 h-2 rounded-sm bg-[#F4D27A]/80" />
            </span>
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="overflow-x-clip bg-[#FBFCF9] text-[#0E2414]">
        <PageHero
          id="mobile-title"
          crumbs={[{ label: "Home", to: "/" }, { label: "Mobile app" }]}
          pill={{ icon: Smartphone, label: "App preview" }}
          title="The PenCom app, in your pocket"
          mark="in your pocket"
          intro={<p>A preview of the PenCom app for Android and iOS. Choose a feature below to see it on the phone, or tap around the phone itself.</p>}
          actions={featureList}
          aside={phone}
        />

        <section aria-labelledby="app-built-title" className={cn(sectionCls, "bg-white")}>
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              n="02"
              id="app-built-title"
              eyebrow="Built for everyone"
              title="Made for the way people really read"
              highlight="really read"
              intro="The app follows the same rules as the website: plain words, labelled buttons and nothing behind a login."
            />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {builtFor.map((b, i) => (
                <li key={b.title}>
                  <Rise delay={i * 0.06} className="h-full">
                    <div className="relative h-full">
                      <div aria-hidden="true" className="absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-[1.75rem] bg-[#105D1D] opacity-0 transition duration-300 [li:hover_&]:translate-x-3 [li:hover_&]:translate-y-3 [li:hover_&]:opacity-100" />
                      <div className="flex h-full flex-col rounded-[1.75rem] bg-[#F6F8F3] p-6 ring-1 ring-black/10 transition duration-300 [li:hover_&]:-translate-x-0.5 [li:hover_&]:-translate-y-0.5 [li:hover_&]:bg-white">
                        <span className="flex items-center justify-between">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#105D1D] text-[#F4D27A]">
                            <b.icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                          <span aria-hidden="true" className="font-mono text-sm font-bold text-[#B07E0C]">{String(i + 1).padStart(2, "0")}</span>
                        </span>
                        <h3 className="mt-5 text-xl font-bold text-[#1C4226]">{b.title}</h3>
                        <p className="mt-2 flex-1 text-base leading-relaxed text-gray-700">{b.body}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setTouring(false);
                            setScreen(b.screen);
                            phoneRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
                          }}
                          className={cn("group/b mt-5 inline-flex min-h-11 items-center gap-2 self-start rounded-full px-1 text-base font-bold text-[#105D1D] underline decoration-[#CB9615] decoration-2 underline-offset-[6px] hover:text-[#14892A]", focus)}
                        >
                          Show me on the phone
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/b:translate-x-1" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </Rise>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
