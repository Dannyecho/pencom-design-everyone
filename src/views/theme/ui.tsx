"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import { scrollToId } from "@/views/about/primitives";

/**
 * Building blocks shared by every inner page of the "for everyone" theme, so pages stay consistent with
 * the home page: the page hero (soft colour fields, dot grid, breadcrumb, gold-underlined title), the
 * sticky "On this page" bar, a scroll reveal, and an accessible modal.
 */

export const ease = [0.22, 1, 0.36, 1] as const;
export const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";
/** Section spacing; scroll margin clears the header (92px) and the section bar. */
export const sectionCls = "scroll-mt-[160px] px-4 py-16 sm:py-20";

export function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────── Page hero ─────────────────────────── */

export function PageHero({
  id,
  crumbs,
  pill,
  title,
  mark,
  intro,
  actions,
  aside,
}: {
  id: string;
  crumbs: { label: string; to?: string }[];
  pill: { icon: LucideIcon; label: string };
  title: string;
  /** Words at the end of the title that get the green colour and the gold underline. */
  mark: string;
  intro: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const { t, lang } = useI18n();
  // Translate the whole title, then find the translated highlight in it (word order differs by language).
  const T = t(title);
  const M = t(mark);
  const at = M ? T.toLowerCase().indexOf(M.toLowerCase()) : -1;
  const has = at >= 0;
  const shown = has ? T.slice(at, at + M.length) : "";
  const [before, after] = has ? [T.slice(0, at), T.slice(at + M.length)] : [T, ""];
  const Pill = pill.icon;
  return (
    <section aria-labelledby={id} className="relative isolate overflow-hidden bg-[#F6F8F3]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#BFE3C4]/70 blur-[110px]"
          animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: 2, ease: "easeInOut" }}
        />
        <div className="absolute -right-32 top-24 h-[28rem] w-[28rem] rounded-full bg-[#F8E2A8]/70 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(10,74,19,0.08)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>
      <div className={cn("mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-16 pt-8 sm:pt-10 lg:pb-20", aside && "lg:grid-cols-12")}>
        <div className={cn(aside ? "lg:col-span-6 lg:pt-6" : "max-w-3xl")}>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {c.to ? (
                    <Link to={c.to} className={cn("rounded hover:text-[#0A4A13] hover:underline", focus)}>
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-semibold text-[#0E2414]">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <motion.p initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-[#0A4A13] shadow-sm ring-1 ring-black/5 backdrop-blur">
            <Pill className="h-4 w-4" aria-hidden="true" />
            {pill.label}
          </motion.p>
          <motion.h1
            id={id}
            data-i18n-done={lang !== "en" && T !== title ? "" : undefined}
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="mt-5 text-[2.4rem] font-bold leading-[1.05] tracking-tight text-[#0E2414] sm:text-6xl"
          >
            {before}
            {has && (
              <span className="relative inline-block max-w-full text-[#117F21] sm:inline sm:whitespace-nowrap">
                {shown}
                <svg aria-hidden="true" viewBox="0 0 300 16" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full">
                  <motion.path d="M2 12 C 80 2, 200 2, 298 9" fill="none" stroke="#CB9615" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5, ease }} />
                </svg>
              </span>
            )}
            {after}
          </motion.h1>
          <div className="mt-6 max-w-xl text-lg leading-relaxed text-gray-700">{intro}</div>
          {actions && <div className="mt-8">{actions}</div>}
        </div>
        {aside && (
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 24, rotate: reduce ? 0 : 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="relative lg:col-span-6"
          >
            {aside}
          </motion.div>
        )}
      </div>
    </section>
  );
}

/** White panel in the offset green frame used by the home page slider. */
export function FramedPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -inset-3 -z-10 translate-x-3 translate-y-3 rounded-[2.2rem] bg-[#0A4A13]" />
      <div className={cn("relative overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(10,46,16,0.7)]", className)}>{children}</div>
    </div>
  );
}

/* ─────────────────────────── On this page ─────────────────────────── */

export function SectionNav({ sections, pillId }: { sections: { id: string; label: string }[]; pillId: string }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(sections[0].id);

  // Current section: the last one whose top has passed just under the header and this bar.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = sections[0].id;
      for (const s of sections) {
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
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-[92px] z-30 px-4 py-3">
      <div className="mx-auto max-w-7xl">
        <ul className="flex gap-1 overflow-x-auto rounded-2xl bg-white/85 p-1.5 shadow-[0_18px_40px_-30px_rgba(10,46,16,0.6)] ring-1 ring-black/5 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => {
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
                  {on && <motion.span layoutId={pillId} className="absolute inset-0 rounded-xl bg-[#0A4A13]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
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

/* ─────────────────────────── Modal ─────────────────────────── */

/**
 * Accessible modal: Escape and the backdrop close it, focus moves to the close button and returns to
 * the control that opened it, and the page behind does not scroll.
 */
export function Modal({ open, onClose, labelledBy, children, className }: { open: boolean; onClose: () => void; labelledBy: string; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) {
      if (opener.current) {
        const el = opener.current;
        opener.current = null;
        window.setTimeout(() => el.focus(), 0);
      }
      return;
    }
    const active = document.activeElement as HTMLElement | null;
    if (active && !active.closest("[role=dialog]")) opener.current = active;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeBtn.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="modal" className="fixed inset-0 z-[120] flex items-end justify-center p-3 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" tabIndex={-1} aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-[#04140A]/60 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ y: reduce ? 0 : 40, scale: reduce ? 1 : 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: reduce ? 0 : 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className={cn("relative max-h-[calc(100svh-1.5rem)] w-full overflow-y-auto rounded-[2rem] bg-white shadow-2xl", className)}
          >
            <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close" className={cn("absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#0E2414] shadow transition hover:rotate-90", focus)}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────── Drawer ─────────────────────────── */

/** Side panel that slides in from the right (full width on phones); same behaviour as Modal. */
export function Drawer({ open, onClose, labelledBy, children }: { open: boolean; onClose: () => void; labelledBy: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) {
      if (opener.current) {
        const el = opener.current;
        opener.current = null;
        window.setTimeout(() => el.focus(), 0);
      }
      return;
    }
    const active = document.activeElement as HTMLElement | null;
    if (active && !active.closest("[role=dialog]")) opener.current = active;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeBtn.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="drawer" className="fixed inset-0 z-[120] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" tabIndex={-1} aria-label="Close" onClick={onClose} className="absolute inset-0 cursor-default bg-[#04140A]/50 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={{ x: reduce ? 0 : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: reduce ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 34 }}
            className="relative h-full w-full max-w-lg overflow-y-auto bg-white shadow-2xl sm:rounded-l-[2rem]"
          >
            <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close" className={cn("absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 transition hover:rotate-90 hover:bg-white/25", focus)}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
