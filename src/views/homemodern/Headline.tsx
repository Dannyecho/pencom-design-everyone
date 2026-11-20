"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Section title for the "for everyone" homepage: an index number and label joined by a line
 * that draws itself, a large title whose key words get a gold highlighter stroke swept in,
 * and the intro set beside it (desktop) behind a thin rule. Motion runs once; reduced motion
 * shows the finished state.
 */
export default function Headline({
  n,
  kicker,
  title,
  mark,
  intro,
  action,
  dark = false,
  stacked = false,
  id,
}: {
  n: string;
  kicker: string;
  title: string;
  mark?: string;
  intro?: ReactNode;
  action?: ReactNode;
  dark?: boolean;
  /** Title and intro one above the other, for narrow columns. */
  stacked?: boolean;
  id: string;
}) {
  const { t, lang } = useI18n();
  const reduce = useReducedMotion();
  const T = t(title);
  const M = mark ? t(mark) : undefined;
  // Find the highlight in the (translated) title, ignoring case, and keep the title's own letters.
  const at = M ? T.toLowerCase().indexOf(M.toLowerCase()) : -1;
  const hl = at >= 0 ? T.slice(at, at + M!.length) : undefined;
  const [before, after] = hl ? [T.slice(0, at), T.slice(at + hl.length)] : [T, ""];
  const view = { once: true, margin: "-80px" } as const;

  return (
    <header className={cn("grid grid-cols-1 gap-6", !stacked && "items-end lg:grid-cols-12 lg:gap-10")}>
      <div className={stacked ? undefined : "lg:col-span-7"}>
        <p className={cn("flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em]", dark ? "text-white/80" : "text-[#0A4A13]")}>
          <span className={cn("font-mono text-sm tracking-normal", dark ? "text-[#F4D27A]" : "text-[#B07E0C]")}>{n}</span>
          <motion.span
            aria-hidden="true"
            className={cn("h-[2px] w-12 origin-left rounded-full", dark ? "bg-[#F4D27A]/70" : "bg-[#117F21]/50")}
            initial={{ scaleX: reduce ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={view}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          {kicker}
        </p>
        <h2
          id={id}
          data-i18n-done={lang !== "en" && T !== title ? "" : undefined}
          className={cn(cn("mt-4 text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-[2.6rem]", !stacked && "lg:text-5xl"), dark ? "text-white" : "text-[#0E2414]")}
        >
          {before}
          {hl && (
            <motion.span
              className={cn(
                "box-decoration-clone rounded-md bg-no-repeat px-1",
                dark
                  ? "bg-[linear-gradient(transparent_58%,rgba(244,210,122,0.45)_58%)]"
                  : "bg-[linear-gradient(transparent_58%,rgba(244,210,122,0.75)_58%)]",
              )}
              initial={{ backgroundSize: reduce ? "100% 100%" : "0% 100%" }}
              whileInView={{ backgroundSize: "100% 100%" }}
              viewport={view}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
            >
              {hl}
            </motion.span>
          )}
          {after}
        </h2>
      </div>
      {(intro || action) && (
        <div className={cn(!stacked && "lg:col-span-5 lg:border-l lg:pl-8", dark ? "lg:border-white/20" : "lg:border-[#0E2414]/15")}>
          {intro && <p className={cn("text-base leading-relaxed sm:text-lg", dark ? "text-white/75" : "text-gray-600")}>{intro}</p>}
          {action && <div className="mt-4">{action}</div>}
        </div>
      )}
    </header>
  );
}
