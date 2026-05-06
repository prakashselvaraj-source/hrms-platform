"use client";

import { useEffect, useState } from "react";
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

    const isCheckedIn = today?.checkIn && !today?.checkOut;
    const isCheckedOut = today?.checkOut;

    useEffect(() => {
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
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    const todayLabel = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const progressPct = (() => {
        if (!isCheckedIn || !timer) return 0;
        const [h = 0] = timer.split(":").map(Number);
        return Math.min(Math.round((h / 8) * 100), 100);
    })();

    const statItems = [
        {
            label: "Days Present",
            value: stats?.present ?? "—",
            textColor: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            iconColor: "text-emerald-500",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: "Absences",
            value: stats?.absent ?? "—",
            textColor: "text-rose-500",
            bg: "bg-rose-50",
            border: "border-rose-100",
            iconColor: "text-rose-400",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: "Avg Hours",
            value: stats?.avgHours ?? "—",
            textColor: "text-sky-600",
            bg: "bg-sky-50",
            border: "border-sky-100",
            iconColor: "text-sky-500",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            label: "Rate",
            value: stats?.rate ? `${stats.rate}%` : "—",
            textColor: "text-violet-600",
            bg: "bg-violet-50",
            border: "border-violet-100",
            iconColor: "text-violet-500",
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-white">

            {/* Top accent stripe */}
            <div className="h-[3px] w-full bg-gradient-to-r from-slate-900 via-slate-600 to-slate-300" />

            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 space-y-10">

                {/* ── Header ── */}
                <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-8 border-b border-slate-100">
                    <div>
                        <p className="text-[11px] font-semibold tracking-[3px] uppercase text-slate-400 mb-2">
                            {todayLabel}
                        </p>
                        <h1 className="text-5xl font-black tracking-[-2.5px] text-slate-900 leading-none">
                            Attendance
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Live clock */}
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="font-mono text-2xl font-bold text-slate-900 leading-none tabular-nums">
                                {liveClock}
                            </span>
                            <span className="text-[10px] font-semibold tracking-[2px] uppercase text-slate-400 mt-1">
                                Current time
                            </span>
                        </div>

                        <div className="w-px h-10 bg-slate-200 hidden sm:block" />

                        {/* Status badge */}
                        {isCheckedOut ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase bg-slate-100 text-slate-500 border border-slate-200">
                                <span className="w-2 h-2 rounded-full bg-slate-400" />
                                Day ended
                            </span>
                        ) : isCheckedIn ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                On duty
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold tracking-widest uppercase bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                                Off duty
                            </span>
                        )}
                    </div>
                </header>

                {/* ── Stats ── */}
                <section>
                    <p className="text-[10px] font-bold tracking-[3px] uppercase text-slate-300 mb-4">
                        Overview
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {statItems.map((s) => (
                            <div
                                key={s.label}
                                className={`rounded-2xl border ${s.border} ${s.bg} p-5 flex flex-col gap-3`}
                            >
                                <div className={`w-8 h-8 rounded-xl bg-white border ${s.border} flex items-center justify-center ${s.iconColor}`}>
                                    {s.icon}
                                </div>
                                <div>
                                    <div className={`text-3xl font-black tracking-tight leading-none mb-1 ${s.textColor}`}>
                                        {s.value}
                                    </div>
                                    <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                        {s.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Main Grid ── */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Left: Session */}
                    <div className="flex flex-col gap-3">
                        <p className="text-[10px] font-bold tracking-[3px] uppercase text-slate-300">
                            Today's session
                        </p>

                        <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6 flex flex-col gap-5 shadow-sm shadow-slate-100">

                            {/* Times */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">
                                        Checked in
                                    </div>
                                    <div className="font-mono text-xl font-bold text-slate-900">
                                        {today?.checkIn || "—"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1">
                                        Checked out
                                    </div>
                                    <div className="font-mono text-xl font-bold text-slate-900">
                                        {today?.checkOut || "—"}
                                    </div>
                                </div>
                            </div>

                            {/* Live timer */}
                            {isCheckedIn && (
                                <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-700">
                                            Live session
                                        </span>
                                    </div>
                                    <span className="font-mono text-base font-bold text-emerald-700 tabular-nums">
                                        {timer}
                                    </span>
                                </div>
                            )}

                            <div className="h-px bg-slate-100" />

                            {/* CTA */}
                            {isCheckedOut ? (
                                <div className="text-center py-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-bold tracking-widest uppercase text-slate-400">
                                    Session complete
                                </div>
                            ) : isCheckedIn ? (
                                <button
                                    onClick={handleCheckOut}
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-700 active:scale-[0.98] text-white text-[11px] font-bold tracking-widest uppercase transition-all duration-150 disabled:opacity-40"
                                >
                                    {loading ? "Processing…" : "Check out →"}
                                </button>
                            ) : (
                                <button
                                    onClick={handleCheckIn}
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-700 active:scale-[0.98] text-white text-[11px] font-bold tracking-widest uppercase transition-all duration-150 disabled:opacity-40"
                                >
                                    {loading ? "Processing…" : "Check in →"}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="lg:col-span-2 flex flex-col gap-3">
                        <p className="text-[10px] font-bold tracking-[3px] uppercase text-slate-300">
                            Today's details
                        </p>

                        <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-6 flex flex-col gap-6 shadow-sm shadow-slate-100">
                            {today ? (
                                <>
                                    {/* Detail cells */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                                        {[
                                            { label: "Check In", value: today.checkIn || "—" },
                                            { label: "Check Out", value: today.checkOut || "—" },
                                            { label: "Duration", value: today.totalHours || (isCheckedIn ? timer : "—") },
                                        ].map((d) => (
                                            <div key={d.label} className="bg-white px-4 py-4">
                                                <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1.5">
                                                    {d.label}
                                                </div>
                                                <div className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                                                    {d.value}
                                                </div>
                                            </div>
                                        ))}
                                        <div className="bg-white px-4 py-4">
                                            <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 mb-1.5">
                                                Status
                                            </div>
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${isCheckedOut
                                                    ? "bg-slate-50 text-slate-500 border-slate-200"
                                                    : isCheckedIn
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                                    }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${isCheckedOut ? "bg-slate-400" : isCheckedIn ? "bg-emerald-500" : "bg-amber-400"}`} />
                                                {isCheckedOut ? "Completed" : isCheckedIn ? "Working" : "Pending"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    {isCheckedIn && (
                                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                                                    Session progress
                                                </span>
                                                <span className="font-mono text-xs font-semibold text-slate-600">
                                                    {progressPct}% · target 8h
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                                    style={{ width: `${progressPct}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-2">
                                                <span className="text-[10px] text-slate-300 font-mono">0h</span>
                                                <span className="text-[10px] text-slate-300 font-mono">8h</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Info notice when not yet checked in */}
                                    {!isCheckedIn && !isCheckedOut && (
                                        <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 flex items-start gap-3">
                                            <svg className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-xs font-medium text-amber-700">
                                                You haven't checked in today. Your session starts the moment you check in.
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 gap-3">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-600">No session today</p>
                                        <p className="text-xs text-slate-400 mt-1">Check in to start tracking your time</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── History Table ── */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-bold tracking-[3px] uppercase text-slate-300">
                            Recent history
                        </p>
                        {data.length > 0 && (
                            <button className="text-[11px] font-bold tracking-widest uppercase text-slate-400 hover:text-slate-700 transition-colors underline underline-offset-4">
                                View all
                            </button>
                        )}
                    </div>

                    <div className="rounded-2xl border border-slate-100 overflow-hidden shadow-sm shadow-slate-100">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    {["Date", "Check In", "Check Out", "Hours", "Status"].map((h) => (
                                        <th
                                            key={h}
                                            className="text-left px-5 py-3.5 text-[10px] font-bold tracking-[2px] uppercase text-slate-400 whitespace-nowrap"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 bg-white">
                                {data.slice(0, 10).map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-5 py-3.5 font-semibold text-slate-800">
                                            {row.date}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-slate-600 tabular-nums">
                                            {row.checkIn || "—"}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono text-slate-600 tabular-nums">
                                            {row.checkOut || "—"}
                                        </td>
                                        <td className="px-5 py-3.5 font-mono font-semibold text-slate-900 tabular-nums">
                                            {row.totalHours || "—"}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {row.checkOut || row.status === "complete" ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    Complete
                                                </span>
                                            ) : row.status === "absent" ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-50 text-rose-600 border border-rose-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                                    Absent
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-700 border border-amber-100">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                    Partial
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-14 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                                                    </svg>
                                                </div>
                                                <p className="text-xs font-semibold text-slate-400">No attendance records yet</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    );
}
