"use client";

import { useStore } from "@/lib/store";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AudioPlayer() {
  const { isMuted, toggleMute } = useStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Logic to attempt playback and handle browser blocks
  const attemptPlay = useCallback(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch((err) => {
        console.log("Interaction still required for audio:", err);
      });
    }
  }, [isMuted]);

  // Stable cleanup — always references the latest attemptPlay via useCallback
  const removeInteractionListeners = useCallback(() => {
    window.removeEventListener("click", attemptPlay);
    window.removeEventListener("touchstart", attemptPlay);
    window.removeEventListener("scroll", attemptPlay);
  }, [attemptPlay]);

  useEffect(() => {
    // 1. Initial attempt
    attemptPlay();

    // 2. Add listeners for first user interaction (Autoplay workaround)
    window.addEventListener("click", attemptPlay);
    window.addEventListener("touchstart", attemptPlay);
    window.addEventListener("scroll", attemptPlay);

    return () => removeInteractionListeners();
  }, [attemptPlay, removeInteractionListeners]);

  // Handle Mute/Unmute toggle changes from the global store
  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => { });
      }
    }
  }, [isMuted]);

  return (
    <>
      <audio ref={audioRef} loop preload="auto">
        {/* Using shehnai_bgm.mp3 as the primary source */}
        <source src="/audio/shehnai_bgm.mp3" type="audio/mpeg" />
      </audio>

      <div className="fixed bottom-6 right-6 z-[150]">
        <motion.button
          onClick={toggleMute}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-xl border-2 border-mauli-gold rounded-full shadow-2xl overflow-hidden"
          aria-label={isMuted ? "Unmute Music" : "Mute Music"}
          suppressHydrationWarning
        >
          <AnimatePresence>
            {!isMuted && (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-1 border border-dashed border-mauli-gold/40 rounded-full"
              />
            )}
          </AnimatePresence>

          <div className="relative z-10 text-wedding-maroon">
            {!isMuted ? (
              <Volume2 size={24} className="text-wedding-royal" />
            ) : (
              <VolumeX size={24} className="text-gray-400 opacity-50" />
            )}
          </div>

          {!isMuted && (
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-mauli-gold rounded-full"
            />
          )}
        </motion.button>
      </div>
    </>
  );
}