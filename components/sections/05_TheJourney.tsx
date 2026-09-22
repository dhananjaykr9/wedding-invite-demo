"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ShlokaText from "../shared/ShlokaText";
import { SHLOKAS, TIMELINE } from "@/lib/constants";
import { Bus, MapPin, Map, ExternalLink, LocateFixed, Wind, Clock, Navigation } from "lucide-react";
import { useStore } from "@/lib/store";
import { useRef, useEffect, useState } from "react";
import { useMobile } from "@/hooks/useMobile";

export default function TheJourney() {
  const data = TIMELINE[2];
  const { isSadhaMode } = useStore();
  const sectionRef = useRef(null);
  const isMobile = useMobile();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const trackOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const roadX = useSpring(useTransform(scrollYProgress, [0, 1], [0, -300]), {
    stiffness: 70,
    damping: 30,
  });

  /** * Hinganghat is at 20% in the array. 
   * Calculation logic used in stops: (pos * 0.65) + 15%
   * (20 * 0.65) + 15 = 13 + 15 = 28%
   */
  const busPosition = "28%";

  const progressLine = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "100%"]);
  const smoothProgress = useSpring(progressLine, { stiffness: 50, damping: 20 });

  const stops = [
    { name: "काजळसरा", pos: "0%" },
    { name: "हिंगणघाट", pos: "20%" },
    { name: "टेमुर्डा", pos: "40%" },
    { name: "वरोरा", pos: "60%" },
    { name: "भद्रावती", pos: "80%" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 px-4 overflow-hidden bg-gradient-to-b from-transparent via-slate-100/40 to-transparent scroll-mt-20"
    >
      {/* 1. Atmospheric Wind Particles */}
      {!isSadhaMode && [...Array(isMobile ? 2 : 4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-slate-200/30 pointer-events-none z-0"
          style={{
            top: `${15 + (i * 25)}%`,
            left: i % 2 === 0 ? "-10%" : "110%"
          }}
          animate={{
            x: i % 2 === 0 ? ["0vw", "120vw"] : ["0vw", "-120vw"],
            opacity: [0, 0.5, 0]
          }}
          transition={{ duration: 12 + i * 2, repeat: Infinity, ease: "linear" }}
        >
          <Wind size={60 + i * 20} strokeWidth={1} />
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto relative z-10">

        {/* 2. Header Section */}
        <div className="w-full max-w-4xl mx-auto mb-12 md:mb-20 relative px-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="pl-4 md:pl-6 border-l-[4px] md:border-l-[5px] border-mauli-gold"
          >
            <ShlokaText
              text={SHLOKAS.journey}
              size="sm"
              className="text-slate-500 text-left italic mb-4 leading-relaxed text-sm md:text-base"
            />
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-marathi font-black text-wedding-maroon tracking-tighter leading-tight mb-4">
              {data.date}
            </h2>

            {/* Marriage Timing Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-wedding-maroon text-white shadow-xl shadow-wedding-maroon/20 mb-6 md:mb-8"
            >
              <Clock size={16} className="animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest opacity-80 leading-none mb-1 text-white/70">शुभ मुहूर्त (Timing)</span>
                <span className="text-lg md:text-2xl font-black font-marathi leading-none">सकाळी ११:४५ वा.</span>
              </div>
            </motion.div>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-1.5 bg-mauli-gold rounded-lg text-white shadow-lg">
                <Navigation size={16} />
              </div>
              <p className="text-mauli-gold font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[9px] md:text-[12px]">
                वरात प्रस्थान • The Royal Passage
              </p>
            </div>
          </motion.div>
        </div>

        {/* 3. Interactive Animated Road Track */}
        <motion.div
          style={{ opacity: isMobile ? 1 : trackOpacity }}
          className="relative w-full h-72 md:h-80 flex items-center bg-white/40 backdrop-blur-3xl rounded-[3rem] md:rounded-[4rem] border border-white/60 shadow-xl overflow-hidden mb-16 md:mb-24 group"
        >
          {/* Main Road Line */}
          <div className="absolute inset-x-8 md:inset-x-32 h-4 md:h-6 bg-slate-200/30 rounded-full overflow-hidden top-1/2 -translate-y-1/2">
            <motion.div
              style={{ x: isMobile ? 0 : roadX }}
              className="w-[600%] h-full flex gap-20 px-10 opacity-40"
            >
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="w-16 h-full bg-slate-400 skew-x-[-40deg] flex-shrink-0" />
              ))}
            </motion.div>
            <motion.div
              style={{ width: smoothProgress }}
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-wedding-maroon via-mauli-red to-mauli-gold z-10 shadow-[0_0_15px_rgba(185,28,28,0.4)]"
            />
          </div>

          {/* Stops - Adjusted for Mobile overlap */}
          {stops.map((stop, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.3 }}
              whileInView={{ opacity: 1 }}
              className="absolute flex flex-col items-center"
              style={{ left: `calc(${stop.pos} * 0.65 + 15%)` }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  backgroundColor: ["#cbd5e1", "#d4af37", "#cbd5e1"]
                }}
                transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 md:border-4 border-white shadow-md z-20"
              />
              <span className="text-[8px] md:text-[12px] font-black text-slate-700 mt-4 md:mt-6 uppercase tracking-tighter bg-white/90 px-2 md:px-3 py-1 rounded-full shadow-sm font-marathi whitespace-nowrap">
                {stop.name}
              </span>
            </motion.div>
          ))}

          {/* Animated Bus - Locked at Hinganghat */}
          <motion.div
            style={{ left: busPosition }}
            className="absolute z-40"
          >
            <motion.div
              animate={{
                y: [0, -3, 0],
                rotate: [0, 0.5, -0.5, 0]
              }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
              className="bg-white p-3 md:p-5 rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-slate-100 flex items-center gap-2 md:gap-4"
            >
              <div className="p-2 md:p-3 bg-gradient-to-br from-wedding-maroon to-mauli-red rounded-xl text-white">
                <Bus size={18} className="md:w-7 md:h-7" />
              </div>
              <div className="pr-1 md:pr-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-[7px] md:text-[9px] uppercase font-black text-slate-400 tracking-widest">हिंगणघाट</p>
                </div>
                <p className="text-[10px] md:text-base font-black text-wedding-maroon font-marathi whitespace-nowrap">वरात मार्गस्थ...</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Destination Pin */}
          <div className="absolute right-4 md:right-[8%] flex flex-col items-center">
            <div className="relative">
              <MapPin size={32} className="md:w-16 md:h-16 text-mauli-red fill-mauli-red/10 drop-shadow-lg" />
              <motion.div
                animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-mauli-red/40 rounded-full -z-10 blur-lg"
              />
            </div>
            <span className="font-marathi font-black text-lg md:text-4xl text-slate-800 mt-2 md:mt-4 tracking-tighter">
              चंद्रपूर
            </span>
          </div>
        </motion.div>

        {/* 4. Detailed Venue Card */}
        <div className="w-full max-w-4xl mx-auto px-2">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-20 rounded-[3rem] md:rounded-[5rem] shadow-xl border border-white relative z-10 text-center overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12">
                <Map size={300} className="text-wedding-maroon" />
              </div>

              <motion.div
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-wedding-maroon/5 text-wedding-maroon mb-8 border border-wedding-maroon/10"
              >
                <LocateFixed size={16} className="animate-spin-slow" />
                <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em]">The Grand Destination</span>
              </motion.div>

              <h3 className="text-4xl sm:text-6xl md:text-8xl font-marathi font-black text-wedding-maroon mb-6 tracking-tighter">
                लग्नस्थळ
              </h3>

              <p className="text-slate-600 font-marathi text-xl md:text-4xl leading-relaxed italic mb-10 md:mb-16 opacity-90 max-w-2xl mx-auto">
                "{(data.events[0] as any).desc}"
              </p>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://maps.app.goo.gl/G6X1frKYNe6hvrHGA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#34A853] hover:bg-[#2d9147] text-white px-8 md:px-20 py-5 md:py-7 rounded-2xl md:rounded-[2rem] font-black text-xs md:text-lg shadow-2xl transition-all"
              >
                {/* Google Maps Pin Logo */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" fill="white">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                GOOGLE MAPS वर पहा
                <ExternalLink size={16} className="opacity-70" />
              </motion.a>

              <div className="mt-12 flex items-center justify-center gap-4 text-slate-300">
                <div className="h-px w-8 md:w-16 bg-red-400/40" />
                <p className="text-[10px] md:text-sm uppercase font-bold tracking-[0.2em] md:tracking-[0.5em] text-red-800">शकुंतला मॅरेज हॉल, चंद्रपूर</p>
                <div className="h-px w-8 md:w-16 bg-red-400/40" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}