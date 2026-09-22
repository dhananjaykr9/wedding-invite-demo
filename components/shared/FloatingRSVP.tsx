"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckSquare } from "lucide-react";

export default function FloatingRSVP() {
  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 3, type: "spring" }}
      className="fixed bottom-8 right-8 z-[100]"
    >
      <Link href="/rsvp">
        <motion.button
          whileHover={{ scale: 1.1, rotate: -2 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-3 bg-mauli-gold text-white px-6 py-4 rounded-2xl shadow-[0_20px_40px_rgba(212,175,55,0.4)] border-2 border-white/30 group"
        >
          <CheckSquare size={20} className="group-hover:animate-bounce" />
          <span className="font-black uppercase tracking-widest text-[10px]">Confirm Presence</span>
        </motion.button>
      </Link>
    </motion.div>
  );
}