"use client";

import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Sparkles, Armchair } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function SadhaModeToggle() {
  // Pulling state from store - if store is false, toggle starts 'off'
  const { isSadhaMode, toggleSadhaMode } = useStore();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col items-end gap-2">
      <div className="flex items-center gap-2">
        {/* Compact Animated Label */}
        <AnimatePresence mode="wait">
          <motion.span
            key={isSadhaMode ? "sadha" : "fancy"}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className={cn(
              "text-[9px] font-black hidden sm:block px-3 py-1.5 rounded-xl backdrop-blur-xl shadow-lg border transition-all uppercase tracking-wider",
              isSadhaMode
                ? "bg-white/90 text-wedding-maroon border-wedding-maroon/20"
                : "bg-wedding-royal/10 text-wedding-royal border-wedding-royal/20"
            )}
          >
            {isSadhaMode ? "साधा मोड चालू" : "साधा मोड"}
          </motion.span>
        </AnimatePresence>

        {/* Reduced Size Toggle Switch */}
        <button
          onClick={toggleSadhaMode}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={cn(
            "relative h-8 w-14 rounded-full transition-all duration-500 p-1 shadow-md outline-none",
            isSadhaMode
              ? "bg-slate-200"
              : "bg-gradient-to-r from-wedding-royal to-mauli-red"
          )}
          aria-label="Toggle Simplified Mode"
          suppressHydrationWarning
        >
          {/* Knob - Starts at x:0 when isSadhaMode is false */}
          <motion.div
            animate={{ x: isSadhaMode ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <AnimatePresence mode="wait">
              {isSadhaMode ? (
                <motion.div
                  key="armchair"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Armchair className="h-3 w-3 text-wedding-maroon" />
                </motion.div>
              ) : (
                <motion.div
                  key="sparkles"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Sparkles className="h-3 w-3 text-mauli-red" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </button>
      </div>

      {/* Compact Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="mr-1 relative"
          >
            <div className="px-3 py-2 bg-slate-900/95 backdrop-blur-md text-white text-[10px] rounded-lg shadow-xl pointer-events-none max-w-[140px] text-center leading-tight border border-white/10 flex flex-col items-center gap-1">
              {isSadhaMode
                ? "Standard high-contrast view."
                : "Switch for animations & effects."}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}