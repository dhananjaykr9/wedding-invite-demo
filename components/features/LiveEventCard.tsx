"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Radio, X, ChevronLeft, ChevronRight, Heart, Camera, Download, Share2 } from "lucide-react";
import confetti from "canvas-confetti";

interface LiveEvent {
    id: number;
    is_active: boolean;
    event_name: string;
    event_emoji: string;
    venue_name: string;
    description: string;
    baraat_stop: number; // -1 = not active, 0..N = current stop index
    updated_at: string;
}

interface LiveWish {
    id: string;
    name: string;
    message: string;
    created_at: string;
}

interface LiveMoment {
    id: string;
    image_url: string;
    caption: string;
    created_at: string;
}

const BARAAT_ROUTE = [
    { name: "हिंगणघाट", sub: "प्रस्थान", emoji: "🏠" },
    { name: "टेमुर्डा", sub: "मार्गावर", emoji: "🛣️" },
    { name: "वरोरा", sub: "मार्गावर", emoji: "🛣️" },
    { name: "भद्रावती", sub: "मार्गावर", emoji: "🛣️" },
    { name: "चंद्रपूर", sub: "मंजिल", emoji: "🎊" },
];

export default function LiveEventCard() {
    const [event, setEvent] = useState<LiveEvent | null>(null);
    const [moments, setMoments] = useState<LiveMoment[]>([]);
    const [featured, setFeatured] = useState(0);
    const [zoomedImg, setZoomedImg] = useState<string | null>(null);
    const [newMomentId, setNewMomentId] = useState<string | null>(null);
    const [showPass, setShowPass] = useState(false);
    const [wishIndex, setWishIndex] = useState(0);
    const [wishes, setWishes] = useState<string[]>(["🌸 सर्वांचे स्वागत आहे!"]);
    const [wishName, setWishName] = useState("");
    const [wishMessage, setWishMessage] = useState("");
    const [wishSending, setWishSending] = useState(false);
    const [wishSent, setWishSent] = useState(false);
    const [showWishForm, setShowWishForm] = useState(false);


    // Fetch live wishes from DB and Google Sheet
    useEffect(() => {
        const fetchWishes = async () => {
            // 1. Fetch from Supabase
            const supabasePromise = supabase
                .from("live_wishes")
                .select("name, message")
                .order("created_at", { ascending: false })
                .limit(30);

            // 2. Fetch from Google Sheet (GAS)
            const googleSheetPromise = fetch("https://script.google.com/macros/s/AKfycby96nNEBj0j3dv-2EFMsGe_MbzHkLTJWnvVwpmNGFXsdVPEjVMEMY6dqpADV5sMqXua/exec?action=getWishes")
                .then(res => res.json())
                .catch(err => {
                    console.error("Failed to fetch Google Sheet wishes:", err);
                    return { data: [] };
                });

            const [supabaseRes, googleRes] = await Promise.all([supabasePromise, googleSheetPromise]);

            const newWishes: string[] = [];

            // Process Supabase wishes
            if (supabaseRes.data && supabaseRes.data.length > 0) {
                supabaseRes.data.forEach((w: any) => newWishes.push(`${w.name}: ${w.message}`));
            }

            // Process Google Sheet wishes
            // API returns: { data: [ { name: "...", "message.": "..." }, ... ] }
            if (googleRes && googleRes.data && Array.isArray(googleRes.data)) {
                googleRes.data.forEach((w: any) => {
                    // Note: The key in the sheet JSON is "message." (with a dot) based on the user's provided JSON
                    const msg = w["message."] || w["message"];
                    if (w.name && msg) {
                        newWishes.push(`${w.name}: ${msg}`);
                    }
                });
            }

            // Combine and set (scramble or just combine? Just combining for now)
            if (newWishes.length > 0) {
                // Remove duplicates if any
                const uniqueWishes = Array.from(new Set(newWishes));
                setWishes(uniqueWishes);
            }
        };
        fetchWishes();

        const wishChannel = supabase
            .channel("live_wishes_changes")
            .on("postgres_changes",
                { event: "INSERT", schema: "public", table: "live_wishes" },
                (payload) => {
                    const w = payload.new as LiveWish;
                    const newWish = `${w.name}: ${w.message}`;
                    setWishes(prev => prev.includes(newWish) ? prev : [newWish, ...prev].slice(0, 30));
                }
            ).subscribe();

        return () => { supabase.removeChannel(wishChannel); };
    }, []);

    useEffect(() => {
        if (wishes.length <= 1) return;
        const interval = setInterval(() => {
            setWishIndex(prev => (prev + 1) % wishes.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [wishes.length]);

    const submitWish = async () => {
        if (!wishName.trim() || !wishMessage.trim()) return;
        const name = wishName.trim();
        const message = wishMessage.trim();
        setWishSending(true);

        // Optimistically show the wish in the ticker immediately
        setWishes(prev => [`${name}: ${message}`, ...prev].slice(0, 30));

        await supabase.from("live_wishes").insert({ name, message });
        setWishSending(false);
        setWishSent(true);
        setWishName("");
        setWishMessage("");
        setTimeout(() => { setWishSent(false); setShowWishForm(false); }, 3000);
    };

    const handleAkshata = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFD700', '#FF0000', '#FFFFFF'], // Gold, Red, White (Rice)
                zIndex: 1000
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#FFD700', '#FF0000', '#FFFFFF'],
                zIndex: 1000
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    useEffect(() => {
        const fetchEvent = async () => {
            const { data } = await supabase
                .from("live_event")
                .select("*")
                .eq("id", 1)
                .single();
            if (data?.is_active) setEvent(data);
        };

        const fetchMoments = async () => {
            const { data } = await supabase
                .from("live_moments")
                .select("*")
                .order("created_at", { ascending: false })
                .limit(20);
            setMoments(data || []);
        };

        fetchEvent();
        fetchMoments();

        const eventChannel = supabase
            .channel("live_event_changes")
            .on("postgres_changes",
                { event: "*", schema: "public", table: "live_event", filter: "id=eq.1" },
                (payload) => {
                    const partial = payload.new as Partial<LiveEvent>;
                    // Merge partial updates (e.g. baraat_stop-only upserts) into existing state
                    setEvent(prev => {
                        if (!prev && partial.is_active === false) return null;
                        if (!prev) {
                            // No existing event — only show if is_active is explicitly true
                            if (partial.is_active) return partial as LiveEvent;
                            return null;
                        }
                        const merged = { ...prev, ...partial };
                        // If is_active was explicitly set to false, hide card
                        if (merged.is_active === false) return null;
                        return merged;
                    });
                }
            ).subscribe();

        const momentsChannel = supabase
            .channel("live_moments_changes")
            .on("postgres_changes",
                { event: "INSERT", schema: "public", table: "live_moments" },
                (payload) => {
                    const newMoment = payload.new as LiveMoment;
                    setMoments((prev) => [newMoment, ...prev].slice(0, 20));
                    setFeatured(0);
                    setNewMomentId(newMoment.id);
                    setTimeout(() => setNewMomentId(null), 4000);
                }
            )
            .on("postgres_changes",
                { event: "DELETE", schema: "public", table: "live_moments" },
                (payload) => {
                    setMoments((prev) => {
                        const next = prev.filter((m) => m.id !== payload.old.id);
                        setFeatured((f) => Math.min(f, Math.max(0, next.length - 1)));
                        return next;
                    });
                }
            ).subscribe();

        return () => {
            supabase.removeChannel(eventChannel);
            supabase.removeChannel(momentsChannel);
        };
    }, []);

    // Auto-cycle featured photo every 5s
    useEffect(() => {
        if (moments.length <= 1) return;
        const t = setInterval(() => setFeatured((f) => (f + 1) % moments.length), 5000);
        return () => clearInterval(t);
    }, [moments.length]);

    if (!event) return null;

    const isBaraat = event.baraat_stop >= 0;
    const currentStop = isBaraat ? BARAAT_ROUTE[event.baraat_stop] : null;
    const isDancing = event.event_name.includes("नाचतोय");
    const isArrival = event.event_name.includes("पोहोचली");
    const isMarriage = event.event_name.includes("विवाह");
    const isComingSoon = event.event_name.includes("लाइव्ह अपडेट");
    const isHaldi = event.event_name.includes("हळदी");
    const isMehendi = event.event_name.includes("मेहंदी");
    const isSangeet = event.event_name.includes("संगीत");
    const isFoamParty = event.event_name.includes("फोम");
    const isPuja = (event.event_name.includes("पूजा") || event.event_name.includes("सत्यनारायण")) && !event.event_name.includes("हळदी");
    const isReception = event.event_name.includes("रिसेप्शन");
    const isDayka = event.event_name.includes("डायका");
    const isSlideshow = event.event_name.toLowerCase().includes("slideshow");

    // Extract dress code from description (looks for "Attire:" pattern)
    const attireMatch = event.description?.match(/Attire:\s*([^•\n]+)/);
    const attireText = attireMatch ? attireMatch[1].trim() : null;
    const prev = () => setFeatured((f) => (f - 1 + moments.length) % moments.length);
    const next = () => setFeatured((f) => (f + 1) % moments.length);

    const handleDownload = (url: string) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = `live-moment-${Date.now()}.jpg`;
        a.click();
    };

    return (
        <>
            {/* Fullscreen zoom overlay */}
            <AnimatePresence>
                {zoomedImg && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setZoomedImg(null)}
                        className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 cursor-pointer"
                    >
                        <motion.img
                            initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
                            src={zoomedImg} alt="Live moment"
                            className="max-w-full max-h-[90vh] rounded-3xl object-contain shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button onClick={() => setZoomedImg(null)}
                            className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-white/40 transition-colors">
                            <X size={20} />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDownload(zoomedImg); }}
                            className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-full text-white hover:bg-white/40 transition-colors text-sm font-bold"
                        >
                            <Download size={16} /> Save Photo
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                <motion.div
                    key="live-card"
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.97 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-4xl mx-auto px-2 sm:px-4"
                >
                    <div className="relative bg-white/70 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] border border-white/40 shadow-[0_30px_80px_rgba(0,0,0,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.6)] overflow-hidden">

                        {/* Ambient glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-mauli-gold/10 rounded-full blur-[80px] -z-10" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-wedding-maroon/5 rounded-full blur-[80px] -z-10" />

                        <div className="p-4 sm:p-6 md:p-10">

                            {/* ── Header ── */}
                            <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="flex items-center gap-2 bg-red-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] shadow-lg shadow-red-500/30"
                                    >
                                        <Radio size={10} /> LIVE
                                    </motion.div>
                                    <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">आत्ता सुरू आहे</span>
                                </div>
                                <span className="text-[9px] sm:text-[10px] text-slate-500 font-bold bg-white/40 border border-white/60 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full backdrop-blur-md shadow-sm">
                                    {new Date(event.updated_at).toLocaleTimeString("mr-IN", { hour: "2-digit", minute: "2-digit" })} ला अपडेट
                                </span>
                            </div>

                            {/* ── Event name ── */}
                            <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <motion.span
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="text-3xl sm:text-4xl md:text-5xl select-none"
                                >
                                    {event.event_emoji || "🎊"}
                                </motion.span>
                                <div>
                                    <h3 className="font-marathi text-2xl sm:text-3xl md:text-4xl font-black text-wedding-maroon tracking-wide leading-tight drop-shadow-sm">
                                        {event.event_name}
                                    </h3>
                                    {event.venue_name && (
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <MapPin size={13} className="text-mauli-gold drop-shadow" />
                                            <span className="font-marathi text-sm text-slate-600 font-bold tracking-wide">{event.venue_name}</span>
                                        </div>
                                    )}
                                    {attireText && (
                                        <div className="flex items-center gap-1.5 mt-2">
                                            <span className="text-sm">👗</span>
                                            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full">
                                                {attireText}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-mauli-gold/30 to-transparent mb-5" />

                            {event.description && (
                                <p className="font-marathi text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 tracking-wide drop-shadow-sm">
                                    {event.description}
                                </p>
                            )}

                            {/* ══════════════════════════════════════════════
                                BARAAT ROUTE TRACKER — shown when baraat_stop >= 0
                            ══════════════════════════════════════════════ */}
                            <AnimatePresence>
                                {isBaraat && currentStop && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                        className="mb-6"
                                    >
                                        {/* ── Animated Road Scene ── */}
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-4 shadow-xl shadow-orange-200/60" style={{ height: "140px" }}>

                                            {/* Sky gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-200" />

                                            {/* Sun */}
                                            <div className="absolute top-4 right-10 w-10 h-10 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/60 opacity-90" />

                                            {/* Scrolling trees (background) */}
                                            <motion.div
                                                animate={{ x: [0, -120] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                className="absolute bottom-[52px] flex gap-10 select-none"
                                                style={{ width: "200%" }}
                                            >
                                                {[...Array(12)].map((_, i) => (
                                                    <span key={i} className="text-2xl" style={{ opacity: 0.7 + (i % 3) * 0.1 }}>🌳</span>
                                                ))}
                                            </motion.div>

                                            {/* Road surface */}
                                            <div className="absolute bottom-0 left-0 right-0 h-14 bg-slate-600" />
                                            {/* Road edge line */}
                                            <div className="absolute bottom-14 left-0 right-0 h-1 bg-yellow-400/60" />
                                            {/* Grass strip between trees and road */}
                                            <div className="absolute bottom-14 left-0 right-0 h-3 bg-emerald-400/80" />

                                            {/* Animated dashed lane markings */}
                                            <motion.div
                                                animate={{ x: [0, -80] }}
                                                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                                                className="absolute bottom-6 flex gap-6 select-none"
                                                style={{ width: "200%" }}
                                            >
                                                {[...Array(20)].map((_, i) => (
                                                    <div key={i} className="w-10 h-1.5 bg-white/70 rounded-full flex-shrink-0" />
                                                ))}
                                            </motion.div>

                                            {/* Start: Home icon (left) */}
                                            <div className="absolute bottom-[52px] left-3 flex flex-col items-center gap-0.5">
                                                <span className="text-xl">🏠</span>
                                                <span className="text-[8px] font-black text-slate-700 bg-white/80 px-1 rounded">हिंगणघाट</span>
                                            </div>

                                            {/* Destination: Wedding hall (right) */}
                                            <div className="absolute bottom-[52px] right-3 flex flex-col items-center gap-0.5">
                                                <span className="text-xl">🎊</span>
                                                <span className="text-[8px] font-black text-slate-700 bg-white/80 px-1 rounded">चंद्रपूर</span>
                                            </div>

                                            {/* Luxury sedan SVG — front faces LEFT, drives left→right */}
                                            <motion.div
                                                animate={{
                                                    left: `${6 + (event.baraat_stop / (BARAAT_ROUTE.length - 1)) * 72}%`,
                                                }}
                                                transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
                                                className="absolute select-none"
                                                style={{
                                                    bottom: "12px",
                                                    left: `${6 + (event.baraat_stop / (BARAAT_ROUTE.length - 1)) * 72}%`,
                                                    width: "80px",
                                                }}
                                            >
                                                <svg viewBox="0 0 160 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="32" style={{ transform: "scaleX(-1)" }}>
                                                    {/* Ground shadow */}
                                                    <ellipse cx="80" cy="62" rx="60" ry="3.5" fill="rgba(0,0,0,0.20)" />

                                                    {/* === BODY === */}
                                                    {/* Main lower body — front(left) to rear(right) */}
                                                    <path d="M10 42 L10 36 Q12 28 20 26 L36 22 Q50 10 72 8 L100 8 Q118 8 130 16 L148 22 Q154 26 155 34 L155 42 Z"
                                                        fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />

                                                    {/* Bonnet slope (front-left) */}
                                                    <path d="M10 36 Q12 28 20 26 L36 22 Q28 30 26 36 Z" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="0.8" />

                                                    {/* Roof */}
                                                    <path d="M52 22 Q58 8 72 6 L100 6 Q116 6 124 18 L120 22 Z"
                                                        fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />

                                                    {/* Roof highlight */}
                                                    <path d="M58 10 Q70 5 95 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

                                                    {/* === WINDOWS === */}
                                                    {/* Front window */}
                                                    <path d="M54 21 Q58 10 70 7 L84 7 L82 21 Z"
                                                        fill="#0f172a" opacity="0.88" />
                                                    {/* Rear window */}
                                                    <path d="M84 7 L100 7 Q112 7 120 18 L118 21 L84 21 Z"
                                                        fill="#0f172a" opacity="0.88" />
                                                    {/* Window pillar */}
                                                    <line x1="84" y1="7" x2="84" y2="21" stroke="#475569" strokeWidth="1.2" />
                                                    {/* Window glare */}
                                                    <path d="M58 12 L64 8" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                                                    <path d="M88 9 L100 9" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />

                                                    {/* === FRONT DETAILS (LEFT SIDE) === */}
                                                    {/* Front bumper */}
                                                    <path d="M10 36 Q8 38 7 42 L14 42 L14 36 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
                                                    {/* Headlight — LED style */}
                                                    <path d="M10 30 Q8 32 8 35 L14 35 L14 28 Q12 28 10 30 Z" fill="#fef9c3" stroke="#fbbf24" strokeWidth="0.8" />
                                                    {/* LED strip */}
                                                    <path d="M9 29 Q8 31 8 33" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
                                                    {/* Grille — BMW kidney style */}
                                                    <rect x="8" y="36" width="5" height="4" rx="1" fill="#94a3b8" />
                                                    <line x1="8" y1="38" x2="13" y2="38" stroke="#64748b" strokeWidth="0.7" />
                                                    {/* Front fog light */}
                                                    <ellipse cx="11" cy="41" rx="2.5" ry="1.2" fill="#fef08a" opacity="0.7" />

                                                    {/* === REAR DETAILS (RIGHT SIDE) === */}
                                                    {/* Rear bumper */}
                                                    <path d="M150 36 Q153 38 154 42 L148 42 L148 36 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
                                                    {/* Taillight — LED strip */}
                                                    <path d="M148 26 L154 28 L154 36 L148 36 Z" fill="#ef4444" stroke="#dc2626" strokeWidth="0.6" opacity="0.9" />
                                                    <path d="M150 27 L153 29" stroke="#fca5a5" strokeWidth="1" strokeLinecap="round" />
                                                    {/* Exhaust */}
                                                    <ellipse cx="148" cy="42" rx="3" ry="1.5" fill="#94a3b8" />
                                                    <ellipse cx="143" cy="42" rx="2.5" ry="1.5" fill="#94a3b8" />

                                                    {/* === DOOR DETAILS === */}
                                                    <path d="M52 22 L52 42" stroke="#e2e8f0" strokeWidth="0.8" />
                                                    <path d="M118 22 L118 42" stroke="#e2e8f0" strokeWidth="0.8" />
                                                    {/* Door handles */}
                                                    <rect x="72" y="30" width="9" height="2.5" rx="1.2" fill="#94a3b8" />
                                                    <rect x="100" y="30" width="9" height="2.5" rx="1.2" fill="#94a3b8" />

                                                    {/* Rocker panel */}
                                                    <path d="M26 42 L140 42 L140 44 Q100 46 80 46 Q55 46 26 44 Z" fill="#e2e8f0" />

                                                    {/* === WHEELS === */}
                                                    {/* Front wheel (LEFT) */}
                                                    <circle cx="36" cy="46" r="12" fill="#1e293b" />
                                                    <circle cx="36" cy="46" r="8.5" fill="#334155" />
                                                    <circle cx="36" cy="46" r="4" fill="#94a3b8" />
                                                    {/* 5-spoke alloy */}
                                                    {[0, 72, 144, 216, 288].map((deg, i) => (
                                                        <line key={i}
                                                            x1={36 + 4 * Math.cos(deg * Math.PI / 180)}
                                                            y1={46 + 4 * Math.sin(deg * Math.PI / 180)}
                                                            x2={36 + 8 * Math.cos(deg * Math.PI / 180)}
                                                            y2={46 + 8 * Math.sin(deg * Math.PI / 180)}
                                                            stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                                                    ))}
                                                    {/* Tyre highlight */}
                                                    <path d="M28 38 Q30 36 34 36" stroke="#475569" strokeWidth="1" strokeLinecap="round" />

                                                    {/* Rear wheel (RIGHT) */}
                                                    <circle cx="124" cy="46" r="12" fill="#1e293b" />
                                                    <circle cx="124" cy="46" r="8.5" fill="#334155" />
                                                    <circle cx="124" cy="46" r="4" fill="#94a3b8" />
                                                    {[0, 72, 144, 216, 288].map((deg, i) => (
                                                        <line key={i}
                                                            x1={124 + 4 * Math.cos(deg * Math.PI / 180)}
                                                            y1={46 + 4 * Math.sin(deg * Math.PI / 180)}
                                                            x2={124 + 8 * Math.cos(deg * Math.PI / 180)}
                                                            y2={46 + 8 * Math.sin(deg * Math.PI / 180)}
                                                            stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                                                    ))}
                                                    <path d="M116 38 Q118 36 122 36" stroke="#475569" strokeWidth="1" strokeLinecap="round" />
                                                </svg>
                                            </motion.div>

                                            {/* Current stop label overlay */}
                                            <div className="absolute top-2 sm:top-3 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
                                                        className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                                                    <span className="text-white text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                                </div>
                                                <div className="bg-orange-500/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-right">
                                                    <p className="text-white font-black text-sm leading-none">{currentStop.name}</p>
                                                    <p className="text-white/70 text-[9px] mt-0.5">
                                                        {event.baraat_stop === BARAAT_ROUTE.length - 1
                                                            ? "🎊 पोहोचली!"
                                                            : `→ ${BARAAT_ROUTE[event.baraat_stop + 1]?.name}`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Route progress strip */}
                                        <div className="bg-white/70 backdrop-blur-md rounded-xl sm:rounded-2xl border border-orange-100 p-3 sm:p-4">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                                🗺️ वरात मार्ग • Route Progress
                                            </p>

                                            {/* Progress bar */}
                                            <div className="relative mb-3">
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${((event.baraat_stop) / (BARAAT_ROUTE.length - 1)) * 100}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
                                                    />
                                                </div>
                                            </div>

                                            {/* Stop dots */}
                                            <div className="flex items-start justify-between gap-1">
                                                {BARAAT_ROUTE.map((stop, i) => {
                                                    const passed = i < event.baraat_stop;
                                                    const current = i === event.baraat_stop;
                                                    return (
                                                        <div key={stop.name} className="flex flex-col items-center gap-1 flex-1 min-w-0">
                                                            <div className={`relative w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 transition-all ${current
                                                                ? "border-orange-500 bg-orange-500 shadow-lg shadow-orange-200"
                                                                : passed
                                                                    ? "border-green-400 bg-green-400"
                                                                    : "border-slate-200 bg-white"
                                                                }`}>
                                                                {current ? (
                                                                    <motion.span
                                                                        animate={{ scale: [1, 1.2, 1] }}
                                                                        transition={{ duration: 1, repeat: Infinity }}
                                                                        className="text-white text-xs"
                                                                    >📍</motion.span>
                                                                ) : passed ? (
                                                                    <span className="text-white text-xs">✓</span>
                                                                ) : (
                                                                    <span className="text-slate-300 text-xs">{stop.emoji}</span>
                                                                )}
                                                            </div>
                                                            <span className={`text-[9px] font-bold text-center leading-tight truncate w-full text-center ${current ? "text-orange-600" : passed ? "text-green-600" : "text-slate-400"
                                                                }`}>
                                                                {stop.name}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Maps button for baraat */}

                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ DANCING GROOM SCENE ══ */}
                            <AnimatePresence>
                                {isDancing && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.6 }} className="mb-6"
                                    >
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-purple-900/40 border border-purple-500/20" style={{ height: "140px" }}>
                                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-800 via-indigo-950 to-slate-900" />
                                            {/* Disco Ball Reflection */}
                                            <motion.div
                                                animate={{ rotate: 360, opacity: [0.3, 0.5, 0.3] }}
                                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                className="absolute -top-20 left-1/2 -translate-x-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,white_20deg,transparent_40deg,white_60deg,transparent_80deg)] opacity-10 mix-blend-overlay"
                                            />
                                            {/* Stars */}
                                            {[...Array(18)].map((_, i) => (
                                                <motion.div key={i}
                                                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                                    transition={{ duration: 1.2 + (i % 4) * 0.4, repeat: Infinity, delay: i * 0.15 }}
                                                    className="absolute w-1 h-1 bg-white rounded-full"
                                                    style={{ top: `${5 + (i * 17) % 55}%`, left: `${(i * 13 + 5) % 95}%` }}
                                                />
                                            ))}
                                            {/* Spotlight beams */}
                                            <div className="absolute bottom-0 left-1/4 w-16 h-full bg-gradient-to-t from-yellow-400/30 to-transparent" style={{ clipPath: "polygon(30% 100%, 70% 100%, 100% 0%, 0% 0%)" }} />
                                            <div className="absolute bottom-0 right-1/4 w-16 h-full bg-gradient-to-t from-pink-400/20 to-transparent" style={{ clipPath: "polygon(30% 100%, 70% 100%, 100% 0%, 0% 0%)" }} />
                                            {/* Stage */}
                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-purple-800 via-pink-800 to-purple-800" />
                                            {/* Crowd */}
                                            <div className="absolute bottom-10 left-0 right-0 flex justify-around items-end px-4">
                                                {["👤", "👤", "👤", "👤", "👤", "👤", "👤", "👤"].map((p, i) => (
                                                    <motion.span key={i} animate={{ y: [0, -(4 + (i % 3) * 3), 0] }}
                                                        transition={{ duration: 0.6 + (i % 3) * 0.2, repeat: Infinity, delay: i * 0.1 }}
                                                        className="text-lg opacity-60">{p}</motion.span>
                                                ))}
                                            </div>
                                            {/* Floating music notes */}
                                            {["🎵", "🎶", "🎵", "🎶", "🎵"].map((note, i) => (
                                                <motion.span key={i}
                                                    animate={{ y: [-10, -60], opacity: [1, 0], x: [0, (i % 2 === 0 ? 12 : -12)] }}
                                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
                                                    className="absolute text-lg select-none"
                                                    style={{ bottom: "50px", left: `${15 + i * 18}%` }}
                                                >{note}</motion.span>
                                            ))}
                                            {/* Groom dancing */}
                                            <motion.div animate={{ rotate: [-8, 8, -8], y: [0, -8, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute text-5xl select-none"
                                                style={{ bottom: "38px", left: "50%", transform: "translateX(-50%)" }}>🕺</motion.div>
                                            {/* Dhol + trumpet */}
                                            <motion.span animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 0.4, repeat: Infinity }}
                                                className="absolute text-3xl select-none" style={{ bottom: "38px", left: "22%" }}>🥁</motion.span>
                                            <motion.span animate={{ rotate: [5, -5, 5] }} transition={{ duration: 0.4, repeat: Infinity }}
                                                className="absolute text-3xl select-none" style={{ bottom: "38px", right: "22%" }}>🎺</motion.span>
                                            {/* Badges */}
                                            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                            </div>
                                            <div className="absolute top-3 right-4 bg-purple-600/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <p className="text-white font-black text-xs">नवरदेव नाचतोय! 🕺</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ ARRIVAL SCENE ══ */}
                            <AnimatePresence>
                                {isArrival && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.6 }} className="mb-6"
                                    >
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-amber-200/60 border border-amber-200/50" style={{ height: "140px" }}>
                                            <div className="absolute inset-0 bg-gradient-to-b from-amber-200 via-orange-100 to-yellow-200" />
                                            {/* Fireworks */}
                                            {["🎆", "🎇", "🎆", "🎇", "✨"].map((fw, i) => (
                                                <motion.span key={i}
                                                    animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                                                    className="absolute text-3xl select-none"
                                                    style={{ top: `${5 + (i * 11) % 30}%`, left: `${8 + i * 20}%` }}
                                                >{fw}</motion.span>
                                            ))}
                                            {/* Hall */}
                                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                                <div className="text-4xl select-none">🏛️</div>
                                                <div className="text-[9px] font-black text-orange-700 bg-white/80 px-2 py-0.5 rounded-lg mt-0.5">शकुंतला मॅरेज हॉल</div>
                                            </div>
                                            {/* Flower petals raining */}
                                            {["🌸", "🌺", "🌼", "🌸", "🌺", "🌼"].map((f, i) => (
                                                <motion.span key={i}
                                                    animate={{ y: [-10, 160], x: [0, (i % 2 === 0 ? 15 : -15)], opacity: [1, 0.5, 0] }}
                                                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: "easeIn" }}
                                                    className="absolute text-lg select-none"
                                                    style={{ top: "-10px", left: `${10 + i * 16}%` }}
                                                >{f}</motion.span>
                                            ))}
                                            {/* Clapping crowd */}
                                            <div className="absolute bottom-10 left-4 flex gap-1">
                                                {["👏", "👏", "👏"].map((e, i) => (
                                                    <motion.span key={i} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} className="text-2xl">{e}</motion.span>
                                                ))}
                                            </div>
                                            <div className="absolute bottom-10 right-4 flex gap-1">
                                                {["👏", "👏", "👏"].map((e, i) => (
                                                    <motion.span key={i} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} className="text-2xl">{e}</motion.span>
                                                ))}
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-orange-200 via-amber-100 to-orange-200" />
                                            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                                                <span className="text-slate-800 text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                            </div>
                                            <div className="absolute top-3 right-4 bg-green-600/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <p className="text-white font-black text-xs">वरात पोहोचली! 🏁</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ MARRIAGE CEREMONY SCENE ══ */}
                            <AnimatePresence>
                                {isMarriage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.6 }} className="mb-6"
                                    >
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-rose-200/60 border border-rose-200/50" style={{ height: "140px" }}>
                                            <div className="absolute inset-0 bg-gradient-to-b from-rose-200 via-amber-100 to-orange-200" />
                                            {/* Divine Glow */}
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl"
                                            />
                                            {/* Garlands top */}
                                            <div className="absolute top-0 left-0 right-0 flex justify-around px-2">
                                                {["🌼🌸🌼", "🌺🌼🌺", "🌼🌸🌼", "🌺🌼🌺"].map((g, i) => (
                                                    <span key={i} className="text-sm select-none">{g}</span>
                                                ))}
                                            </div>
                                            {/* Mandap pillars */}
                                            <div className="absolute bottom-8 left-8 w-3 h-24 bg-gradient-to-b from-amber-400 to-orange-500 rounded-t-full opacity-80" />
                                            <div className="absolute bottom-8 right-8 w-3 h-24 bg-gradient-to-b from-amber-400 to-orange-500 rounded-t-full opacity-80" />
                                            {/* Sacred fire */}
                                            <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.9, 1, 0.9] }}
                                                transition={{ duration: 0.8, repeat: Infinity }}
                                                className="absolute text-4xl select-none"
                                                style={{ bottom: "32px", left: "50%", transform: "translateX(-50%)" }}>🔥</motion.div>
                                            {/* Couple */}
                                            <div className="absolute bottom-8 flex items-end gap-2" style={{ left: "50%", transform: "translateX(-70%)" }}>
                                                <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-3xl select-none">🤵</motion.span>
                                                <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="text-3xl select-none">👰</motion.span>
                                            </div>
                                            {/* Pandit */}
                                            <div className="absolute bottom-8 right-12 text-2xl select-none">🧘</div>
                                            {/* Floating flowers */}
                                            {["🌸", "🌺", "🌸", "🌺", "🌸"].map((f, i) => (
                                                <motion.span key={i}
                                                    animate={{ y: [-5, -50], x: [0, (i % 2 === 0 ? 10 : -10)], opacity: [1, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.7 }}
                                                    className="absolute text-base select-none"
                                                    style={{ bottom: "60px", left: `${20 + i * 14}%` }}
                                                >{f}</motion.span>
                                            ))}
                                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-rose-200 via-amber-100 to-rose-200" />
                                            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                                                <span className="text-rose-900 text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                            </div>
                                            <div className="absolute top-3 right-4 bg-rose-600/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <p className="text-white font-black text-xs">विवाह सोहळा 💍</p>
                                            </div>
                                        </div>
                                        {/* Blessing */}
                                        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                            className="mt-3 text-center bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border border-rose-200 rounded-2xl py-3 px-4">
                                            <p className="font-marathi text-rose-700 font-black text-base">🌸 शुभ विवाह 🌸</p>
                                            <p className="font-marathi text-slate-500 text-xs mt-0.5">अतुल व वैष्णवी यांना शुभेच्छा!</p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ COMING SOON / LIVE STARTING SCENE ══ */}
                            <AnimatePresence>
                                {isComingSoon && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.6 }} className="mb-6"
                                    >
                                        {/* Main scene */}
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-indigo-200/60" style={{ height: "160px" }}>
                                            {/* Deep space background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />

                                            {/* Twinkling stars */}
                                            {[...Array(24)].map((_, i) => (
                                                <motion.div key={i}
                                                    animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.6, 1.3, 0.6] }}
                                                    transition={{ duration: 1.5 + (i % 5) * 0.5, repeat: Infinity, delay: i * 0.18 }}
                                                    className="absolute rounded-full bg-white"
                                                    style={{ width: i % 4 === 0 ? "2px" : "1px", height: i % 4 === 0 ? "2px" : "1px", top: `${(i * 19 + 3) % 90}%`, left: `${(i * 23 + 7) % 95}%` }}
                                                />
                                            ))}

                                            {/* Signal rings expanding from centre */}
                                            {[1, 2, 3].map((ring) => (
                                                <motion.div key={ring}
                                                    animate={{ scale: [0.4, 2.5], opacity: [0.7, 0] }}
                                                    transition={{ duration: 2.4, repeat: Infinity, delay: ring * 0.7, ease: "easeOut" }}
                                                    className="absolute rounded-full border-2 border-indigo-400"
                                                    style={{ width: "80px", height: "80px", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                                                />
                                            ))}

                                            {/* Satellite dish — centre */}
                                            <motion.div
                                                animate={{ rotate: [-6, 6, -6] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute text-5xl select-none"
                                                style={{ top: "50%", left: "50%", transform: "translate(-50%, -58%)" }}
                                            >📡</motion.div>

                                            {/* Floating notification bells */}
                                            {["🔔", "🔔", "🔔"].map((b, i) => (
                                                <motion.span key={i}
                                                    animate={{ y: [0, -12, 0], rotate: [-15, 15, -15] }}
                                                    transition={{ duration: 1 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
                                                    className="absolute text-2xl select-none"
                                                    style={{ bottom: "55px", left: `${20 + i * 30}%` }}
                                                >{b}</motion.span>
                                            ))}

                                            {/* Scrolling ticker at bottom */}
                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-indigo-600/90 backdrop-blur-sm flex items-center overflow-hidden">
                                                <motion.div
                                                    animate={{ x: ["100%", "-100%"] }}
                                                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                                    className="whitespace-nowrap text-white text-xs font-black tracking-widest px-4"
                                                >
                                                    🔴 लाइव्ह अपडेट लवकरच सुरू होणार आहेत &nbsp;•&nbsp; इथेच राहा &nbsp;•&nbsp; LIVE UPDATES STARTING SOON &nbsp;•&nbsp; Stay Tuned &nbsp;•&nbsp; 🔴 लाइव्ह अपडेट लवकरच सुरू होणार आहेत &nbsp;•&nbsp;
                                                </motion.div>
                                            </div>

                                            {/* LIVE SOON badge */}
                                            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                                                <span className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">COMING SOON</span>
                                            </div>
                                            <div className="absolute top-3 right-4 bg-indigo-600/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <p className="text-white font-black text-xs">📡 लाइव्ह सुरू होणार!</p>
                                            </div>
                                        </div>

                                        {/* Info strip below */}
                                        <motion.div
                                            animate={{ opacity: [0.8, 1, 0.8] }}
                                            transition={{ duration: 2.5, repeat: Infinity }}
                                            className="mt-3 flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-2xl py-3 px-4"
                                        >
                                            <span className="text-2xl">🎉</span>
                                            <div>
                                                <p className="font-marathi text-indigo-700 font-black text-sm">लाइव्ह अपडेट येथे मिळतील!</p>
                                                <p className="font-marathi text-slate-500 text-xs mt-0.5">कार्यक्रम सुरू होताच फोटो, व्हिडिओ आणि अपडेट येथे दिसतील.</p>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ HALDI SCENE ══ */}
                            <AnimatePresence>
                                {isHaldi && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }} className="mb-6">
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-yellow-300/60 border border-yellow-200/50" style={{ height: "140px" }}>
                                            <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-amber-200 to-orange-200" />
                                            {/* Turmeric splashes */}
                                            {["💛", "🌼", "💛", "🌼", "💛", "🌼"].map((f, i) => (
                                                <motion.span key={i} animate={{ y: [-5, -40], opacity: [1, 0], scale: [1, 1.5] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                                    className="absolute text-2xl select-none" style={{ bottom: "60px", left: `${10 + i * 16}%` }}>{f}</motion.span>
                                            ))}
                                            {/* People applying haldi */}
                                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-4">
                                                <motion.span animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 1.2, repeat: Infinity }} className="text-4xl select-none">🧑</motion.span>
                                                <motion.span animate={{ y: [0, -5, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-4xl select-none">🧑‍🤝‍🧑</motion.span>
                                                <motion.span animate={{ rotate: [10, -10, 10] }} transition={{ duration: 1.2, repeat: Infinity }} className="text-4xl select-none">👩</motion.span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300" />
                                            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                                                <span className="text-yellow-900 text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                            </div>
                                            <div className="absolute top-3 right-4 bg-yellow-600/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <p className="text-white font-black text-xs">हळदी सोहळा 💛</p>
                                            </div>
                                        </div>
                                        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                            className="mt-3 text-center bg-gradient-to-r from-yellow-50 via-amber-50 to-yellow-50 border border-yellow-200 rounded-2xl py-3 px-4">
                                            <p className="font-marathi text-yellow-700 font-black text-base">💛 हळदी सोहळा सुरू! 💛</p>
                                            <p className="font-marathi text-slate-500 text-xs mt-0.5">अतुल ला हळदी लावली जात आहे!</p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ MEHENDI SCENE ══ */}
                            <AnimatePresence>
                                {isMehendi && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }} className="mb-6">
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-green-300/60 border border-green-200/50" style={{ height: "140px" }}>
                                            <div className="absolute inset-0 bg-gradient-to-b from-green-200 via-emerald-100 to-teal-100" />
                                            {/* Henna patterns floating */}
                                            {["🌿", "🍃", "🌿", "🍃", "🌿"].map((f, i) => (
                                                <motion.span key={i} animate={{ rotate: [0, 360], opacity: [0.6, 1, 0.6] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
                                                    className="absolute text-2xl select-none" style={{ top: `${10 + (i * 17) % 50}%`, left: `${5 + i * 20}%` }}>{f}</motion.span>
                                            ))}
                                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-3">
                                                <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-4xl select-none">👰</motion.span>
                                                <motion.span animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 1, repeat: Infinity }} className="text-3xl select-none">✋</motion.span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-green-200 via-emerald-100 to-green-200" />
                                            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                                                <span className="text-green-900 text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                            </div>
                                            <div className="absolute top-3 right-4 bg-green-700/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <p className="text-white font-black text-xs">मेहंदी कार्यक्रम 🌿</p>
                                            </div>
                                        </div>
                                        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                            className="mt-3 text-center bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border border-green-200 rounded-2xl py-3 px-4">
                                            <p className="font-marathi text-green-700 font-black text-base">🌿 मेहंदी कार्यक्रम सुरू! 🌿</p>
                                            <p className="font-marathi text-slate-500 text-xs mt-0.5">वधूच्या हातांवर सुंदर मेहंदी रेखाटली जात आहे!</p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ SANGEET SCENE ══ */}
                            <AnimatePresence>
                                {isSangeet && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }} className="mb-6">
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-pink-300/60 border border-pink-200/50" style={{ height: "140px" }}>
                                            <div className="absolute inset-0 bg-gradient-to-b from-pink-400 via-rose-300 to-purple-400" />
                                            {/* Disco lights */}
                                            {[...Array(12)].map((_, i) => (
                                                <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }} transition={{ duration: 0.8 + (i % 4) * 0.3, repeat: Infinity, delay: i * 0.1 }}
                                                    className="absolute w-2 h-2 rounded-full" style={{ background: ["#f9a8d4", "#c084fc", "#67e8f9", "#fde68a"][i % 4], top: `${5 + (i * 17) % 55}%`, left: `${(i * 13 + 5) % 95}%` }} />
                                            ))}
                                            {/* Music notes */}
                                            {["🎵", "🎶", "🎵", "🎶"].map((note, i) => (
                                                <motion.span key={i} animate={{ y: [-10, -60], opacity: [1, 0], x: [0, (i % 2 === 0 ? 15 : -15)] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                                                    className="absolute text-xl select-none" style={{ bottom: "50px", left: `${15 + i * 20}%` }}>{note}</motion.span>
                                            ))}
                                            {/* Dancers */}
                                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-2">
                                                <motion.span animate={{ rotate: [-12, 12, -12], y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="text-4xl select-none">💃</motion.span>
                                                <motion.span animate={{ rotate: [12, -12, 12], y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="text-4xl select-none">🕺</motion.span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500" />
                                            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                            </div>
                                            <div className="absolute top-3 right-4 bg-pink-600/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <p className="text-white font-black text-xs">संगीत कार्यक्रम 🎶</p>
                                            </div>
                                        </div>
                                        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                            className="mt-3 text-center bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border border-pink-200 rounded-2xl py-3 px-4">
                                            <p className="font-marathi text-pink-700 font-black text-base">🎶 संगीत कार्यक्रम सुरू! 🎶</p>
                                            <p className="font-marathi text-slate-500 text-xs mt-0.5">नाच, गाणे आणि आनंद — सर्वांनी सहभागी व्हा!</p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ FOAM PARTY SCENE ══ */}
                            <AnimatePresence>
                                {isFoamParty && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }} className="mb-6">
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-cyan-300/60 border border-cyan-200/50" style={{ height: "140px" }}>
                                            <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 via-sky-200 to-blue-300" />
                                            {/* Bubbles */}
                                            {[...Array(16)].map((_, i) => (
                                                <motion.div key={i} animate={{ y: [0, -(80 + (i % 4) * 30)], opacity: [0.8, 0], scale: [0.5 + (i % 3) * 0.3, 1.2] }}
                                                    transition={{ duration: 2 + (i % 4) * 0.5, repeat: Infinity, delay: i * 0.25, ease: "easeOut" }}
                                                    className="absolute rounded-full border-2 border-white/60 bg-white/20"
                                                    style={{ width: `${12 + (i % 4) * 8}px`, height: `${12 + (i % 4) * 8}px`, bottom: "20px", left: `${(i * 7 + 3) % 90}%` }} />
                                            ))}
                                            {/* Party people */}
                                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-2">
                                                {["🎉", "🙌", "🎊"].map((e, i) => (
                                                    <motion.span key={i} animate={{ y: [0, -8, 0], rotate: [-10, 10, -10] }} transition={{ duration: 0.7 + i * 0.2, repeat: Infinity, delay: i * 0.2 }} className="text-3xl select-none">{e}</motion.span>
                                                ))}
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-12 bg-white/40 backdrop-blur-sm" />
                                            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                            </div>
                                            <div className="absolute top-3 right-4 bg-cyan-600/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <p className="text-white font-black text-xs">फोम पार्टी 🎉</p>
                                            </div>
                                        </div>
                                        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                            className="mt-3 text-center bg-gradient-to-r from-cyan-50 via-sky-50 to-cyan-50 border border-cyan-200 rounded-2xl py-3 px-4">
                                            <p className="font-marathi text-cyan-700 font-black text-base">🎉 फोम पार्टी सुरू! 🎉</p>
                                            <p className="font-marathi text-slate-500 text-xs mt-0.5">DJ आणि फोम पार्टीचा आनंद घ्या!</p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ SATYANARAYAN PUJA SCENE ══ */}
                            <AnimatePresence>
                                {isPuja && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }} className="mb-6">
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-orange-300/60 border border-orange-200/50" style={{ height: "140px" }}>
                                            <div className="absolute inset-0 bg-gradient-to-b from-orange-200 via-amber-100 to-yellow-200" />
                                            {/* Divine glow */}
                                            <motion.div
                                                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-yellow-400/30 rounded-full blur-3xl"
                                            />
                                            {/* Floating diyas */}
                                            {["🪔", "🪔", "🪔", "🪔", "🪔"].map((d, i) => (
                                                <motion.span key={i} animate={{ y: [0, -6, 0], opacity: [0.8, 1, 0.8] }} transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.3 }}
                                                    className="absolute text-2xl select-none" style={{ bottom: "52px", left: `${10 + i * 18}%` }}>{d}</motion.span>
                                            ))}
                                            {/* Flowers raining */}
                                            {["🌸", "🌼", "🌺", "🌸", "🌼"].map((f, i) => (
                                                <motion.span key={i}
                                                    animate={{ y: [-10, 160], x: [0, (i % 2 === 0 ? 12 : -12)], opacity: [1, 0.4, 0] }}
                                                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.6, ease: "easeIn" }}
                                                    className="absolute text-lg select-none" style={{ top: "-10px", left: `${8 + i * 18}%` }}
                                                >{f}</motion.span>
                                            ))}
                                            {/* Pandit & idol */}
                                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-4">
                                                <motion.span animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl select-none">🧘</motion.span>
                                                <motion.span animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl select-none">🛕</motion.span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-orange-300 via-amber-200 to-orange-300" />
                                            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                                                <span className="text-orange-900 text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                            </div>
                                            <div className="absolute top-3 right-4 bg-orange-600/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <p className="text-white font-black text-xs">सत्यनारायण पूजा 🪔</p>
                                            </div>
                                        </div>
                                        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                            className="mt-3 text-center bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 rounded-2xl py-3 px-4">
                                            <p className="font-marathi text-orange-700 font-black text-base">🪔 श्री सत्यनारायण महापूजा सुरू! 🪔</p>
                                            <p className="font-marathi text-slate-500 text-xs mt-0.5">सर्वांनी भक्तिभावाने सहभागी व्हा!</p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ RECEPTION SCENE ══ */}
                            <AnimatePresence>
                                {isReception && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }} className="mb-6">
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-violet-300/60 border border-violet-200/50" style={{ height: "140px" }}>
                                            <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-violet-900 to-slate-900" />
                                            {/* Stars */}
                                            {[...Array(20)].map((_, i) => (
                                                <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5 + (i % 5) * 0.4, repeat: Infinity, delay: i * 0.2 }}
                                                    className="absolute w-1 h-1 bg-white rounded-full" style={{ top: `${(i * 19 + 3) % 70}%`, left: `${(i * 23 + 7) % 95}%` }} />
                                            ))}
                                            {/* Champagne */}
                                            {["🥂", "✨", "🥂"].map((e, i) => (
                                                <motion.span key={i} animate={{ y: [0, -15, 0], opacity: [0.8, 1, 0.8] }} transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.6 }}
                                                    className="absolute text-2xl select-none" style={{ bottom: "50px", left: `${20 + i * 30}%` }}>{e}</motion.span>
                                            ))}
                                            {/* Couple silhouette */}
                                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-2">
                                                <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl select-none">🤵</motion.span>
                                                <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="text-4xl select-none">👰</motion.span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-violet-800 via-purple-700 to-violet-800" />
                                            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                            </div>
                                            <div className="absolute top-3 right-4 bg-violet-600/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <p className="text-white font-black text-xs">रिसेप्शन 🥂</p>
                                            </div>
                                        </div>
                                        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                            className="mt-3 text-center bg-gradient-to-r from-violet-50 via-purple-50 to-violet-50 border border-violet-200 rounded-2xl py-3 px-4">
                                            <p className="font-marathi text-violet-700 font-black text-base">🥂 रिसेप्शन सुरू! 🥂</p>
                                            <p className="font-marathi text-slate-500 text-xs mt-0.5">अतुल व वैष्णवी यांचे स्वागत करण्यासाठी सर्वांनी या!</p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ DAYKA SCENE ══ */}
                            <AnimatePresence>
                                {isDayka && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }} className="mb-6">
                                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-rose-200/60 border border-rose-100/50" style={{ height: "140px" }}>
                                            <div className="absolute inset-0 bg-gradient-to-b from-rose-100 via-pink-50 to-amber-100" />
                                            {/* Gifts floating */}
                                            {["🎁", "🎀", "🎁", "🎀"].map((g, i) => (
                                                <motion.span key={i} animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }} transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
                                                    className="absolute text-2xl select-none" style={{ top: `${15 + (i * 20) % 40}%`, left: `${10 + i * 22}%` }}>{g}</motion.span>
                                            ))}
                                            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-3">
                                                <motion.span animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-4xl select-none">👨‍👩‍👧</motion.span>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200" />
                                            <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                                                <span className="text-rose-900 text-[10px] font-black uppercase tracking-widest">LIVE</span>
                                            </div>
                                            <div className="absolute top-3 right-4 bg-rose-500/90 backdrop-blur-sm rounded-xl px-3 py-1.5">
                                                <p className="text-white font-black text-xs">डायका कार्यक्रम 🎁</p>
                                            </div>
                                        </div>
                                        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }}
                                            className="mt-3 text-center bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border border-rose-200 rounded-2xl py-3 px-4">
                                            <p className="font-marathi text-rose-700 font-black text-base">🎁 डायका कार्यक्रम सुरू! 🎁</p>
                                            <p className="font-marathi text-slate-500 text-xs mt-0.5">कुटुंबाचा आनंदोत्सव — सर्वांचे हार्दिक स्वागत!</p>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ══ SLIDESHOW SCENE ══ */}
                            <AnimatePresence>
                                {isSlideshow && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-6 relative h-[280px] sm:h-[350px] md:h-[400px] rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-2xl border-2 sm:border-4 border-white/20">
                                        <AnimatePresence mode="wait">
                                            {moments.length > 0 ? (
                                                <motion.img
                                                    key={moments[featured]?.id || "empty"}
                                                    src={moments[featured]?.image_url}
                                                    alt="Slideshow"
                                                    initial={{ opacity: 0, scale: 1.1 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 1.5 }}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 gap-2">
                                                    <span className="text-4xl">📷</span>
                                                    <span>Waiting for photos...</span>
                                                </div>
                                            )}
                                        </AnimatePresence>

                                        {/* Overlay Gradient */}
                                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                        {/* Caption/Title */}
                                        <div className="absolute bottom-6 left-6 right-6 text-center">
                                            <motion.div
                                                key={featured}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="inline-block"
                                            >
                                                {moments[featured]?.caption ? (
                                                    <p className="text-white font-bold text-lg drop-shadow-lg bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                                        {moments[featured].caption}
                                                    </p>
                                                ) : (
                                                    <span className="text-white/60 text-sm font-mono tracking-widest uppercase">Live Slideshow</span>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Progress Indicators */}
                                        {moments.length > 0 && (
                                            <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 px-4">
                                                {moments.map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className={`h-1 rounded-full ${i === featured ? "bg-white" : "bg-white/20"}`}
                                                        style={{ width: `${100 / moments.length}%`, maxWidth: "40px" }}
                                                        animate={{ opacity: i === featured ? 1 : 0.3 }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Engagement Actions */}
                            {event.is_active && isMarriage && (
                                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={handleAkshata}
                                        className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold shadow-lg shadow-orange-500/20 text-xs sm:text-sm"
                                    >
                                        <span className="text-lg">🌸</span> फुल उधळा (Bless)
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowPass(true)}
                                        className="flex items-center gap-1.5 sm:gap-2 bg-white border border-slate-200 text-slate-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full font-bold shadow-md hover:bg-slate-50 text-xs sm:text-sm"
                                    >
                                        <Camera size={16} /> I was there
                                    </motion.button>
                                </div>
                            )}


                            {/* ── Live Moments — Broadcast Screen ── */}
                            {moments.length > 0 && !isSlideshow && (
                                <div>
                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <motion.span
                                                animate={{ opacity: [1, 0.3, 1] }}
                                                transition={{ duration: 1.2, repeat: Infinity }}
                                                className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-500 inline-block"
                                            />
                                            <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] sm:tracking-[0.25em]">
                                                लाइव्ह क्षण • Live Moments
                                            </span>
                                        </div>
                                        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                                            {moments.length} photos
                                        </span>
                                    </div>

                                    {/* Featured / Hero photo — portrait, centered */}
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden mb-3 bg-black shadow-2xl shadow-black/20 border-2 sm:border-4 border-white/20 max-w-[280px] sm:max-w-[320px] md:max-w-[360px] mx-auto" style={{ aspectRatio: "3/4" }}>
                                            <AnimatePresence mode="wait">
                                                <motion.img
                                                    key={moments[featured]?.id}
                                                    src={moments[featured]?.image_url}
                                                    alt={moments[featured]?.caption || "Live moment"}
                                                    initial={{ opacity: 0, scale: 1.04 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.97 }}
                                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
                                                    onClick={() => setZoomedImg(moments[featured]?.image_url)}
                                                />
                                            </AnimatePresence>

                                            {/* Broadcast top bar */}
                                            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-b from-black/60 to-transparent">
                                                <div className="flex items-center gap-2">
                                                    <motion.div
                                                        animate={{ opacity: [1, 0.3, 1] }}
                                                        transition={{ duration: 1, repeat: Infinity }}
                                                        className="flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest"
                                                    >
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white" /> REC
                                                    </motion.div>
                                                    <span className="text-white/80 text-[9px] sm:text-[10px] font-bold truncate max-w-[100px] sm:max-w-none">{event.event_name}</span>
                                                </div>
                                                <span className="text-white/60 text-[10px] font-mono">{featured + 1} / {moments.length}</span>
                                            </div>

                                            {/* Live Ticker */}
                                            <div className="absolute top-10 sm:top-12 left-0 right-0 px-2 sm:px-4 pointer-events-none text-center">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={wishIndex}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="bg-black/40 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full inline-block shadow-sm border border-white/10 max-w-[90%] truncate"
                                                    >
                                                        {wishes[wishIndex]}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>

                                            {/* Caption */}
                                            {moments[featured]?.caption && (
                                                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent">
                                                    <p className="text-white text-sm font-bold drop-shadow">{moments[featured].caption}</p>
                                                </div>
                                            )}

                                            {/* NEW badge */}
                                            <AnimatePresence>
                                                {newMomentId && moments[featured]?.id === newMomentId && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
                                                        className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg"
                                                    >
                                                        🔴 NEW
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Prev / Next */}
                                            {moments.length > 1 && (
                                                <>
                                                    <button onClick={prev} className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-1.5 sm:p-2 rounded-full transition-all">
                                                        <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                    </button>
                                                    <button onClick={next} className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white p-1.5 sm:p-2 rounded-full transition-all">
                                                        <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                    </button>
                                                </>
                                            )}

                                            {/* Dot indicators */}
                                            {moments.length > 1 && moments.length <= 12 && (
                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                                    {moments.map((_, i) => (
                                                        <button key={i} onClick={() => setFeatured(i)}
                                                            className={`rounded-full transition-all ${i === featured ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>{/* end portrait photo div */}

                                        {/* Filmstrip */}
                                        {moments.length > 1 && (
                                            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide mt-2 sm:mt-3">
                                                <AnimatePresence>
                                                    {moments.map((m, i) => (
                                                        <motion.button
                                                            key={m.id}
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.8 }}
                                                            transition={{ delay: i * 0.03 }}
                                                            onClick={() => setFeatured(i)}
                                                            className={`relative flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === featured
                                                                ? "border-wedding-maroon shadow-lg scale-105"
                                                                : "border-white/60 opacity-70 hover:opacity-100 hover:border-mauli-gold/60"
                                                                }`}
                                                            style={{ width: "44px", height: "58px" }}
                                                        >
                                                            <img src={m.image_url} alt={m.caption || ""} className="w-full h-full object-cover" />
                                                            {m.id === newMomentId && (
                                                                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white" />
                                                            )}
                                                        </motion.button>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}


                            {/* ── Send a Wish ── */}
                            <br></br>
                            <div className="mb-2">
                                {!showWishForm ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowWishForm(true)}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 text-rose-600 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm hover:from-rose-100 hover:to-pink-100 transition-all"
                                    >
                                        <span className="text-base">💌</span> शुभेच्छा पाठवा (Send a Wish)
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 border border-rose-200 rounded-2xl sm:rounded-3xl p-4 sm:p-5"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">💌</span>
                                                <h4 className="font-marathi font-black text-rose-700 text-base">शुभेच्छा पाठवा</h4>
                                            </div>
                                            <button onClick={() => setShowWishForm(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                                <X size={16} />
                                            </button>
                                        </div>

                                        {wishSent ? (
                                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                                className="text-center py-4">
                                                <div className="text-4xl mb-2">🎉</div>
                                                <p className="font-marathi font-black text-emerald-600 text-base">शुभेच्छा पाठवल्या!</p>
                                                <p className="font-marathi text-slate-500 text-xs mt-1">तुमच्या शुभेच्छा सर्वांना दिसतील!</p>
                                            </motion.div>
                                        ) : (
                                            <div className="space-y-3">
                                                <input
                                                    value={wishName}
                                                    onChange={e => setWishName(e.target.value)}
                                                    placeholder="तुमचे नाव (Your Name)"
                                                    className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all"
                                                />
                                                <textarea
                                                    value={wishMessage}
                                                    onChange={e => setWishMessage(e.target.value)}
                                                    placeholder="तुमच्या शुभेच्छा लिहा... (Write your wishes)"
                                                    rows={3}
                                                    className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all resize-none"
                                                />
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                                    onClick={submitWish}
                                                    disabled={wishSending || !wishName.trim() || !wishMessage.trim()}
                                                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-black text-sm shadow-lg shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                                >
                                                    {wishSending ? "पाठवत आहे..." : "💌 शुभेच्छा पाठवा"}
                                                </motion.button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                        </div>
                    </div>
                </motion.div>
            </AnimatePresence >

            {/* Digital Pass Modal */}
            <AnimatePresence>
                {
                    showPass && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowPass(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={e => e.stopPropagation()}
                                className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 max-w-[90vw] sm:max-w-xs w-full relative overflow-hidden text-center shadow-2xl border-2 sm:border-4 border-white"
                            >
                                <button
                                    onClick={() => setShowPass(false)}
                                    className="absolute top-3 right-3 bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors"
                                >
                                    <X size={16} />
                                </button>

                                <div className="border-2 border-dashed border-wedding-maroon/20 rounded-2xl p-4 bg-orange-50/50">
                                    <div className="w-14 h-14 bg-wedding-maroon rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl shadow-lg ring-4 ring-wedding-maroon/20">
                                        🎟️
                                    </div>
                                    <h3 className="font-marathi text-xl font-black text-wedding-maroon mb-1">अधिकृत पाहुणे</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-4">Official Guest Pass</p>

                                    <div className="space-y-2 text-xs font-medium text-slate-700 border-t border-slate-200 pt-3">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Event</span>
                                            <span className="font-bold text-wedding-maroon">Atul weds Vaishnavi</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Date</span>
                                            <span className="font-bold text-slate-800">{new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-green-100 px-2 py-1 rounded-lg mt-2">
                                            <span className="text-green-700 font-black tracking-wider">STATUS</span>
                                            <span className="flex items-center gap-1 text-green-700 font-bold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> ATTENDED
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1">
                                    <Share2 size={10} /> Screenshot to save & share!
                                </p>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </>
    );
}
