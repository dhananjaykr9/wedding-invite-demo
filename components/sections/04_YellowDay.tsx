"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ShlokaText from "../shared/ShlokaText";
import EventCard from "../shared/EventCard";
import { SHLOKAS, TIMELINE } from "@/lib/constants";
import ThreadKnot from "../mauli/ThreadKnot";
import { Sun, Sparkles } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export default function YellowDay() {
  const data = TIMELINE[1];
  const containerRef = useRef(null);

  // FIX: State for particles to avoid Hydration Error
  const [particles, setParticles] = useState<{ size: number; delay: number; left: number }[]>([]);

  useEffect(() => {
    const generated = [...Array(12)].map((_, i) => ({
      size: 2, // Consistent size for haldi dust
      delay: Math.random() * 5,
      left: 5 + (i * 8)
    }));
    setParticles(generated);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yParticles = useSpring(useTransform(scrollYProgress, [0, 1], [0, 600]), {
    stiffness: 25,
    damping: 25
  });

  return (
    <section
      ref={containerRef}
      className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-transparent via-orange-50/20 to-transparent"
    >
      {/* 1. Sunlight Flare Overlay */}
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        whileInView={{ x: "100%", opacity: 0.4 }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 pointer-events-none -z-10"
      />

      {/* Floating Haldi Dust Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{
            left: `${p.left}%`,
            top: "-5%",
            y: yParticles
          }}
          animate={{
            x: [0, (i % 2 === 0 ? 40 : -40), 0],
            rotate: [0, 360],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 8 + p.delay,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5
          }}
          className="absolute w-2 h-2 rounded-full bg-wedding-haldi/40 blur-[1.5px] pointer-events-none"
        />
      ))}

      <div className="max-w-5xl mx-auto relative z-10">

        {/* 2. Header Section with Sequential Stagger */}
        <div className="text-center mb-24 flex flex-col items-center">

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full border border-wedding-haldi/20 bg-white/70 backdrop-blur-lg text-orange-800 font-black text-[11px] uppercase tracking-[0.3em] shadow-md mb-10"
          >
            <Sun size={14} className="text-wedding-haldi animate-[spin_8s_linear_infinite]" />
            <span>{data.date}</span>
            <Sun size={14} className="text-wedding-haldi animate-[spin_8s_linear_infinite]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ShlokaText
              text={SHLOKAS.haldi}
              size="sm"
              className="text-orange-700/80 font-medium italic max-w-lg mx-auto leading-relaxed tracking-wide mb-10 px-4"
            />
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="relative mb-10 group"
          >
            <div className="absolute inset-[-20px] bg-wedding-haldi/15 rounded-full blur-3xl animate-pulse" />
            <ThreadKnot className="scale-125 relative z-10" />
          </motion.div>

          <motion.h2
            initial={{ letterSpacing: "-0.05em", opacity: 0 }}
            whileInView={{ letterSpacing: "0em", opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-marathi text-5xl sm:text-6xl md:text-8xl text-orange-900 font-black tracking-tight leading-tight drop-shadow-sm max-w-4xl"
          >
            हळदीचा थाट व संगीत
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="h-1.5 bg-gradient-to-r from-transparent via-wedding-haldi/60 to-transparent mt-10 rounded-full"
          />
        </div>

        {/* 3. The Interactive Timeline */}
        <div className="relative pt-12 px-2">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-wedding-haldi/40 via-orange-200/20 to-transparent hidden md:block -translate-x-1/2 origin-top"
          />

          <div className="flex flex-col gap-16 md:gap-32 relative">
            {/* FIX: Added 'any' type to 'event' to bypass property mismatch errors */}
            {data.events.map((event: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 !== 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  type: "spring",
                  bounce: 0.4
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <EventCard
                  time={event.time}
                  title={event.title}
                  dress_code={event.dress_code}
                  note={event.note}
                  isLeft={index % 2 !== 0}
                  variant="yellow"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Elegant Section Outro */}
      <div className="mt-40 flex flex-col items-center">
        <div className="flex gap-3 mb-6">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ repeat: Infinity, duration: 3, delay: i * 1 }}
              className="w-2 h-2 rounded-full bg-wedding-haldi/60"
            />
          ))}
        </div>
        <motion.div
          initial={{ height: 0 }}
          whileInView={{ height: 120 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="w-[1.5px] bg-gradient-to-b from-wedding-haldi/40 via-orange-100 to-transparent"
        />
      </div>
    </section>
  );
}