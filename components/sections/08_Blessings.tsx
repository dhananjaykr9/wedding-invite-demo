"use client";

import { motion } from "framer-motion";
import ThreadKnot from "../mauli/ThreadKnot";
import { Heart, Quote, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Blessings() {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; scale: number; duration: number }[]>([]);

  useEffect(() => {
    const generated = [...Array(6)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      scale: Math.random() * 0.5 + 0.5,
      duration: Math.random() * 5 + 5
    }));
    setParticles(generated);
  }, []);

  const blessings = [
    {
      who: "आई आणि बाबा",
      relation: "Parents",
      text: "संसाराच्या या नवीन प्रवासात तुम्हा दोघांना उदंड आयुष्य आणि सुख लाभो, हीच आमची ईश्वरचरणी प्रार्थना.",
      img: "/images/family/parents.jpg"
    },
    {
      who: "ताई आणि भाऊजी",
      relation: "Sister & Brother-in-law",
      text: "तुमच्या आयुष्यातील प्रत्येक दिवस सुखाचा आणि प्रेमाचा जावो. नवदाम्पत्यास सुखी संसारासाठी अनेक शुभेच्छा!",
      img: "/images/family/sister.jpg"
    },
    {
      who: "दादा आणि वहिनी",
      relation: "Host",
      text: "नात्यांची ही रेशीमगाठ अशीच घट्ट राहो. तुमच्या सुखी संसारासाठी खूप खूप शुभेच्छा!",
      img: "/images/family/hosts.jpg"
    }
  ];

  return (
    <section className="relative py-24 px-4 bg-[#FDFCF0] overflow-hidden">
      {/* 1. Interactive Background Atmosphere */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/images/textures/floral-pattern.png')] bg-center" />
      
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute text-mauli-gold/20 pointer-events-none"
          style={{ left: p.left, top: p.top }}
          animate={{ 
            y: [0, -100, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [p.scale, p.scale * 1.2, p.scale]
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "easeInOut" }}
        >
          <Heart size={20} fill="currentColor" />
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* 2. Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20 md:mb-28"
        >
          <div className="flex items-center justify-center gap-3 text-mauli-gold mb-6">
            <Sparkles size={16} className="animate-pulse" />
            <span className="uppercase tracking-[0.5em] text-[10px] font-black opacity-80 whitespace-nowrap">Divine Blessings</span>
            <Sparkles size={16} className="animate-pulse" />
          </div>
          <h2 className="text-6xl md:text-8xl font-marathi font-black text-wedding-maroon tracking-tighter leading-none drop-shadow-sm">
            घरचा आशीर्वाद
          </h2>
          <div className="flex items-center justify-center gap-6 mt-8">
            <motion.div initial={{ width: 0 }} whileInView={{ width: "3rem" }} className="h-[1.5px] bg-gradient-to-r from-transparent to-mauli-gold/60" />
            <Heart size={24} className="text-mauli-red fill-mauli-red/20 animate-bounce" />
            <motion.div initial={{ width: 0 }} whileInView={{ width: "3rem" }} className="h-[1.5px] bg-gradient-to-l from-transparent to-mauli-gold/60" />
          </div>
        </motion.div>

        {/* 3. The Blessings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {blessings.map((blessing, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 1, type: "spring" }}
              whileHover={{ y: -15, scale: 1.02 }}
              viewport={{ once: true }}
              className="relative group p-8 md:p-12 rounded-[4rem] bg-white/80 backdrop-blur-sm border border-mauli-gold/10 border-b-[8px] border-b-mauli-gold/20 shadow-2xl hover:shadow-mauli-gold/10 transition-all duration-500 flex flex-col items-center"
            >
              {/* Photo Frame Container */}
              <div className="relative w-36 h-36 md:w-44 md:h-44 mb-12">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-15px] rounded-full border-2 border-dashed border-mauli-gold/40 opacity-50" 
                />
                <div className="w-full h-full rounded-full border-[8px] border-white shadow-2xl overflow-hidden relative z-10 ring-2 ring-mauli-gold/5">
                  <img 
                    src={blessing.img} 
                    alt={blessing.who} 
                    className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1s]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(blessing.who)}&background=7c2d12&color=fff&size=256&bold=true`;
                    }}
                  />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-2 right-4 bg-gradient-to-tr from-mauli-red to-wedding-maroon p-3 rounded-full text-white shadow-xl z-20 border-4 border-white"
                >
                  <Heart size={14} fill="currentColor" />
                </motion.div>
              </div>

              {/* Message Content */}
              <div className="relative space-y-8 text-center flex-1 flex flex-col justify-between">
                <div className="relative inline-block">
                  <Quote className="absolute -top-6 -left-6 text-mauli-gold/10 rotate-180 w-12 h-12" />
                  <p className="font-marathi text-2xl md:text-3xl text-slate-800 font-bold italic leading-relaxed px-2 relative z-10">
                    "{blessing.text}"
                  </p>
                </div>
                
                <div className="pt-8">
                  {/* FIXED: added whitespace-nowrap here */}
                  <p className="text-3xl font-marathi font-black text-wedding-maroon tracking-tight mb-3 whitespace-nowrap">
                    — {blessing.who}
                  </p>
                  <div className="inline-block px-6 py-1.5 bg-mauli-gold/5 text-mauli-gold rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-mauli-gold/20 shadow-inner">
                    {blessing.relation}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 4. Closing Ornament */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 flex flex-col items-center gap-10"
        >
          <div className="h-24 w-[1.5px] bg-gradient-to-b from-mauli-gold/50 via-mauli-gold/10 to-transparent" />
          <ThreadKnot className="scale-125 md:scale-[1.6] opacity-90" />
        </motion.div>
      </div>
    </section>
  );
}