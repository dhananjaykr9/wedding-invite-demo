"use client";

import { motion, Variants } from "framer-motion";
import { IceCream, Cake, Heart, Sparkles, Candy, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";

export default function ChildInvitation() {
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Content animation variants - Fixed with "Variants" type and explicit type string
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        type: "spring",
        staggerChildren: 0.15 
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <section className="relative py-16 md:py-32 px-4 md:px-6 overflow-hidden bg-[#FFFDF0] z-30">
      {/* 1. Playful Floating Elements - Magnetic Hover */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, 15, 0], rotate: [0, 15, 0] }}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[5%] md:left-[10%] text-orange-500/20 md:text-orange-500/30"
        >
          <IceCream size={48} className="w-10 h-10 md:w-16 md:h-16" strokeWidth={1.5} />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 25, 0], x: [0, -10, 0], rotate: [0, -20, 0] }}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-[10%] md:right-[15%] text-pink-500/20 md:text-pink-500/30"
        >
          <Cake size={56} className="w-12 h-12 md:w-20 md:h-20" strokeWidth={1.5} />
        </motion.div>

        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
          whileHover={{ rotate: 180, scale: 1.3 }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-40 left-[10%] md:left-[15%] text-yellow-500/20 md:text-yellow-500/30"
        >
          <Candy size={42} className="w-10 h-10 md:w-14 md:h-14" strokeWidth={1.5} />
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* 2. Main Invitation Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          onViewportEnter={triggerConfetti}
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white p-6 md:p-14 pt-20 md:pt-32 rounded-[3rem] md:rounded-[4rem] border-[4px] md:border-[6px] border-double border-mauli-gold/20 shadow-[0_40px_100px_-20px_rgba(200,162,77,0.15)] text-center relative"
        >
          {/* Badge */}
          <motion.div 
            animate={{ rotate: [12, 5, 12], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-mauli-red text-white p-3 md:p-5 rounded-xl md:rounded-3xl shadow-xl z-20"
          >
            <PartyPopper size={24} className="w-5 h-5 md:w-7 md:h-7" />
          </motion.div>

          {/* Child's Photo */}
          <div className="absolute -top-14 md:-top-20 left-1/2 -translate-x-1/2 z-10">
            <div className="relative group">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 md:-inset-4 border-2 border-dashed border-mauli-gold/30 rounded-full" 
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 md:-inset-2 border border-dotted border-mauli-red/20 rounded-full" 
              />
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative w-28 h-28 md:w-44 md:h-44 rounded-full border-[6px] md:border-[10px] border-white shadow-2xl overflow-hidden ring-2 ring-mauli-gold/10"
              >
                <img 
                  src="/images/bhavika.jpeg" 
                  alt="Ku. Bhavika Gavaskar" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Bhavika&background=7c2d12&color=fff&size=256";
                  }}
                />
              </motion.div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Header Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 md:gap-3 px-5 py-2 md:px-8 md:py-3 bg-mauli-gold/5 rounded-full text-mauli-gold border border-mauli-gold/10 shadow-sm relative overflow-hidden group"
            >
              <Sparkles size={12} className="animate-pulse md:w-4 md:h-4" />
              <span className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">A Special Message</span>
              <Sparkles size={12} className="animate-pulse md:w-4 md:h-4" />
              <motion.div 
                className="absolute inset-0 bg-mauli-gold/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" 
              />
            </motion.div>

            {/* Fun Text */}
            <motion.div variants={itemVariants} className="space-y-2 md:space-y-4">
              <h2 className="font-marathi text-[9vw] md:text-7xl text-wedding-maroon font-black leading-[1.2] drop-shadow-sm px-1">
                रसगुल्ला खायिए, <br /> 
                आइसक्रीम खायिए!
              </h2>
            </motion.div>

            {/* Heart Divider */}
            <motion.div variants={itemVariants} className="relative py-2 md:py-6">
               <div className="h-[2px] w-16 md:w-32 bg-gradient-to-r from-transparent via-mauli-gold/30 to-transparent mx-auto" />
               <motion.div 
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-mauli-red bg-white px-2"
               >
                 <Heart size={16} className="md:w-6 md:h-6" fill="currentColor" />
               </motion.div>
            </motion.div>

            <motion.p variants={itemVariants} className="font-marathi text-[6vw] md:text-5xl text-slate-700 leading-[1.4] px-1 md:px-4">
              "मेरे चाचा की शादी में <br /> 
              <motion.span 
                animate={{ 
                  color: ["#b91c1c", "#1e3a8a", "#b91c1c"],
                  textShadow: ["0 0 0px #fff", "0 0 10px rgba(255,215,0,0.3)", "0 0 0px #fff"]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="font-black underline decoration-mauli-gold decoration-wavy underline-offset-4 md:underline-offset-8"
              >
                जरुर-जरुर
              </motion.span> आईए!"
            </motion.p>

            {/* 3. Signature - Color cycling hover */}
            <motion.div 
              variants={itemVariants}
              className="pt-4 mt-4 md:pt-8 md:mt-8 border-t border-dashed border-slate-200 flex flex-col items-center group/sig"
            >
              <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] md:tracking-[0.5em] mb-2 md:mb-4">With Love</span>
              <motion.p 
                whileHover={{ 
                  scale: 1.05,
                  color: "#D4AF37" 
                }}
                className="font-marathi text-[7vw] md:text-6xl text-wedding-royal font-black drop-shadow-sm whitespace-nowrap transition-colors duration-300 cursor-default"
              >
                — कु. भाविका गावस्कर
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        {/* 4. Bottom Decor */}
        <div className="mt-6 md:mt-12 flex justify-center gap-3 md:gap-6">
           {[...Array(6)].map((_, i) => (
             <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                delay: i * 0.1, 
                repeat: Infinity, 
                duration: 3,
                scale: { duration: 0.5 }
              }}
             >
               <Heart size={12} className={`md:w-4 md:h-4 ${i % 2 === 0 ? "text-mauli-red/30" : "text-mauli-gold/30"}`} fill="currentColor" />
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}