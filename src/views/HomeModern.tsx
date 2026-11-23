"use client";

import { useEffect } from "react";
import { useLocation } from "@/lib/router";
import { MotionConfig, useReducedMotion } from "framer-motion";
import CookieConsent from "@/components/CookieConsent";
import PromoPopup from "@/components/PromoPopup";
import { scrollToId } from "./about/primitives";
import Hero from "./homemodern/Hero";
import { Circulars, Figures, HelpContact, NewsEvents, OnlineServices } from "./homemodern/Sections";

/**
 * Home, third design: for everyone. Order follows the stakeholder answer to DES-19:
 * (1) "I am a…" quick links → (2) search and commonly used services (with a compact feature slider,
 * DES-18/19) → (3) important alerts (header bell, opens with the top notice on first load) → (4) latest circulars and regulatory updates → (5) online services →
 * (6) news and events → (7) approved industry figures with source and date (DES-21) → (8) FAQs and contact.
 * Other designs: /home-retirees (older readers first) and /home-classic.
 */
export default function HomeModern() {
  const { hash } = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id || id === "chat") return;
    const t = window.setTimeout(() => scrollToId(id, !reduce), 80);
    return () => window.clearTimeout(t);
  }, [hash, reduce]);

  return (
    <MotionConfig reducedMotion="user">
      <CookieConsent />
      <PromoPopup />
      <div className="bg-[#FBFCF9] text-[#1C4226]">
        <Hero />
        <Circulars />
        <OnlineServices />
        <NewsEvents />
        <Figures />
        <HelpContact />
      </div>
    </MotionConfig>
  );
}
