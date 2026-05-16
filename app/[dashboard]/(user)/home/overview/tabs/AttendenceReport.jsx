"use client";
import { useTenant } from "@/hooks/useTenant";
import { getAttendanceReport } from "@/services/user/overviewService";
import React, { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock3,
    User2,
    TimerReset,
    BadgeCheck,
    Search,
    Filter,
    ArrowUpRight,
    MoreHorizontal,
    Download,
    BarChart2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AttendenceReport() {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const tenantId = useTenant();

    useEffect(() => {
        const fetchAttendenceReport = async () => {
            if (!tenantId) return;
            try {
                const res = await getAttendanceReport(tenantId);
                setReportData(res || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendenceReport();
    }, [tenantId]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const formatTime = (time) => {
        if (!time) return "--";
        return new Date(time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="flex flex-col bg-white">
            {/* Header / Toolbar */}
            <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <BarChart2 size={18} />
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900">Attendance Activity</h3>
                        <p className="text-[12px] font-medium text-slate-400">Reviewing your daily login/logout cycles</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Filter by date..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] focus:ring-2 focus:ring-indigo-100 outline-none w-48 transition-all" />
                    </div>
                    <button className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all">
                        <Download size={16} />
                    </button>
                </div>
            </div>

            <div className="p-6">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Loading Logs</span>
                        </div>
                    ) : reportData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="text-left border-b border-slate-100">
                                        <th className="pb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-2">Member</th>
                                        <th className="pb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                        <th className="pb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Check In</th>
                                        <th className="pb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Check Out</th>
                                        <th className="pb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Duration</th>
                                        <th className="pb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right pr-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {reportData.map((report, idx) => (
                                        <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="py-4 pl-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-[11px] shadow-sm">
                                                        {report.employeeId?.charAt(0)}
                                                    </div>
                                                    <span className="text-[13px] font-semibold text-slate-700">{report.employeeId}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 text-[13px] font-medium text-slate-600">{formatDate(report.date)}</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    {formatTime(report.checkIn)}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                    {formatTime(report.checkOut)}
                                                </div>
                                            </td>
                                            <td className="py-4 text-center">
                                                <span className="px-2 py-1 rounded-md bg-slate-100 text-[11px] font-bold text-slate-600">{report.totalHours || "0.0h"}</span>
                                            </td>
                                            <td className="py-4 text-right pr-2">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                                                    ${report.status === "Present" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                                        report.status === "Late" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                                                            "bg-rose-50 text-rose-700 border border-rose-100"}`}
                                                >
                                                    {report.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mb-4 border border-slate-100">
                                <Clock3 size={32} />
                            </div>
                            <h4 className="text-[16px] font-bold text-slate-900">No Attendance Records</h4>
                            <p className="text-[13px] font-medium text-slate-400 mt-1 max-w-xs">Attendance data for this period is not yet available. Check back later.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default AttendenceReport;