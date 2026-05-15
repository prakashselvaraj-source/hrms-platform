"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock,
    CheckCircle2,
    XCircle,
    Timer,
    History,
    Activity,
    LogOut,
    LogIn,
    MapPin,
    Zap,
    TrendingUp,
    BarChart3,
    Calendar,
    ChevronRight,
} from "lucide-react";
import useAttendance from "@/hooks/useAttendance";

/* ─── Tiny reusable components ─────────────────────────────────────── */

function StatCard({ label, value, icon, accent }) {
    const palettes = {
        emerald: {
            ring: "ring-emerald-100",
            text: "text-emerald-600",
            bg: "bg-emerald-50",
            bar: "bg-emerald-400",
        },
        rose: {
            ring: "ring-rose-100",
            text: "text-rose-500",
            bg: "bg-rose-50",
            bar: "bg-rose-400",
        },
        indigo: {
            ring: "ring-indigo-100",
            text: "text-indigo-600",
            bg: "bg-indigo-50",
            bar: "bg-indigo-400",
        },
    };
    const p = palettes[accent] ?? palettes.indigo;

    return (
        <motion.div
            whileHover={{ y: -3, boxShadow: "0 12px 32px -8px rgba(99,102,241,0.15)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`relative bg-white rounded-2xl ring-1 ${p.ring} p-5 overflow-hidden flex flex-col gap-3`}
        >
            {/* subtle corner glow */}
            <div
                className={`absolute -top-4 -right-4 w-20 h-20 rounded-full ${p.bg} opacity-60 blur-2xl`}
            />
            <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] ${p.text}`}>
                {icon}
                {label}
            </div>
            <div className="text-3xl font-black text-slate-900 tabular-nums leading-none">
                {value}
            </div>
            {/* decorative bottom bar */}
            <div className={`h-0.5 w-10 rounded-full ${p.bar} opacity-60`} />
        </motion.div>
    );
}

function StatusBadge({ active }) {
    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all duration-500 ${active
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                    }`}
            />
            {active ? "Session Active" : "No Session"}
        </div>
    );
}

/* ─── Main page ─────────────────────────────────────────────────────── */

export default function AttendancePage() {
    const { data, today, stats, timer, loading, handleCheckIn, handleCheckOut } =
        useAttendance();

    const [liveClock, setLiveClock] = useState("");
    const [liveDate, setLiveDate] = useState("");
    const [mounted, setMounted] = useState(false);

    const isCheckedIn = today?.checkIn && !today?.checkOut;
    const isCheckedOut = today?.checkOut;

    useEffect(() => {
        setMounted(true);
        const tick = () => {
            const now = new Date();
            setLiveClock(
                now.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                })
            );
            setLiveDate(
                now.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                })
            );
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

    /* animation presets */
    const page = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
    };
    const card = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <div className="min-h-screen bg-[#f7f8fc] font-sans text-slate-900 pb-16">

            {/* ── Header ── */}
            <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-indigo-100/60">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
                            <Clock size={16} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-black tracking-tight text-slate-900 leading-none">
                                Attendance
                            </h1>
                            <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest mt-0.5">
                                Ledger System
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* live clock chip */}
                        <div className="hidden sm:flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[11px] font-black text-indigo-700 tabular-nums tracking-wider">
                                {liveClock}
                            </span>
                        </div>
                        <StatusBadge active={isCheckedIn} />
                    </div>
                </div>
            </header>

            {/* ── Body ── */}
            <motion.main
                className="max-w-9xl mx-auto px-6 pt-8 space-y-6"
                variants={page}
                initial="hidden"
                animate="visible"
            >
                {/* date banner */}
                <motion.div variants={card} className="flex items-center gap-2">
                    <Calendar size={13} className="text-indigo-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {liveDate}
                    </span>
                </motion.div>

                {/* ── Grid: punch terminal + stats + history ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT — Punch Terminal */}
                    <motion.div variants={card} className="lg:col-span-4 space-y-4">

                        {/* big punch card */}
                        <div className="relative bg-white rounded-2xl ring-1 ring-indigo-100 p-6 overflow-hidden shadow-sm">
                            {/* background decoration */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-70" />

                            <div className="relative space-y-5">
                                <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-indigo-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-500">
                                        Punch Terminal
                                    </span>
                                </div>

                                {/* time slots */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Entry", value: today?.checkIn || "--:--", icon: <LogIn size={12} /> },
                                        { label: "Exit", value: today?.checkOut || "--:--", icon: <LogOut size={12} /> },
                                    ].map((slot) => (
                                        <div
                                            key={slot.label}
                                            className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 space-y-1"
                                        >
                                            <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-indigo-400">
                                                {slot.icon}
                                                {slot.label}
                                            </div>
                                            <div className="text-base font-black text-indigo-700 tabular-nums">
                                                {slot.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* session duration */}
                                <div className="bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl p-4 flex items-center justify-between text-white shadow-lg shadow-indigo-200">
                                    <div>
                                        <div className="text-[9px] font-bold uppercase tracking-widest text-indigo-200 mb-1">
                                            Session Duration
                                        </div>
                                        <div className="text-2xl font-black tabular-nums font-mono">
                                            {isCheckedIn ? timer : today?.totalHours || "00:00"}
                                        </div>
                                    </div>
                                    <Timer size={28} className="text-indigo-300" />
                                </div>

                                {/* progress bar */}
                                {isCheckedIn && (
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                            <span>Daily Progress</span>
                                            <span className="text-indigo-600">{progressPct}% of 8h</span>
                                        </div>
                                        <div className="h-1.5 bg-indigo-50 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progressPct}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* punch button */}
                                <AnimatePresence mode="wait">
                                    {isCheckedOut ? (
                                        <motion.div
                                            key="done"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="w-full py-3 border border-dashed border-indigo-200 rounded-xl text-center text-[10px] font-bold uppercase tracking-widest text-indigo-400"
                                        >
                                            Ledger Finalized ✓
                                        </motion.div>
                                    ) : (
                                        <motion.button
                                            key="action"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
                                            disabled={loading}
                                            className={`w-full py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 shadow-sm ${isCheckedIn
                                                ? "bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                                                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"
                                                }`}
                                        >
                                            {loading ? (
                                                <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    {isCheckedIn ? <LogOut size={15} /> : <LogIn size={15} />}
                                                    {isCheckedIn ? "Finalize Exit" : "Initialize Entry"}
                                                </>
                                            )}
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* access point pill */}
                        <div className="bg-white ring-1 ring-indigo-100 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                                    <MapPin size={14} className="text-indigo-500" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-700">Corporate HQ</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                        Primary Office · Secure
                                    </p>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-100" />
                        </div>
                    </motion.div>

                    {/* RIGHT — Stats + History */}
                    <motion.div variants={card} className="lg:col-span-8 flex flex-col gap-6">

                        {/* stat cards */}
                        <div className="grid grid-cols-3 gap-4">
                            <StatCard
                                label="Present"
                                value={stats?.present ?? "0"}
                                icon={<CheckCircle2 size={11} />}
                                accent="emerald"
                            />
                            <StatCard
                                label="Absences"
                                value={stats?.absent ?? "0"}
                                icon={<XCircle size={11} />}
                                accent="rose"
                            />
                            <StatCard
                                label="Avg Hours"
                                value={stats?.avgHours ?? "0.0"}
                                icon={<BarChart3 size={11} />}
                                accent="indigo"
                            />
                        </div>

                        {/* history table */}
                        <div className="flex-1 bg-white ring-1 ring-indigo-100 rounded-2xl overflow-hidden flex flex-col shadow-sm">
                            {/* table header */}
                            <div className="px-6 py-4 border-b border-indigo-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <History size={13} className="text-indigo-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">
                                        Chronological Records
                                    </span>
                                </div>
                                <button className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-wider flex items-center gap-1 transition-colors">
                                    Export CSV <ChevronRight size={10} />
                                </button>
                            </div>

                            {/* table */}
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-indigo-50/40">
                                            {["Date", "Entry", "Exit", "Workload", "Status"].map((h) => (
                                                <th
                                                    key={h}
                                                    className="px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-indigo-400"
                                                >
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(data ?? []).slice(0, 8).map((row, i) => (
                                            <motion.tr
                                                key={i}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.04 }}
                                                className="border-t border-slate-50 hover:bg-indigo-50/30 transition-colors group"
                                            >
                                                <td className="px-6 py-3.5 text-xs font-bold text-slate-700">
                                                    {row.date}
                                                </td>
                                                <td className="px-6 py-3.5 text-xs font-mono text-slate-500">
                                                    {row.checkIn || "—"}
                                                </td>
                                                <td className="px-6 py-3.5 text-xs font-mono text-slate-500">
                                                    {row.checkOut || "—"}
                                                </td>
                                                <td className="px-6 py-3.5 text-xs font-black text-indigo-600">
                                                    {row.totalHours || "—"}
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    {row.checkOut || row.status === "complete" ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[9px] font-bold text-emerald-700 uppercase tracking-widest">
                                                            <CheckCircle2 size={9} /> Valid
                                                        </span>
                                                    ) : row.status === "absent" ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-[9px] font-bold text-rose-600 uppercase tracking-widest">
                                                            <XCircle size={9} /> Void
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-[9px] font-bold text-amber-600 uppercase tracking-widest">
                                                            <Activity size={9} /> Partial
                                                        </span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>

                                {(!data || data.length === 0) && (
                                    <div className="py-16 text-center text-sm text-slate-400 font-medium">
                                        No records found
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.main>
        </div>
    );
}