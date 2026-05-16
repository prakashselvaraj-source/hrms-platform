import { getReportingManager } from '@/services/user/overviewService';
import { MessageSquare, ShieldCheck, Mail, ExternalLink, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTenant } from '@/hooks/useTenant';

function SideCard({ children, title }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {title && (
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
                </div>
            )}
            <div className="p-5">
                {children}
            </div>
        </div>
    );
}

function ReportingManager() {
    const tenantId = useTenant();
    const [reportingManager, setReportingManager] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchReportingManager = async () => {
            if (!tenantId) return;
            setLoading(true);
            try {
                const data = await getReportingManager(tenantId);
                console.log("Reporting manager data:", data);
                setReportingManager(data);
                setError(false);
            } catch (err) {
                console.error("Failed to fetch reporting manager:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchReportingManager();
    }, [tenantId]);

    // Skeleton / Loading State
    if (loading) {
        return (
            <SideCard title="Reporting Manager">
                <div className="flex items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-slate-100" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-100 rounded w-24" />
                        <div className="h-2 bg-slate-100 rounded w-32" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-6">
                    <div className="h-9 bg-slate-50 rounded-lg animate-pulse" />
                    <div className="h-9 bg-slate-50 rounded-lg animate-pulse" />
                </div>
            </SideCard>
        );
    }

    // Fallback if no manager or error
    if (error || !reportingManager) {
        return (
            <SideCard title="Reporting Manager">
                <div className="flex flex-col items-center py-4 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-3 border border-slate-100">
                        <User size={20} />
                    </div>
                    <p className="text-[13px] font-semibold text-slate-900">No Manager Assigned</p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">Your reporting structure will be visible here once configured.</p>
                </div>
            </SideCard>
        );
    }

    // Dynamic data rendering
    const initials = reportingManager?.name?.split(" ").map(n => n[0]).join("") || "??";

    return (
        <SideCard title="Reporting Manager">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-indigo-50">
                        {initials}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${reportingManager.isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-bold text-slate-900 truncate">{reportingManager?.name}</h4>
                    <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-tight">{reportingManager?.role || reportingManager?.designation}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-6">
                <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-[12px] font-bold hover:bg-indigo-100 transition-all">
                    <MessageSquare size={14} />
                    Message
                </button>
                <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-[12px] font-bold hover:bg-slate-50 transition-all">
                    <Mail size={14} />
                    Email
                </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50">
                <button className="flex items-center justify-between w-full text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-all group">
                    ORGANIZATION CHART
                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        </SideCard>
    );
}

export default ReportingManager;