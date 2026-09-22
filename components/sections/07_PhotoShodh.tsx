"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, ExternalLink, ShieldCheck, ScanFace, Search, MessageCircle, PhoneCall, Lock } from "lucide-react";
import ThreadKnot from "../mauli/ThreadKnot";

export default function PhotoShodh() {
  const FOTOOWL_URL = "https://site.fotoowl.ai/gavaskarwedding/gallery/227610?access_key=e92ad404-9fa8-43bf-a33e-e3b92efa539d";
  const CONTACT_NUMBER = "+919595167618";
  const WHATSAPP_MESSAGE = encodeURIComponent("नमस्ते, मला लग्नाचे फोटो शोधायला मदत हवी आहे.");

  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    // Target date: Feb 26, 2026
    const targetDate = new Date("2026-02-26T00:00:00");
    const checkDate = () => {
      const now = new Date();
      setIsUnlocked(now >= targetDate);
    };

    checkDate();
    const timer = setInterval(checkDate, 60000); // Check every minute
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-24 px-4 max-w-6xl mx-auto overflow-hidden">
      {/* 1. Dynamic Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-wedding-royal/5 rounded-full blur-[140px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-mauli-gold/10 rounded-full blur-[140px] -z-10" />

      {/* 2. Elite Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-wedding-royal/5 border border-wedding-royal/10 text-wedding-royal shadow-sm mb-8"
          >
            <Search size={14} className="animate-pulse" />
            <span className="uppercase tracking-[0.4em] text-[10px] font-black">AI Facial Recognition Engine</span>
          </motion.div>

          <h2 className="text-5xl sm:text-7xl md:text-8xl font-marathi font-black text-wedding-maroon tracking-tighter leading-tight">
            स्मार्ट फोटो शोध
          </h2>

          <p className="text-slate-500 font-marathi text-2xl md:text-3xl max-w-2xl mx-auto leading-relaxed mt-6">
            हजारो फोटोंच्या गर्दीत स्वतःचे खास क्षण शोधणे आता फक्त एका 'स्कॅन'वर!
          </p>
        </div>
        <div className="pt-12">
          <ThreadKnot className="mx-auto scale-125 md:scale-150" />
        </div>
      </motion.div>

      {/* 3. Intelligent Gateway Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto bg-white/40 backdrop-blur-3xl rounded-[4.5rem] shadow-[0_60px_150px_-30px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden group/card"
      >
        <div className="absolute top-0 left-0 w-40 h-40 bg-mauli-gold/5 rounded-br-full -translate-x-10 -translate-y-10 group-hover/card:translate-x-0 group-hover/card:translate-y-0 transition-transform duration-1000" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-wedding-royal/5 rounded-tl-full translate-x-10 translate-y-10 group-hover/card:translate-x-0 group-hover/card:translate-y-0 transition-transform duration-1000" />

        <div className="relative z-10 flex flex-col items-center py-16 md:py-24 px-10 text-center">
          <div className="relative mb-14">
            <div className="absolute -inset-6 border-t-2 border-l-2 border-mauli-gold/40 w-12 h-12 rounded-tl-3xl" />
            <div className="absolute -inset-6 border-t-2 border-r-2 border-mauli-gold/40 w-12 h-12 rounded-tr-3xl right-[-24px]" />
            <div className="absolute -inset-6 border-b-2 border-l-2 border-mauli-gold/40 w-12 h-12 rounded-bl-3xl bottom-[-24px]" />
            <div className="absolute -inset-6 border-b-2 border-r-2 border-mauli-gold/40 w-12 h-12 rounded-br-3xl right-[-24px] bottom-[-24px]" />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[-30px] rounded-full border border-dashed border-mauli-gold/20"
            />

            <div className="w-44 h-44 md:w-52 md:h-52 bg-gradient-to-br from-wedding-royal via-wedding-maroon to-wedding-royal rounded-[4rem] flex items-center justify-center shadow-2xl relative overflow-hidden">
              <ScanFace size={72} className="text-white relative z-10" />
              <motion.div
                animate={{ top: ["-10%", "110%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-mauli-gold/40 to-transparent z-20"
              />
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -top-2 -right-2 bg-mauli-gold p-4 rounded-2xl shadow-xl border-4 border-white z-30"
              >
                <Sparkles size={28} className="text-white" />
              </motion.div>
            </div>
          </div>

          <h3 className="text-4xl sm:text-5xl md:text-6xl font-marathi font-black text-slate-800 mb-8 tracking-tight">
            तुमचा चेहरा ओळखा
          </h3>
          <p className="text-slate-500 mb-14 max-w-xl text-xl md:text-2xl leading-relaxed font-medium">
            आमच्या <span className="text-wedding-royal font-black">AI फोटोग्राफी पार्टनर</span> च्या मदतीने, फक्त एक सेल्फी अपलोड करा आणि लग्नातील तुमचे सर्व फोटो क्षणार्धात मिळवा.
          </p>

          {isUnlocked ? (
            <motion.a
              href={FOTOOWL_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center gap-5 bg-wedding-royal hover:bg-wedding-maroon text-white px-10 py-5 md:px-14 md:py-7 rounded-[2rem] font-black shadow-[0_20px_40px_rgba(26,35,126,0.2)] transition-all duration-500"
            >
              <Camera size={24} className="group-hover:rotate-12 transition-transform" />
              <span className="tracking-[0.1em] text-xl md:text-2xl uppercase font-marathi">फोटो पोर्टल उघडा</span>
              <ExternalLink size={18} className="opacity-40 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s]" />
            </motion.a>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center gap-5 bg-slate-200 text-slate-400 px-10 py-5 md:px-14 md:py-7 rounded-[2rem] font-black cursor-not-allowed">
                <Lock size={24} />
                <span className="tracking-[0.1em] text-xl md:text-2xl uppercase font-marathi">फोटो पोर्टल २६ फेब्रुवारीला उघडेल</span>
              </div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Coming Soon • 26th Feb 2026</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* 4. Support & Assistance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-16 flex flex-col items-center gap-8"
      >
        <p className="text-slate-500 font-marathi text-xl md:text-2xl font-medium italic">
          फोटो शोधण्यात अडचण येत असल्यास येथे संपर्क साधा:
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <motion.a
            href={`https://wa.me/${CONTACT_NUMBER.replace('+', '')}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] rounded-2xl font-bold hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
          >
            <MessageCircle size={22} />
            <span className="font-marathi text-lg">व्हॉट्सॲप मदत (WhatsApp)</span>
          </motion.a>

          <motion.a
            href={`tel:${CONTACT_NUMBER}`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-8 py-4 bg-wedding-royal/10 border border-wedding-royal/20 text-wedding-royal rounded-2xl font-bold hover:bg-wedding-royal hover:text-white transition-all shadow-sm"
          >
            <PhoneCall size={22} />
            <span className="font-marathi text-lg">कॉल करा (Call)</span>
          </motion.a>
        </div>
      </motion.div>

      {/* 5. Privacy Trust Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-16 flex flex-col items-center gap-5"
      >
        <div className="flex items-center gap-4 px-10 py-5 bg-white/50 border border-slate-200/50 rounded-full shadow-sm backdrop-blur-md text-center">
          <ShieldCheck size={22} className="text-emerald-500 flex-shrink-0" />
          <p className="text-slate-600 text-lg font-bold font-marathi leading-snug">
            तुमची गोपनीयता सुरक्षित आहे. सर्व फोटो कूटबद्ध (Encrypted) आणि सुरक्षित आहेत.
          </p>
        </div>
      </motion.div>
    </section>
  );
}