"use client";

import { motion } from "framer-motion";
import { Clock, Shirt, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventProps {
  time: string;
  title: string;
  icon?: string;
  dress_code?: { men?: string; women?: string };
  note?: string;
  isLeft?: boolean;
  variant?: "green" | "yellow" | "royal" | "default";
}

export default function EventCard({
  time,
  title,
  dress_code,
  note,
  isLeft = true,
  variant = "default",
}: EventProps) {
  
  // Theme color mapping for high visual impact
  const themes = {
    green: "border-wedding-green/30 text-wedding-green bg-green-50/50",
    yellow: "border-wedding-haldi/40 text-orange-700 bg-orange-50/50",
    royal: "border-wedding-royal/30 text-wedding-royal bg-indigo-50/50",
    default: "border-mauli-gold/30 text-wedding-maroon bg-wedding-paper/50",
  };

  const accentColors = {
    green: "bg-wedding-green",
    yellow: "bg-wedding-haldi",
    royal: "bg-wedding-royal",
    default: "bg-mauli-gold",
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full transition-all duration-700",
        isLeft ? "md:flex-row-reverse" : ""
      )}
    >
      {/* 1. Enhanced Timeline Dot with Pulse Effect */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className={cn("w-4 h-4 md:w-5 md:h-5 rounded-full border-4 border-white shadow-lg z-20 transition-colors duration-500", accentColors[variant])} />
        <div className={cn("absolute w-8 h-8 rounded-full opacity-20 animate-ping z-10", accentColors[variant])} />
      </div>

      {/* 2. The Card Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 30 : -30, scale: 0.95 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        viewport={{ once: true, margin: "-50px" }}
        className={cn(
          "w-full md:w-[48%] backdrop-blur-md border-[1.5px] rounded-[2rem] p-6 md:p-8 shadow-xl shadow-black/5 relative overflow-hidden text-center md:text-left ring-1 ring-white/50",
          themes[variant]
        )}
      >
        {/* Ornate Corner Motif */}
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles size={40} className={themes[variant].split(' ')[1]} />
        </div>

        {/* Time Badge */}
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 shadow-sm border border-current opacity-80",
          themes[variant]
        )}>
          <Clock size={14} strokeWidth={3} />
          <span>{time}</span>
        </div>

        {/* Title */}
        <h3 className="font-marathi text-2xl md:text-4xl font-extrabold mb-4 leading-tight drop-shadow-sm">
          {title}
        </h3>

        {/* Dress Code Block */}
        {dress_code && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 p-4 rounded-2xl bg-white/60 border border-white shadow-inner text-left"
          >
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
              <Shirt size={14} className="text-gray-400" />
              <span>Attire Recommendation</span>
            </div>
            <div className="space-y-2 text-sm md:text-base text-gray-800 font-marathi">
              {dress_code.men && (
                <div className="flex gap-2 items-center">
                  <span className="opacity-60 text-xs">🤵</span>
                  <p><strong className="font-bold">पुरुष:</strong> {dress_code.men}</p>
                </div>
              )}
              {dress_code.women && (
                <div className="flex gap-2 items-center">
                  <span className="opacity-60 text-xs">💃</span>
                  <p><strong className="font-bold">महिला:</strong> {dress_code.women}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Note */}
        {note && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-5 flex items-start gap-3 text-xs md:text-sm font-medium leading-relaxed p-3 rounded-xl bg-black/5"
          >
            <Info size={16} className="shrink-0 mt-0.5 opacity-60" />
            <p className="italic">{note}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}