"use client";
import { useState, useRef, useEffect } from "react";
import {
    Search, Download, ChevronDown, Filter, X,
    User, Mail, Briefcase, Calendar, Clock,
    MoreHorizontal, Eye, FileText, ChevronLeft, ChevronRight,
    HomeIcon, BarChart2, RotateCcw, LockIcon
} from "lucide-react";
import * as XLSX from "xlsx";

const employees = [
    {
        id: 1,
        name: "Arjun Das",
        email: "arjun.das@atelier.com",
        role: "Senior Backend Dev",
        cl: "08/15",
        sl: "08/15",
        leaveBalance: "53%",
        attendance: 98,
        status: "PRESENT",
        avatar: "AD",
        color: "bg-violet-100 text-violet-700",
    },
    {
        id: 2,
        name: "Priya Sharma",
        email: "priya.s@atelier.com",
        role: "UI/UX Lead",
        cl: "08/15",
        sl: "08/15",
        leaveBalance: "53%",
        attendance: 92,
        status: "ON LEAVE",
        avatar: "PS",
        color: "bg-pink-100 text-pink-700",
    },
    {
        id: 3,
        name: "David Chen",
        email: "d.chen@atelier.com",
        role: "Project Manager",
        cl: "08/15",
        sl: "08/15",
        leaveBalance: "53%",
        attendance: 100,
        status: "PRESENT",
        avatar: "DC",
        color: "bg-teal-100 text-teal-700",
    },
    {
        id: 4,
        name: "Sarah Jenkins",
        email: "s.jenkins@atelier.com",
        role: "Frontend Developer",
        cl: "08/15",
        sl: "08/15",
        leaveBalance: "53%",
        attendance: 85,
        status: "ABSENT",
        avatar: "SJ",
        color: "bg-amber-100 text-amber-700",
    },
    {
        id: 5,
        name: "Marcus Webb",
        email: "m.webb@atelier.com",
        role: "DevOps Engineer",
        cl: "08/15",
        sl: "08/15",
        leaveBalance: "53%",
        attendance: 95,
        status: "PRESENT",
        avatar: "MW",
        color: "bg-blue-100 text-blue-700",
    },
];

const roles = ["All Roles", "Senior Backend Dev", "UI/UX Lead", "Project Manager", "Frontend Developer", "DevOps Engineer"];
const statuses = ["All Status", "PRESENT", "ON LEAVE", "ABSENT"];

const AttendanceBar = ({ value }) => {
    const bars = 5;
    const filled = Math.round((value / 100) * bars);
    return (
        <span className="inline-flex items-end gap-[2px]">
            {Array.from({ length: bars }, (_, i) => (
                <span
                    key={i}
                    className={`inline-block w-[3px] rounded-sm transition-all ${i < filled ? "bg-slate-700" : "bg-slate-200"
                        }`}
                    style={{ height: `${8 + i * 3}px` }}
                />
            ))}
        </span>
    );
};

const StatusPill = ({ status }) => {
    const map = {
        PRESENT: "bg-[#007B71] text-white",
        "ON LEAVE": "bg-[#FFDAD6] text-[#BA1A1A]",
        ABSENT: "bg-[#F2F4F6] text-[#434655]",
    };
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-sm text-[10px] font-bold tracking-wider ${map[status] || "bg-slate-100 text-slate-500"}`}
        >
            {status}
        </span>
    );
};


export default function MyTeam() {
    const [search, setSearch] = useState("");
    const [activeRole, setActiveRole] = useState("All Roles");
    const [activeStatus, setActiveStatus] = useState("All Status");
    const [page, setPage] = useState(1);
    const perPage = 4;

    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    const roleRef = useRef(null);
    const statusRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (roleRef.current && !roleRef.current.contains(event.target)) setIsRoleOpen(false);
            if (statusRef.current && !statusRef.current.contains(event.target)) setIsStatusOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filtered = employees.filter((e) => {
        const matchSearch =
            e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = activeRole === "All Roles" || e.role === activeRole;
        const matchStatus = activeStatus === "All Status" || e.status === activeStatus;
        return matchSearch && matchRole && matchStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleRole = (r) => {
        setActiveRole(r);
        setPage(1);
    };

    const handleStatus = (s) => {
        setActiveStatus(s);
        setPage(1);
    };

    const handleExport = () => {
        // Map filtered data to a clean format for Excel
        const exportData = filtered.map(emp => ({
            "Employee Name": emp.name,
            "Email": emp.email,
            "Role": emp.role,
            "CL Balance": emp.cl,
            "SL Balance": emp.sl,
            "Attendance (%)": `${emp.attendance}%`,
            "Status": emp.status
        }));

        // Create a worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Create a workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "My Team");

        // Set column widths for better readability
        const wscols = [
            { wch: 20 }, // Employee Name
            { wch: 25 }, // Email
            { wch: 20 }, // Role
            { wch: 12 }, // CL Balance
            { wch: 12 }, // SL Balance
            { wch: 15 }, // Attendance (%)
            { wch: 12 }  // Status
        ];
        ws['!cols'] = wscols;

        // Generate and download the XLSX file
        const timestamp = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `My_Team_Directory_${timestamp}.xlsx`);
    };

    return (
        <section className="min-h-screen p-4 sm:p-8">
            <div>

                {/* Page title */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="text-[11px] flex items-center gap-1.5 text-slate-400 mb-3 tracking-wide uppercase">
                            <HomeIcon size={14} className="text-[#4A45B6]" />
                            <ChevronRight size={12} />
                            <span>My Team</span>
                        </div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-[#1F2937] tracking-tight">My Team</h1>
                            <div className="flex items-center bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]">
                                <LockIcon className="w-3 h-3" />

                                <span className="px-2 py-0.5 rounded  
                                 text-[9px] font-bold tracking-widest ">

                                    READ-ONLY ACCESS</span>

                            </div>

                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">Manage and monitor your direct reports and their performance.</p>
                    </div>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-[#E2DFFF] text-[#4A45B6] rounded-sm px-5 py-2.5 text-[12px] font-bold hover:bg-[#D3D0FF] transition-all shadow-sm self-start md:self-auto"
                    >
                        <Download size={15} />
                        <span>Export Directory</span>
                    </button>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="bg-[#F2F4F6] border border-[#E5E7EB] rounded-sm p-5 mb-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={search}
                                onChange={handleSearch}
                                className="w-full border border-[#E5E7EB] rounded-sm pl-10 pr-4 py-2 text-[13px] outline-none focus:border-[#4A45B6] transition-all text-slate-700 placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            {/* Role Dropdown */}
                            <div className="relative" ref={roleRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsRoleOpen(!isRoleOpen)}
                                    className="flex items-center justify-between gap-3 min-w-[160px]  border border-[#E5E7EB] rounded-sm px-4 py-2 text-[13px] font-semibold text-[#374151] hover:border-slate-300 transition-all"
                                >
                                    <span className="truncate">{activeRole}</span>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isRoleOpen ? "rotate-180 text-[#4A45B6]" : ""}`} />
                                </button>
                                {isRoleOpen && (
                                    <div className="absolute left-0 mt-1 w-full bg-white border border-[#E5E7EB] rounded-sm shadow-xl z-50 overflow-hidden">
                                        <ul className="max-h-60 overflow-y-auto">
                                            {roles.map((r) => (
                                                <li key={r}>
                                                    <button
                                                        type="button"
                                                        onClick={() => { handleRole(r); setIsRoleOpen(false); }}
                                                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-all
                                                            ${activeRole === r
                                                                ? "text-white font-bold bg-[#4A45B6]"
                                                                : "text-slate-600 hover:bg-slate-50 hover:text-[#4A45B6]"
                                                            }`}
                                                    >
                                                        {r}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Status Dropdown */}
                            <div className="relative" ref={statusRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                                    className="flex items-center justify-between gap-3 min-w-[140px]  border border-[#E5E7EB] rounded-sm px-4 py-2 text-[13px] font-semibold text-[#374151] hover:border-slate-300 transition-all"
                                >
                                    <span className="truncate">{activeStatus}</span>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isStatusOpen ? "rotate-180 text-[#4A45B6]" : ""}`} />
                                </button>
                                {isStatusOpen && (
                                    <div className="absolute left-0 mt-1 w-full bg-white border border-[#E5E7EB] rounded-sm shadow-xl z-50 overflow-hidden">
                                        <ul className="py-1">
                                            {statuses.map((s) => (
                                                <li key={s}>
                                                    <button
                                                        type="button"
                                                        onClick={() => { handleStatus(s); setIsStatusOpen(false); }}
                                                        className={`w-full text-left px-4 py-2.5 text-[13px] transition-all
                                                            ${activeStatus === s
                                                                ? "text-white font-bold bg-[#4A45B6]"
                                                                : "text-slate-600 hover:bg-slate-50 hover:text-[#4A45B6]"
                                                            }`}
                                                    >
                                                        {s}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Clear All */}
                            {(activeRole !== "All Roles" || activeStatus !== "All Status" || search) && (
                                <button
                                    onClick={() => { setActiveRole("All Roles"); setActiveStatus("All Status"); setSearch(""); setPage(1); }}
                                    className="flex items-center gap-1.5 text-[#4A45B6] hover:text-[#3a3692] text-[12px] font-bold transition-all ml-2"
                                >
                                    <RotateCcw size={14} />
                                    <span>Clear Filters</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}

                <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-[#F2F4F6]">
                            <tr className="border-b border-[#F3F4F6]">

                                <th className="text-left px-5 py-4 text-[10px] font-bold text-[#434655] uppercase tracking-wider">Employee</th>
                                <th className="text-left px-4 py-4 text-[10px] font-bold text-[#434655] uppercase tracking-wider hidden md:table-cell">Role</th>
                                <th className="text-left px-4 py-4 text-[10px] font-bold text-[#434655] uppercase tracking-wider hidden lg:table-cell">Leave Balance<br /><span className="lowercase font-medium">(cl / sl)</span></th>
                                <th className="text-left px-4 py-4 text-[10px] font-bold text-[#434655] uppercase tracking-wider hidden sm:table-cell">Attendance %</th>
                                <th className="text-left px-4 py-4 text-[10px] font-bold text-[#434655] uppercase tracking-wider">Today Status</th>
                                <th className="text-left px-4 py-4 text-[10px] font-bold text-[#434655] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No employees match your filters.</td>
                                </tr>
                            ) : (
                                paginated.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="px-5 py-3.5">
                                            <figure className="flex items-center gap-3">
                                                <span className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${emp.color}`}>
                                                    {emp.avatar}

                                                </span>
                                                <figcaption>
                                                    <p className="font-semibold text-[#0F172A] text-[13px] leading-tight">
                                                        {emp.name}</p>
                                                    <p className="text-[#64748B] text-[11px] mt-0.5">{emp.email}</p>
                                                </figcaption>

                                            </figure>
                                        </td>

                                        <td className="px-4 py-3.5 hidden md:table-cell">
                                            <span className="text-[#334155] text-[13px]">{emp.role}</span>
                                        </td>
                                        <td className="px-4 py-4 hidden lg:table-cell">
                                            <div className="flex flex-col text-[11px]">
                                                <div className="flex justify-between">

                                                    <span className="font-semibold text-[#64748B]">CL: {emp.cl}</span>
                                                    <span className="text-[#64748B] font-semibold ml-2">53%</span>
                                                </div>
                                                <div className="flex justify-between text-[#6B7280]">
                                                    <span className="font-semibold text-[#64748B]">SL: {emp.sl}</span>
                                                    <span className="font-semibold text-[#64748B] ml-2">53%</span>
                                                </div>
                                                <div className="flex justify-between text-[#6B7280]">
                                                    <span className="font-semibold text-[#64748B]">EL: 00/15</span>
                                                    <span className="font-semibold text-[#64748B] ml-2">53%</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#0F172A] text-[13px] font-bold tabular-nums w-8">{emp.attendance}%</span>
                                                <BarChart2 size={18} className="text-[#007B71]" />
                                            </div>

                                        </td>
                                        <td className="px-4 py-3.5">
                                            <StatusPill status={emp.status} />
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-4">

                                                <button className="text-[#4A45B6] text-[12px] font-bold hover:underline">Profile</button>
                                                <button className="text-[#475569] text-[12px] font-bold hover:underline">Leaves</button>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-4 text-[12px] text-slate-500 font-medium">
                            <p>Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} records</p>
                            <div className="flex items-center gap-2">
                                <span>Records per page:</span>
                                <select className="bg-transparent border border-slate-200 rounded-sm px-1 py-0.5 outline-none">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                </select>
                            </div>
                        </div>
                        <nav className="inline-flex items-center gap-1.5">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all select-none ${page === 1 ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100 border border-[#E5E7EB] cursor-pointer"
                                    }`}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold transition-all select-none cursor-pointer ${page === p ? "bg-[#4A45B6] text-white shadow-sm" : "text-[#374151] hover:bg-slate-100 border border-[#E5E7EB]"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all select-none ${page === totalPages ? "text-slate-300 cursor-not-allowed" : "text-slate-600 hover:bg-slate-100 border border-[#E5E7EB] cursor-pointer"
                                    }`}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </nav>
                    </footer>
                </article>

            </div>
        </section>
    );
}