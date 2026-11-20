"use client";

import type { ReactNode } from "react";
import Headline from "@/views/homemodern/Headline";

/**
 * Old-style SectionHeading props mapped onto the home page's numbered Headline, so ported sections keep
 * their markup while taking the theme’s look. Numbers follow each page’s section order (ids are unique site-wide).
 */
const numbers: Record<string, string> = {
  // Resources
  "guides-title": "01",
  "faq-title": "02",
  "glossary-title": "03",
  "pub-title": "04",
  "dl-title": "05",
  "learn-title": "06",
  // Regulations
  "latest-title": "01",
  "library-title": "02",
  "act-title": "03",
  "compliance-title": "04",
  "policies-title": "05",
  // Connect
  "form-title": "01",
  "track-title": "02",
  "offices-title": "03",
  "news-title": "04",
  // Performance
  "assets-title": "01",
  "alloc-title": "02",
  "funds-title": "03",
  "cov-title": "04",
  "cmp-title": "05",
  "fees-title": "06",
  "method-title": "07",
  // Media
  "vid-title": "01",
  "ph-title": "02",
  "follow-title": "03",
  // Chronicles
  "inside-title": "01",
  "launch-title": "02",
  "issues-title": "03",
  // Forms and checklists
  "cl-t": "01",
  "forms-t": "02",
  // Q1 2026 report
  "glance-t": "01",
  "dg-t": "02",
  "dom-t": "03",
};

export function SectionHeading({
  n,
  id,
  eyebrow,
  title,
  highlight,
  intro,
  dark,
  action,
  stacked,
}: {
  /** Overrides the number from the table above. */
  n?: string;
  id: string;
  eyebrow: string;
  title: string;
  highlight?: string;
  intro?: ReactNode;
  dark?: boolean;
  action?: ReactNode;
  stacked?: boolean;
}) {
  return <Headline id={id} n={n ?? numbers[id] ?? "—"} kicker={eyebrow} title={title} mark={highlight} intro={intro} dark={dark} action={action} stacked={stacked} />;
}
