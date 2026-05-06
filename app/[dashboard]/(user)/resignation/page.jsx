"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus, FileText, Clock, CheckCircle2,
    XCircle, AlertCircle, ChevronRight,
    ArrowRight, Info, Upload, Eye
} from "lucide-react";
import { useTenant } from "@/hooks/useTenant";
import { getMyResignations } from "@/services/resignationService";

export default function UserResignationPage() {
    const router = useRouter();
    const tenant = useTenant();
    const [mounted, setMounted] = useState(false);

    // Mock data for user's own resignation
    // In a real app, this would come from an API
    const [myResignation, setMyResignation] = useState(null);

    useEffect(() => {
        setMounted(true);

        const fetchResignation = async () => {
            try {
                const res = await getMyResignations(tenant);
                const resignations = res.data?.resignations || (Array.isArray(res.data) ? res.data : []);
                
                if (resignations.length > 0) {
                    const latest = resignations[resignations.length - 1];
                    const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

                    setMyResignation({
                        id: latest.id,
                        status: latest.status,
                        documentUrl: latest.documentUrl,
                        submittedDate: fmt(latest.resignationDate),
                        lastWorkingDay: fmt(latest.lastWorkingDay),
                        reason: latest.reason,
                        history: [
                            { label: "Submitted", date: fmt(latest.resignationDate), done: true },
                            { label: "Executive Review", date: latest.status === "PENDING" ? "In Progress" : latest.status, active: latest.status === "PENDING", done: latest.status !== "PENDING" },
                            { label: "HR Review", date: latest.status === "APPROVED" ? "Approved" : "pending", done: latest.status === "APPROVED" },
                        ]
                    });
                }
            } catch (error) {
                console.error("Error fetching resignation:", error);
            }
        };

        if (tenant) fetchResignation();
    }, [tenant]);

    if (!mounted) return null;

    const statusConfig = {
        PENDING: {
            icon: Clock,
            bg: "bg-amber-50",
            border: "border-amber-100",
            text: "text-amber-700",
            label: "Pending Review",
            description: "Your resignation request is currently being reviewed by the administration."
        },
        APPROVED: {
            icon: CheckCircle2,
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            text: "text-emerald-700",
            label: "Approved",
            description: "Your resignation has been approved. Please contact HR for the exit process."
        },
        REJECTED: {
            icon: XCircle,
            bg: "bg-red-50",
            border: "border-red-100",
            text: "text-red-700",
            label: "Rejected",
            description: "Your resignation request was not approved. Please speak with your manager."
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Resignation Status</h1>
                        <p className="text-sm text-gray-500">Track and manage your exit process.</p>
                    </div>
                    {!myResignation && (
                        <button
                            onClick={() => router.push(`/${tenant}/resignation/apply`)}
                            className="inline-flex items-center gap-2 bg-[#4A45B6] hover:bg-[#3f3aa0] text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            Apply for Resignation
                        </button>
                    )}
                </div>

                {!myResignation ? (
                    /* Empty State */
                    <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center space-y-6 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <FileText className="w-10 h-10" />
                        </div>
                        <div className="max-w-sm mx-auto space-y-2">
                            <h2 className="text-xl font-bold text-gray-900">No Active Resignation</h2>
                            <p className="text-gray-500">You haven't submitted any resignation requests yet. If you are planning to leave, you can start the process here.</p>
                        </div>
                        <button
                            onClick={() => router.push(`/${tenant}/resignation/apply`)}
                            className="inline-flex items-center gap-2 text-[#4A45B6] font-bold hover:underline"
                        >
                            Start application process
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    /* Resignation Details */
                    <div className="space-y-6">
                        {/* Status Alert */}
                        <div className={`p-6 rounded-3xl border ${statusConfig[myResignation.status].bg} ${statusConfig[myResignation.status].border} flex items-start gap-4 shadow-sm`}>
                            <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center ${statusConfig[myResignation.status].text} shadow-sm flex-shrink-0`}>
                                {(() => {
                                    const Icon = statusConfig[myResignation.status].icon;
                                    return <Icon className="w-6 h-6" />;
                                })()}
                            </div>
                            <div className="space-y-1">
                                <h3 className={`font-bold ${statusConfig[myResignation.status].text}`}>
                                    {statusConfig[myResignation.status].label}
                                </h3>
                                <p className="text-sm opacity-80 text-gray-600">
                                    {statusConfig[myResignation.status].description}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Details Card */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-gray-900">Application Details</h2>
                                        <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-wider">
                                            Ref: #RES-9042
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Submission Date</p>
                                            <p className="font-bold text-gray-900">{myResignation.submittedDate}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Working Day</p>
                                            <p className="font-bold text-indigo-600">{myResignation.lastWorkingDay}</p>
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Primary Reason</p>
                                            <p className="font-bold text-gray-900">{myResignation.reason}</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-50 space-y-6">
                                        <div className="space-y-3">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Notice Period Policy</h3>
                                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                                                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                <p className="text-xs text-blue-700 leading-relaxed">
                                                    Standard notice period for your role is 90 days. Early release requests are subject to departmental approval and knowledge transfer completion.
                                                </p>
                                            </div>
                                        </div>

                                        {myResignation.documentUrl && (
                                            <div className="space-y-3">
                                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Attached Documents</h3>
                                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3 max-w-sm">
                                                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                                        <FileText className="w-[22px] h-[22px]" stroke="#6366f1" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-gray-800 truncate">Resignation_Letter</p>
                                                        <p className="text-[11px] text-gray-400">PDF Document</p>
                                                    </div>
                                                    <a
                                                        href={myResignation.documentUrl?.startsWith('http')
                                                            ? myResignation.documentUrl
                                                            : myResignation.documentUrl?.startsWith('/')
                                                                ? `http://localhost:8080${myResignation.documentUrl}`
                                                                : `http://${myResignation.documentUrl}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors"
                                                        title="View Document"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Card */}
                            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                <h2 className="text-lg font-bold text-gray-900 mb-8">Process Tracker</h2>
                                <div className="space-y-8 relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-100" />

                                    {myResignation.history.map((step, i) => (
                                        <div key={i} className="flex gap-4 relative">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 border-4 border-white shadow-sm ${step.done ? "bg-emerald-500" : step.active ? "bg-indigo-500" : "bg-gray-200"
                                                }`}>
                                                {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </div>
                                            <div className="space-y-1">
                                                <p className={`text-sm font-bold ${step.active ? "text-indigo-600" : "text-gray-900"
                                                    }`}>
                                                    {step.label}
                                                </p>
                                                <p className="text-[11px] text-gray-400 font-medium">
                                                    {step.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-12 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Next Step</p>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Once the executive review is complete, HR will reach out to you for the final exit documentation and clearance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
