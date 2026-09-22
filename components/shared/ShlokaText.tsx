// frontend/components/shared/ShlokaText.tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShlokaProps {
  text: string | { line1: string; line2: string }; // Handles single or double lines
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function ShlokaText({ text, className, size = "md" }: ShlokaProps) {
  
  // Size Mapper
  const sizeClasses = {
    sm: "text-lg md:text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
    xl: "text-4xl md:text-6xl", // Hero Ganesh Shloka
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }} // Slow, respectful fade
      viewport={{ once: true }} // Animates only once (No looping)
      className={cn(
        "font-sanskrit text-wedding-maroon text-center leading-relaxed select-none", // select-none prevents accidental highlights
        sizeClasses[size],
        className
      )}
    >
      {typeof text === "string" ? (
        <p>{text}</p>
      ) : (
        <div className="flex flex-col gap-2">
          <p>{text.line1}</p>
          <p>{text.line2}</p>
        </div>
      )}
    </motion.div>
  );
}