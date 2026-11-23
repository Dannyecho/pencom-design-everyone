"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";

/**
 * Mega menu for the "for everyone" theme: a light framed panel (dark-green offset frame, as on the
 * homepage hero). On the left the section name with a gold highlighter stroke swept in, its one-line
 * description and an Overview link; on the right one soft colour field per group, each with an index
 * number joined to its title by a line that draws itself. Links get the gold highlighter on hover/focus.
 */

type Link_ = { label: string; href: string; plain?: boolean; note?: string };
type Item = { label: string; href: string; description?: string; megaMenu?: { columns: { title: string; links: Link_[] }[] } };

const focus = "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#FFD84D]";
const fields = ["bg-[#EEF6EE]", "bg-[#FFF6DC]", "bg-[#EAF3FB]"];
const ease = [0.22, 1, 0.36, 1] as const;

function NavLink({ to, plain, ...rest }: { to: string; plain?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return plain ? <a href={to} {...rest} /> : <Link to={to} {...rest} />;
}

export default function MegaPanel({ item, pathname }: { item: Item; pathname: string }) {
  const reduce = useReducedMotion();
  const cols = item.megaMenu?.columns ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduce ? 0 : 8 }}
      transition={{ duration: 0.22, ease }}
      className="absolute inset-x-4 top-full z-10 pt-2"
    >
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-0 -z-10 translate-x-2.5 translate-y-2.5 rounded-[1.75rem] bg-[#105D1D]" />
        <div className="grid grid-cols-[14rem_1fr] gap-4 rounded-[1.75rem] border border-[#105D1D]/15 bg-white p-4 shadow-[0_30px_60px_-30px_rgba(22,77,32,0.55)] xl:grid-cols-[16rem_1fr]">
          {/* Section intro */}
          <div className="flex flex-col justify-between p-3">
            <div>
              <p className="text-3xl font-bold leading-tight tracking-tight text-[#1C4226]">
                <motion.span
                  className="box-decoration-clone rounded-md bg-[linear-gradient(transparent_58%,rgba(244,210,122,0.75)_58%)] bg-no-repeat px-1"
                  initial={{ backgroundSize: reduce ? "100% 100%" : "0% 100%" }}
                  animate={{ backgroundSize: "100% 100%" }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
                >
                  {item.label}
                </motion.span>
              </p>
              {item.description && <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.description}</p>}
            </div>
            <Link
              to={item.href}
              className={cn("group/o mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-[#105D1D] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#14892A]", focus)}
            >
              Overview
              <ArrowRight className="h-4 w-4 transition-transform group-hover/o:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          {/* Groups on soft colour fields */}
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))` }}>
            {cols.map((col, i) => (
              <motion.div
                key={col.title}
                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: reduce ? 0 : 0.05 + i * 0.05, ease }}
                className={cn("rounded-2xl p-4", fields[i % fields.length])}
              >
                <p className="mb-3 flex items-center gap-2.5 px-2 text-xs font-bold uppercase tracking-[0.18em] text-[#105D1D]">
                  <span className="font-mono text-sm tracking-normal text-[#8A6309]">{String(i + 1).padStart(2, "0")}</span>
                  <motion.span
                    aria-hidden="true"
                    className="h-[2px] w-6 origin-left rounded-full bg-[#14892A]/50"
                    initial={{ scaleX: reduce ? 1 : 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: reduce ? 0 : 0.15 + i * 0.05, ease }}
                  />
                  {col.title}
                </p>
                <ul className="space-y-0.5">
                  {col.links.map((link) => {
                    const here = pathname === link.href;
                    return (
                      <li key={link.label}>
                        <NavLink
                          to={link.href}
                          plain={link.plain}
                          aria-current={here ? "page" : undefined}
                          className={cn(
                            "group/l flex min-h-10 items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[15px] text-[#1C4226] transition-colors hover:bg-white/70",
                            here && "font-semibold",
                            focus,
                          )}
                        >
                          <span className="min-w-0">
                            <span
                              className={cn(
                                "box-decoration-clone bg-[linear-gradient(transparent_60%,rgba(244,210,122,0.85)_60%)] bg-no-repeat transition-[background-size] duration-300 group-hover/l:bg-[length:100%_100%] group-focus-visible/l:bg-[length:100%_100%]",
                                here ? "bg-[length:100%_100%]" : "bg-[length:0%_100%]",
                              )}
                            >
                              {link.label}
                            </span>
                            {link.note && <span className="mt-0.5 block text-xs leading-snug text-gray-600">{link.note}</span>}
                          </span>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 -translate-x-1 text-[#117F21] opacity-0 transition duration-200 group-hover/l:translate-x-0 group-hover/l:opacity-100 group-focus-visible/l:opacity-100"
                            aria-hidden="true"
                          />
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
