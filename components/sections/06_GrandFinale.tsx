"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ShlokaText from "../shared/ShlokaText";
import EventCard from "../shared/EventCard";
import { SHLOKAS, TIMELINE } from "@/lib/constants";
import { MapPin, Sparkles, Clock, Compass } from "lucide-react";
import ThreadKnot from "../mauli/ThreadKnot";
import { useEffect, useState, useRef } from "react";
import { useMobile } from "@/hooks/useMobile";

interface Particle {
  width: number;
  height: number;
  left: string;
  top: string;
  duration: number;
  delay: number;
}

export default function GrandFinale() {
  const data = TIMELINE[3];
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef(null);
  const isMobile = useMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const ySpring = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), {
    stiffness: 100,
    damping: 30,
  });

  const parallaxCard = useSpring(useTransform(scrollYProgress, [0.3, 0.8], [15, -15]), {
    stiffness: 80,
    damping: 25
  });

  useEffect(() => {
    if (isMobile) return; // No particles on mobile
    const generated = [...Array(10)].map((_, i) => ({
      width: Math.random() * 5 + 2,
      height: Math.random() * 5 + 2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 8 + 5,
      delay: i * 0.4,
    }));
    setParticles(generated);
  }, [isMobile]);

  return (
    <section ref={containerRef} className="relative py-12 md:py-32 px-4 w-full max-w-6xl mx-auto overflow-hidden md:overflow-visible">

      {/* 1. Golden Dust System */}
      <motion.div style={{ y: isMobile ? 0 : ySpring }} className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute bg-mauli-gold/30 rounded-full blur-[1px]"
            style={{ width: p.width, height: p.height, left: p.left, top: p.top }}
            animate={{
              y: [0, -300],
              opacity: [0, 0.6, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </motion.div>

      {/* 2. Sacred Scroll Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 md:mb-32 space-y-6 md:space-y-8 w-full"
      >
        <div className="flex items-center justify-center gap-4 w-full max-w-[100vw] px-2">
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1 }} className="h-px bg-mauli-gold/40 flex-1 hidden sm:block" />
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-marathi font-black text-wedding-maroon tracking-tighter leading-tight">
            {data.date}
          </h2>
          <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1 }} className="h-px bg-mauli-gold/40 flex-1 hidden sm:block" />
        </div>

        <div className="relative py-8 md:py-16 px-6 md:px-16 rounded-[2rem] md:rounded-[4rem] bg-white border border-mauli-gold/15 shadow-lg overflow-hidden max-w-4xl mx-auto group">
          <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-mauli-gold/30 rounded-tl-xl" />
          <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-mauli-gold/30 rounded-br-xl" />

          <ShlokaText
            text={SHLOKAS.muhurta}
            size="md"
            className="text-wedding-royal font-black leading-[1.5] mb-4 md:mb-6 tracking-wide text-base md:text-3xl drop-shadow-sm px-2"
          />

          <div className="flex items-center justify-center gap-4 text-mauli-gold/70">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-mauli-gold/40" />
            <Clock size={16} className="animate-spin-slow shrink-0" />
            <p className="font-serif italic tracking-[0.3em] text-[8px] md:text-xs font-black uppercase whitespace-nowrap">The Divine Moment</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-mauli-gold/40" />
          </div>
        </div>
      </motion.div>

      {/* 3. Rituals Progression */}
      <div className="flex flex-col items-center space-y-16 md:space-y-48 mb-20 md:mb-48 w-full overflow-visible">

        <div className="w-full flex justify-center px-4">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <EventCard
              time={data.events[0].time}
              title={data.events[0].title}
              dress_code={(data.events[0] as any).dress_code}
              isLeft={true}
              variant="royal"
            />
          </motion.div>
        </div>

        {/* Satyanarayan Puja Card - Tightened Size */}
        <motion.div
          style={{ y: isMobile ? 0 : parallaxCard }}
          className="relative w-full max-w-[700px] px-2 md:px-0 z-20"
        >
          <div className="absolute -top-8 md:-top-16 left-1/2 -translate-x-1/2 z-30">
            <ThreadKnot className="scale-75 md:scale-[1.3]" />
          </div>

          <div className="bg-gradient-to-b from-orange-50/90 via-white to-white border border-mauli-gold/20 rounded-[2.5rem] md:rounded-[4rem] pt-16 pb-10 md:pt-28 md:pb-20 px-4 md:px-12 text-center shadow-xl relative overflow-hidden flex flex-col items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute inset-0 text-orange-200/20 pointer-events-none flex items-center justify-center">
              <Sparkles className="w-[250px] h-[250px] md:w-[350px] md:h-[350px]" />
            </motion.div>

            <div className="relative z-10 w-full flex flex-col items-center px-2">
              <div className="flex items-center justify-center gap-2 text-orange-700 mb-4 md:mb-8">
                <Clock size={16} className="opacity-80 animate-pulse" />
                <span className="text-[8px] md:text-sm font-black tracking-[0.2em] uppercase">सकाळी ११.०० ते १२.३० वाजेपर्यंत</span>
              </div>

              <ShlokaText
                text={SHLOKAS.puja}
                size="sm"
                className="text-mauli-red/90 mb-6 md:mb-8 italic font-black text-sm md:text-xl leading-relaxed text-center px-4"
              />

              <h3 className="text-4xl sm:text-5xl md:text-6xl font-marathi font-black text-wedding-maroon mb-6 md:mb-10 tracking-tight leading-[1.1] text-center w-full">
                {data.events[1].title}
              </h3>

              <div className="flex flex-col items-center gap-3 md:gap-4 w-full">
                <div className="flex items-center gap-3 opacity-60">
                  <div className="h-px w-4 bg-mauli-gold" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-900">ड्रेस कोड</span>
                  <div className="h-px w-4 bg-mauli-gold" />
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="inline-flex items-center gap-3 px-5 py-2 bg-white shadow-sm border border-mauli-gold/10 rounded-xl text-wedding-maroon"
                >
                  <Sparkles size={12} className="text-mauli-gold animate-pulse" />
                  <p className="font-marathi text-xs md:text-xl font-black whitespace-nowrap">
                    महिला : पैठणी साडी
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. The Grand Reception Finale */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        className="bg-wedding-royal text-white rounded-[2rem] md:rounded-[4rem] p-6 md:p-20 shadow-2xl relative overflow-hidden group border-b-[8px] md:border-b-[16px] border-mauli-gold w-full mt-8 md:mt-12"
      >
        <div className="absolute top-0 right-0 w-[300px] md:w-[700px] h-[300px] md:h-[700px] bg-mauli-gold/10 rounded-full blur-[80px] md:blur-[180px] -translate-y-1/2 translate-x-1/2 animate-pulse" />

        <div className="relative z-10 text-center space-y-8 md:space-y-16">
          <div className="space-y-2 px-2">
            <ShlokaText text={SHLOKAS.reception.line1} size="sm" className="text-mauli-gold font-black tracking-[0.2em] text-[7px] md:text-lg opacity-80" />
            <ShlokaText text={SHLOKAS.reception.line2} size="sm" className="text-mauli-gold font-black tracking-[0.2em] text-[7px] md:text-lg" />
          </div>

          <div className="space-y-4">
            <h3 className="text-6xl sm:text-7xl md:text-8xl font-marathi font-black tracking-tighter text-white leading-none">
              {data.events[2].title}
            </h3>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl mx-auto"
            >
              <Clock size={14} className="text-mauli-gold animate-pulse shrink-0" />
              <div className="text-left">
                <p className="text-[6px] md:text-[10px] uppercase tracking-widest text-mauli-gold/80 font-black leading-none mb-1">सांयकाळी (Evening)</p>
                <p className="text-sm md:text-xl font-marathi font-black text-white leading-none">७.०० वाजल्यापासून</p>
              </div>
            </motion.div>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] border border-white/10 w-full max-w-3xl mx-auto ring-1 ring-white/10">
            <div className="flex items-center justify-center gap-2 text-mauli-gold mb-4 md:mb-6">
              <MapPin size={18} className="md:w-8 md:h-8" />
              <span className="font-black uppercase tracking-[0.3em] text-[8px] md:text-sm">Reception Venue</span>
            </div>
            <p className="text-4xl sm:text-5xl md:text-5xl font-marathi font-black leading-tight text-white mb-2 md:mb-4 drop-shadow-md">
              {(data.events[2] as any).location}
            </p>
            <p className="text-[7px] md:text-xs text-mauli-gold/60 font-serif italic tracking-[0.3em] uppercase">Wardha District, Maharashtra</p>
          </div>

          <motion.a
            whileHover={{ scale: 1.05, backgroundColor: "#fff" }}
            whileTap={{ scale: 0.98 }}
            href={(data.events[2] as any).map_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 md:gap-6 px-6 md:px-16 py-4 md:py-8 bg-mauli-gold text-wedding-royal font-black rounded-full transition-all shadow-lg text-[9px] md:text-lg tracking-[0.2em]"
          >
            <Compass size={16} className="group-hover:rotate-45 transition-transform md:w-8 md:h-8" />
            START NAVIGATION
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}