"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import ShlokaText from "../shared/ShlokaText";
import { SHLOKAS, COUPLE } from "@/lib/constants";
import { ChevronDown, Sparkle, Heart } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";
import { useStore } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import { throttle } from "lodash";

interface MouseSparkle {
  id: number;
  x: number;
  y: number;
}

export default function ShubhAarambh() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { isSadhaMode } = useStore();
  const [sparkles, setSparkles] = useState<{ id: number; top: string; left: string; size: number; delay: number }[]>([]);
  const [mouseSparkles, setMouseSparkles] = useState<MouseSparkle[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    // Reduced sparkle count for performance on old devices
    const generated = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 10 + 6,
      delay: Math.random() * 5,
    }));
    setSparkles(generated);
  }, []);

  // Throttle mouse move to reduce React re-renders and CPU usage
  const handleMouseMove = useCallback(
    throttle((e: React.MouseEvent | React.TouchEvent) => {
      if (isSadhaMode) return;
      if (Math.random() > 0.3) return; // Slightly less frequent sparkles

      let clientX, clientY;
      if ('touches' in e) {
        clientX = (e as React.TouchEvent).touches[0].clientX;
        clientY = (e as React.TouchEvent).touches[0].clientY;
      } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
      }

      const newSparkle = {
        id: nextId.current++,
        x: clientX,
        y: clientY,
      };

      setMouseSparkles((prev) => [...prev.slice(-10), newSparkle]); // Lower cap
    }, 50),
    [isSadhaMode]
  );

  useEffect(() => {
    if (mouseSparkles.length === 0) return;
    const timer = setTimeout(() => {
      setMouseSparkles((prev) => prev.slice(1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [mouseSparkles]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const yBackground = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), springConfig);
  const yText = useSpring(useTransform(scrollYProgress, [0, 1], [0, -120]), springConfig);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Entrance Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: "blur(12px)", scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1] as any // Custom ease-out expo
      }
    }
  };

  return (
    <motion.section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative min-h-[100dvh] w-full flex flex-col items-center py-12 md:py-20 overflow-hidden px-4 select-none bg-wedding-paper"
    >
      {/* 1. Interactive Sparkle Layer - Highest Z-Index, ignore clicks */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <AnimatePresence>
          {mouseSparkles.map((ms) => (
            <motion.div
              key={ms.id}
              initial={{ opacity: 1, scale: 0, x: ms.x, y: ms.y }}
              animate={{
                opacity: 0,
                scale: Math.random() * 1.5,
                y: ms.y - 120,
                x: ms.x + (Math.random() - 0.5) * 60,
                rotate: 180
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute text-[#D4AF37]"
            >
              <Sparkle size={14} fill="currentColor" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. Background Layer - Lowest Z-Index */}
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        style={{ y: isSadhaMode ? 0 : yBackground, scale: isSadhaMode ? 1 : bgScale }}
        className="absolute inset-0 z-0 h-[110%] w-full will-change-transform"
      >
        <Image
          src="/images/hero/hero.jpg"
          alt="Wedding Background"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80 filter contrast-[1.05]"
          quality={75}
        />
        {!isSadhaMode && sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute text-[#D4AF37]/40 pointer-events-none z-10"
            style={{ top: s.top, left: s.left }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay: s.delay }}
          >
            <Sparkle size={s.size} fill="currentColor" />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-wedding-paper/15 to-wedding-paper/85 z-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-wedding-paper/40 via-transparent to-wedding-paper/95 z-20" />
      </motion.div>

      {/* 3. Top Content: Shloka - High Z-Index */}
      <motion.div
        variants={itemVariants}
        style={{ y: isSadhaMode ? 0 : yText, opacity: isSadhaMode ? 1 : opacityFade }}
        className="z-50 flex flex-col items-center space-y-6 md:space-y-8 mt-2"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-2xl -z-10"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-dashed border-[#D4AF37]/30 rounded-full -z-10"
          />
          <div className="w-20 h-20 md:w-28 md:h-28 relative">
            <Image
              src="/images/ganpati.png"
              alt="Ganpati"
              fill
              className="object-contain filter drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]"
              priority
            />
          </div>
        </div>
        <ShlokaText
          text={SHLOKAS.ganesh}
          size="sm"
          className="text-[#b91c1c] font-yantramanav font-bold tracking-normal text-center px-4 leading-[1.6] max-w-[95vw] drop-shadow-sm mt-1 mb-2"
        />
      </motion.div>

      {/* 4. Center Block: Names + RSVP Button - High Z-Index */}
      <motion.div
        variants={itemVariants}
        className="z-50 text-center w-full max-w-6xl px-4 flex flex-col items-center justify-center flex-grow py-8"
      >
        <div className="flex flex-col items-center">
          <div className="relative py-2 md:py-4">
            {/* Names updated to use a Devanagari calligraphy-style matching the wedding theme */}
            <h1 className="text-5xl sm:text-7xl md:text-[9.5rem] text-[#8b0000] leading-[1.1] md:leading-[1.1] tracking-tighter drop-shadow-[0_2px_2px_rgba(212,175,55,0.8)]">
              <span className="block lg:inline-block px-2 md:px-4 font-yantramanav font-bold tracking-normal">{COUPLE.groom.name}</span>
              <span className="block lg:inline-block text-2xl md:text-7xl text-[#d4af37] font-serif italic mx-0 lg:mx-10 opacity-100 my-1 lg:my-0 drop-shadow-none">
                &
              </span>
              <span className="block lg:inline-block px-2 md:px-4 font-yantramanav font-bold tracking-normal">{COUPLE.bride.name}</span>
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-10 w-full mt-4 md:mt-6">
            <div className="h-[1px] flex-1 max-w-[30px] md:max-w-[50px] bg-gradient-to-r from-transparent to-[#D4AF37]/60" />
            <p className="font-marathi text-[10px] sm:text-sm md:text-3xl text-slate-800 tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.6em] uppercase font-bold whitespace-nowrap">
              The Royal Wedding
            </p>
            <div className="h-[1px] flex-1 max-w-[30px] md:max-w-[50px] bg-gradient-to-l from-transparent to-[#D4AF37]/60" />
          </div>

          {/* RSVP BUTTON ACTION */}
          <div className="mt-8 md:mt-16">
            <Link href="/rsvp">
              <button
                className="px-6 md:px-10 py-4 md:py-5 bg-[#800000] hover:bg-[#a00000] text-white rounded-full font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-xs shadow-[0_20px_50px_rgba(128,0,0,0.4)] border border-white/20 flex items-center gap-2 md:gap-3 transition-all hover:scale-105 active:scale-95 group"
                suppressHydrationWarning
              >
                <Heart size={16} className="group-hover:fill-white transition-all" />
                Confirm Attendance (RSVP)
              </button>
            </Link>
            <p className="text-[9px] md:text-[10px] font-black text-[#M0AF80] uppercase tracking-[0.3em] md:tracking-[0.4em] mt-3 md:mt-4 opacity-80">
              Please respond by Feb 20th
            </p>
          </div>
        </div>
      </motion.div>

      {/* 5. Scroll Indicator - High Z-Index */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="z-50 text-[#b91c1c] flex flex-col items-center gap-2 cursor-pointer pb-6 hover:text-[#D4AF37] transition-colors duration-300 mt-auto"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
      >
        <span className="text-[11px] uppercase tracking-[0.5em] font-black opacity-80">
          Explore
        </span>
        <div className="p-2 rounded-full border border-[#b91c1c]/20">
          <ChevronDown size={28} strokeWidth={2.5} />
        </div>
      </motion.div>
    </motion.section>
  );
}