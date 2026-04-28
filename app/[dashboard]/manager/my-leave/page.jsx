"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    CalendarDays,
    Plus,
    CheckCircle2,
    XCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    Camera,
    Snowflake,
    Star,
    Zap,
    Award,
    Eye,
    Pencil,
    Trash2,
    MoreVertical,
    X,
    AlertCircle,
} from "lucide-react";

const leaveStats = [
    { label: "SICK LEAVE", used: "04", total: "/10", sub: null, note: null, WatermarkIcon: Camera },
    { label: "COMP OFF", used: "02", total: "/0", sub: "5", note: null, WatermarkIcon: Snowflake },
    { label: "CASUAL LEAVE", used: "07", total: "/1", sub: "4", note: null, WatermarkIcon: Star },
    { label: "OPTIONAL", used: "01", total: "/02", sub: null, note: null, WatermarkIcon: Zap },
    { label: "LOP", used: "00", total: "", sub: null, note: "Excellent Standing", WatermarkIcon: AlertCircle },
];

const initialLeaves = [



    { id: "001", type: "CL", typeColor: "bg-[#E2DFFF] text-[#4A45B6]", from: "Mar 20", to: "Mar 20", days: "1d", appliedOn: "Mar 18", reason: "Personal errand", status: "Approved", note: null },
    { id: "002", type: "SL", typeColor: "bg-[#FEF3C7] text-[#B45309]", from: "Feb 14", to: "Feb 14", days: "1d", appliedOn: "Feb 13", reason: "Fever & cold", status: "Approved", note: null },
    { id: "003", type: "CL", typeColor: "bg-violet-100 text-violet-700", from: "Jan 26", to: "Jan 28", days: "3d", appliedOn: "Jan 24", reason: "Extended weekend trip", status: "Rejected", note: "CL max 2 days" },
    { id: "004", type: "EL", typeColor: "bg-emerald-100 text-emerald-700", from: "Dec 23", to: "Dec 27", days: "5d", appliedOn: "Dec 15", reason: "Year-end vacation", status: "Approved", note: null },
];

const StatusBadge = ({ status }) => {
    if (status === "Approved")
        return (

            <span className="inline-flex w-fit justify-center items-center gap-1.5 px-2 py-2 rounded-full
             text-xs font-semibold bg-[#007B71] text-white">
                <CheckCircle2 size={12} /> Approved
            </span>

        );
    if (status === "Rejected")
        return (
            <span className="inline-flex  items-center justify-center 
            gap-1.5 px-2 w-fit py-2 rounded-full text-xs font-semibold 
            bg-[#FFDAD6] text-[#93000A] border border-rose-200">

                <XCircle size={12} /> Rejected
            </span>
        );
    return (
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            <Clock size={12} /> Pending
        </span>
    );
};

/* ── Dropdown Menu ── */

/* ── View Modal ── */
function ViewModal({ row, onClose }) {
    if (!row) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">
                    <X size={16} />
                </button>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Leave Details</h3>
                <div className="space-y-3 text-sm">
                    {[
                        ["Leave ID", row.id],
                        ["Leave Type", row.type],
                        ["From", row.from],
                        ["To", row.to],
                        ["Days", row.days],
                        ["Applied On", row.appliedOn],
                        ["Reason", row.reason],
                        ["Status", row.status],
                        ...(row.note ? [["Note", row.note]] : []),
                    ].map(([label, value]) => (
                        <div key={label} className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-400 font-medium">{label}</span>
                            <span className="text-slate-700 font-semibold">{value}</span>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="mt-5 w-full bg-[#4A45B6] hover:bg-violet-700 text-white text-sm font-semibold py-2.5 rounded-sm transition-colors">
                    Close
                </button>
            </div>
        </div>
    );
}

/* ── Edit Modal ── */
function EditModal({ row, onClose, onSave }) {
    const [form, setForm] = useState({});


    useEffect(() => {
        if (row) setForm({ ...row });
    }, [row]);

    if (!row) return null;

    const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400">
                    <X size={16} />
                </button>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Edit Leave Request</h3>
                <div className="space-y-3 text-sm">
                    {[
                        { label: "From", key: "from" },
                        { label: "To", key: "to" },
                        { label: "Days", key: "days" },
                        { label: "Applied On", key: "appliedOn" },
                        { label: "Reason", key: "reason" },
                    ].map(({ label, key }) => (
                        <div key={key}>
                            <label className="block text-slate-400 font-medium mb-1">{label}</label>
                            <input
                                value={form[key] || ""}
                                onChange={set(key)}
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-700 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                            />
                        </div>
                    ))}
                    <div>
                        <label className="block text-slate-400 font-medium mb-1">Status</label>
                        <select
                            value={form.status || ""}
                            onChange={set("status")}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-700 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition"
                        >
                            {["Approved", "Pending", "Rejected"].map((s) => <option key={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-3 mt-5">
                    <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-sm hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (form.type === "CL" && parseFloat(form.days) > 2) {
                                alert("Casual Leave (CL) cannot exceed 2 days.");
                                return;
                            }
                            onSave(form);
                        }}
                        className="flex-1 bg-[#4A45B6] hover:bg-violet-700 text-white text-sm font-semibold py-2.5 rounded-sm transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Delete Confirm ── */
function DeleteConfirm({ id, onClose, onConfirm }) {
    if (!id) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} className="text-rose-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Delete Leave Request?</h3>
                <p className="text-sm text-slate-400 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-sm hover:bg-slate-50 transition-colors">
                        Cancel
                    </button>
                    <button onClick={() => onConfirm(id)} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold py-2.5 rounded-sm transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Main Component ── */
export default function MyLeaves() {
    const router = useRouter();
    const [view, setView] = useState("ANNUALLY");
    const [filter, setFilter] = useState("All");
    const [leaves, setLeaves] = useState(initialLeaves);
    const [viewRow, setViewRow] = useState(null);
    const [editRow, setEditRow] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [page, setPage] = useState(1);
    const backscrollRef = useRef(null);

    const perPage = 5;

    const filtered = filter === "All" ? leaves : leaves.filter((l) => l.status === filter);
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    useEffect(() => {
        setPage(1);
    }, [filter]);

    const handleSave = (updated) => {
        setLeaves((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
        setEditRow(null);
    };

    const handleDelete = (id) => {
        setLeaves((prev) => prev.filter((l) => l.id !== id));
        setDeleteId(null);
    };

    return (
        <div ref={backscrollRef} className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">

            {/* Modals */}
            <ViewModal row={viewRow}

                onClose={() => setViewRow(null)} />
            <EditModal row={editRow} onClose={() => setEditRow(null)} onSave={handleSave} />
            <DeleteConfirm id={deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} />

            {/* Page Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <span>Leave & Holidays</span>
                        <ChevronRight size={14} />
                        <span className="text-slate-700 font-medium">My Leaves</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Leaves</h1>
                    <p className="text-slate-400 mt-1 text-sm">Apply and track your own leave requests</p>
                </div>
                <button
                    onClick={() => router.push("/manager/My-leave/apply-leave")}
                    className="flex items-center gap-2 bg-[#4A45B6]
                     hover:bg-violet-700 active:scale-95 transition-all 
                     text-white text-sm font-semibold px-5 py-2.5 rounded-sm shadow-md shadow-violet-200"
                >
                    <Plus size={16} /> Apply Leave
                </button>
            </div>

            {/* Leave Report */}

            <div className="bg-white rounded-2xl border-l-4 border-[#4A45B6] shadow-sm mb-6 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-sm bg-violet-50 flex items-center justify-center">
                            <CalendarDays size={16} className="text-[#4A45B6]" />

                        </div>
                        <h2 className="text-base font-semibold text-slate-800">Leave Report</h2>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white">
                        {["ANNUALLY", "MONTHLY"].map((v) => (
                            <button key={v} onClick={() => setView(v)}
                                className={`text-xs font-semibold px-5 py-1.5 rounded-full transition-all ${v === view ? "bg-[#4A45B6] text-white shadow" : "text-slate-400 hover:text-slate-600"}`}>
                                {v}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {leaveStats.map(({ label, used, total, sub, note, WatermarkIcon }) => (
                        <div key={label} className="relative overflow-hidden rounded-2xl
                         bg-violet-100 px-5 pt-5 pb-5 flex flex-col gap-1 min-h-[120px] text-center">
                            <WatermarkIcon size={84} strokeWidth={1.2} className="absolute -bottom-4 -right-4 text-violet-300 opacity-40 pointer-events-none" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] z-10">{label}</span>
                            <div className="flex items-center justify-center gap-1 z-10 mt-1">
                                <span className="text-4xl font-bold text-slate-800 leading-none">{used}</span>
                                <div className="flex flex-col leading-tight ml-0.5">
                                    <span className="text-sm font-semibold text-slate-400">{total}</span>
                                    {sub && <span className="text-sm font-semibold text-slate-400">{sub}</span>}
                                </div>
                            </div>

                            {note && <span className="text-[10px] text-violet-500 font-medium z-10 mt-1">{note}</span>}
                        </div>
                    ))}
                </div>
            </div>


            {/* Leave History Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-6">
                <div className="flex items-center justify-between mb-6 px-6">
                    <h2 className="text-base font-semibold text-slate-800">My Leave History</h2>
                    <div className="flex items-center gap-2 bg-[#F2F4F6] p-2 rounded-sm">

                        {["All", "Pending", "Approved", "Rejected"].map((f) => (
                            <button key={f} onClick={() => setFilter(f)}

                                className={`text-xs font-semibold px-4 py-1.5 rounded-sm transition-all ${filter === f ? "bg-white text-[#4A45B6] " : "text-[#434655] border-slate-200 hover:border-slate-400"}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm px-6">
                        <thead >
                            <tr className="border-b border-slate-100 bg-[#F2F4F6]">
                                {["#", "LEAVE TYPE", "FROM", "TO", "DAYS", "APPLIED ON", "REASON", "STATUS", "ACTION"].map((col) => (
                                    <th key={col} className="text-left text-[11px] font-bold uppercase 
                                    tracking-wider text-[#434655] p-4 whitespace-nowrap">
                                        {col}

                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">No leave requests found.</td>
                                </tr>
                            )}
                            {paginated.map((row) => {
                                const isRejected = row.status === "Rejected";
                                return (
                                    <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                                        <td className="p-5 text-[#434655] text-xs">{row.id}</td>
                                        <td className="py-5 pr-6">

                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${row.typeColor}`}>
                                                {row.type}</span>
                                        </td>

                                        <td className={`py-5 pr-6 font-medium 
                                            ${isRejected ? "text-[#BA1A1A]" :
                                                "text-slate-700"}`}>{row.from}</td>

                                        <td className={`py-5 pr-6 font-medium
                                             ${isRejected ? "text-[#BA1A1A]" : "text-slate-700"}`}>{row.to}</td>
                                        <td className={`py-5 pr-6 font-medium
                                             ${isRejected ? "text-[#BA1A1A]" : "text-slate-700"}`}>{row.days}</td>
                                        <td className="py-5 pr-6 text-slate-500">
                                            {row.appliedOn}</td>
                                        <td className="py-5 pr-6 text-slate-600 
                                        max-w-[140px]">{row.reason}</td>
                                        <td className="py-5 pr-6">
                                            <StatusBadge status={row.status} />
                                        </td>
                                        <td className="py-5">
                                            <div className="flex items-center gap-2">
                                                {row.status === "Rejected" && row.note && (
                                                    <div className="bg-[#F2F4F6] text-[#434655] px-2 py-1 rounded-sm text-[10px] font-bold leading-tight mr-2 text-center">
                                                        {row.note.split(" ").map((word, idx) => (
                                                            <div key={idx}>{word}</div>
                                                        ))}
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => setViewRow(row)}
                                                    className="w-8 h-8 rounded-sm flex items-center justify-center border border-slate-100 text-slate-400
                                                     hover:text-[#4A45B6] hover:bg-violet-50 transition-all cursor-pointer"
                                                    title="View"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setEditRow(row)}
                                                    className="w-8 h-8 rounded-sm flex items-center justify-center border border-slate-100 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(row.id)}
                                                    className="w-8 h-8 rounded-sm flex items-center justify-center border border-slate-100 text-slate-400 hover:text-[#BA1A1A] hover:bg-rose-50 transition-all cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-5 pt-4 px-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                        Showing {paginated.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} leave requests
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className={`w-7 h-7 rounded-sm border border-slate-200 flex items-center justify-center transition-all ${page === 1 ? "opacity-30 cursor-not-allowed" : "text-slate-400 hover:bg-slate-100 cursor-pointer"}`}
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <div className="flex items-center gap-1 px-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setPage(n)}
                                    className={`w-7 h-7 rounded-sm text-xs font-bold transition-all ${page === n ? "bg-[#4A45B6] text-white" : "text-slate-400 hover:bg-slate-50 cursor-pointer"}`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className={`w-7 h-7 rounded-sm border border-slate-200 flex items-center justify-center transition-all ${page === totalPages ? "opacity-30 cursor-not-allowed" : "text-slate-400 hover:bg-slate-100 cursor-pointer"}`}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}