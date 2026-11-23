"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@/lib/router";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Check, Copy, Download, FileText, Info, Minus, Plus, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/views/about/primitives";

/** Shared building blocks for web versions of official documents (DES-22). */

export const ring = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#FFD84D]";

export function useDocJson<T>(url: string) {
  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; data: T | null }>({ status: "loading", data: null });
  useEffect(() => {
    let off = false;
    setState({ status: "loading", data: null });
    fetch(url)
      .then((r) => {
        if (!r.ok || !(r.headers.get("content-type") ?? "").includes("json")) throw new Error("missing");
        return r.json();
      })
      .then((d: T) => !off && setState({ status: "ready", data: d }))
      .catch(() => !off && setState({ status: "error", data: null }));
    return () => {
      off = true;
    };
  }, [url]);
  return state;
}

export function useTitle(t: string) {
  useEffect(() => {
    document.title = `${t} | PenCom`;
    return () => {
      document.title = "PenCom Nigeria";
    };
  }, [t]);
}

/** Highlights search matches. */
export function Mark({ text, q }: { text: string; q: string }) {
  const t = q.trim();
  if (t.length < 2) return <>{text}</>;
  const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return <>{text.split(re).map((p, i) => (i % 2 ? <mark key={i} className="rounded bg-[#FFE38A] px-0.5 text-inherit">{p}</mark> : p))}</>;
}

export function ReadingBar() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div aria-hidden="true" style={{ scaleX: x }} className="fixed inset-x-0 top-[92px] z-30 h-[3px] origin-left bg-gradient-to-r from-[#14892A] via-[#36A045] to-[#CB9615] print:hidden" />;
}

export function DocHero({
  crumbs, kind, title, lead, meta, badge, actions, icon,
}: {
  crumbs: { label: string; to?: string }[];
  kind: string;
  title: string;
  lead?: ReactNode;
  meta: { label: string; value: ReactNode }[];
  badge?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <header className="relative isolate overflow-hidden bg-[#F6F8F3] text-[#1C4226] print:bg-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 print:hidden">
        <motion.div
          className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#BFE3C4]/70 blur-[110px]"
          animate={reduce ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: 2, ease: "easeInOut" }}
        />
        <div className="absolute -right-32 top-24 h-[28rem] w-[28rem] rounded-full bg-[#F8E2A8]/70 blur-[110px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,93,29,0.08)_1px,transparent_0)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-8 sm:pt-10">
        <nav aria-label="Breadcrumb" className="print:hidden">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {c.to ? (
                  <Link to={c.to} className={cn("rounded hover:text-[#105D1D] hover:underline", ring)}>{c.label}</Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-[#1C4226]">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-6 grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <motion.p initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-semibold text-[#105D1D] shadow-sm ring-1 ring-black/5 backdrop-blur">
                {icon ?? <FileText className="h-4 w-4" aria-hidden="true" />} {kind}
              </span>
              {badge}
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: reduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
              {title}
            </motion.h1>
            <svg aria-hidden="true" viewBox="0 0 300 16" preserveAspectRatio="none" className="mt-3 h-3 w-40 print:hidden">
              <motion.path d="M2 12 C 80 2, 200 2, 298 9" fill="none" stroke="#CB9615" strokeWidth="5" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.4, ease }} />
            </svg>
            {lead && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">{lead}</motion.div>}
            {actions && <motion.div initial={{ opacity: 0, y: reduce ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-8 flex flex-wrap gap-3 print:hidden">{actions}</motion.div>}
          </div>
          <motion.div initial={{ opacity: 0, y: reduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7, ease }} className="relative lg:col-span-4">
            <div aria-hidden="true" className="absolute -inset-2 -z-10 translate-x-2 translate-y-2 rounded-[1.8rem] bg-[#105D1D] print:hidden" />
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.6rem] bg-black/5 shadow-[0_30px_60px_-30px_rgba(22,77,32,0.6)] ring-1 ring-black/5">
              {meta.map((m) => (
                <div key={m.label} className="bg-white p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{m.label}</dt>
                  <dd className="mt-1 font-semibold">{m.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

export function PrimaryBtn({ href, children, external }: { href: string; children: ReactNode; external?: boolean }) {
  const cls = cn("group inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#CB9615] px-5 font-semibold text-[#1A1206] shadow-[0_15px_40px_-15px_rgba(203,150,21,0.9)] transition hover:bg-[#E0AA22]", ring);
  return external ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}<span className="sr-only"> (opens in a new tab)</span></a> : <Link to={href} className={cls}>{children}</Link>;
}
export function GhostBtn({ onClick, children, href }: { onClick?: () => void; children: ReactNode; href?: string }) {
  const cls = cn("inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 font-semibold text-[#105D1D] ring-1 ring-black/10 transition hover:ring-[#14892A]", ring);
  if (href) return <a href={href} onClick={onClick} className={cls}>{children}</a>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

/** Text size, print and copy-link tools. */
export function DocTools({ size, setSize }: { size: number; setSize: (n: number) => void }) {
  const [copied, setCopied] = useState(false);
  const btn = cn("flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-600 ring-1 ring-black/10 transition hover:ring-[#14892A] hover:text-[#117F21] disabled:opacity-30", ring);
  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <div role="group" aria-label="Text size" className="flex items-center gap-1">
        <button type="button" className={btn} onClick={() => setSize(Math.max(0, size - 1))} disabled={size === 0} aria-label="Smaller text"><Minus className="h-4 w-4" aria-hidden="true" /></button>
        <span className="w-8 text-center text-sm font-bold text-gray-600" aria-live="polite">A<span className="sr-only"> size {size + 1} of 3</span></span>
        <button type="button" className={btn} onClick={() => setSize(Math.min(2, size + 1))} disabled={size === 2} aria-label="Larger text"><Plus className="h-4 w-4" aria-hidden="true" /></button>
      </div>
      <button type="button" className={btn} onClick={() => window.print()} aria-label="Print"><Printer className="h-4 w-4" aria-hidden="true" /></button>
      <button type="button" className={btn} aria-label="Copy link to this page" onClick={() => { navigator.clipboard?.writeText(location.href).catch(() => undefined); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
        {copied ? <Check className="h-4 w-4 text-[#117F21]" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? "Link copied" : ""}</span>
    </div>
  );
}
export const sizes = ["1rem", "1.125rem", "1.25rem"];

/** Contents list with a scroll-spy that works in both directions. */
export function Toc({ items, title = "Contents", className }: { items: { id: string; label: string; level?: number }[]; title?: string; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    let raf = 0;
    const run = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let cur = items[0]?.id;
      for (const i of items) {
        const el = document.getElementById(i.id);
        if (el && el.getBoundingClientRect().top <= line) cur = i.id;
      }
      setActive(cur);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(run); };
    run();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [items]);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);
  return (
    <nav aria-label={title} className={cn("rounded-3xl bg-white p-4 ring-1 ring-black/10", className)}>
      <p className="px-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-400">{title}</p>
      <ol ref={listRef} className="mt-2 max-h-[60vh] space-y-0.5 overflow-y-auto border-l-2 border-gray-100 pr-1 [scrollbar-width:thin]">
        {items.map((i) => (
          <li key={i.id} data-id={i.id}>
            <a
              href={`#${i.id}`}
              onClick={(e) => { e.preventDefault(); document.getElementById(i.id)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
              aria-current={active === i.id ? "location" : undefined}
              className={cn("-ml-0.5 block border-l-2 py-1.5 pr-2 text-sm leading-snug transition", (i.level ?? 1) > 1 ? "pl-7 text-[13px]" : "pl-4", active === i.id ? "border-[#14892A] font-semibold text-[#117F21]" : "border-transparent text-gray-500 hover:text-gray-800")}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PdfCard({ href, title, meta }: { href: string; title: string; meta: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn("group relative flex items-center gap-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#105D1D] to-[#14892A] p-6 text-white", ring)}>
      <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-1000 group-hover:translate-x-full" />
      <span className="relative flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-[#B52026] shadow-lg transition group-hover:-rotate-6">
        <FileText className="h-6 w-6" aria-hidden="true" /><span className="text-[10px] font-black">PDF</span>
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-[0.16em] text-[#F4D27A]">Official signed copy</span>
        <span className="mt-1 block font-semibold leading-snug">{title}</span>
        <span className="mt-0.5 block text-sm text-white/60">{meta}</span>
      </span>
      <span className="relative hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#CB9615] text-[#1A1206] transition group-hover:scale-110 sm:flex"><Download className="h-5 w-5" aria-hidden="true" /></span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function VerifyNote({ children }: { children?: ReactNode }) {
  return (
    <p className="flex gap-3 rounded-2xl border border-[#CB9615]/40 bg-[#FFF8E1] p-4 text-sm leading-relaxed text-[#5C4300]">
      <Info className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{children ?? "This web version was prepared from the official PDF so it is easier to read, search and link to. If the two ever differ, the signed PDF is the authoritative text."}</span>
    </p>
  );
}

export function Loading({ label = "Loading the document" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-gray-500" role="status">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#14892A]/20 border-t-[#14892A]" aria-hidden="true" />
      {label}…
    </div>
  );
}
