"use client";
import { useTenant } from "@/hooks/useTenant";
import React, { useEffect, useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Clock3,
    CalendarDays,
    Search,
    ChevronRight,
    ClipboardList,
    Layers,
    MessageCircle,
    History,
    MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getLeaveRequestStatus } from "@/services/user/overviewService";

function RequestStatus() {
    const [requestStatus, setRequestStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const tenantId = useTenant();

    useEffect(() => {
        const fetchLeaveRequestStatus = async () => {
            if (!tenantId) return;
            try {
                const res = await getLeaveRequestStatus(tenantId);
                setRequestStatus(res || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaveRequestStatus();
    }, [tenantId]);

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "approved":
                return "bg-emerald-50 text-emerald-700 border-emerald-100";
            case "rejected":
                return "bg-rose-50 text-rose-700 border-rose-100";
            default:
                return "bg-amber-50 text-amber-700 border-amber-100";
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="flex flex-col bg-white">
            {/* Toolbar */}
            <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <ClipboardList size={18} />
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold text-slate-900">Request Lifecycle</h3>
                        <p className="text-[12px] font-medium text-slate-400">Track and manage your application history</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search requests..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] focus:ring-2 focus:ring-indigo-100 outline-none w-48 transition-all" />
                    </div>
                </div>
            </div>

            <div className="p-6">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                            <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Loading Requests</span>
                        </div>
                    ) : requestStatus.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {requestStatus.map((request, index) => (
                                <div
                                    key={request.id || index}
                                    className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50 transition-all group"
                                >
                                    {/* Icon & Type */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                                            <CalendarDays size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-[14px] font-bold text-slate-900 truncate">{request.leaveType}</h4>
                                                {/* <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">#{request?.id?.slice(-5) || "NEW"}</span> */}
                                            </div>
                                            <p className="text-[12px] text-slate-500 mt-0.5 truncate">{request.reason || "No reason specified"}</p>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="text-center">
                                            <p className="text-[12px] font-bold text-slate-700">{formatDate(request.startDate)}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">Start</p>
                                        </div>
                                        <div className="w-4 h-px bg-slate-200" />
                                        <div className="text-center">
                                            <p className="text-[12px] font-bold text-slate-700">{formatDate(request.endDate)}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase">End</p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center justify-between sm:justify-end gap-4 min-w-[140px]">
                                        <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${getStatusStyles(request.status)}`}>
                                            {request.status}
                                        </span>
                                        <button className="p-2 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-200 transition-all">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mb-4 border border-slate-100">
                                <ClipboardList size={32} />
                            </div>
                            <h4 className="text-[16px] font-bold text-slate-900">No Request History</h4>
                            <p className="text-[13px] font-medium text-slate-400 mt-1 max-w-xs">You haven't submitted any leave requests yet. Your future applications will appear here.</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default RequestStatus;