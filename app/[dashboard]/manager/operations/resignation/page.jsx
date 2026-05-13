"use client";

import { useState, useRef, useEffect } from "react";
import {
    Search, Filter, Plus, Eye, Pencil, Trash2, RefreshCw,
    FileText, ChevronLeft, ChevronRight, ChevronDown, X,
    Download, GraduationCap, Upload
} from "lucide-react";
import { useTenant } from "@/hooks/useTenant";
import { getAllResignations, updateResignationStatus } from "@/services/resignationService";
import OperationNavbar from "@/components/layout/OperationNavbar";

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

const REASONS = [
    "Further Studies", "Career Change", "Personal Reasons", "Relocation",
    "Better Opportunity", "Health Issues", "Retirement", "Other",
];

const PER_PAGE_OPTIONS = [5, 10, 15, 20];


const statusStyle = {
    APPROVED: "bg-[#0d9488] text-white",
    PENDING: "bg-[#7c3aed] text-white",
    REJECTED: "bg-[#FFDAD6] text-[#93000A]",
};

// ── Avatar ─────────────────────────────────────────────────
function Avatar({ name, colorIdx = 0, size = "md" }) {
    const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const sz = size === "lg" ? "w-16 h-16 text-lg" : "w-10 h-10 text-xs";
    return (
        <div className={`${sz} rounded-full bg-gradient-to-br ${AVATAR_COLORS[colorIdx % AVATAR_COLORS.length]} flex items-center justify-center text-white font-semibold flex-shrink-0 ring-2 ring-white`}>
            {initials}
        </div>
    );
}

// Modal logic removed, now using separate page



import { useRouter } from "next/navigation";

// ── Main Page ──────────────────────────────────────────────
export default function ResignationsPage() {
    const tenant = useTenant();
    const router = useRouter();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [showFilters, setShowFilters] = useState(true);
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalEntries, setTotalEntries] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [applied, setApplied] = useState({ employee: "", status: "", dateFrom: "", dateTo: "" });

    const [perPageOpen, setPerPageOpen] = useState(false);
    const [empOpen, setEmpOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const perPageRef = useRef(null);
    const empRef = useRef(null);
    const statusRef = useRef(null);
    const scrollref = useRef(null);

    useEffect(() => {
        const fetchResignations = async () => {
            try {
                setLoading(true);
                const res = await getAllResignations(tenant, currentPage, perPage);

                const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                const fmtMulti = (d) => {
                    const dt = new Date(d);
                    return `${dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })},\n${dt.getFullYear()}`;
                };

                const rawData = res.data?.resignations || res.data?.content || (Array.isArray(res.data) ? res.data : []);
                const mappedData = rawData.map((item, idx) => {
                    const resDt = new Date(item.resignationDate);
                    const lastDt = new Date(item.lastWorkingDay);
                    const diffDays = Math.round((lastDt - resDt) / 86400000);
                    const noticeStr = diffDays <= 0 ? "0 Days" : diffDays >= 60 ? `${Math.round(diffDays / 30)} Months` : `${diffDays} Days`;

                    return {
                        id: item.id,
                        name: item.employeeName || "Unknown",
                        email: item.employeeEmail || "",
                        role: item.employeeRole || "Employee",
                        empId: item.employeeCode || `EMP-${item.employeeId}`,
                        colorIdx: idx % AVATAR_COLORS.length,
                        resignationDate: fmtMulti(item.resignationDate),
                        lastWorkingDay: fmtMulti(item.lastWorkingDay),
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
                        docs: [], // Map from attachments
                        history: [
                            { label: "Submitted", date: fmt(item.resignationDate), done: true },
                            { label: "Executive Review", date: item.status === "PENDING" ? "In Progress" : item.status, active: item.status === "PENDING", done: item.status !== "PENDING" },
                            { label: "HR Review", date: item.status === "APPROVED" ? "Approved" : "pending", done: item.status === "APPROVED" },
                        ],
                    };
                });

                setEmployees(mappedData);
                setTotalEntries(res.data.totalElements ?? mappedData.length);
                setTotalPages(res.data.totalPages ?? 1);
            } catch (error) {
                console.error("Error fetching resignations:", error);
            } finally {
                setLoading(false);
            }
        };

        if (tenant) fetchResignations();

        const handler = (e) => {
            if (perPageRef.current && !perPageRef.current.contains(e.target)) setPerPageOpen(false);
            if (empRef.current && !empRef.current.contains(e.target)) setEmpOpen(false);
            if (statusRef.current && !statusRef.current.contains(e.target)) setStatusOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [tenant, currentPage, perPage]);

    const applyFilters = () => {
        setApplied({ employee: selectedEmployee, status: selectedStatus, dateFrom, dateTo });
        setCurrentPage(0);
    };
    const resetFilters = () => {
        setSearch(""); setSelectedEmployee(""); setSelectedStatus(""); setDateFrom(""); setDateTo("");
        setApplied({ employee: "", status: "", dateFrom: "", dateTo: "" });
        setCurrentPage(0);
    };
    const handleSearch = () => {
        setApplied({ employee: search, status: selectedStatus, dateFrom, dateTo });
        setCurrentPage(0);
    };

    const paginated = employees; // Server-side paginated
    const activeFilterCount = [applied.employee, applied.status, applied.dateFrom, applied.dateTo].filter(Boolean).length;



    const pageNumbers = () => {
        const pages = Array.from({ length: totalPages }, (_, i) => i).filter(
            (p) => p >= Math.max(0, currentPage - 1) && p <= Math.min(totalPages - 1, currentPage + 1)
        );
        return pages;
    };

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gray-50" ref={scrollref}>
            <div className="w-full space-y-4 max-w-7xl mx-auto">

                {/* Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-800">Resignations</h1>

                </div>

                {/* Search / Filter card */}
                <div className="bg-[#F2F4F6] rounded-2xl border border-gray-100">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2"><Search className="w-4 h-4 text-gray-400" /></span>
                            <input type="text" placeholder="Search employee..." value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 text-gray-700 placeholder-gray-400" />
                        </div>
                        <button onClick={handleSearch}
                            className="inline-flex items-center gap-2 bg-[#4A45B6] hover:bg-[#4f46e5] text-white text-sm font-semibold px-5 py-2.5 rounded-sm shadow-lg shadow-indigo-900/30 transition-colors self-start sm:self-auto">
                            Search
                        </button>
                        <button onClick={() => setShowFilters((f) => !f)}
                            className="inline-flex items-center gap-2 text-sm text-gray-600 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap bg-[#E6E8EA]">
                            <Filter className="w-4 h-4" /> {showFilters ? "Hide" : "Show"} Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-[#4A45B6] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">{activeFilterCount}</span>
                            )}
                        </button>
                        <div className="inline-flex items-center gap-2 text-sm border border-gray-200 px-4 py-2.5 rounded-xl bg-white whitespace-nowrap">
                            <span className="font-medium text-gray-500 text-xs uppercase tracking-wide">Per Page</span>
                            <div className="relative" ref={perPageRef}>
                                <button
                                    type="button"
                                    onClick={() => setPerPageOpen(!perPageOpen)}
                                    className="flex items-center gap-2 font-semibold text-gray-800 bg-transparent focus:outline-none"
                                >
                                    <span>{perPage}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${perPageOpen ? "rotate-180" : ""}`} />
                                </button>
                                {perPageOpen && (
                                    <ul className="absolute right-0 z-20 mt-2 w-20 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                                        {PER_PAGE_OPTIONS.map((n) => (
                                            <li key={n}>
                                                <button
                                                    type="button"
                                                    onClick={() => { setPerPage(n); setCurrentPage(0); setPerPageOpen(false); }}
                                                    className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${perPage === n ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                                >
                                                    {n}
                                                    {perPage === n && <span className="w-3 text-indigo-500">✓</span>}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="px-4 pb-4 flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-3 border-t border-gray-100 pt-4">
                            <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</label>
                                <div className="relative" ref={empRef}>
                                    <button
                                        type="button"
                                        onClick={() => setEmpOpen(!empOpen)}
                                        className="w-full flex items-center justify-between text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-600"
                                    >
                                        <span className="truncate">{selectedEmployee || "Select Employee"}</span>
                                        <ChevronDown className={`flex-shrink-0 w-3.5 h-3.5 text-gray-400 transition-transform ${empOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {empOpen && (
                                        <ul className="absolute z-20 mt-2 w-full max-h-50 overflow-y-auto bg-white border border-gray-100 rounded-xl shadow-lg">
                                            <li key="empty">
                                                <button
                                                    type="button"
                                                    onClick={() => { setSelectedEmployee(""); setEmpOpen(false); }}
                                                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${!selectedEmployee ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                                >
                                                    <span className={`w-4 text-indigo-500 ${!selectedEmployee ? "opacity-100" : "opacity-0"}`}>✓</span>
                                                    Select Employee
                                                </button>
                                            </li>
                                            {[...new Set(employees.map((e) => e.name))].map((n) => (
                                                <li key={n}>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setSelectedEmployee(n); setEmpOpen(false); }}
                                                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${selectedEmployee === n ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                                    >
                                                        <span className={`w-4 text-indigo-500 ${selectedEmployee === n ? "opacity-100" : "opacity-0"}`}>✓</span>
                                                        <span className="truncate">{n}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
                                <div className="relative" ref={statusRef}>
                                    <button
                                        type="button"
                                        onClick={() => setStatusOpen(!statusOpen)}
                                        className="w-full flex items-center justify-between text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-600"
                                    >
                                        <span className="truncate">
                                            {selectedStatus === "APPROVED" ? "Approved" : selectedStatus === "PENDING" ? "Pending" : selectedStatus === "REJECTED" ? "Rejected" : "Select Status"}
                                        </span>
                                        <ChevronDown className={`flex-shrink-0 w-3.5 h-3.5 text-gray-400 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {statusOpen && (
                                        <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                                            <li key="empty">
                                                <button
                                                    type="button"
                                                    onClick={() => { setSelectedStatus(""); setStatusOpen(false); }}
                                                    className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${!selectedStatus ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                                >
                                                    <span className={`w-4 text-indigo-500 ${!selectedStatus ? "opacity-100" : "opacity-0"}`}>✓</span>
                                                    Select Status
                                                </button>
                                            </li>
                                            {[
                                                { val: "APPROVED", label: "Approved" },
                                                { val: "PENDING", label: "Pending" },
                                                { val: "REJECTED", label: "Rejected" },
                                            ].map((s) => (
                                                <li key={s.val}>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setSelectedStatus(s.val); setStatusOpen(false); }}
                                                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${selectedStatus === s.val ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                                    >
                                                        <span className={`w-4 text-indigo-500 ${selectedStatus === s.val ? "opacity-100" : "opacity-0"}`}>✓</span>
                                                        {s.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date From</label>
                                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-600" />
                            </div>
                            <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date To</label>
                                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-600" />
                            </div>
                            <div className="flex gap-2 flex-shrink-0 self-end pt-4 sm:pt-0">
                                <button onClick={applyFilters} className="bg-[#4A45B6] hover:bg-[#4f46e5] text-white text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors whitespace-nowrap">Apply Filters</button>
                                <button onClick={resetFilters} className="border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold px-5 py-2.5 rounded-sm transition-colors bg-[#E6E8EA] whitespace-nowrap">Reset Filters</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[700px]">
                            <thead className="bg-[#F2F4F6]">
                                <tr className="border-b border-gray-100">
                                    {["#", "Employee", "Resignation\nDate", "Last\nWorking\nDay", "Notice\nPeriod", "Status", "Documents", "Action"].map((h, i) => (
                                        <th key={i} className={`text-[10px] font-extrabold text-[#737686] uppercase tracking-widest px-4 py-4 whitespace-pre-line ${i === 7 ? "text-center" : "text-left"}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.map((emp, idx) => {
                                    const globalIdx = currentPage * perPage + idx + 1;
                                    return (
                                        <tr key={emp.id} className="border-t border-[#ECEEF0] hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-4 py-4 text-gray-400 font-medium">{globalIdx}</td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={emp.name} colorIdx={emp.colorIdx} />
                                                    <div>
                                                        <p className="text-[#191C1E] font-semibold text-sm whitespace-nowrap">{emp.name}</p>
                                                        <p className="text-xs text-[#737686] mt-0.5">{emp.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-[#191C1E] text-sm whitespace-pre-line leading-snug">{emp.resignationDate}</td>
                                            <td className="px-4 py-4 text-[#191C1E] text-sm whitespace-pre-line leading-snug">{emp.lastWorkingDay}</td>
                                            <td className="px-4 py-4 text-[#191C1E] text-sm whitespace-pre-line leading-snug">{emp.noticePeriod}</td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${statusStyle[emp.status]}`}>{emp.status}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {emp.hasDocs ? (
                                                    <a href={emp.documentUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                                                        <FileText className="w-[22px] h-[22px]" stroke="#6366f1" />
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">No docs</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        title="View"
                                                        onClick={() => router.push(`/${tenant}/admin/operations/resignation/${emp.id}`)}
                                                        className="text-[#7c3aed] hover:text-blue-600 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                                                    >
                                                        <Eye className="w-[18px] h-[18px]" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {paginated.length === 0 && (
                                    <tr><td colSpan={8} className="px-5 py-16 text-center text-gray-400 text-sm">No resignations found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-5 py-4 flex flex-col sm:flex-row items-center bg-[#F2F4F6] justify-between gap-3 border-t border-[#E0E3E5]">
                        <div className="flex items-center gap-3 text-[12px] text-[#6B7280]">
                            <span className="text-[#434655]">
                                Showing {totalEntries === 0 ? 0 : currentPage * perPage + 1} to {Math.min((currentPage + 1) * perPage, totalEntries)} of {totalEntries} entries
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button id="prev-page-btn" onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0}
                                className="w-8 h-8 flex items-center justify-center bg-white border border-[#E2E8F0] text-[#434655] disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {pageNumbers().map((page) => (
                                <button key={page} id={`page-btn-${page}`} onClick={() => setCurrentPage(page)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-[12px] font-medium transition-colors ${currentPage === page ? "bg-[#4A45B6] text-white shadow-md shadow-indigo-200" : "border border-[#E2E8F0] text-[#6B7280] bg-white hover:bg-gray-50"
                                        }`}>
                                    {page + 1}
                                </button>
                            ))}
                            <button id="next-page-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1 || totalPages === 0}
                                className="w-8 h-8 flex items-center justify-center bg-white border border-[#E2E8F0] text-[#434655] disabled:opacity-40 disabled:cursor-not-allowed transition-colors rounded-md">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

