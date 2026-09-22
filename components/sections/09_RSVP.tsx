"use client";

import { useState } from "react";
import { Send, Heart, User, Sparkles, Feather, PenLine, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ShlokaText from "../shared/ShlokaText";
import { SHLOKAS } from "@/lib/constants";

export default function RSVP() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycby96nNEBj0j3dv-2EFMsGe_MbzHkLTJWnvVwpmNGFXsdVPEjVMEMY6dqpADV5sMqXua/exec";

  const handleSend = async () => {
    if (!message.trim() || !name.trim()) return;
    setIsSubmitting(true);

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      setIsSent(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert("क्षमस्व! संदेश पाठवताना तांत्रिक अडचण आली. पुन्हा प्रयत्न करा.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-24 md:py-32 px-4 max-w-2xl mx-auto mb-20 overflow-visible">
      {/* 1. Cinematic Ambient Decor */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[url('/images/textures/paper-grain.png')] mix-blend-multiply opacity-5" />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-mauli-gold/15 via-transparent to-transparent"
        />
      </div>

      {/* 2. Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, 0], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="inline-block mb-8 relative"
        >
          <div className="p-5 bg-white rounded-full shadow-xl border border-mauli-gold/20 relative z-10">
            <Feather className="text-mauli-gold" size={32} strokeWidth={1.5} />
          </div>
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-mauli-gold rounded-full blur-xl -z-10"
          />
        </motion.div>

        <h2 className="text-5xl sm:text-7xl md:text-8xl font-marathi font-black text-wedding-maroon tracking-tighter mb-4 drop-shadow-sm">
          शुभेच्छा संदेश
        </h2>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-mauli-gold/50 to-transparent" />
          <Sparkles size={14} className="text-mauli-gold animate-pulse" />
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-mauli-gold/50 to-transparent" />
        </div>

        <p className="text-slate-500 font-marathi text-xl md:text-2xl italic max-w-md mx-auto leading-relaxed">
          "तुमच्या शुभेच्छा आमच्या जीवनातील सर्वात मौल्यवान भेट आहेत."
        </p>
      </motion.div>

      {/* 3. The Form Card */}
      <div className="relative">
        <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-14 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(200,162,77,0.15)] border border-white relative z-10 overflow-hidden ring-1 ring-mauli-gold/10">

          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Name Input */}
                <div className="space-y-3">
                  <motion.label
                    animate={{ color: focusedField === "name" ? "#D4AF37" : "#94a3b8" }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] ml-4"
                  >
                    <User size={12} /> पूर्ण नाव
                  </motion.label>
                  <input
                    type="text"
                    value={name}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. श्री. राजेश पाटील"
                    className="w-full p-5 bg-slate-50/40 border border-slate-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-mauli-gold/20 focus:bg-white transition-all font-marathi text-xl md:text-2xl text-slate-800 placeholder:opacity-30"
                    suppressHydrationWarning
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-3">
                  <motion.label
                    animate={{ color: focusedField === "message" ? "#D4AF37" : "#94a3b8" }}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] ml-4"
                  >
                    <PenLine size={12} /> आशीर्वाद संदेश
                  </motion.label>
                  <textarea
                    value={message}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="तुमचे आशीर्वाद येथे लिहा..."
                    className="w-full h-48 p-6 bg-slate-50/40 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-mauli-gold/20 focus:bg-white transition-all font-marathi text-xl md:text-2xl resize-none leading-relaxed text-slate-800 placeholder:opacity-30"
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(185,28,28,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSend}
                  disabled={!message.trim() || !name.trim() || isSubmitting}
                  className="w-full py-5 bg-gradient-to-br from-wedding-maroon to-mauli-red text-white font-black rounded-[2rem] shadow-xl flex items-center justify-center gap-4 disabled:opacity-30 transition-all duration-500 overflow-hidden relative group"
                >
                  {isSubmitting ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      <span className="tracking-[0.2em] uppercase text-xs">संदेश पाठवा</span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </motion.button>
              </motion.div>
            ) : (
              /* Success State */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 flex flex-col items-center text-center"
              >
                <div className="relative mb-10">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-mauli-red/20 rounded-full blur-2xl"
                  />
                  <div className="w-24 h-24 bg-wedding-maroon rounded-full flex items-center justify-center shadow-2xl relative border-4 border-white z-10">
                    <Heart size={40} className="text-white fill-white animate-pulse" />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4 px-4"
                >
                  <h3 className="text-4xl md:text-5xl font-marathi font-black text-wedding-maroon flex items-center justify-center gap-3">
                    खूप खूप आभार! <CheckCircle2 className="text-green-500" size={28} />
                  </h3>
                  <p className="text-slate-600 font-marathi text-xl md:text-2xl leading-relaxed">
                    <span className="text-mauli-gold font-black">{name}</span> जी, तुमचे आशीर्वाद आमच्यापर्यंत पोहोचले आहेत.
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setIsSent(false); setMessage(""); setName(""); }}
                  className="mt-10 px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-mauli-gold bg-mauli-gold/5 rounded-full border border-mauli-gold/20 hover:bg-mauli-gold/10 transition-colors"
                >
                  आणखी एक आशीर्वाद लिहा
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-24 text-center"
      >
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-mauli-gold/30 to-transparent mx-auto mb-8" />
        <ShlokaText
          text={SHLOKAS.footer}
          size="md"
          className="text-slate-400 font-black tracking-[0.6em] uppercase text-[9px] md:text-xs px-4"
        />
      </motion.div>
    </section>
  );
}