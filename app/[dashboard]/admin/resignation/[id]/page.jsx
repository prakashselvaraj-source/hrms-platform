"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getResignationById, updateResignationStatus } from "@/services/resignationService";
import { useTenant } from "@/hooks/useTenant";
import { ChevronLeft, Download, FileText, GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";

const AVATAR_COLORS = [
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-emerald-400 to-emerald-600",
    "from-orange-400 to-orange-600",
    "from-red-400 to-red-600",
    "from-teal-400 to-teal-600",
    "from-indigo-400 to-indigo-600",
    "from-pink-400 to-pink-600",
];

function Avatar({ name, colorIdx = 0, size = "lg" }) {
    const initials = (name || "Unknown").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const sz = size === "lg" ? "w-16 h-16 text-lg" : "w-10 h-10 text-xs";
    return (
        <div className={`${sz} rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIdx % AVATAR_COLORS.length]} flex items-center justify-center text-white font-semibold flex-shrink-0 ring-2 ring-white`}>
            {initials}
        </div>
    );
}

export default function ResignationDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const tenant = useTenant();
    const { id } = params;

    const [emp, setEmp] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!tenant || !id) return;
            try {
                setLoading(true);
                const res = await getResignationById(id, tenant);
                const item = res.data;

                const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const resDt = new Date(item.resignationDate);
                const lastDt = new Date(item.lastWorkingDay);
                const diffDays = Math.round((lastDt - resDt) / 86400000);
                const noticeStr = diffDays <= 0 ? "0 Days" : diffDays >= 60 ? `${Math.round(diffDays / 30)} Months` : `${diffDays} Days`;

                setEmp({
                    id: item.id,
                    name: item.employeeName || "Unknown",
                    email: item.employeeEmail || "",
                    role: item.employeeRole || "Employee",
                    empId: item.employeeCode || `EMP-${item.employeeId}`,
                    colorIdx: 0, // Simplified for single view
                    resignationDate: fmt(item.resignationDate),
                    lastWorkingDay: fmt(item.lastWorkingDay),
                    noticePeriod: `${diffDays}\nDays`,
                    status: item.status,
                    hasDocs: !!item.documentUrl,
                    documentUrl: item.documentUrl,
                    resignDateFull: fmt(item.resignationDate),
                    resignDateSub: "Submitted via Portal",
                    lastDayFull: fmt(item.lastWorkingDay),
                    lastDaySub: `${noticeStr} Remaining`,
                    noticeFull: noticeStr,
                    noticeSub: "Standard Corporate Policy",
                    reason: item.reason,
                    description: item.description,
                    history: [
                        { label: "Submitted", date: fmt(item.resignationDate), done: true },
                        { label: "Executive Review", date: item.status === "PENDING" ? "In Progress" : item.status, active: item.status === "PENDING", done: item.status !== "PENDING" },
                        { label: "HR Review", date: item.status === "APPROVED" ? "Approved" : "pending", done: item.status === "APPROVED" },
                    ],
                });
            } catch (error) {
                console.error("Error fetching resignation details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [tenant, id]);

    const handleApprove = async () => {
        try {
            await updateResignationStatus(id, "APPROVED", tenant);
            setEmp((prev) => ({
                ...prev, status: "APPROVED",
                history: [
                    { label: "Submitted", date: prev.history[0]?.date || "", done: true },
                    { label: "Executive Review", date: "Approved", done: true },
                    { label: "HR Review", date: "Approved", done: true },
                ],
            }));
        } catch (error) {
            console.error("Error approving resignation:", error);
            alert("Failed to approve resignation.");
        }
    };

    const handleReject = async () => {
        try {
            await updateResignationStatus(id, "REJECTED", tenant);
            setEmp((prev) => ({
                ...prev, status: "REJECTED",
                history: [
                    { label: "Submitted", date: prev.history[0]?.date || "", done: true },
                    { label: "Executive Review", date: "Rejected", done: true },
                    { label: "HR Review", date: "N/A", done: false },
                ],
            }));
        } catch (error) {
            console.error("Error rejecting resignation:", error);
            alert("Failed to reject resignation.");
        }
    };

    if (loading) {
        return <div className="min-h-screen p-8 flex items-center justify-center">Loading details...</div>;
    }

    if (!emp) {
        return <div className="min-h-screen p-8 flex items-center justify-center">Resignation not found.</div>;
    }

    const statusBadge = { APPROVED: "bg-emerald-100 text-emerald-700", PENDING: "bg-amber-100 text-amber-700", REJECTED: "bg-red-100 text-red-700" }[emp.status] || "bg-gray-100 text-gray-600";

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto space-y-6">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium mb-4"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Resignations
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex">
                        <div className="w-1.5 flex-shrink-0" style={{ background: "linear-gradient(180deg,#7c3aed,#4f46e5)" }} />
                        <div className="flex-1 p-6 sm:p-8 space-y-8">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Avatar name={emp.name} colorIdx={emp.colorIdx} size="lg" />
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900">{emp.name}</h2>
                                        <p className="text-sm text-gray-500">{emp.role}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge}`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />{emp.status}
                                            </span>
                                            <span className="text-xs text-gray-400 font-medium">ID: {emp.empId}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    {emp.status === "PENDING" && (
                                        <>
                                            <button onClick={handleReject} className="text-sm bg-[#F2F4F6] font-semibold px-5 py-2.5 rounded-lg border border-gray-200 text-[#191C1E] hover:bg-gray-50 transition-colors">Reject Request</button>
                                            <button onClick={handleApprove} className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-[#4A45B6] hover:bg-indigo-700 text-white transition-colors shadow-md shadow-indigo-200">Approve Resignation</button>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {/* Info cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { label: "Resignation Date", val: emp.resignDateFull, sub: emp.resignDateSub, color: "text-gray-800" },
                                    { label: "Last Working Day", val: emp.lastDayFull, sub: emp.lastDaySub, color: "text-indigo-600" },
                                    { label: "Notice Period", val: emp.noticeFull, sub: emp.noticeSub, color: "text-gray-800" },
                                ].map((c) => (
                                    <div key={c.label} className="bg-gray-50 border border-gray-100 rounded-xl p-5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{c.label}</p>
                                        <p className={`text-lg font-bold ${c.color}`}>{c.val}</p>
                                        <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Reason + Docs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reason for Departure</p>
                                        <div className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-500" /><span className="text-sm font-semibold text-indigo-600">{emp.reason}</span></div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Detailed Description</p>
                                        <p className="text-sm text-gray-600 leading-relaxed bg-white p-3 rounded-lg border border-gray-100">{emp.description}</p>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-3">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Supporting Documents</p>
                                    {!emp.documentUrl ? (
                                        <div className="h-full flex items-center justify-center min-h-[100px] bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <p className="text-xs text-gray-400 italic">No documents attached.</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition-colors">
                                            <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                                                <FileText className="w-6 h-6" stroke="#6366f1" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">Resignation_Document.pdf</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Uploaded on {emp.resignDateFull}</p>
                                            </div>
                                            <a href={emp.documentUrl} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 text-gray-500 transition-all shadow-sm">
                                                <Download className="w-4 h-4" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Process History */}
                            <div className="border-t border-gray-100 pt-6">
                                <div className="flex items-center justify-between mb-6">
                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Process History</p>
                                </div>
                                <div className="flex items-start">
                                    {emp.history.map((step, i) => (
                                        <div key={i} className="flex flex-1 items-start">
                                            <div className="flex flex-col items-center flex-1">
                                                <div className="flex items-center w-full">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${step.done ? "bg-emerald-500 border-emerald-500" : step.active ? "bg-white border-indigo-500" : "bg-white border-gray-200"}`}>
                                                        {step.done ? (
                                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                                                        ) : step.active ? (
                                                            <div className="w-3 h-3 rounded-full border-2 border-indigo-500" />
                                                        ) : (
                                                            <div className="w-3 h-3 rounded-full bg-gray-200" />
                                                        )}
                                                    </div>
                                                    {i < emp.history.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${step.done ? "bg-emerald-300" : "bg-gray-200"}`} />}
                                                </div>
                                                <div className="mt-3 text-center pr-2">
                                                    <p className={`text-sm font-semibold ${step.active ? "text-indigo-600" : step.done ? "text-gray-800" : "text-gray-400"}`}>{step.label}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{step.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
