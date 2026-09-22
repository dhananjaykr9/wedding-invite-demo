"use client";

import { Heart, Globe, Instagram, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function DeveloperInfo() {
  return (
    <footer className="w-full pt-16 pb-12 text-center border-t border-mauli-gold/10 relative bg-gradient-to-b from-transparent to-wedding-paper/80 overflow-hidden">
      {/* Subtle Ambient Glow */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-mauli-gold/5 blur-[120px] rounded-full pointer-events-none"
      />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Family Sign-off */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="font-marathi text-2xl sm:text-3xl text-wedding-maroon font-black tracking-normal drop-shadow-sm leading-relaxed mb-2">
            कृतज्ञतापूर्वक – गावस्कर परिवार
          </p>

          <div className="flex justify-center items-center gap-6 mt-6">
            <div className="h-[1.5px] w-16 md:w-32 bg-gradient-to-r from-transparent via-mauli-gold to-transparent opacity-40" />
            <Heart size={24} className="text-mauli-red fill-current" />
            <div className="h-[1.5px] w-16 md:w-32 bg-gradient-to-l from-transparent via-mauli-gold to-transparent opacity-40" />
          </div>
        </motion.div>

        {/* Kshanika Digital Branding */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-mauli-gold/10"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">
            Built by
          </p>

          <a
            href="https://kshanikadigital.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-wedding-maroon hover:text-mauli-red transition-colors"
          >
            <Globe size={16} className="text-mauli-gold" />
            <span className="text-sm font-black uppercase tracking-[0.3em]">
              kshanikadigital.app
            </span>
          </a>

          <p className="text-[10px] text-slate-400 font-bold mt-2 tracking-wider">
            Premium Digital Invitations & Web Solutions
          </p>

          {/* Contact Details */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <a
              href="https://wa.me/919595167618"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <MessageCircle size={12} />
              WhatsApp
            </a>
            <a
              href="https://instagram.com/kshanika.digital"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <Instagram size={12} />
              Instagram
            </a>
            <a
              href="tel:+919595167618"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              <Phone size={12} />
              +91 95951 67618
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}