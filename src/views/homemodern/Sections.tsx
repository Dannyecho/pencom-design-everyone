"use client";

import { useState, type ReactNode } from "react";
import { Link } from "@/lib/router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle, ArrowRight, ArrowUpRight, Banknote, BookOpen, Building2, CheckCircle2, ChevronDown, ExternalLink,
  Heart, Info, Mail, MessageCircle, MessageSquareWarning, Phone, RefreshCw, Scale, ShieldAlert, type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/i18n/context";
import { siteNotices, type NoticeType } from "@/lib/alerts";
import { cn } from "@/lib/utils";
import { CountUp } from "@/views/about/primitives";
import { headOffice } from "@/views/connect/data";
import { externalPortals, faqs, figures } from "@/views/home/data";
import { openChat } from "@/views/home/SiteSearch";
import { news, newsPath } from "@/views/news/data";
import { library } from "@/views/regulations/library";
import Headline from "./Headline";

const ease = [0.22, 1, 0.36, 1] as const;
const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";
const fmt = (d: string, o: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) => new Date(d).toLocaleDateString("en-GB", o);

function Rise({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={{ opacity: 0, y: reduce ? 0 : 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay, ease }} className={className}>
      {children}
    </motion.div>
  );
}

const linkBtn = cn("group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#105D1D] px-5 text-sm font-semibold text-white transition hover:bg-[#14892A]", focus);

/* ─────────────────────────── 01 Important alerts ─────────────────────────── */

const alertLook: Record<NoticeType, { icon: LucideIcon; label: string; chip: string; glow: string }> = {
  critical: { icon: ShieldAlert, label: "Critical", chip: "bg-[#FCEBEB] text-[#8E1A1E]", glow: "from-[#E53935]/15" },
  warning: { icon: AlertTriangle, label: "Warning", chip: "bg-[#FAEEDA] text-[#7A4300]", glow: "from-[#F59E0B]/15" },
  info: { icon: Info, label: "Information", chip: "bg-[#E6F1FB] text-[#0C447C]", glow: "from-[#1E88E5]/15" },
  success: { icon: CheckCircle2, label: "Update", chip: "bg-[#E8F5E9] text-[#105D1D]", glow: "from-[#36A045]/15" },
};

export function Alerts() {
  const { t } = useI18n();
  return (
    <section id="alerts" aria-labelledby="alerts-title" className="scroll-mt-32 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <Headline id="alerts-title" n="01" kicker="Alerts" title="Important alerts" mark="alerts" intro="Deadlines and changes that may affect you. The bell at the top of every page keeps these too." />
        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {siteNotices.map((n, i) => {
            const s = alertLook[n.type];
            return (
              <li key={n.id}>
                <Rise delay={i * 0.07} className={cn("relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.45)]")}>
                  <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent", s.glow)} />
                  <span className={cn("relative inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]", s.chip)}>
                    <s.icon className="h-4 w-4" aria-hidden="true" />
                    {t(s.label)}
                  </span>
                  <h3 className="relative mt-4 text-lg font-bold text-[#1C4226]">{t(n.title)}</h3>
                  <p className="relative mt-1.5 flex-1 leading-relaxed text-gray-700">{t(n.message)}</p>
                  {n.link && (
                    <Link to={n.link.to} className={cn("relative mt-4 inline-flex w-fit items-center gap-1.5 font-semibold text-[#117F21] hover:underline", focus)}>
                      {t(n.link.label)}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </Rise>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── 02 Latest circulars ─────────────────────────── */

export function Circulars() {
  const { t } = useI18n();
  const latest = [...library].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  return (
    <section id="circulars" aria-labelledby="circulars-title" className="scroll-mt-32 bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <Headline
          id="circulars-title"
          n="01"
          kicker="Regulatory updates"
          title="Latest circulars and guidelines"
          mark="circulars"
          intro="Read each one online or download the signed PDF. Every item shows its date, type and who it applies to."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <ol className="divide-y divide-gray-100 overflow-hidden rounded-3xl ring-1 ring-black/10 lg:col-span-8">
            {latest.map((d, i) => (
              <li key={d.id}>
                <Rise delay={i * 0.05}>
                  <Link to={`/regulations/doc/${d.id}`} className={cn("group flex items-start gap-4 bg-white p-5 transition hover:bg-[#F6F8F3] sm:gap-5 sm:p-6", focus)}>
                    <span className="flex w-14 shrink-0 flex-col items-center rounded-2xl bg-[#105D1D] py-2 text-white" aria-hidden="true">
                      <span className="text-xl font-bold leading-none">{new Date(d.date).getDate()}</span>
                      <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-[#F4D27A]">{fmt(d.date, { month: "short" })}</span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-[#EEF6EE] px-2.5 py-0.5 text-[#105D1D]">{d.type}</span>
                        <span className="text-gray-500">{fmt(d.date)}</span>
                        {d.appliesTo.slice(0, 2).map((x) => (
                          <span key={x} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-gray-700">{x}</span>
                        ))}
                      </span>
                      <span className="mt-2 block font-semibold leading-snug text-[#1C4226] group-hover:text-[#117F21]">{d.title}</span>
                    </span>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#117F21]" aria-hidden="true" />
                  </Link>
                </Rise>
              </li>
            ))}
          </ol>

          <div className="flex flex-col gap-4 lg:col-span-4">
            <Rise className="relative flex-1 overflow-hidden rounded-3xl bg-[#105D1D] p-7 text-white">
              <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#CB9615]/30 blur-2xl" />
              <BookOpen className="relative h-9 w-9 text-[#F4D27A]" aria-hidden="true" />
              <h3 className="relative mt-4 text-xl font-bold">{t("Regulatory library")}</h3>
              <p className="relative mt-2 text-white/80">{t("Search every regulation, guideline, circular and code by type, year or subject.")}</p>
              <Link to="/regulations#library" className={cn("relative mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#F4D27A] px-5 text-sm font-bold text-[#1A1206] transition hover:bg-[#FFE08F]", focus)}>
                {t("Open the library")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Rise>
            <Rise delay={0.08}>
              <Link to="/regulations/pension-reform-act" className={cn("group flex items-center gap-4 rounded-3xl bg-[#F6F8F3] p-6 ring-1 ring-black/10 transition hover:ring-[#14892A]", focus)}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#105D1D] ring-1 ring-black/10">
                  <Scale className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block font-bold text-[#1C4226]">Pension Reform Act 2014</span>
                  <span className="block text-sm text-gray-600">{t("Read the full Act online")}</span>
                </span>
                <ArrowRight className="h-5 w-5 text-[#117F21] transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Rise>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── 03 Online services ─────────────────────────── */

const portalIcons: Record<string, LucideIcon> = { ExternalLink, Heart, RefreshCw, Banknote };

export function OnlineServices() {
  const { t } = useI18n();
  return (
    <section id="online" aria-labelledby="online-title" className="scroll-mt-32 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <Headline
          id="online-title"
          n="02"
          kicker="Online services"
          title="Go straight to the right portal"
          mark="right portal"
          intro="These PenCom services run on their own websites. Each opens in a new tab."
          action={
            <Link to="/services#portals" className={cn("inline-flex items-center gap-1.5 font-semibold text-[#117F21] hover:underline", focus)}>
              {t("Not sure which one? Compare the portals")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {externalPortals.map((p, i) => {
            const I = portalIcons[p.icon] ?? ExternalLink;
            return (
              <li key={p.name}>
                <Rise delay={i * 0.06} className="h-full">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn("group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-6 ring-1 ring-black/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_50px_-30px_rgba(16,93,29,0.6)]", focus)}
                  >
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-[#14892A] to-[#CB9615] transition-transform duration-500 group-hover:scale-x-100" />
                    <span className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF6EE] text-[#105D1D] transition group-hover:bg-[#105D1D] group-hover:text-[#F4D27A]">
                        <I className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-gray-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#117F21]" aria-hidden="true" />
                    </span>
                    <span className="mt-5 text-xl font-bold text-[#1C4226]">{p.name}</span>
                    <span className="mt-1 text-gray-600">{t(p.description)}</span>
                    <span className="mt-4 text-sm text-gray-500">{p.url.replace("https://", "")}</span>
                    <span className="sr-only">{t("(opens in a new tab)")}</span>
                  </a>
                </Rise>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────── 04 News and events ─────────────────────────── */

export function NewsEvents() {
  const { t } = useI18n();
  const [lead, ...rest] = news.slice(0, 3);
  return (
    <section id="news" aria-labelledby="news-title" className="scroll-mt-32 bg-white px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <Headline
          id="news-title"
          n="03"
          kicker="News and events"
          title="What’s happening at PenCom"
          mark="PenCom"
          action={
            <Link to="/news" className={linkBtn}>
              {t("All news")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          }
        />
        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <Rise className="lg:col-span-7">
            <Link to={newsPath(lead)} className={cn("group relative block h-full min-h-[24rem] overflow-hidden rounded-3xl", focus)}>
              <img src={lead.image} alt={t(lead.imageAlt)} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-x-4 bottom-4 block rounded-2xl bg-white/95 p-5 shadow-lg backdrop-blur sm:p-6">
                <span className="text-sm font-semibold text-[#117F21]">
                  {lead.category} · {fmt(lead.date)}
                </span>
                <span className="mt-1.5 block text-xl font-bold leading-snug text-[#1C4226] sm:text-2xl">{lead.title}</span>
                <span className="mt-2 line-clamp-2 block text-gray-600">{lead.excerpt}</span>
              </span>
            </Link>
          </Rise>
          <ul className="flex flex-col gap-5 lg:col-span-5">
            {rest.map((a, i) => (
              <li key={a.id} className="flex-1">
                <Rise delay={0.08 * (i + 1)} className="h-full">
                  <Link to={newsPath(a)} className={cn("group flex h-full gap-4 overflow-hidden rounded-3xl bg-[#F6F8F3] p-3 ring-1 ring-black/5 transition hover:ring-[#14892A]", focus)}>
                    <span className="relative block w-32 shrink-0 overflow-hidden rounded-2xl sm:w-40">
                      <img src={a.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                    </span>
                    <span className="flex min-w-0 flex-col justify-center py-2 pr-2">
                      <span className="text-sm font-semibold text-[#117F21]">{fmt(a.date)}</span>
                      <span className="mt-1 font-bold leading-snug text-[#1C4226] group-hover:text-[#117F21]">{a.title}</span>
                      <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#105D1D]">
                        {t("Read more")}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    </span>
                  </Link>
                </Rise>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── 05 Industry figures ─────────────────────────── */

export function Figures() {
  const { t } = useI18n();
  return (
    <section id="figures" aria-labelledby="figures-title" className="relative isolate scroll-mt-32 overflow-hidden bg-[#164D20] px-4 py-16 text-white sm:py-24">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(203,150,21,0.25),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(54,160,69,0.35),transparent_55%)]" />
      <div className="mx-auto max-w-7xl">
        <Headline
          id="figures-title"
          n="04"
          kicker="Industry figures"
          title="The pension industry at a glance"
          mark="at a glance"
          dark
          intro="Approved figures from PenCom’s published industry reports. Each one shows the date it refers to."
        />
        <dl className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {figures.map((f, i) => (
            <Rise key={f.label} delay={i * 0.07} className="group relative overflow-hidden rounded-3xl bg-white/[0.06] p-6 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/[0.1]">
              <span aria-hidden="true" className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#F4D27A]/10 transition-transform duration-500 group-hover:scale-150" />
              <dt className="relative text-white/80">{t(f.label)}</dt>
              <dd className="relative mt-2 text-4xl font-bold tracking-tight text-[#F4D27A] sm:text-5xl">
                <CountUp value={f.value} />
              </dd>
              <dd className="relative mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">{t(f.note)}</dd>
            </Rise>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
          <span>{t("Source: PenCom industry reports")}</span>
          <Link to="/resources/reports/q1-2026" className={cn("inline-flex items-center gap-1.5 font-semibold text-[#F4D27A] hover:underline", focus)}>
            {t("Read the Q1 2026 report")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link to="/performance" className={cn("inline-flex items-center gap-1.5 font-semibold text-[#F4D27A] hover:underline", focus)}>
            {t("See industry performance")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── 06 Questions and contact ─────────────────────────── */

export function HelpContact() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  const tel = headOffice.phone.replace(/\s/g, "");
  const contacts = [
    { icon: Phone, label: "Call us", value: headOffice.phone, href: `tel:${tel}` },
    { icon: Mail, label: "Email us", value: headOffice.email, href: `mailto:${headOffice.email}` },
    { icon: Building2, label: "Visit an office", value: "Head office in Abuja and offices in every zone", to: "/connect#zonal-offices" },
    { icon: MessageSquareWarning, label: "Make a complaint", value: "We aim to resolve within 14 working days", to: "/connect" },
  ];
  return (
    <section id="help" aria-labelledby="help-title" className="scroll-mt-32 px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <Headline id="help-title" n="05" kicker="Help" title="Questions and how to reach us" mark="reach us" />
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <ul className="space-y-3 lg:col-span-7">
            {faqs.slice(0, 5).map((f, i) => {
              const on = open === i;
              return (
                <li key={f.question} className={cn("overflow-hidden rounded-2xl bg-white ring-1 transition", on ? "ring-[#14892A] shadow-[0_20px_40px_-28px_rgba(16,93,29,0.6)]" : "ring-black/10")}>
                  <h3>
                    <button
                      type="button"
                      id={`hq-${i}`}
                      aria-expanded={on}
                      aria-controls={`ha-${i}`}
                      onClick={() => setOpen(on ? null : i)}
                      className={cn("flex min-h-16 w-full items-center gap-4 px-5 py-4 text-left font-semibold text-[#1C4226]", focus)}
                    >
                      <span className="flex-1">{t(f.question)}</span>
                      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition", on ? "rotate-180 bg-[#105D1D] text-white" : "bg-gray-100 text-gray-600")}>
                        <ChevronDown className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div id={`ha-${i}`} role="region" aria-labelledby={`hq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.3, ease }}>
                        <p className="px-5 pb-5 leading-relaxed text-gray-700">{t(f.answer)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
            <li>
              <Link to="/resources/faq" className={cn("inline-flex items-center gap-1.5 px-1 pt-2 font-semibold text-[#117F21] hover:underline", focus)}>
                {t("See all questions")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>

          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#F6F8F3] p-6 ring-1 ring-black/5 sm:p-7">
              <button
                type="button"
                onClick={openChat}
                className={cn("group flex w-full items-center gap-4 rounded-2xl bg-[#105D1D] p-5 text-left text-white transition hover:bg-[#14892A]", focus)}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#F4D27A]">
                  <MessageCircle className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block font-bold">{t("Ask PenCom Assistant")}</span>
                  <span className="block text-sm text-white/75">{t("Quick answers in plain language")}</span>
                </span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
              <ul className="mt-4 divide-y divide-black/5">
                {contacts.map((c) => {
                  const inner = (
                    <>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#105D1D] ring-1 ring-black/10">
                        <c.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-[#1C4226]">{t(c.label)}</span>
                        <span className="block break-words text-sm text-gray-600">{t(c.value)}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#117F21]" aria-hidden="true" />
                    </>
                  );
                  const cls = cn("group flex items-center gap-4 py-4", focus);
                  return <li key={c.label}>{c.to ? <Link to={c.to} className={cls}>{inner}</Link> : <a href={c.href} className={cls}>{inner}</a>}</li>;
                })}
              </ul>
              <p className="mt-3 flex items-start gap-2 rounded-2xl bg-white p-4 text-sm text-gray-700 ring-1 ring-black/5">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#117F21]" aria-hidden="true" />
                {t("Never share your RSA PIN, password or bank details in a chat.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
