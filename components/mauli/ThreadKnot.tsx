"use client";

import { motion } from "framer-motion";

interface ThreadKnotProps {
  className?: string;
}

export default function ThreadKnot({ className }: ThreadKnotProps) {
  return (
    <div className={`flex items-center justify-center gap-6 md:gap-10 ${className}`}>
      
      {/* 1. Left Decorative Line with Light Ping */}
      <div className="relative h-[2px] w-16 md:w-48 overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-mauli-gold/40 to-mauli-gold" />
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent"
        />
        {/* End Glow Ping */}
        <motion.div 
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-mauli-gold rounded-full blur-[2px] z-10"
        />
      </div>

      {/* 2. Center Sacred Symbol Assembly */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="relative flex items-center justify-center scale-110 group cursor-default"
      >
        
        {/* Deep Divine Aura - Pulsing Glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-28 h-28 bg-mauli-gold rounded-full blur-3xl"
        />

        {/* Outer Sacred Geometry (Lotus Dots) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute w-20 h-20 border-[0.5px] border-dashed border-mauli-gold/20 rounded-full"
        />

        {/* Circular Halo Glow - Focused Halo */}
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 20px 2px rgba(212, 175, 55, 0.1)", 
              "0 0 40px 10px rgba(212, 175, 55, 0.4)", 
              "0 0 20px 2px rgba(212, 175, 55, 0.1)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-12 h-12 rounded-full bg-mauli-gold/5 border border-mauli-gold/40"
        />

        {/* Triple Rotating Orbitals - Tech-Traditional Blend */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-16 h-16 border-[1px] border-dashed border-mauli-gold/20 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-14 h-14 border border-dotted border-mauli-gold/30 rounded-full"
        />
        
        {/* Central Component with Meditative Rotation */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: 360 
          }}
          transition={{ 
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 15, repeat: Infinity, ease: "linear" } 
          }}
          className="relative w-10 h-10 flex items-center justify-center filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
        >
          {/* Swastik Symbol */}
          <div className="relative z-10 text-mauli-red">
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 3v18M3 12h18" />
              <path d="M12 3h9M12 21H3M21 12v9M3 3v9" />
              
              <motion.g
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
                <circle cx="16.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
                <circle cx="7.5" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
                <circle cx="16.5" cy="16.5" r="1.2" fill="currentColor" stroke="none" />
              </motion.g>
            </svg>
          </div>
        </motion.div>
      </motion.div>

      {/* 3. Right Decorative Line with Light Ping */}
      <div className="relative h-[2px] w-16 md:w-48 overflow-hidden rounded-full">
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-mauli-gold/40 to-mauli-gold" />
        <motion.div
          animate={{ x: ["200%", "-100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-l from-transparent via-white/80 to-transparent"
        />
        {/* End Glow Ping */}
        <motion.div 
          animate={{ opacity: [0, 1, 0], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-mauli-gold rounded-full blur-[2px] z-10"
        />
      </div>
    </div>
  );
}