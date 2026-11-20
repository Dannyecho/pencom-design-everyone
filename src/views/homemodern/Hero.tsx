"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "@/lib/router";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Briefcase, Building2, ChevronLeft, ChevronRight, Megaphone, Pause, Play, Store, User, UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import { audiences, popularTasks, slides } from "@/views/home/data";
import SiteSearch, { go } from "@/views/home/SiteSearch";

const ease = [0.22, 1, 0.36, 1] as const;
const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";
const icons: Record<string, LucideIcon> = { user: User, retiree: UserRoundCheck, building: Building2, briefcase: Briefcase, store: Store };

/**
 * Opening area, following DES-19: (1) "I am a…" quick links with each audience's top tasks,
 * (2) search and commonly used services, beside a compact feature slider that stays out of the way
 * (DES-18/19: no large distracting slider). Soft animated colour fields sit behind it.
 */
export default function Hero() {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const H1 = t("Pensions made clear for every Nigerian");
  const M1 = t("every Nigerian");
  const has = H1.includes(M1);
  const [b1, a1] = has ? H1.split(M1) : [H1, ""];
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-[#F6F8F3]">
      {/* Ambient colour fields */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#BFE3C4]/70 blur-[110px]"
          animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: 2, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-32 top-24 h-[28rem] w-[28rem] rounded-full bg-[#F8E2A8]/70 blur-[110px]"
          animate={reduce ? undefined : { x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 22, repeat: 2, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(10,74,19,0.08)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 pb-16 pt-10 sm:pt-14 lg:grid-cols-12 lg:gap-12 lg:pb-20">
        <div className="lg:col-span-7">
          <motion.p initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-[#0A4A13] shadow-sm ring-1 ring-black/5 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#117F21]" aria-hidden="true" />
            National Pension Commission
          </motion.p>
          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            data-i18n-done={lang !== "en" ? "" : undefined}
            className="mt-5 text-[2.4rem] font-bold leading-[1.05] tracking-tight text-[#0E2414] sm:text-6xl"
          >
            {b1}
            {has && <span className="relative whitespace-nowrap text-[#117F21]">
              {M1}
              <svg aria-hidden="true" viewBox="0 0 300 16" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full">
                <motion.path d="M2 12 C 80 2, 200 2, 298 9" fill="none" stroke="#CB9615" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5, ease }} />
              </svg>
            </span>}
            {a1}
          </motion.h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-700">Tell us who you are and we’ll show you the services people like you use most.</p>

          <AudiencePicker />

          <div className="mt-8">
            <SiteSearch />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">Popular</span>
              {popularTasks.map((tk) => (
                <Link key={tk.label} to={tk.href} className={cn("inline-flex min-h-9 items-center rounded-full bg-white px-3.5 text-sm font-medium text-[#0E2414] ring-1 ring-black/10 transition hover:bg-[#0A4A13] hover:text-white", focus)}>
                  {tk.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <FeatureCard />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── "I am a…" ─────────────────────────── */

function AudiencePicker() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [active, setActive] = useState(audiences[0].id);
  const a = audiences.find((x) => x.id === active) ?? audiences[0];
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const j = (i + d + audiences.length) % audiences.length;
    setActive(audiences[j].id);
    tabs.current[j]?.focus();
  };

  return (
    <div className="mt-8">
      <p id="iam-label" className="text-sm font-bold uppercase tracking-[0.18em] text-[#0A4A13]">{t("I am a…")}</p>
      <LayoutGroup id="iam">
        <div role="tablist" aria-labelledby="iam-label" className="mt-3 flex flex-wrap gap-2">
          {audiences.map((x, i) => {
            const on = x.id === active;
            const I = icons[x.icon] ?? User;
            return (
              <button
                key={x.id}
                ref={(el) => void (tabs.current[i] = el)}
                id={`iam-tab-${x.id}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="iam-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(x.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn("relative isolate inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.95rem] font-semibold transition-colors", on ? "text-white" : "bg-white text-[#0E2414] ring-1 ring-black/10 hover:ring-[#117F21]", focus)}
              >
                {on && <motion.span layoutId="iam-pill" className="absolute inset-0 -z-10 rounded-full bg-[#0A4A13] shadow-[0_10px_24px_-10px_rgba(10,74,19,0.7)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <I className="h-4 w-4" aria-hidden="true" />
                {x.label}
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div id="iam-panel" role="tabpanel" aria-labelledby={`iam-tab-${a.id}`} className="mt-4 overflow-hidden rounded-3xl bg-white/90 p-2 shadow-[0_24px_60px_-34px_rgba(10,46,16,0.45)] ring-1 ring-black/5 backdrop-blur">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul key={a.id} initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -6 }} transition={{ duration: 0.25 }} className="grid grid-cols-1 gap-1 sm:grid-cols-2">
            {a.tasks.slice(0, 4).map((tk) => (
              <li key={tk.label}>
                <button
                  type="button"
                  onClick={() => go(tk, navigate)}
                  className={cn("group flex min-h-14 w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[0.95rem] font-semibold text-[#0E2414] transition hover:bg-[#EEF6EE]", focus)}
                >
                  <span className="flex-1">{tk.label}</span>
                  {tk.external ? (
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-[#117F21]" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-5 w-5 shrink-0 text-[#117F21] transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  )}
                  {tk.external && <span className="sr-only">{t("(opens in a new tab)")}</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────── Compact feature slider ─────────────────────────── */

const SLIDE_MS = 8000;

function FeatureCard() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hold, setHold] = useState(false);
  const [announce, setAnnounce] = useState("");
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) setPlaying(false);
  }, [reduce]);
  useEffect(() => {
    const next = slides[(index + 1) % slides.length];
    if (!next) return;
    const img = new Image();
    img.srcset = next.srcSet;
    img.sizes = "(min-width: 1024px) 40vw, 100vw";
    img.src = next.image;
  }, [index]);

  const goTo = (i: number, user = true) => {
    const n = (i + slides.length) % slides.length;
    setIndex(n);
    if (user) setAnnounce(t("Slide {n} of {total}: {title}", { n: n + 1, total: slides.length, title: t(slides[n].title) }));
  };

  const s = slides[index];
  if (!s) return null;
  const running = playing && !hold && !reduce;
  const ctl = cn("flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-[#0E2414] shadow-md backdrop-blur transition hover:bg-white", focus);

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 24, rotate: reduce ? 0 : 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease }}
      className="relative"
    >
      {/* decorative offset frame */}
      <div aria-hidden="true" className="absolute -inset-3 -z-10 translate-x-3 translate-y-3 rounded-[2.2rem] bg-[#0A4A13]" />
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured announcements"
        onPointerEnter={() => setHold(true)}
        onPointerLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHold(false)}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
        className="relative h-[34rem] overflow-hidden rounded-[2rem] bg-[#0E2414] shadow-[0_40px_80px_-40px_rgba(10,46,16,0.7)] sm:h-[36rem] lg:h-full lg:min-h-[36rem]"
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={s.id}
            src={s.image}
            srcSet={s.srcSet}
            sizes="(min-width: 1024px) 40vw, 100vw"
            alt={t(s.alt)}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.1 }}
            animate={{ opacity: 1, scale: running ? 1.03 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: reduce ? 0 : 1 }, scale: { duration: running ? SLIDE_MS / 1000 + 1 : 1, ease: "easeOut" } }}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: s.position }}
            fetchPriority={index === 0 ? "high" : "auto"}
          />
        </AnimatePresence>
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />

        {/* progress segments + controls */}
        <div className="absolute inset-x-4 top-4 flex items-center gap-3">
          <ol className="flex flex-1 gap-1.5" aria-label="Slides">
            {slides.map((x, i) => (
              <li key={x.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={i === index ? "true" : undefined}
                  aria-label={t("Go to slide {n}: {title}", { n: i + 1, title: t(x.title) })}
                  className={cn("block w-full py-2", focus)}
                >
                  <span className="relative block h-1.5 overflow-hidden rounded-full bg-white/35">
                    {i < index && <span className="absolute inset-0 bg-white" />}
                    {i === index && (
                      <motion.span
                        key={`${index}-${running}`}
                        className="absolute inset-y-0 left-0 bg-white"
                        initial={{ width: running ? "0%" : "100%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: running ? SLIDE_MS / 1000 : 0, ease: "linear" }}
                        onAnimationComplete={() => running && goTo(index + 1, false)}
                      />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause slides" : "Play slides"} className={ctl}>
            {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>

        {/* words on a solid card, never on the busy photo; kept to about a third of the slide */}
        <div className="absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${slides.length}`}
              initial={{ opacity: 0, y: reduce ? 0 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : 10, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5, ease }}
              className="rounded-2xl bg-white/95 px-4 py-3.5 shadow-xl backdrop-blur sm:px-5 sm:py-4"
            >
              <p className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.14em]", s.kind === "campaign" ? "bg-[#FFF2CC] text-[#7A5200]" : "bg-[#EEF6EE] text-[#0A4A13]")}>
                {s.kind === "campaign" && <Megaphone className="h-3 w-3" aria-hidden="true" />}
                {s.eyebrow}
              </p>
              <h2 className="mt-2 line-clamp-2 text-lg font-bold leading-snug text-[#0E2414] sm:text-xl">{s.title}</h2>
              <p className="sr-only">{s.summary}</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <button type="button" onClick={() => go(s.cta, navigate)} className={cn("group inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#0A4A13] px-3.5 text-sm font-semibold text-white transition hover:bg-[#117F21]", focus)}>
                  {s.cta.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </button>
                <span className="flex items-center gap-1.5">
                  <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous slide" className={cn("flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-black/10 transition hover:bg-[#EEF6EE]", focus)}>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => goTo(index + 1)} aria-label="Next slide" className={cn("flex h-9 w-9 items-center justify-center rounded-full ring-1 ring-black/10 transition hover:bg-[#EEF6EE]", focus)}>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>
    </motion.div>
  );
}
