"use client";

import { useState, useRef } from "react";
import Modal from "../ui/Modal";
import { Linkedin, Instagram, MessageCircle, Heart, ExternalLink, Quote, Sparkles, Zap, Globe, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export const DEVELOPER = {
  name: "धनंजय खारकर",
  signature: "Dhananjay Kharkar",
  brand: "Kshanika Digital",
  relation: "पुतण्या (Nephew)",
  role: "Founder, Kshanika Digital",
  modal_title: "हे डिजिटल आमंत्रण नवरदेवाच्या पुतण्याने, Kshanika Digital तर्फे साकारले आहे...",
  modal_text: "काकांच्या लग्नासाठी बनवलेली ही एक छोटीशी डिजिटल भेट. तंत्रज्ञान आणि नात्यांची ही एक अनोखी सांगड - Kshanika Digital च्या माध्यमातून!",
  links: {
    linkedin: "https://www.linkedin.com/in/dhananjaykharkar/",
    instagram: "https://instagram.com/dhanno.9",
    whatsapp: "https://wa.me/919595167618?text=Namaste%20Dhananjay!%20I%20saw%20the%20wedding%20portal%20and%20want%20to%20collaborate."
  }
};

export default function DeveloperInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const magneticRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!magneticRef.current) return;
    const { clientX, clientY } = e;
    const { width, left, top, height } = magneticRef.current.getBoundingClientRect();
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    const factor = isTouch ? 0.05 : 0.12;
    setPosition({ x: middleX * factor, y: middleY * factor });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  return (
    <>
      <footer className="w-full pt-24 pb-20 text-center border-t border-mauli-gold/10 mt-32 relative bg-gradient-to-b from-transparent via-wedding-paper/30 to-wedding-paper/80 overflow-hidden">
        {/* Subtle Ambient Glow */}
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-mauli-gold/5 blur-[120px] rounded-full pointer-events-none"
        />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="font-marathi text-2xl sm:text-3xl md:text-4xl text-wedding-maroon font-black tracking-normal drop-shadow-sm leading-relaxed mb-2">
              कृतज्ञतापूर्वक – गावस्कर परिवार
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-mauli-gold/60">
              Crafted by Kshanika Digital
            </p>

            <div className="flex justify-center items-center gap-6 md:gap-10 mt-10">
              <div className="h-[1.5px] w-16 md:w-32 bg-gradient-to-r from-transparent via-mauli-gold to-transparent opacity-40"></div>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  filter: ["drop-shadow(0 0 0px #b91c1c)", "drop-shadow(0 0 8px #b91c1c)", "drop-shadow(0 0 0px #b91c1c)"]
                }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="relative flex items-center justify-center"
              >
                <Heart size={36} className="text-mauli-red fill-current" />
                <motion.div
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.8, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute text-mauli-gold"
                >
                  <Sparkles size={36} />
                </motion.div>
              </motion.div>
              <div className="h-[1.5px] w-16 md:w-32 bg-gradient-to-l from-transparent via-mauli-gold to-transparent opacity-40"></div>
            </div>
          </motion.div>

          <motion.div
            ref={magneticRef}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className="inline-block"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 30px 60px rgba(0,0,0,0.08)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="group relative flex flex-col items-center justify-center py-10 px-10 md:px-16 rounded-[4rem] bg-white/60 backdrop-blur-2xl border border-mauli-gold/20 shadow-xl transition-all duration-500 ring-1 ring-white/50"
              suppressHydrationWarning
            >
              <span className="text-xs md:text-sm font-marathi text-slate-500 group-hover:text-wedding-royal transition-colors font-bold tracking-[0.1em] uppercase max-w-xs leading-relaxed">
                {DEVELOPER.modal_title}
              </span>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Zap size={16} className="text-wedding-maroon fill-current" />
                </div>
                <span className="text-[10px] md:text-[11px] text-mauli-gold font-black uppercase tracking-[0.4em]">
                  Meet Kshanika Digital
                </span>
                <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <ExternalLink size={14} className="text-mauli-gold" />
                </motion.div>
              </div>
            </motion.button>
          </motion.div>

        </div>
      </footer>

      <AnimatePresence>
        {isOpen && (
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Founder & Architect">
            <div className="flex flex-col items-center text-center space-y-12 py-12 overflow-y-auto max-h-[85vh] custom-scrollbar px-8 relative">

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ rotateY: 15, rotateX: -10 }}
                style={{ perspective: 1200 }}
                className="relative cursor-default"
              >
                <div className="absolute inset-[-20px] rounded-full border-[1.5px] border-mauli-gold/30 border-dashed animate-[spin_30s_linear_infinite]" />
                <div className="absolute inset-[-32px] rounded-full border-[1px] border-wedding-royal/10 border-dashed animate-[spin_50s_linear_infinite_reverse]" />

                <div className="w-48 h-48 md:w-52 md:h-52 rounded-full bg-white border-[10px] border-white shadow-2xl overflow-hidden relative z-10 ring-1 ring-mauli-gold/20">
                  <img
                    src="/images/developer/me.jpg"
                    alt={DEVELOPER.name}
                    className="w-full h-full object-cover transition-all duration-700 grayscale-[20%] hover:grayscale-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=Dhananjay+Kharkar&background=7c2d12&color=fff&size=256&bold=true`; }}
                  />
                </div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -bottom-4 -right-4 z-20 pointer-events-none"
                >
                  <img
                    src="/images/logo-k.png"
                    alt="Kshanika Logo"
                    className="w-16 h-16 object-contain drop-shadow-lg"
                  />
                </motion.div>
              </motion.div>

              <div className="space-y-2">
                <div className="flex flex-col items-center gap-1 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-mauli-gold">FOUNDER</span>
                  <h3 className="text-4xl sm:text-5xl md:text-6xl font-black text-wedding-maroon tracking-tighter leading-tight">
                    {DEVELOPER.name}
                  </h3>
                </div>
                <motion.p
                  className="text-2xl sm:text-4xl md:text-5xl text-mauli-gold/80"
                  style={{ fontFamily: "'Great Vibes', cursive" }}
                >
                  {DEVELOPER.signature}
                </motion.p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <span className="px-5 py-2 bg-mauli-gold/10 text-mauli-gold rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-mauli-gold/10">
                    {DEVELOPER.relation}
                  </span>
                  <span className="px-5 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                    {DEVELOPER.brand}
                  </span>
                </div>
              </div>

              <div className="relative px-6 max-w-lg">
                <Quote className="absolute -top-8 -left-2 text-mauli-gold/15 rotate-180" size={56} />
                <p className="text-slate-600 font-marathi text-2xl md:text-3xl italic font-medium leading-relaxed relative z-10">
                  {DEVELOPER.modal_text}
                </p>
                <Quote className="absolute -bottom-8 -right-2 text-mauli-gold/15" size={56} />
              </div>

              <div className="grid grid-cols-3 gap-6 w-full pt-12 border-t border-slate-100">
                {[
                  { icon: Linkedin, color: '#0077b5', link: DEVELOPER.links.linkedin, label: 'LinkedIn' },
                  { icon: Instagram, color: '#E1306C', link: DEVELOPER.links.instagram, label: 'Instagram' },
                  { icon: MessageCircle, color: '#25D366', link: DEVELOPER.links.whatsapp, label: 'WhatsApp' }
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -8, scale: 1.08 }}
                    className="flex flex-col items-center gap-3 p-5 bg-slate-50 rounded-[2.5rem] hover:bg-white transition-all group shadow-sm hover:shadow-xl"
                  >
                    <div className="p-4 rounded-2xl bg-white shadow-md transition-transform group-hover:rotate-12" style={{ color: social.color }}>
                      <social.icon size={26} />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{social.label}</span>
                  </motion.a>
                ))}
              </div>

              <div className="pt-8 flex flex-col items-center gap-4 w-full opacity-60">
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">
                  <Globe size={14} className="text-mauli-gold" /> kshanikadigital.app
                </div>
                <p className="text-[9px] text-mauli-gold/60 font-bold uppercase tracking-widest">A Digital Presence Ecosystem</p>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}