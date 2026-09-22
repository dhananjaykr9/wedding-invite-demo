"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useStore } from "@/lib/store";
import { useEffect, useState, useMemo } from "react";

export default function MauliThread() {
  const { isSadhaMode } = useStore();
  const [docHeight, setDocHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      setDocHeight(document.documentElement.scrollHeight);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(document.body);
    window.addEventListener("resize", updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const { scrollYProgress } = useScroll();
  
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 35, // Smoother, more "silk-like" movement
    damping: 20,
    restDelta: 0.001
  });

  const springDistance = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), 
    { stiffness: 60, damping: 20 }
  );

  // Path logic: High-Fidelity Organic Wavy Curve
  const wavyPath = useMemo(() => {
    const startX = 20; 
    let d = `M ${startX} 0`;
    const step = 120; // Tighter steps for smoother Chrome rendering
    for (let i = step; i <= docHeight + step; i += step) {
      const xOffset = i % (step * 2) === 0 ? 2 : -2;
      const controlY = i - (step / 2);
      d += ` Q ${startX + xOffset} ${controlY}, ${startX} ${i}`;
    }
    return d;
  }, [docHeight]);

  if (isSadhaMode) {
    return (
      <div className="fixed left-[4%] md:left-[5%] top-0 w-[1px] bg-mauli-red/10 h-full -z-10" />
    );
  }

  return (
    <div 
      className="fixed top-0 left-0 w-full pointer-events-none -z-10" 
      style={{ height: "100vh" }}
    >
      <svg
        className="absolute left-[0.5%] md:left-[2.5%] top-0 w-16 h-full overflow-visible"
        viewBox={`0 0 40 ${docHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mauliGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="25%" stopColor="#B91C1C" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="75%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>

          <filter id="sacredGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="glow"/>
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* 1. Deep Shadow for 3D appearance */}
        <path
          d={wavyPath}
          fill="transparent"
          stroke="#000"
          strokeWidth="3.5"
          className="opacity-[0.02] translate-x-1.5 translate-y-1"
        />

        {/* 2. Secondary Braided Layer (Darker) */}
        <motion.path
          d={wavyPath}
          fill="transparent"
          stroke="#7F1D1D"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: scaleY }}
          className="opacity-20"
        />

        {/* 3. Main Mauli Thread (Silk Base) */}
        <motion.path
          d={wavyPath}
          fill="transparent"
          stroke="url(#mauliGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#sacredGlow)"
          style={{ pathLength: scaleY }}
          className="opacity-80"
        />

        {/* 4. The "Golden Twist" - Simulating the weave detail */}
        <motion.path
          d={wavyPath}
          fill="transparent"
          stroke="#FEF3C7"
          strokeWidth="0.6"
          strokeDasharray="4 8"
          style={{ pathLength: scaleY }}
          className="opacity-40 mix-blend-overlay"
        />

        {/* 5. Traveling Sparkle & Ember Trail */}
        <motion.g
          style={{ 
            offsetPath: `path('${wavyPath}')`,
            offsetDistance: springDistance
          }}
        >
          {/* Outer Bloom */}
          <circle r="8" fill="#F2C94C" className="opacity-10 blur-md" />
          
          {/* Inner Light Core */}
          <circle r="3" fill="#FFFBEB" className="drop-shadow-[0_0_8px_#F2C94C]" />
          
          {/* Pulsing Sacred Aura */}
          <motion.circle 
            r="5" 
            stroke="#F2C94C" 
            strokeWidth="0.5" 
            fill="transparent"
            animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </motion.g>
      </svg>
    </div>
  );
}