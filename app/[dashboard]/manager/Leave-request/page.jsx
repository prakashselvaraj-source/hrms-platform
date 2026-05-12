"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import {
    ChevronRight, HomeIcon, Calendar, ChevronDown, Download, AlertTriangle,
    Check, XCircle, ChevronLeft, X, AlertCircle, Clock
} from "lucide-react";
import { getAllLeaveRequests, updateLeaveStatus } from "@/services/leaveService";
import { useTenant } from "@/hooks/useTenant";
import { toast } from "react-hot-toast";
const typeOptions = ["All Types", "CL", "SL", "EL", "ML", "PL"];
const statusOptions = ["All Status", "Pending", "Approved", "Rejected"];
const monthOptions = ["This Month", "Last Month", "This Quarter"];

/* ─── Reusable Dropdown ─── */
function Dropdown({ value, options, onChange, withCalIcon }) {
    const [open, setOpen] = useState(false);
    const wrapRef = useRef(null);

    useEffect(() => {
        const close = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <span className="relative inline-block" ref={wrapRef}>
            <span
                onClick={() => setOpen((o) => !o)}
                className={`inline-flex items-center gap-2 px-3.5 py-[7px] rounded-md border text-[13px] font-medium cursor-pointer select-none transition-all whitespace-nowrap
          ${open
                        ? "bg-white border-[#4A45B6] text-[#4A45B6] shadow-sm"
                        : "bg-white border-[#E5E7EB] text-[#374151] hover:border-slate-300 hover:shadow-sm"
                    }`}
            >
                {withCalIcon && <Calendar size={12} className="shrink-0 text-slate-400" />}
                {value}
                <ChevronDown
                    size={13}
                    className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180 text-[#4A45B6]" : "text-slate-400"}`}
                />
            </span>

            {open && (
                <span
                    className="absolute left-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-md shadow-xl z-50 overflow-hidden flex flex-col"
                    style={{ minWidth: "100%" }}
                >
                    {options.map((opt) => (
                        <span
                            key={opt}
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={`px-4 py-2 text-[13px] cursor-pointer select-none transition-colors whitespace-nowrap
                ${value === opt
                                    ? "bg-[#4A45B6] text-white font-bold"
                                    : "text-[#191C1E] hover:bg-slate-50 hover:text-[#4A45B6]"
                                }`}
                        >
                            {opt}
                        </span>
                    ))}
                </span>
            )}
        </span>
    );
}

/* ─── Status Pill ─── */
function StatusPill({ status }) {
    const styles = {
        "Approved": "bg-[#007B711A] text-[#006058] border-[#007B711A]",
        "Rejected": "bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]",
        "Pending": "bg-[#FFDAD61A] text-[#BA1A1A] border-[#FFDAD61A]"
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border
         ${styles[status] || styles["Pending"]} transition-all`}>
            {status.toUpperCase()}
        </span>
    );
}

/* ─── Reject Modal ─── */
function RejectModal({ request, onConfirm, onCancel }) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState(false);
    const [shaking, setShaking] = useState(false);
    const textareaRef = useRef(null);

    useEffect(() => {
        const t = setTimeout(() => textareaRef.current?.focus(), 120);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const handleKey = (e) => { if (e.key === "Escape") onCancel(); };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onCancel]);

    const handleConfirm = () => {
        if (!reason.trim()) {
            setError(true);
            setShaking(true);
            setTimeout(() => setShaking(false), 400);
            textareaRef.current?.focus();
            return;
        }
        onConfirm(request.id, reason.trim());
    };

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            style={{ background: "rgba(15,20,30,0.45)", backdropFilter: "blur(3px)", animation: "fadeInOverlay 0.18s ease" }}
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <div className="modal-slide bg-white rounded-2xl w-full max-w-[460px] shadow-2xl overflow-hidden">
                <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100">
                    <div>
                        <p className="text-[17px] font-bold text-slate-900 leading-tight">Reject Leave Request</p>
                        <p className="text-[13px] text-slate-500 mt-1">
                            Rejecting leave for <strong className="text-slate-700">{request.name}</strong>
                        </p>
                    </div>
                    <button onClick={onCancel} className="w-7 h-7 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors ml-3 mt-0.5 shrink-0">
                        <X size={13} className="text-slate-500" />
                    </button>
                </div>
                <div className="px-6 py-5">
                    <div className="flex items-center gap-3 bg-[#FFFBEB] rounded-sm px-4 py-3 mb-5">
                        <AlertTriangle size={14} className="text-[#A50000] shrink-0 mt-0.5" />
                        <p className="text-[12.5px] text-amber-800 leading-relaxed">The employee will be notified with your reason. This action can be reviewed by HR.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[12px] font-medium"><Calendar size={13} className="text-slate-400" /> {request.dateRange}</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[12px] font-medium"><Clock size={13} className="text-slate-400" /> {request.days}</span>
                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[11px] font-bold ${request.leaveColor}`}>{request.leaveType}</span>
                    </div>
                    <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Rejection Reason <span className="text-red-500">*</span></label>
                    <div className={shaking ? "shake-it" : ""}>
                        <textarea ref={textareaRef} value={reason} onChange={(e) => { setReason(e.target.value); if (e.target.value.trim()) setError(false); }} placeholder="Please provide a reason for rejection…" maxLength={300} rows={4} className={`w-full resize-y rounded-lg px-3.5 py-3 text-[13px] text-slate-800 leading-relaxed font-[inherit] outline-none transition-all ${error ? "border-[1.5px] border-red-400 bg-red-50 focus:border-red-500" : "border-[1.5px] border-slate-200 bg-slate-50 focus:border-[#4A45B6] focus:bg-white"}`} />
                    </div>
                    {error && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <AlertCircle size={12} className="text-red-500" />
                            <p className="text-[12px] text-red-500">Please provide a reason before confirming.</p>
                        </div>
                    )}
                    <p className="text-[11.5px] text-slate-400 mt-1.5">{reason.length}/300 characters</p>
                </div>
                <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
                    <button onClick={onCancel} className="px-4 py-2 rounded-sm border border-[#DADADA] bg-white text-[#999999] text-[13px] font-semibold cursor-pointer hover:bg-slate-100 transition-colors">Cancel</button>
                    <button onClick={handleConfirm} className={`px-5 py-2 rounded-sm border border-[#AF0000] text-[#AF0000] text-[13px] font-bold cursor-pointer transition-colors ${reason.trim() ? "border-red-600 bg-red-600 text-white hover:bg-red-700" : "text-[#AF0000] cursor-not-allowed"}`}>Confirm Rejection</button>
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page Component ─── */
export default function LeaveRequests() {
    const tenant = useTenant();
    const [activeType, setActiveType] = useState("All Types");
    const [activeStatus, setActiveStatus] = useState("All Status");
    const [activeMonth, setActiveMonth] = useState("This Month");
    const [page, setPage] = useState(1);
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const [pagination, setPagination] = useState({ totalPages: 1, totalElements: 0 });
    const [loading, setLoading] = useState(true);
    const [rejectingRequest, setRejectingRequest] = useState(null);

    const scrollRef = useRef(null);
    const perPage = 10;

    const fetchData = useCallback(async () => {
        if (!tenant) return;
        setLoading(true);
        try {
            const res = await getAllLeaveRequests(tenant, page - 1, perPage);
            const rawData = res.data?.data || [];
            
            const formatted = rawData.map(lr => {
                const start = new Date(lr.startDate);
                const end = new Date(lr.endDate);
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                
                const initials = lr.employeeName?.split(" ").map(n => n[0]).join("") || "U";
                const colors = ["bg-pink-100 text-pink-700", "bg-violet-100 text-violet-700", "bg-teal-100 text-teal-700", "bg-emerald-100 text-emerald-700", "bg-rose-100 text-rose-700"];
                const colorIdx = (lr.employeeName?.length || 0) % colors.length;

                return {
                    id: lr.id,
                    name: lr.employeeName,
                    role: lr.employeeDesignation || "Employee",
                    avatar: initials,
                    avatarColor: colors[colorIdx],
                    leaveType: lr.leaveType,
                    leaveColor: lr.leaveType === "SL" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600",
                    dateRange: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { day: 'numeric' })}`,
                    days: `${diffDays}d`,
                    appliedOn: new Date(lr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    status: lr.status?.charAt(0).toUpperCase() + lr.status?.slice(1).toLowerCase() || "Pending",
                    actionable: lr.status === "PENDING",
                    approved: lr.status === "APPROVED",
                    rejected: lr.status === "REJECTED"
                };
            });

            setRequests(formatted);
            if (res.data?.stats) setStats(res.data.stats);
            if (res.data?.pagination) setPagination(res.data.pagination);
        } catch (error) {
            console.error("Error fetching leaves:", error);
            toast.error("Failed to load leave requests");
        } finally {
            setLoading(false);
        }
    }, [tenant, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApprove = async (id) => {
        try {
            await updateLeaveStatus(tenant, id, "APPROVED");
            toast.success("Leave approved successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to approve leave");
        }
    };

    const handleConfirmReject = async (id, reason) => {
        try {
            await updateLeaveStatus(tenant, id, "REJECTED");
            toast.success("Leave rejected successfully");
            handleClose();
            fetchData();
        } catch (error) {
            toast.error("Failed to reject leave");
        }
    };

    const openModal = (request) => {
        setRejectingRequest(request);
        if (scrollRef.current) scrollRef.current.style.overflow = "hidden";
    };

    const handleClose = () => {
        setRejectingRequest(null);
        if (scrollRef.current) scrollRef.current.style.overflow = "auto";
    };

    const filtered = requests; // Filtering is handled by backend if we send params, otherwise we can filter local page data
    const totalPages = pagination.totalPages;

    const totalPending = stats.pending;
    const totalApproved = stats.approved;
    const totalRejected = stats.rejected;
    const lopWarning = requests.find((r) => r.flag === "LOP RISK" && r.status === "Pending");

    const handleExport = () => {
        const exportData = requests.map((req) => ({
            "Employee Name": req.name,
            "Role": req.role,
            "Leave Type": req.leaveType,
            "Date Range": req.dateRange,
            "Days": req.days,
            "Applied On": req.appliedOn,
            "Status": req.status,
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leave Requests");
        ws["!cols"] = [
            { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 18 },
            { wch: 8 }, { wch: 12 }, { wch: 15 }
        ];
        const timestamp = new Date().toISOString().split("T")[0];
        XLSX.writeFile(wb, `Leave_Requests_Report_${timestamp}.xlsx`);
    };

    return (
        <>
            {/* ── Reject Modal ── */}
            {rejectingRequest && (
                <RejectModal
                    request={rejectingRequest}
                    onConfirm={handleConfirmReject}
                    onCancel={handleClose}
                />
            )}

            <div ref={scrollRef} className="min-h-screen p-4 sm:p-6 lg:p-8" style={{ overflowY: "auto" }}>

                {/* ── Breadcrumb ── */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-5 uppercase tracking-widest font-medium">
                    <HomeIcon size={11} className="text-slate-400" />
                    <span className="hover:text-[#191C1E] cursor-pointer transition-colors">Leave & Holidays</span>
                    <span className="text-slate-300"><ChevronRight size={11} /></span>
                    <span className="text-[#4A45B6] font-semibold">Leave Request</span>
                </div>

                {/* ── Title + filter row ── */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                    <div>
                        <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Leave Requests</h1>
                        <p className="text-[13px] text-[#191C1E] mt-0.5">Review and manage employee absence schedules</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Dropdown
                            value={activeType}
                            options={typeOptions}
                            onChange={(v) => { setActiveType(v); setPage(1); }}
                        />
                        <Dropdown
                            value={activeStatus}
                            options={statusOptions}
                            onChange={(v) => { setActiveStatus(v); setPage(1); }}
                        />
                        <Dropdown
                            value={activeMonth}
                            options={monthOptions}
                            onChange={setActiveMonth}
                            withCalIcon
                        />
                        <span
                            onClick={handleExport}
                            className="inline-flex items-center gap-1.5 bg-[#4A45B6] hover:bg-[#3b37a3] active:bg-[#332f91] text-white text-[13px] font-semibold px-4 py-[7px] rounded-md cursor-pointer select-none transition-colors whitespace-nowrap"
                        >
                            <Download size={13} />
                            Export Report
                        </span>
                    </div>
                </div>

                {/* ── LOP Warning banner ── */}
                {lopWarning && (
                    <div className="flex items-center gap-3 bg-[#FFDAD6] border-l-4 border-[#BA1A1A] rounded-sm px-4 py-3 mb-5">
                        <AlertTriangle size={15} className="text-[#BA1A1A] shrink-0 mt-0.5" />
                        <div>
                            <p className="text-[13px] font-bold text-[#93000A]">LOP Warning</p>
                            <p className="text-[12px] text-[#93000A] mt-0.5">
                                Priya Sharma has already used 2 leaves this month. This request will result in Loss of Pay.
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Table ── */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto mb-4">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-[#F2F4F680]">
                                <th className="text-left px-5 py-3 text-[11px] font-semibold text-[#434655] uppercase tracking-wider">Employee</th>
                                <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#434655] uppercase tracking-wider">
                                    <span className="block leading-tight">Leave</span>
                                    <span className="block leading-tight">Type</span>
                                </th>
                                <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#434655] uppercase tracking-wider">
                                    <span className="block leading-tight">Date</span>
                                    <span className="block leading-tight">Range</span>
                                </th>
                                <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#434655] uppercase tracking-wider">Days</th>
                                <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#434655] uppercase tracking-wider hidden sm:table-cell">
                                    <span className="block leading-tight">Applied</span>
                                    <span className="block leading-tight">On</span>
                                </th>
                                <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#434655] uppercase tracking-wider hidden md:table-cell">Flags</th>
                                <th className="text-left px-3 py-3 text-[11px] font-semibold text-[#434655] uppercase tracking-wider">Status</th>
                                <th className="text-right px-5 py-3 text-[11px] font-semibold text-[#434655] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-14 text-slate-400 text-sm">
                                        No leave requests match your filters.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((item, index) => (
                                    <tr key={`${item.id}-${index}`} className="hover:bg-slate-50/60 transition-colors">

                                        {/* Employee */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${item.avatarColor}`}>
                                                    {item.avatar}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-[#191C1E] text-[13px] truncate leading-tight">{item.name}</p>
                                                    <p className="text-[#434655] text-[11px] truncate">{item.role}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Leave Type */}
                                        <td className="px-3 py-3.5">
                                            <span className={`inline-flex items-center justify-center w-8 h-6 rounded text-[11px] font-bold ${item.leaveColor}`}>
                                                {item.leaveType}
                                            </span>
                                        </td>

                                        {/* Date Range */}
                                        <td className="px-3 py-3.5">
                                            <span className={`text-[13px] text-[#191C1E] ${item.status === "Rejected" ? "line-through text-slate-400" : ""}`}>
                                                {item.dateRange}
                                            </span>
                                        </td>

                                        {/* Days */}
                                        <td className="px-3 py-3.5">
                                            <span className="text-[13px] font-medium text-[#191C1E]">{item.days}</span>
                                        </td>

                                        {/* Applied On */}
                                        <td className="px-3 py-3.5 hidden sm:table-cell">
                                            <span className="text-[13px] text-[#191C1E]">{item.appliedOn}</span>
                                        </td>

                                        {/* Flags */}
                                        <td className="px-3 py-3.5 hidden md:table-cell">
                                            {item.flag ? (
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${item.flagColor}`}>
                                                    {item.flag}
                                                </span>
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-3 py-3.5">
                                            <StatusPill status={item.status} />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-2">
                                                {item.actionable ? (
                                                    <>
                                                        <span
                                                            onClick={() => handleApprove(item.id)}
                                                            className="cursor-pointer inline-flex items-center px-3 py-1 rounded-sm text-[12px] font-semibold border border-[#C1CAB3] text-[#02911A] bg-[#DCFCE7] hover:bg-emerald-100 transition-colors select-none"
                                                        >
                                                            APPROVE
                                                        </span>
                                                        <span
                                                            onClick={() => openModal(item)}
                                                            className="cursor-pointer inline-flex items-center px-3 py-1 rounded-sm text-[12px] font-semibold border border-[#C1CAB3] text-[#910202] bg-[#FEE2E2] hover:bg-red-100 transition-colors select-none"
                                                        >
                                                            REJECT
                                                        </span>
                                                    </>
                                                ) : item.approved ? (
                                                    <Check size={18} className="text-emerald-500" />
                                                ) : item.rejected ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <XCircle size={18} className="text-red-400" />
                                                        {item.rejectionReason && (
                                                            <span
                                                                className="text-[11px] text-slate-400 max-w-[90px] truncate"
                                                                title={item.rejectionReason}
                                                            >
                                                                "{item.rejectionReason}"
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* ── Pagination ── */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
                        <p className="text-[12px] text-[#434655]">
                            Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} requests
                        </p>
                        <div className="inline-flex items-center gap-1">
                            <span
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all select-none
                  ${page === 1 ? "text-slate-300 cursor-default" : "text-[#191C1E] hover:bg-slate-200 cursor-pointer"}`}
                            >
                                <ChevronLeft size={12} />
                            </span>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <span
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-all select-none cursor-pointer
                    ${page === p ? "bg-[#4A45B6] text-white" : "text-[#191C1E] hover:bg-slate-200"}`}
                                >
                                    {p}
                                </span>
                            ))}
                            <span
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all select-none
                  ${page === totalPages ? "text-slate-300 cursor-default" : "text-[#191C1E] hover:bg-slate-200 cursor-pointer"}`}
                            >
                                <ChevronRight size={12} />
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Summary footer cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                    {[
                        {
                            label: "Total Pending",
                            value: totalPending,
                            badge: "Action Required",
                            badgeColor: "bg-[#FFF4E5] text-[#B26100]",
                            bg: "bg-[#F8FAFC]"
                        },
                        {
                            label: "Total Approved",
                            value: totalApproved,
                            badge: "This Month",
                            badgeColor: "bg-[#E6F9F6] text-[#007B71]",
                            bg: "bg-[#F8FAFC]"
                        },
                        {
                            label: "Total Rejected",
                            value: totalRejected,
                            badge: "YTD",
                            badgeColor: "bg-[#F2F4F6] text-[#434655]",
                            bg: "bg-[#F8FAFC]"
                        },
                    ].map(({ label, value, badge, badgeColor, bg }) => (
                        <div key={label} className={`${bg} rounded-[20px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-[140px] transition-all hover:shadow-md`}>
                            <p className="text-[14px] font-medium text-slate-500">{label}</p>
                            <div className="flex items-end justify-between">
                                <p className="text-[42px] font-bold text-slate-900 leading-none tracking-tight">
                                    {String(value).padStart(2, "0")}
                                </p>
                                <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${badgeColor}`}>
                                    {badge}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </>
    );
}