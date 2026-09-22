"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-wedding-paper flex flex-col items-center justify-center"
    >
      {/* Texture overlay to match the site theme */}
      <div className="texture-overlay opacity-40" />

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40"
        >
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
          <Image
            src="/images/gavaskar-logo.png"
            alt="Gavaskar Family Logo"
            fill
            className="object-contain drop-shadow-md"
            priority
          />
        </motion.div>
        {/* Spinning Swastik */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-mauli-red"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
          >
            <path d="M12 4v16M4 12h16" />
            <path d="M12 4h8M12 20H4M20 12v8M4 4v8" />
            <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
            <circle cx="16" cy="8" r="1" fill="currentColor" stroke="none" />
            <circle cx="8" cy="16" r="1" fill="currentColor" stroke="none" />
            <circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" />
          </svg>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="font-marathi text-wedding-maroon text-xl sm:text-2xl font-bold tracking-widest"
        >
          ॥ शुभं भवतु ॥
        </motion.p>
      </div>
    </motion.div>
  );
}