"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, ChevronRight, Home, ChevronLeft } from "lucide-react";

const ISSUE_OPTIONS = ["All Issues", "Late Arrival", "Missed Punch", "Early Exit"];
const STATUS_OPTIONS = ["All Status", "Pending", "Approved", "Rejected"];

const initialRequests = [
    {
        id: 1,
        name: "Arjun Das",
        role: "Senior Backend Dev",
        initials: "AD",
        date: "Apr 8, 2026",
        issueType: "Late Arrival",
        clockIn: "10:42 AM",
        clockOut: "7:18 PM",
        reason: "Metro train delay...",
        status: "Pending",
    },
    {
        id: 2,
        name: "Sonia Kaur",
        role: "Frontend Developer",
        initials: "SK",
        date: "Apr 7, 2026",
        issueType: "Missed Punch",
        clockIn: "9:05 AM",
        clockOut: null,
        reason: "System error...",
        status: "Pending",
    },
    {
        id: 3,
        name: "Vikram Kota",
        role: "DevOps Engineer",
        initials: "VK",
        date: "Apr 4, 2026",
        issueType: "Late Arrival",
        clockIn: "10:12 AM",
        clockOut: "6:50 PM",
        reason: "Doctor appointment...",
        status: "Approved",
    },
    {
        id: 4,
        name: "Priya Sharma",
        role: "UI Designer",
        initials: "PS",
        date: "Apr 3, 2026",
        issueType: "Early Exit",
        clockIn: "9:00 AM",
        clockOut: "3:30 PM",
        reason: "Family emergency...",
        status: "Rejected",
    },
];

function CustomDropdown({ options, value, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            <span
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-sm px-3 h-[38px] text-[13px] text-[#191C1E] cursor-pointer select-none min-w-[130px] justify-between hover:border-[#4A45B6] transition-colors"
            >
                {value}
                <ChevronDown
                    size={11}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </span>

            {open && (
                <span
                    className="absolute left-0 top-full mt-1 bg-white border border-[#E5E7EB] rounded-sm shadow-xl z-50 overflow-hidden flex flex-col"
                    style={{ minWidth: "100%" }}
                >
                    {options.map((opt) => (
                        <span
                            key={opt}
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={`px-4 py-2 text-[13px] cursor-pointer select-none transition-colors whitespace-nowrap ${value === opt
                                ? "bg-[#4A45B6] text-white font-bold"
                                : "text-[#191C1E] hover:bg-[#f5f4ff] hover:text-[#4A45B6]"
                                }`}
                        >
                            {opt}
                        </span>
                    ))}
                </span>
            )}
        </div>
    );
}

function IssueBadge({ type }) {
    const styles = {

        "Late Arrival": "bg-[#8A4CFC1A] text-[#712AE2]",
        "Missed Punch": "bg-[#F8D7DA] text-[#842029]",
        "Early Exit": "bg-[#D1ECF1] text-[#0C5460]",
    };
    return (
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${styles[type] || "bg-gray-100 text-gray-600"}`}>
            {type.toUpperCase().replace(" ", "\u00A0")}
        </span>
    );
}

function StatusBadge({ status }) {
    const map = {
        Pending: { dot: "bg-[#F59E0B]", text: "text-[#856404]" },
        Approved: { dot: "bg-[#006058]", text: "text-[#155724]" },
        Rejected: { dot: "bg-[#BA1A1A]", text: "text-[#721C24]" },
    };

    const s = map[status] || { dot: "bg-gray-400", text: "text-gray-600" };
    return (
        <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            <span className={`text-[12px] font-medium ${s.text}`}>{status}</span>
        </span>
    );
}

export default function RegularizationRequests() {
    const [issueFilter, setIssueFilter] = useState("All Issues");
    const [statusFilter, setStatusFilter] = useState("All Status");
    const [search, setSearch] = useState("");
    const [requests, setRequests] = useState(initialRequests);
    const [page, setPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const filtered = requests.filter((r) => {
        const matchIssue = issueFilter === "All Issues" || r.issueType === issueFilter;
        const matchStatus = statusFilter === "All Status" || r.status === statusFilter;
        const matchSearch =
            search === "" ||
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.role.toLowerCase().includes(search.toLowerCase());
        return matchIssue && matchStatus && matchSearch;
    });

    const clearFilters = () => {
        setIssueFilter("All Issues");
        setStatusFilter("All Status");
        setSearch("");
        setPage(1);
    };

    const handleApprove = (id) =>
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r)));

    const handleReject = (id) =>
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Rejected" } : r)));

    const perPage = 5;
    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div>

                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-4 uppercase tracking-widest font-medium">
                    <Home size={11} />
                    <ChevronRight size={11} className="text-gray-300" />
                    <span className="text-[#4A45B6] cursor-pointer hover:underline transition-colors">Leave & Holidays</span>
                    <ChevronRight size={11} className="text-gray-300" />
                    <span className="text-gray-500">Permission</span>
                </div>

                {/* Page Title */}
                <h1 className="text-[22px] font-bold text-[#191C1E] mb-0.5">Regularization Requests</h1>
                <p className="text-[13px] text-gray-400 mb-5">Permission Requests</p>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-5 bg-[#F2F4F6]">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-white border border-[#E5E7EB]
                     rounded-sm px-3 h-[38px] flex-1 min-w-[200px] max-w-sm hover:border-[#4A45B6] transition-colors">
                        <Search size={14} className="text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search by name or employee"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="border-none outline-none text-[13px] text-[#191C1E] w-full bg-transparent
                             placeholder:text-gray-400"
                        />
                    </div>

                    <CustomDropdown options={ISSUE_OPTIONS} value={issueFilter} onChange={(v) => { setIssueFilter(v); setPage(1); }} />
                    <CustomDropdown options={STATUS_OPTIONS} value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1); }} />

                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 text-[13px] text-[#4A45B6] cursor-pointer ml-auto hover:opacity-70 transition-opacity"
                    >
                        <X size={14} strokeWidth={2.5} />
                        Clear Filters
                    </button>
                </div>

                {/* Table Card */}
                <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[#F2F4F680]">
                                    {["Employee", "Date", "Issue Type", "Clock In", "Clock Out", "Reason", "Status", "Actions"].map((h) => (
                                        <th
                                            key={h}

                                            className="text-left text-[11px] font-semibold text-[#434655] uppercase tracking-wide px-4 py-3 border-b border-[#E5E7EB] whitespace-nowrap"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12 text-[13px] text-gray-400">
                                            No requests found matching your filters.
                                        </td>
                                    </tr>
                                ) : (
                                    paginated.map((r, i) => (
                                        <tr
                                            key={r.id}
                                            className={`transition-colors hover:bg-[#fafafa] ${i !== paginated.length - 1 ? "border-b border-[#F3F4F6]" : ""}`}
                                        >
                                            {/* Employee */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-[34px] h-[34px] rounded-full bg-[#e0dff9] flex items-center justify-center text-[12px] font-bold text-[#4A45B6] shrink-0">
                                                        {r.initials}
                                                    </div>
                                                    <div>
                                                        <div className="text-[13px] font-semibold text-[#191C1E] whitespace-nowrap">{r.name}</div>
                                                        <div className="text-[11px] text-gray-400">{r.role}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-3 text-[13px] text-[#191C1E] whitespace-nowrap">{r.date}</td>

                                            {/* Issue Type */}
                                            <td className="px-4 py-3"><IssueBadge type={r.issueType} /></td>

                                            {/* Clock In */}
                                            <td className="px-4 py-3 text-[13px] text-[#191C1E] whitespace-nowrap">{r.clockIn}</td>

                                            {/* Clock Out */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {r.clockOut ? (
                                                    <span className="text-[13px] text-[#191C1E]">{r.clockOut}</span>
                                                ) : (
                                                    <span className="text-[13px] font-semibold text-[#BA1A1A]">Missing</span>
                                                )}
                                            </td>


                                            {/* Reason */}
                                            <td className="px-4 py-3 text-[13px] text-[#434655] max-w-[140px] truncate">{r.reason}</td>

                                            {/* Status */}
                                            <td className="px-4 py-3"><StatusBadge status={r.status} /></td>

                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                {r.status === "Pending" ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            onClick={() => setSelectedRequest(r)}
                                                            className="border border-[#4A45B6] cursor-pointer text-[#4A45B6] rounded-sm px-3 py-1 text-[12px] font-semibold hover:bg-[#f5f4ff] transition-colors"
                                                        >
                                                            view
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprove(r.id)}

                                                            className="bg-[#45B663] cursor-pointer text-white rounded-sm
                                                             px-3 py-1 text-[12px] font-semibold hover:bg-[#3730a3] 
                                                             transition-colors"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(r.id)}
                                                            className=" 

                                                            text-[#BA1A1A] rounded-sm px-3 py-1 text-[12px] 
                                                            cursor-pointer 
                                                            font-semibold 
                                                            bg-[#FFDAD680]
                                                            hover:bg-[#fff5f5] 

                                                            transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[12px] text-[ #434655] font-medium">Done</span>
                                                )}
                                            </td>
                                        </tr>

                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#F3F4F6]">
                        <span className="text-[12px] text-gray-400">
                            Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} requests
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={`w-[30px] h-[30px] rounded-sm border border-[#E5E7EB] bg-white text-[13px] flex items-center justify-center transition-colors ${page === 1 ? "opacity-50 cursor-not-allowed" : "text-gray-500 hover:border-[#4A45B6] hover:text-[#4A45B6]"}`}
                            >
                                <ChevronLeft size={14} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setPage(n)}
                                    className={`w-[30px] h-[30px] rounded-sm border text-[13px] font-semibold flex items-center justify-center transition-colors ${page === n
                                        ? "bg-[#4A45B6] text-white border-[#4A45B6]"
                                        : "bg-white text-[#191C1E] border-[#E5E7EB] hover:border-[#4A45B6] hover:text-[#4A45B6]"
                                        }`}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className={`w-[30px] h-[30px] rounded-sm border border-[#E5E7EB] bg-white text-[13px] flex items-center justify-center transition-colors ${page === totalPages ? "opacity-50 cursor-not-allowed" : "text-gray-500 hover:border-[#4A45B6] hover:text-[#4A45B6]"}`}
                            >
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Modal */}
            <ViewModal
                request={selectedRequest}
                onClose={() => setSelectedRequest(null)}
            />
        </div>
    );
}

function ViewModal({ request, onClose }) {
    if (!request) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#191C1E4D] backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-sm shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-[#F3F4F6] flex items-center justify-between bg-white">
                    <h2 className="text-[16px] font-bold text-[#191C1E]">Regularization Details</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-[#F3F4F6] text-gray-400 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="flex items-center gap-3.5 mb-6">
                        <div className="w-12 h-12 rounded-full bg-[#e0dff9] flex items-center justify-center text-[16px] font-bold text-[#4A45B6] shrink-0">
                            {request.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-[15px] font-bold text-[#191C1E] truncate">{request.name}</h3>
                            <p className="text-[12px] text-gray-400 truncate">{request.role}</p>
                        </div>
                        <StatusBadge status={request.status} />
                    </div>

                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Issue Type</p>
                                <IssueBadge type={request.issueType} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Date</p>
                                <p className="text-[13px] text-[#191C1E] font-semibold">{request.date}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Clock In</p>
                                <p className="text-[13px] text-[#191C1E] font-semibold">{request.clockIn}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Clock Out</p>
                                <p className="text-[13px] text-[#191C1E] font-semibold">{request.clockOut || "Missing"}</p>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Reason for Regularization</p>
                            <div className="text-[13px] text-[#434655] bg-[#F9FAFB] p-3 rounded-sm border border-[#F3F4F6] leading-relaxed italic">
                                "{request.reason}"
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-white border-t border-[#F3F4F6] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 h-9 bg-[#4A45B6] text-white rounded-sm text-[12px] font-bold hover:bg-[#3d38a0] transition-colors shadow-sm cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
