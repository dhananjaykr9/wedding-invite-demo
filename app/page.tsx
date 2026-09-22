"use client";

import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/ui/LoadingScreen";

// Global Features
import MauliThread from "@/components/mauli/MauliThread";
import AudioPlayer from "@/components/features/AudioPlayer";
import SadhaModeToggle from "@/components/features/SadhaModeToggle";
import DeveloperInfo from "@/components/features/DeveloperInfo";

// Content Sections
import ShubhAarambh from "@/components/sections/01_ShubhAarambh";
import AmcheAple from "@/components/sections/02_AmcheAple";
import GreenDay from "@/components/sections/03_GreenDay";
import YellowDay from "@/components/sections/04_YellowDay";
import TheJourney from "@/components/sections/05_TheJourney";
import GrandFinale from "@/components/sections/06_GrandFinale";
import PhotoShodh from "@/components/sections/07_PhotoShodh";
import Blessings from "@/components/sections/08_Blessings";
import RSVP from "@/components/sections/09_RSVP";
import ChildInvitation from "@/components/sections/10_ChildInvitation";
import LiveEventCard from "@/components/features/LiveEventCard";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for the "Shubh Bhavatu" animation to complete at least one cycle
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <main className="relative min-h-screen w-full bg-wedding-paper selection:bg-mauli-gold/30 selection:text-wedding-maroon overflow-x-hidden scroll-smooth">
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* 1. SACRED PROGRESS BAR */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-mauli-red via-mauli-gold to-mauli-red origin-left z-[100] shadow-md shadow-mauli-red/10"
            style={{ scaleX }}
          />

          {/* 2. GLOBAL HUD */}
          <div className="fixed inset-0 pointer-events-none z-[80]">
            <MauliThread />
          </div>

          <div className="fixed bottom-6 left-6 z-[110] flex items-center gap-4">
            <SadhaModeToggle />
          </div>

          <div className="fixed bottom-6 right-6 z-[110]">
            <AudioPlayer />
          </div>

          {/* 3. GLOBAL ATMOSPHERIC TEXTURES */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 opacity-[0.05] bg-[url('/images/textures/paper-grain.png')] mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-wedding-paper/10 to-wedding-paper/60" />
          </div>

          {/* 4. MAIN INVITATION FLOW */}
          <article className="relative z-10 flex flex-col w-full">

            <section id="welcome" className="w-full relative">
              <ShubhAarambh />
            </section>

            <div className="relative flex flex-col w-full mx-auto overflow-visible">

              <div className="max-w-6xl mx-auto w-full px-4">
                <section id="profiles" className="w-full py-16">
                  <AmcheAple />
                </section>
              </div>

              {/* LIVE EVENT CARD — appears when admin activates a live event */}
              <div className="max-w-4xl mx-auto w-full px-4 pb-8">
                <LiveEventCard />
              </div>

              {/* THE SACRED TIMELINE */}
              <div className="relative w-full pt-20">
                <GreenDay />
                <YellowDay />
                <TheJourney />
              </div>

              {/* WEDDING DAY - High Emphasis Section */}
              <section id="finale" className="w-full relative z-20 py-20">
                <GrandFinale />
              </section>

              {/* INTERACTIVE GUEST TOOLS & STORIES */}
              <div className="relative flex flex-col w-full space-y-32 py-24 bg-gradient-to-b from-transparent via-mauli-gold/[0.03] to-transparent">



                <div className="max-w-6xl mx-auto w-full px-4">
                  <PhotoShodh />
                </div>


                <div className="max-w-6xl mx-auto w-full px-4">
                  <Blessings />
                </div>

                <section id="child-invite" className="w-full relative z-30 min-h-[400px]">
                  <ChildInvitation />
                </section>

                <div className="max-w-4xl mx-auto w-full px-4">
                  <RSVP />
                </div>
              </div>
            </div>

            {/* 5. FOOTER & SIGN-OFF */}
            <footer className="relative z-[50] w-full bg-wedding-paper border-t border-mauli-gold/10 pt-10">
              <DeveloperInfo />
            </footer>
          </article>

          <div className="sr-only">
            <h1>Wedding Invitation of Atul Gavaskar and Vaishnavi</h1>
            <p>A bachelor's story leading to a royal union on February 26th, 2026.</p>
          </div>
        </>
      )
      }
    </main>
  );
}