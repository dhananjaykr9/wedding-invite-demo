"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ShieldCheck, Cpu, ArrowRight, Zap, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        // 1. Force a refresh to clear the client-side router cache
        // This prevents Middleware from redirecting back to login due to stale state
        router.refresh();
        
        // 2. Small delay to ensure cookies are written before the browser navigates
        setTimeout(() => {
          window.location.replace("/admin");
        }, 100);
      }
    } catch (err) {
      setErrorMsg("Terminal access denied. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-wedding-paper flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mauli-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-wedding-maroon/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Branding Section */}
        <div className="flex flex-col items-center mb-12 text-center">
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] mb-6 relative group border border-mauli-gold/20 p-3"
          >
             <img 
                src="/images/gavaskar-logo.png" 
                alt="Gavaskar Logo" 
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
             />
             <div className="absolute inset-0 rounded-[2.5rem] ring-1 ring-inset ring-mauli-gold/20" />
             <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-mauli-gold/10 rounded-[2.5rem] blur-xl -z-10" 
             />
          </motion.div>
          
          <h1 className="text-4xl font-display text-wedding-maroon tracking-tight">
            Core <span className="text-mauli-gold italic font-light">Access</span>
          </h1>
          <div className="flex items-center gap-2 mt-3">
             <div className="w-1.5 h-1.5 bg-mauli-gold rounded-full animate-pulse" />
             <p className="text-slate-400 text-[10px] uppercase tracking-[0.4em] font-black">Authorized Personnel Only</p>
          </div>
        </div>

        {/* Login Form */}
        <form 
          onSubmit={handleLogin} 
          className="bg-white/95 backdrop-blur-3xl p-10 md:p-12 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white/40 relative overflow-hidden"
        >
          <div className="absolute top-8 right-8 text-mauli-gold/10">
             <Cpu size={48} />
          </div>

          <div className="space-y-8 relative z-10">
            {/* Email Input */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within:text-mauli-gold transition-colors">Credential ID</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-mauli-gold transition-colors" size={18} />
                <input 
                  type="email" 
                  autoComplete="email"
                  placeholder="admin@reshimgaath.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-mauli-gold/5 focus:border-mauli-gold/20 transition-all text-sm font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2 group">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4 group-focus-within:text-mauli-gold transition-colors">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-mauli-gold transition-colors" size={18} />
                <input 
                  type="password" 
                  autoComplete="current-password"
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-mauli-gold/5 focus:border-mauli-gold/20 transition-all text-sm font-medium text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-50 text-red-600 p-4 rounded-2xl text-[11px] font-bold mt-8 text-center border border-red-100 flex items-center justify-center gap-2"
              >
                <Zap size={14} className="fill-current" /> {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading} 
            className="group/btn relative w-full mt-10 py-6 bg-wedding-maroon text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] overflow-hidden transition-all shadow-[0_20px_40px_rgba(128,0,0,0.25)] hover:bg-black active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3"
          >
            {loading ? (
              <span className="flex items-center gap-3 italic">
                <Loader2 className="animate-spin" size={16} /> establishing connection...
              </span>
            ) : (
              <>
                <ShieldCheck size={18} className="text-mauli-gold group-hover/btn:scale-110 transition-transform" />
                Authorize Session
                <ArrowRight size={14} className="opacity-40 group-hover/btn:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-12 text-center flex flex-col items-center gap-4">
            <Link href="/" className="group text-[10px] text-slate-400 hover:text-mauli-gold transition-colors uppercase tracking-[0.3em] font-black flex items-center gap-2">
               <ArrowRight size={12} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Main Gateway
            </Link>
            <div className="h-px w-8 bg-slate-200" />
            <p className="text-slate-300 text-[8px] uppercase tracking-[0.8em] font-medium">Terminal v2.0.26 Encrypted</p>
        </div>
      </motion.div>
    </main>
  );
}