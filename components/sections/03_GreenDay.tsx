"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import ShlokaText from "../shared/ShlokaText";
import EventCard from "../shared/EventCard";
import { SHLOKAS, TIMELINE } from "@/lib/constants";
import ThreadKnot from "../mauli/ThreadKnot";
import { Leaf, Sparkles, Home, Navigation, MapPin, Camera } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useMobile } from "@/hooks/useMobile";

export default function GreenDay() {
  const data = TIMELINE[0];
  const sectionRef = useRef(null);
  const isMobile = useMobile();

  const [sparkleData, setSparkleData] = useState<{ size: number; delay: number }[]>([]);

  useEffect(() => {
    if (isMobile) return; // No sparkles on mobile
    const generated = [...Array(8)].map(() => ({
      size: Math.random() * 24 + 12,
      delay: Math.random() * 5
    }));
    setSparkleData(generated);
  }, [isMobile]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const leafTopRaw = useTransform(scrollYProgress, [0, 1], [-150, 250]);
  const leafBottomRaw = useTransform(scrollYProgress, [0, 1], [150, -250]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const yLeafTop = useSpring(leafTopRaw, { stiffness: 30, damping: 20 });
  const yLeafBottom = useSpring(leafBottomRaw, { stiffness: 30, damping: 20 });
  const smoothY = useSpring(parallaxY, { stiffness: 50, damping: 25 });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-transparent via-green-50/30 to-transparent scroll-mt-20"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/images/textures/mehendi-pattern.png')] bg-[size:400px] mix-blend-multiply" />

      <motion.div
        style={{ y: yLeafTop, rotate: 35 }}
        animate={{ rotate: [33, 37, 33], x: [-5, 5, -5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 -left-40 opacity-[0.07] pointer-events-none hidden lg:block"
      >
        <Leaf size={600} className="text-wedding-green fill-current blur-[2px]" />
      </motion.div>

      <motion.div
        style={{ y: yLeafBottom, rotate: -35 }}
        animate={{ rotate: [-37, -33, -37], x: [5, -5, 5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 -right-40 opacity-[0.07] pointer-events-none hidden lg:block"
      >
        <Leaf size={650} className="text-wedding-green fill-current blur-[2px]" />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        {sparkleData.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: [0, 0.3, 0] }}
            animate={{
              y: [0, -120],
              x: [0, (i % 2 === 0 ? 30 : -30)]
            }}
            transition={{
              duration: 7 + s.delay,
              repeat: Infinity,
              delay: i * 1.5
            }}
            className="absolute text-wedding-green/10"
            style={{ left: `${10 + i * 12}%`, top: `${20 + i * 8}%` }}
          >
            <Sparkles size={s.size} />
          </motion.div>
        ))}
      </div>

      <motion.div style={{ y: isMobile ? 0 : smoothY }} className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 space-y-8"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-wedding-green/20 bg-white/90 backdrop-blur-md text-wedding-green font-black tracking-[0.3em] text-[11px] uppercase shadow-2xl relative group cursor-default"
          >
            <Sparkles size={14} className="text-wedding-haldi animate-pulse" />
            <span className="relative z-10">{data.date}</span>
            <Sparkles size={14} className="text-wedding-haldi animate-pulse" />
            <div className="absolute inset-0 bg-wedding-green/5 rounded-full animate-pulse" />
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <ShlokaText
              text={SHLOKAS.mehendi}
              size="sm"
              className="text-wedding-green/80 font-bold italic leading-relaxed px-6 drop-shadow-sm"
            />
          </div>

          <div className="flex items-center justify-center gap-8 py-4">
            <motion.div initial={{ width: 0 }} whileInView={{ width: "120px" }} className="h-px bg-gradient-to-r from-transparent via-wedding-green/40 to-transparent" />
            <ThreadKnot className="scale-125 md:scale-150" />
            <motion.div initial={{ width: 0 }} whileInView={{ width: "120px" }} className="h-px bg-gradient-to-l from-transparent via-wedding-green/40 to-transparent" />
          </div>

          <h2 className="font-marathi text-5xl sm:text-6xl md:text-8xl text-wedding-green font-black tracking-tighter leading-tight drop-shadow-md">
            मेहेंदी व संगीत सोहळा
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-32 max-w-4xl mx-auto px-2 group/card"
        >
          <div className="bg-white rounded-[4rem] border border-wedding-green/10 shadow-[0_50px_100px_rgba(45,90,39,0.1)] overflow-hidden relative transition-transform duration-700 hover:shadow-[0_60px_120px_rgba(45,90,39,0.15)]">
            {/* ASPECT RATIO FIX: Changed from fixed h-80 to responsive aspect ratio */}
            <div className="relative aspect-[4/5] md:aspect-video overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                src="/images/venue/home.jpg"
                alt="Groom's Residence"
                className="w-full h-full object-cover grayscale-[10%] group-hover/card:grayscale-0 transition-all duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1595113340742-6f37195d340c?q=80&w=1200&auto=format&fit=crop";
                }}
              />

              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 z-10 pointer-events-none"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10" />

              <div className="absolute top-8 left-8">
                <div className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-wedding-green/10">
                  <Home size={18} className="text-wedding-green" />
                  <span className="text-[11px] font-black text-wedding-green uppercase tracking-widest">Groom Home</span>
                </div>
              </div>

              <div className="absolute bottom-8 left-0 right-0 flex justify-center px-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  className="bg-wedding-green/90 backdrop-blur-lg px-8 py-4 rounded-2xl border border-white/30 shadow-2xl"
                >
                  <p className="font-marathi text-white text-base md:text-xl font-black flex items-center gap-3">
                    <Camera size={20} className="text-mauli-gold animate-pulse" />
                    येथे आपले सहर्ष स्वागत आहे!
                  </p>
                </motion.div>
              </div>
            </div>

            {/* MARGIN FIX: Removed -mt-10 to prevent overlapping with the image content */}
            <div className="p-10 md:p-16 text-center relative z-20 bg-white">
              <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-wedding-green/5 text-wedding-green mb-8 border border-wedding-green/10 shadow-sm">
                <MapPin size={18} className="animate-bounce" />
                <span className="text-[12px] font-black uppercase tracking-[0.3em]">वरस्थळ • Residence</span>
              </div>

              {/* TYPOGRAPHY FIX: Use fluid sizing for small mobile screens */}
              <h3 className="text-5xl sm:text-6xl md:text-7xl font-marathi font-black text-wedding-green mb-6 tracking-tight drop-shadow-sm whitespace-normal sm:whitespace-nowrap">
                गावस्कर निवास
              </h3>

              <div className="space-y-3 mb-12">
                <p className="text-slate-700 font-marathi text-2xl md:text-4xl leading-relaxed font-bold">
                  माता मंदिर वॉर्ड, हिंगणघाट
                </p>
                <p className="text-slate-400 font-marathi text-xl md:text-2xl italic font-medium">
                  जिल्हा - वर्धा.
                </p>
              </div>

              <motion.a
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                href="https://maps.app.goo.gl/5BfZmY1vRgmkazb26"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 bg-gradient-to-r from-wedding-green to-green-800 text-white px-14 py-6 rounded-[2.5rem] font-black text-sm shadow-[0_25px_50px_rgba(45,90,39,0.3)] transition-all group/btn uppercase tracking-widest"
              >
                <Navigation size={22} className="group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-transform" />
                गूगल मॅपवर दिशा मिळवा
              </motion.a>
            </div>
          </div>
        </motion.div>

        <div className="relative px-2">
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-wedding-green/40 via-wedding-green/5 to-transparent hidden md:block -translate-x-1/2" />
          <div className="flex flex-col gap-20 md:gap-40 relative">
            {data.events.map((event: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, type: "spring", bounce: 0.3, delay: index * 0.2 }}
              >
                <EventCard
                  time={event.time}
                  title={event.title}
                  dress_code={event.dress_code}
                  note={event.note}
                  isLeft={index % 2 === 0}
                  variant="green"
                />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-40 flex flex-col items-center gap-8">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: 120 }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="w-[2px] bg-gradient-to-b from-wedding-green/60 via-wedding-green/10 to-transparent"
          />
          <motion.div
            animate={{
              y: [0, 12, 0],
              scale: [1, 1.1, 1],
              rotate: [180, 185, 175, 180]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="p-5 bg-green-50 rounded-full border border-green-100/50 shadow-xl group hover:bg-white transition-colors duration-500"
          >
            <Leaf size={28} className="text-wedding-green/40 group-hover:text-wedding-green transition-colors" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}