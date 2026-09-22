"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Send, CheckCircle2, XCircle, Loader2, Sparkles, Heart, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ThreadKnot from "@/components/mauli/ThreadKnot";
import Link from "next/link";

type Status = "idle" | "submitting" | "success" | "error";

export default function GavaskarRSVP() {
  const [name, setName] = useState("");
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || isAttending === null) return;

    setStatus("submitting");

    const { error } = await supabase.from("gavaskar_rsvps").insert([
      {
        guest_name: name,
        is_attending: isAttending,
        total_guests: isAttending ? guestCount : 0,
      },
    ]);

    if (error) {
      console.error(error);
      setStatus("error");
      return;
    }

    setStatus("success");
  };

  return (
    <main className="min-h-screen bg-[#FDFCF0] py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('/images/textures/floral-pattern.png')] bg-center bg-fixed" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* 1. Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-mauli-gold/10 border border-mauli-gold/20 text-mauli-gold mb-6">
            <Sparkles size={16} className="animate-pulse" />
            <span className="uppercase tracking-[0.3em] text-[10px] font-black">Official Wedding RSVP</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-marathi font-black text-wedding-maroon tracking-tighter leading-tight mb-4">
            उपस्थिती निश्चित करा
          </h1>
          <p className="text-slate-500 font-marathi text-xl md:text-2xl italic leading-relaxed mb-8">
            "आपल्या उपस्थितीने विवाह सोहळ्याची शोभा वाढवावी."
          </p>
          <ThreadKnot className="mx-auto scale-125" />
        </motion.div>

        {/* 2. RSVP Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(185,28,28,0.12)] border border-white relative overflow-hidden ring-1 ring-mauli-gold/10"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl">
                  <CheckCircle2 className="text-green-600" size={48} />
                </div>
                <h3 className="text-4xl font-marathi font-black text-wedding-maroon mb-4">धन्यवाद!</h3>
                <p className="text-slate-600 font-marathi text-2xl leading-relaxed px-4 mb-10">
                  {isAttending 
                    ? "तुमची उपस्थिती नोंदवण्यात आली आहे. आम्ही तुमची आतुरतेने वाट पाहत आहोत!" 
                    : "तुमचा संदेश आम्हाला प्राप्त झाला आहे. तुम्ही उपस्थित राहू शकत नसल्याबद्दल आम्हाला वाईट वाटत आहे."}
                </p>
                
                {/* RETURN BUTTON */}
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-black uppercase tracking-widest text-xs transition-colors"
                  >
                    <ArrowLeft size={16} /> मुख्य पृष्ठावर परत जा (Home)
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <form key="form" onSubmit={handleSubmit} className="space-y-10">
                
                {/* Name Input */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-mauli-gold uppercase tracking-[0.4em] ml-4">आपले नाव (Full Name)</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="उदा. श्री. आणि सौ. पाटील"
                    className="w-full p-6 bg-slate-50/50 border border-slate-100 rounded-3xl focus:ring-2 focus:ring-mauli-gold/20 outline-none transition-all font-marathi text-2xl text-slate-800"
                  />
                </div>

                {/* Attendance Toggle */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-mauli-gold uppercase tracking-[0.4em] ml-4">आपण येणार का?</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setIsAttending(true)}
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${
                        isAttending === true ? "border-mauli-red bg-mauli-red/5 text-mauli-red shadow-lg" : "border-slate-50 bg-slate-50/50 text-slate-400"
                      }`}
                    >
                      <CheckCircle2 size={24} />
                      <span className="font-bold font-marathi text-xl">हो, नक्की येणार</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAttending(false)}
                      className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${
                        isAttending === false ? "border-slate-400 bg-slate-100 text-slate-700 shadow-lg" : "border-slate-50 bg-slate-50/50 text-slate-400"
                      }`}
                    >
                      <XCircle size={24} />
                      <span className="font-bold font-marathi text-xl">येणे शक्य नाही</span>
                    </button>
                  </div>
                </div>

                {/* Guest Count */}
                <AnimatePresence>
                  {isAttending === true && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <label className="text-[10px] font-black text-mauli-gold uppercase tracking-[0.4em] ml-4">एकूण किती जण येणार? (Total Guests)</label>
                      <div className="relative">
                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-mauli-gold/50" size={20} />
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="w-full pl-16 pr-6 py-6 bg-slate-50/50 border border-slate-100 rounded-3xl outline-none font-bold text-2xl text-slate-800"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <div className="space-y-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === "submitting" || isAttending === null}
                    className="w-full py-6 bg-gradient-to-r from-wedding-maroon to-mauli-red text-white font-black rounded-3xl shadow-xl shadow-mauli-red/20 flex items-center justify-center gap-4 disabled:opacity-40 transition-all uppercase tracking-widest text-sm"
                  >
                    {status === "submitting" ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Send size={20} />
                        नोंदणी करा (Submit RSVP)
                      </>
                    )}
                  </motion.button>
                  
                  {/* BACK TO HOME LINK */}
                  <div className="text-center">
                    <Link href="/" className="text-[10px] text-slate-400 hover:text-wedding-maroon uppercase tracking-[0.3em] font-black transition-colors flex items-center justify-center gap-2">
                       <ArrowLeft size={12} /> पृष्ठावर परत जा (Back)
                    </Link>
                  </div>
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-center font-bold text-sm">
                    क्षमस्व! तांत्रिक अडचण आली. कृपया पुन्हा प्रयत्न करा.
                  </p>
                )}
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="mt-20 flex flex-col items-center gap-4 opacity-40">
        <Heart size={20} className="text-mauli-red fill-mauli-red" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Gavaskar Family & Reshimgaath</p>
      </div>
    </main>
  );
}