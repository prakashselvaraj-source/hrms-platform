"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Clock, 
    Calendar, 
    CheckCircle2, 
    XCircle, 
    Timer, 
    ArrowUpRight, 
    ArrowDownRight,
    History,
    Activity,
    LogOut,
    LogIn,
    ChevronRight,
    MapPin
} from "lucide-react";
import useAttendance from "@/hooks/useAttendance";

export default function AttendancePage() {
    const {
        data,
        today,
        stats,
        timer,
        loading,
        handleCheckIn,
        handleCheckOut,
    } = useAttendance();

    const [liveClock, setLiveClock] = useState("");
    const [liveDate, setLiveDate] = useState("");

    const isCheckedIn = today?.checkIn && !today?.checkOut;
    const isCheckedOut = today?.checkOut;

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setLiveClock(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }));
            setLiveDate(now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const progressPct = (() => {
        if (!isCheckedIn || !timer) return 0;
        const [h = 0] = timer.split(":").map(Number);
        return Math.min(Math.round((h / 8) * 100), 100);
    })();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 pb-10">
            <motion.div 
                className="max-w-7xl mx-auto px-4 sm:px-6 pt-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* ── Top Utility Bar ── */}
                <motion.div 
                    className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-indigo-100 bg-indigo-50/30 -mx-4 px-4 sm:-mx-6 sm:px-6 pt-2"
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-indigo-600 text-white rounded-md shadow-sm">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">Attendance Ledger</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">{liveDate}</span>
                                <span className="w-1 h-1 rounded-full bg-indigo-200" />
                                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider tabular-nums">{liveClock}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                            isCheckedIn ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-white text-slate-500 border-slate-200'
                        }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isCheckedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            {isCheckedIn ? 'Active Session' : 'No Active Session'}
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* ── Left: Control Center ── */}
                    <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
                        <div className="bg-white border-t-2 border-indigo-600 border-x border-b border-slate-200 rounded-md p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <Activity size={16} className="text-indigo-600" />
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Punch Terminal</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-px bg-indigo-100 border border-indigo-100 rounded-sm overflow-hidden">
                                    <div className="bg-white p-4">
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check In</div>
                                        <div className="text-sm font-bold text-indigo-700 tabular-nums">{today?.checkIn || '--:--'}</div>
                                    </div>
                                    <div className="bg-white p-4">
                                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check Out</div>
                                        <div className="text-sm font-bold text-indigo-700 tabular-nums">{today?.checkOut || '--:--'}</div>
                                    </div>
                                </div>

                                <div className="bg-indigo-50/50 border border-indigo-100 rounded-sm p-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Session Duration</div>
                                        <div className="text-xl font-mono font-bold text-indigo-600 tabular-nums">{isCheckedIn ? timer : (today?.totalHours || '00:00')}</div>
                                    </div>
                                    <Timer size={20} className="text-indigo-200" />
                                </div>

                                <div className="pt-2">
                                    {isCheckedOut ? (
                                        <div className="w-full py-3 bg-white border border-dashed border-indigo-200 rounded-sm text-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                            Daily Ledger Finalized
                                        </div>
                                    ) : (
                                        <button
                                            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                                            disabled={loading}
                                            className={`w-full py-3 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm ${
                                                isCheckedIn 
                                                ? 'bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50' 
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            } disabled:opacity-50`}
                                        >
                                            {loading ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    {isCheckedIn ? <LogOut size={16} /> : <LogIn size={16} />}
                                                    {isCheckedIn ? "Finalize Exit" : "Initialize Entry"}
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-md p-6">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                                <MapPin size={12} className="text-indigo-500" />
                                Access Point
                            </h3>
                            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                <span>Corporate HQ</span>
                                <span className="text-indigo-600">Primary Office</span>
                            </div>
                            <p className="text-[10px] text-indigo-300 mt-1 font-medium italic">Your IP: 192.168.1.104 · Secure Connection</p>
                        </div>
                    </motion.div>

                    {/* ── Right: Performance Ledger ── */}
                    <motion.div className="lg:col-span-8 flex flex-col" variants={itemVariants}>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-3 gap-6 mb-6">
                            {[
                                { label: "Present Days", value: stats?.present ?? "0", icon: <CheckCircle2 size={14} />, color: "text-emerald-600", border: "border-emerald-100", bg: "bg-emerald-50/30" },
                                { label: "Absences", value: stats?.absent ?? "0", icon: <XCircle size={14} />, color: "text-rose-600", border: "border-rose-100", bg: "bg-rose-50/30" },
                                { label: "Average Hours", value: stats?.avgHours ?? "0.0", icon: <Timer size={14} />, color: "text-indigo-600", border: "border-indigo-100", bg: "bg-indigo-50/30" }
                            ].map((s, i) => (
                                <div key={i} className={`bg-white border ${s.border} rounded-md p-5 flex flex-col gap-2 shadow-sm ${s.bg}`}>
                                    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${s.color}`}>
                                        {s.icon}
                                        {s.label}
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* History Table */}
                        <div className="flex-1 bg-white border border-slate-200 rounded-md overflow-hidden flex flex-col shadow-sm">
                            <div className="px-5 py-4 border-b border-indigo-100 flex items-center justify-between bg-indigo-50/30">
                                <h3 className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                                    <History size={14} />
                                    Chronological Records
                                </h3>
                                <button className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wider">Export CSV</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white border-b border-indigo-50">
                                            {["Date", "Entry", "Exit", "Workload", "Compliance"].map((h) => (
                                                <th key={h} className="px-5 py-3 text-[9px] font-bold uppercase tracking-[0.15em] text-indigo-400">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {data.slice(0, 8).map((row, i) => (
                                            <tr key={i} className="hover:bg-indigo-50/30 transition-colors">
                                                <td className="px-5 py-3 text-xs font-bold text-slate-700">{row.date}</td>
                                                <td className="px-5 py-3 text-xs font-mono text-slate-500">{row.checkIn || '—'}</td>
                                                <td className="px-5 py-3 text-xs font-mono text-slate-500">{row.checkOut || '—'}</td>
                                                <td className="px-5 py-3 text-xs font-bold text-indigo-600 italic">{row.totalHours || '—'}</td>
                                                <td className="px-5 py-3">
                                                    {row.checkOut || row.status === "complete" ? (
                                                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                                                            <CheckCircle2 size={10} /> Valid
                                                        </span>
                                                    ) : row.status === "absent" ? (
                                                        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1.5">
                                                            <XCircle size={10} /> Void
                                                        </span>
                                                    ) : (
                                                        <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                                                            <Activity size={10} /> Partial
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
