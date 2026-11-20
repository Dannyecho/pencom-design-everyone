"use client";

import { useCallback, useEffect, useState } from "react";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Landmark } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { Link, useLocation } from "@/lib/router";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";
import { heroStats } from "./data";
import { Charter, History, Leadership, MissionValues, Overview, ProfileDialog, Structure } from "./sections";

/**
 * About PenCom, "for everyone" theme. Same language as the home page: soft colour fields and a dot grid
 * in the hero, a photo in an offset green frame, numbered section titles with a drawn line and a gold
 * highlighter, white rounded cards and a deep-green panel. Sections: overview and mandate → mission,
 * vision and values → history → structure → leadership → Service Charter and visiting us.
 * Menu anchors from the header and footer (#mission, #executive, #structure, #stakeholders, #why-us,
 * #dg-corner, #board, #signing, #charter, #history) all land on the right section.
 */

export const ease = [0.22, 1, 0.36, 1] as const;
export const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";

const onThisPage = [
  { id: "overview", label: "Overview" },
  { id: "mission", label: "Mission and values" },
  { id: "history", label: "Our history" },
  { id: "structure", label: "Structure" },
  { id: "executive", label: "Leadership" },
  { id: "charter", label: "Service Charter" },
];

export default function AboutPage() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();
  const [profile, setProfile] = useState<string | null>(null);
  const closeProfile = useCallback(() => setProfile(null), []);

  // Deep links (/about#mission …): scroll once the page has laid out, then correct after images settle.
  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const t1 = window.setTimeout(() => scrollToId(id, !reduce), 80);
    const t2 = window.setTimeout(() => scrollToId(id, false), 900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="bg-[#FBFCF9] text-[#0E2414]">
        <Hero />
        <SectionNav />
        <Overview />
        <MissionValues />
        <History />
        <Structure onSelect={setProfile} />
        <Leadership onSelect={setProfile} />
        <Charter />
        <ProfileDialog id={profile} onClose={closeProfile} />
      </div>
    </MotionConfig>
  );
}

/* ─────────────────────────── Hero ─────────────────────────── */

function Hero() {
  const reduce = useReducedMotion();
  const { t, lang } = useI18n();
  // Whole title translated, then the highlight found inside it (word order differs by language).
  const T = t("Keeping every Nigerian’s retirement safe");
  const M = t("retirement safe");
  const at = T.toLowerCase().indexOf(M.toLowerCase());
  const heroTitle = at >= 0 ? { before: T.slice(0, at), mark: T.slice(at, at + M.length), after: T.slice(at + M.length), done: lang !== "en" } : { before: T, mark: "", after: "", done: lang !== "en" };
  return (
    <section aria-labelledby="about-title" className="relative isolate overflow-hidden bg-[#F6F8F3]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#BFE3C4]/70 blur-[110px]"
          animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: 2, ease: "easeInOut" }}
        />
        <div className="absolute -right-32 top-24 h-[28rem] w-[28rem] rounded-full bg-[#F8E2A8]/70 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(10,74,19,0.08)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-16 pt-8 sm:pt-10 lg:grid-cols-12 lg:pb-20">
        <div className="lg:col-span-6 lg:pt-6">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <li>
                <Link to="/" className={cn("rounded hover:text-[#0A4A13] hover:underline", focus)}>
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="font-semibold text-[#0E2414]">
                About PenCom
              </li>
            </ol>
          </nav>
          <motion.p initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-[#0A4A13] shadow-sm ring-1 ring-black/5 backdrop-blur">
            <Landmark className="h-4 w-4" aria-hidden="true" />
            About the Commission
          </motion.p>
          <motion.h1
            id="about-title"
            data-i18n-done={heroTitle.done ? "" : undefined}
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="mt-5 text-[2.4rem] font-bold leading-[1.05] tracking-tight sm:text-6xl"
          >
            {heroTitle.before}
            <span className="relative inline-block max-w-full text-[#117F21] sm:inline sm:whitespace-nowrap">
              {heroTitle.mark}
              <svg aria-hidden="true" viewBox="0 0 300 16" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full">
                <motion.path d="M2 12 C 80 2, 200 2, 298 9" fill="none" stroke="#CB9615" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5, ease }} />
              </svg>
            </span>
            {heroTitle.after}
          </motion.h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-700">
            The National Pension Commission licenses and supervises every pension operator in Nigeria, so that what workers save is invested safely and paid when they retire. Established in 2004, we now work under the Pension Reform Act 2014.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => scrollToId("history", !reduce)} className={cn("group inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#0A4A13] px-5 font-semibold text-white transition hover:bg-[#117F21]", focus)}>
              Explore our history
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scrollToId("structure", !reduce)} className={cn("group inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-semibold text-[#0A4A13] ring-1 ring-black/10 transition hover:bg-[#E8F5E9]", focus)}>
              How we are organised
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24, rotate: reduce ? 0 : 1.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
          className="relative lg:col-span-6"
        >
          <div aria-hidden="true" className="absolute -inset-3 -z-10 translate-x-3 translate-y-3 rounded-[2.2rem] bg-[#0A4A13]" />
          <div className="relative h-[28rem] overflow-hidden rounded-[2rem] bg-[#0E2414] shadow-[0_40px_80px_-40px_rgba(10,46,16,0.7)] sm:h-[32rem]">
            <img
              src="/images/site/board-meeting-1920.webp"
              srcSet="/images/site/board-meeting-960.webp 960w, /images/site/board-meeting-1920.webp 1920w"
              sizes="(min-width: 1024px) 45vw, 100vw"
              alt="Colleagues reviewing figures around a boardroom table"
              className="absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
            />
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
            <p className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-[#FFD84D] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#04140A] shadow">
              Since 2004
            </p>
            <dl className="absolute inset-x-3 bottom-3 grid grid-cols-3 divide-x divide-black/5 rounded-2xl bg-white/95 shadow-xl backdrop-blur sm:inset-x-4 sm:bottom-4">
              {heroStats.map((s) => (
                <div key={s.label} className="px-3 py-3.5 sm:px-5 sm:py-4">
                  <dt className="text-xs font-semibold text-gray-600 sm:text-sm">{s.label}</dt>
                  <dd className="mt-0.5 font-mono text-xl font-bold text-[#0E2414] sm:text-2xl">{s.value}</dd>
                  <dd className="text-[11px] text-gray-500">{s.note}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────── On this page ─────────────────────────── */

function SectionNav() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(onThisPage[0].id);

  // Current section: the last one whose top has passed just under the header and this bar.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = onThisPage[0].id;
      for (const s of onThisPage) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 200) current = s.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <nav aria-label="On this page" className="sticky top-[92px] z-30 px-4 py-3">
      <div className="mx-auto max-w-7xl">
        <ul className="flex gap-1 overflow-x-auto rounded-2xl bg-white/85 p-1.5 shadow-[0_18px_40px_-30px_rgba(10,46,16,0.6)] ring-1 ring-black/5 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {onThisPage.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(s.id);
                    scrollToId(s.id, !reduce);
                    history.replaceState(null, "", `#${s.id}`);
                  }}
                  aria-current={on ? "location" : undefined}
                  className={cn("relative flex min-h-10 items-center rounded-xl px-4 text-sm font-semibold transition", on ? "text-white" : "text-gray-700 hover:bg-[#F1F5EF]", focus)}
                >
                  {on && <motion.span layoutId="about-nav-pill" className="absolute inset-0 rounded-xl bg-[#0A4A13]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="relative">{s.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
