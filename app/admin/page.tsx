"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  Users, CheckCircle2, XCircle, 
  Download, Loader2, RefreshCw, LogOut, Calendar
} from "lucide-react";
import { motion } from "framer-motion";

interface RSVP {
  id: number;
  guest_name: string;
  is_attending: boolean;
  total_guests: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  // 1. Fetch function wrapped in useCallback
  const fetchRSVPs = useCallback(async () => {
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from("gavaskar_rsvps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database Error:", error);
      // If error is unauthorized (JWT expired or missing), boot to login
      if (error.code === 'PGRST301' || error.message.includes('JWT')) {
        router.replace("/login");
      }
    } else {
      setRsvps(data || []);
    }
    setLoading(false);
    setIsRefreshing(false);
  }, [router]);

  // 2. Strict Auth Guard
  useEffect(() => {
    const checkUser = async () => {
      // Get the current user session
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.warn("Unauthorized access attempt. Redirecting...");
        router.replace("/login");
        return;
      }

      // If we reach here, user is valid
      setAuthenticated(true);
      fetchRSVPs();
    };

    checkUser();

    // Listen for auth changes (like logouts in other tabs)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setAuthenticated(false);
        router.replace("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [router, fetchRSVPs]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Using window.location forces a clean cache clear on Vercel
    window.location.href = "/login";
  };

  const exportToCSV = () => {
    if (rsvps.length === 0) return;
    const headers = ["Guest Name", "Attending", "Total Guests", "Date"];
    const rows = rsvps.map(r => [
      r.guest_name,
      r.is_attending ? "Yes" : "No",
      r.total_guests,
      new Date(r.created_at).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `rsvps_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAttending = rsvps.filter(r => r.is_attending).length;
  const totalGuestCount = rsvps.reduce((acc, curr) => acc + (curr.total_guests || 0), 0);

  // Show loading state while verifying auth OR fetching first time
  if (loading || !authenticated) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="animate-spin text-wedding-maroon" size={40} />
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Verifying Secure Terminal...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB] p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-wedding-maroon/10 text-wedding-maroon text-[9px] font-black uppercase tracking-widest rounded-full border border-wedding-maroon/20">
                    Admin Portal
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">RSVP Center</h1>
            <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
               <Calendar size={14} /> Gavaskar Family Wedding • 2026
            </p>
          </motion.div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={exportToCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:shadow-lg transition-all active:scale-95"
            >
              <Download size={16} /> Export
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-600 hover:text-white transition-all active:scale-95"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard label="Total Responses" value={rsvps.length} icon={<Users className="text-blue-500" />} delay={0.1} />
          <StatCard label="Attending Families" value={totalAttending} icon={<CheckCircle2 className="text-emerald-500" />} delay={0.2} />
          <StatCard label="Total Guest Count" value={totalGuestCount} icon={<Users className="text-white" />} color="bg-wedding-maroon text-white shadow-xl" delay={0.3} />
        </div>

        {/* Table Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
             <h2 className="font-black uppercase tracking-widest text-[11px] text-slate-400">Guest Directory</h2>
             <button onClick={fetchRSVPs} className={`p-2 rounded-xl transition-all ${isRefreshing ? 'animate-spin' : 'hover:bg-slate-100'}`}>
                <RefreshCw size={18} className="text-slate-400" />
             </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Guest Name</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Guests</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-6 font-bold text-slate-700 group-hover:text-wedding-maroon transition-colors">{rsvp.guest_name}</td>
                    <td className="p-6">
                      <div className="flex justify-center">
                        {rsvp.is_attending ? (
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider border border-emerald-100">
                            <CheckCircle2 size={10} /> Confirmed
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-wider border border-rose-100">
                            <XCircle size={10} /> Declined
                            </span>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className="font-mono font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-lg text-sm">{rsvp.total_guests}</span>
                    </td>
                    <td className="p-6 text-right font-bold text-slate-400 text-[10px]">
                       {new Date(rsvp.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon, color = "bg-white", delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${color} p-8 rounded-[2.8rem] shadow-sm border border-slate-100 flex items-center justify-between transition-all`}
    >
      <div>
        <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${color.includes('white') ? 'text-slate-400' : 'text-white/60'}`}>{label}</p>
        <p className="text-5xl font-black tracking-tighter leading-none">{value}</p>
      </div>
      <div className={`p-5 rounded-[1.5rem] ${color.includes('white') ? 'bg-slate-50' : 'bg-white/10'}`}>
        {icon}
      </div>
    </motion.div>
  );
}