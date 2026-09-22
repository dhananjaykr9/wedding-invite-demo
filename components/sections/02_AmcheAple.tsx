"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreadKnot from "../mauli/ThreadKnot";
import { COUPLE } from "@/lib/constants"; // Assuming SHLOKAS is not used in this specific file, kept imports as is
import { Heart, Sparkles, ArrowRightCircle, Clock, PartyPopper, X } from "lucide-react";

// Types for the particle effect
interface Particle {
  id: number;
  x: number;
  y: number;
}

export default function AmcheAple() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [isCeremonyStarted, setIsCeremonyStarted] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const nextId = useRef(0);

  // 1. Unified Countdown Logic
  useEffect(() => {
    // Note: Kept the date from your code: Feb 17. 
    // If you meant Feb 25 based on the comment, please change the string below.
    const targetDate = new Date("2026-02-25T11:45:00");

    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        setIsCeremonyStarted(true);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          mins: Math.floor((difference / 1000 / 60) % 60),
          secs: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Heart Trail Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Math.random() > 0.15) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newParticle = { id: nextId.current++, x, y };
    setParticles((prev) => [...prev.slice(-15), newParticle]);
  };

  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [particles]);

  return (
    <section className="relative min-h-screen py-16 md:py-24 px-4 overflow-hidden bg-wedding-paper/5">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none -z-10 bg-[url('/images/textures/mandala.png')] bg-no-repeat bg-center bg-contain" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* LOGO & COUNTDOWN BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-16 md:mb-20 px-2"
        >
          <div className="mb-8 md:mb-10 relative w-24 h-24 md:w-32 md:h-32">
            {/* Running Boundary */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-dashed border-mauli-red/40 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border border-dotted border-mauli-gold/60 rounded-full"
            />
            <img
              src="/images/gavaskar-logo.png"
              alt="Gavaskar Logo"
              className="w-full h-full object-contain drop-shadow-md relative z-10"
            />
          </div>

          <AnimatePresence mode="wait">
            {!isCeremonyStarted ? (
              <motion.div
                key="countdown"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white/40 backdrop-blur-xl border border-mauli-gold/20 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl flex flex-wrap items-center justify-center gap-4 md:gap-12"
              >
                <div className="flex flex-col items-center text-mauli-gold shrink-0">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 animate-spin-slow mb-1" />
                  <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Countdown</span>
                </div>

                <div className="flex gap-3 sm:gap-4 md:gap-12 items-center">
                  {[
                    { label: "दिवस", val: timeLeft.days },
                    { label: "तास", val: timeLeft.hours },
                    { label: "मिनिटे", val: timeLeft.mins },
                    { label: "सेकंद", val: timeLeft.secs }
                  ].map((unit, i) => (
                    <div key={i} className="flex flex-col items-center min-w-[35px] sm:min-w-[50px] md:min-w-[60px]">
                      <motion.span
                        key={unit.val}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl sm:text-3xl md:text-6xl font-black text-wedding-maroon font-serif leading-none"
                      >
                        {String(unit.val).padStart(2, '0')}
                      </motion.span>
                      <span className="text-[7px] sm:text-[9px] md:text-xs font-black text-mauli-gold uppercase tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.2em] font-marathi mt-1 md:mt-2">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="h-12 w-px bg-mauli-gold/20 hidden lg:block" />
                <div className="hidden lg:block text-right">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed">
                    शुभ विवाहासाठी<br />उरलेला वेळ
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="banner"
                initial={{ opacity: 0, scale: 0.85, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative group w-full max-w-4xl"
              >
                {/* Outer glow */}
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-wedding-maroon/30 rounded-[2.5rem] md:rounded-[3rem] blur-3xl"
                />

                <div className="bg-gradient-to-br from-[#6b0000] via-wedding-maroon to-[#8b0000] border-2 border-mauli-gold/50 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-14 shadow-2xl relative z-10 text-center overflow-hidden">

                  {/* Shimmer sweep */}
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                  />

                  {/* Corner sparkles */}
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute -top-8 -left-8 text-mauli-gold/20 pointer-events-none">
                    <Sparkles size={90} />
                  </motion.div>
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute -bottom-8 -right-8 text-mauli-gold/15 pointer-events-none">
                    <Sparkles size={110} />
                  </motion.div>

                  {/* Gold corner accents */}
                  <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-mauli-gold/50 rounded-tl-2xl" />
                  <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-mauli-gold/50 rounded-tr-2xl" />
                  <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-mauli-gold/50 rounded-bl-2xl" />
                  <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-mauli-gold/50 rounded-br-2xl" />

                  <div className="flex flex-col items-center gap-4 md:gap-6 relative z-10">

                    {/* Diya + pulsing icon */}
                    <div className="relative">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="absolute inset-0 bg-mauli-gold/30 rounded-full blur-xl"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-mauli-gold/15 p-3 md:p-4 rounded-full border border-mauli-gold/30 relative z-10"
                      >
                        <PartyPopper className="text-mauli-gold w-8 h-8 md:w-10 md:h-10" />
                      </motion.div>
                    </div>

                    {/* Floating diya */}
                    <motion.span
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      className="text-4xl md:text-5xl select-none"
                    >
                      🪔
                    </motion.span>

                    {/* Main heading */}
                    <motion.h2
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.7 }}
                      className="font-marathi text-[7vw] sm:text-5xl md:text-7xl text-white font-black tracking-tight drop-shadow-lg leading-tight"
                    >
                      शुभ सोहळा सुरू झाला आहे!
                    </motion.h2>

                    {/* Animated gold divider */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                      className="h-px w-28 md:w-40 bg-gradient-to-r from-transparent via-mauli-gold to-transparent"
                    />

                    {/* Verse */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.7 }}
                      className="font-marathi text-mauli-gold text-lg sm:text-xl md:text-3xl italic font-bold leading-relaxed max-w-xl"
                    >
                      "मंगलाष्टकांचा मंगल सूर,<br className="hidden sm:block" /> आनंदाचा हा सुंदर प्रहर..."
                    </motion.p>

                    {/* Bottom decorative dots */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="flex items-center gap-2"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                          className="w-1.5 h-1.5 rounded-full bg-mauli-gold/60"
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* MAIN TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20 md:mb-28"
        >
          <ThreadKnot className="mb-8 md:mb-10 scale-100 md:scale-125" />
          <h2 className="font-marathi text-5xl sm:text-7xl md:text-9xl text-wedding-maroon font-black tracking-tighter mb-6 md:mb-8 drop-shadow-sm whitespace-normal sm:whitespace-nowrap">
            वर-वधू परिचय
          </h2>
          <div className="flex justify-center items-center gap-6 md:gap-10 opacity-60">
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-mauli-gold to-transparent" />
            <Sparkles className="text-mauli-gold animate-pulse w-6 h-6 md:w-8 md:h-8" />
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent via-mauli-gold to-transparent" />
          </div>
        </motion.div>

        {/* PROFILE CARDS */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-16 sm:gap-24 md:gap-24 lg:gap-48 px-2">
          {(["groom", "bride"] as const).map((type) => {
            const person = COUPLE[type];
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -25, rotateY: type === 'groom' ? 8 : -8 }}
                onMouseMove={handleMouseMove}
                className="relative cursor-default group w-full max-w-[320px] md:max-w-none"
                style={{ perspective: 1200 }}
              >
                {/* Floating Hearts Effect */}
                <div className="absolute inset-0 pointer-events-none z-30">
                  <AnimatePresence>
                    {particles.map((particle) => (
                      <motion.div
                        key={particle.id}
                        initial={{ opacity: 1, scale: 0.5, x: particle.x, y: particle.y }}
                        animate={{ opacity: 0, scale: 1.5, y: particle.y - 100 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute text-mauli-red/60"
                      >
                        <Heart size={20} fill="currentColor" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="absolute inset-0 bg-mauli-gold/10 blur-[100px] rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000" />

                <div className="relative flex flex-col items-center">
                  <div className="relative">
                    {/* Rotating Rings */}
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute inset-[-16px] md:inset-[-24px] rounded-full border-[1.5px] border-mauli-gold/30 border-dashed group-hover:border-mauli-gold/60" />
                    <motion.div animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute inset-[-28px] md:inset-[-36px] rounded-full border-[1px] border-wedding-royal/10 border-dashed" />

                    {/* Profile Image */}
                    <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full border-[8px] md:border-[12px] border-white shadow-2xl overflow-hidden relative z-10 transition-all duration-700 group-hover:border-mauli-gold/30">
                      <img 
                        src={`/images/profiles/${type}_profile.jpg`} 
                        alt={person.name} 
                        className="w-full h-full object-cover transition-all duration-1000 grayscale-[15%] group-hover:grayscale-0 group-hover:scale-110 cursor-pointer"
                        onClick={(e) => {
                           e.stopPropagation();
                           setZoomedImage(`/images/profiles/${type}_profile.jpg`);
                        }}
                      />
                    </div>

                    {/* Bio Badge */}
                    <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -bottom-8 md:-bottom-10 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl px-8 md:px-12 py-4 md:py-5 rounded-[2.5rem] shadow-2xl border border-mauli-gold/20 z-20 min-w-[150px] md:min-w-[180px]">
                      <p className="text-[10px] md:text-[12px] font-black uppercase text-mauli-gold tracking-[0.3em] md:tracking-[0.4em] text-center mb-1">{person.bio_header}</p>
                      <div className="w-10 h-0.5 bg-mauli-gold/20 mx-auto rounded-full" />
                    </motion.div>
                  </div>

                  {/* Name and Details Section */}
                  <div className="mt-20 sm:mt-24 text-center space-y-2 md:space-y-3">
                    <p className="text-sm md:text-base font-black text-mauli-gold uppercase tracking-[0.25em] md:tracking-[0.35em]">
                      {type === "groom" ? "चि." : "चि.सौ.का."}
                    </p>
                    <h3 className="font-marathi text-6xl sm:text-7xl md:text-8xl text-wedding-maroon group-hover:text-mauli-red font-black tracking-tight leading-tight">
                      {person.name}
                    </h3>
                    <motion.div className="flex items-center justify-center gap-2 md:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-6 group-hover:translate-y-0">
                      <span className="text-[9px] md:text-[11px] font-black text-mauli-gold uppercase tracking-[0.2em] md:tracking-[0.3em]">परिचय पहा</span>
                      <ArrowRightCircle className="w-4 h-4 md:w-[18px] md:h-[18px] text-mauli-gold animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* PHOTO ZOOM OVERLAY */}
      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); setZoomedImage(null); }}
            >
              <X size={32} />
            </motion.button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={zoomedImage}
              alt="Zoomed Memory"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl object-contain border-4 border-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}