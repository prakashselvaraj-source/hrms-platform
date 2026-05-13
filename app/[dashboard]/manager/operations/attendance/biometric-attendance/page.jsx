"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Search, SlidersHorizontal, Eye, RefreshCw,
    ChevronDown, Fingerprint, X, Clock, Calendar,
    Hash, User, Activity, LogIn, LogOut,
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_DATA = [
    { id: 1, code: "103", name: "Caitlyn Harvey", date: "2025-10-09", clockIn: "09:00:00", clockOut: "18:30:00", entries: 2, device: "Main Entrance", status: "Present", shift: "Morning", duration: "9h 30m" },
    { id: 2, code: "102", name: "Amie Jerde", date: "2025-10-09", clockIn: "09:00:00", clockOut: "18:30:00", entries: 2, device: "Main Entrance", status: "Present", shift: "Morning", duration: "9h 30m" },
    { id: 3, code: "101", name: "Employee", date: "2025-10-09", clockIn: "09:00:17", clockOut: "18:30:00", entries: 4, device: "Side Gate", status: "Late", shift: "Morning", duration: "9h 29m" },
    { id: 4, code: "103", name: "Caitlyn Harvey", date: "2025-10-08", clockIn: "09:00:00", clockOut: "18:30:00", entries: 2, device: "Main Entrance", status: "Present", shift: "Morning", duration: "9h 30m" },
    { id: 5, code: "102", name: "Amie Jerde", date: "2025-10-08", clockIn: "09:00:00", clockOut: "18:30:00", entries: 2, device: "Main Entrance", status: "Present", shift: "Morning", duration: "9h 30m" },
    { id: 6, code: "101", name: "Employee", date: "2025-10-08", clockIn: "09:00:17", clockOut: "18:30:00", entries: 4, device: "Side Gate", status: "Late", shift: "Morning", duration: "9h 29m" },
    { id: 7, code: "103", name: "Caitlyn Harvey", date: "2025-10-07", clockIn: "09:00:00", clockOut: "18:30:00", entries: 2, device: "Main Entrance", status: "Present", shift: "Morning", duration: "9h 30m" },
    { id: 8, code: "102", name: "Amie Jerde", date: "2025-10-07", clockIn: "09:00:00", clockOut: "18:30:00", entries: 2, device: "Main Entrance", status: "Present", shift: "Morning", duration: "9h 30m" },
    { id: 9, code: "101", name: "Employee", date: "2025-10-07", clockIn: "09:00:17", clockOut: "18:30:00", entries: 4, device: "Side Gate", status: "Late", shift: "Morning", duration: "9h 29m" },
    { id: 10, code: "103", name: "Caitlyn Harvey", date: "2025-10-06", clockIn: "09:00:00", clockOut: "18:30:00", entries: 2, device: "Main Entrance", status: "Present", shift: "Morning", duration: "9h 30m" },
];

const PUNCH_LOGS = {
    Present: [
        { time: "09:00:00", type: "IN", device: "Main Entrance" },
        { time: "13:00:00", type: "OUT", device: "Main Entrance" },
        { time: "14:00:00", type: "IN", device: "Main Entrance" },
        { time: "18:30:00", type: "OUT", device: "Main Entrance" },
    ],
    Late: [
        { time: "09:00:17", type: "IN", device: "Side Gate" },
        { time: "12:45:00", type: "OUT", device: "Side Gate" },
        { time: "13:30:00", type: "IN", device: "Side Gate" },
        { time: "17:00:00", type: "OUT", device: "Side Gate" },
    ],
};

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function BiometricDetailModal({ record, onClose }) {
    const backdropRef = useRef(null);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, []);

    useEffect(() => {
        function onKey(e) { if (e.key === "Escape") onClose(); }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    function handleBackdropClick(e) {
        if (e.target === backdropRef.current) onClose();
    }

    const punches = PUNCH_LOGS[record.status] ?? PUNCH_LOGS.Present;

    const statusStyle =
        record.status === "Present" ? "bg-emerald-100 text-emerald-700"
            : record.status === "Late" ? "bg-amber-100 text-amber-700"
                : "bg-red-100 text-red-700";

    return (
        <div
            ref={backdropRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
        >
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#4A45B6]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                            <Fingerprint className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-white font-bold text-base">Biometric Detail</p>
                            <p className="text-violet-100 text-[11px] font-medium opacity-80">Employee ID: {record.code}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Employee Profile */}
                    <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="w-14 h-14 rounded-full bg-[#4A45B6]/10 flex items-center justify-center border-2 border-white shadow-sm">
                            <User className="w-6 h-6 text-[#4A45B6]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-lg leading-tight truncate">{record.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{record.shift} Shift</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyle}`}>
                                    {record.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { icon: <Calendar className="w-4 h-4 text-gray-400" />, label: "Attendance Date", value: record.date },
                            { icon: <Activity className="w-4 h-4 text-[#4A45B6]" />, label: "Working Duration", value: record.duration },
                            { icon: <LogIn className="w-4 h-4 text-emerald-500" />, label: "First Clock In", value: record.clockIn },
                            { icon: <LogOut className="w-4 h-4 text-orange-500" />, label: "Last Clock Out", value: record.clockOut },
                            { icon: <Hash className="w-4 h-4 text-blue-500" />, label: "Punch Frequency", value: `${record.entries} Times` },
                            { icon: <Clock className="w-4 h-4 text-indigo-500" />, label: "Device Point", value: record.device },
                        ].map(({ icon, label, value }) => (
                            <div key={label} className="group hover:bg-white hover:shadow-md transition-all duration-300 bg-gray-50 rounded-2xl p-4 border border-transparent hover:border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 rounded-lg bg-white shadow-sm group-hover:bg-[#4A45B6]/5 transition-colors">
                                        {icon}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                                </div>
                                <p className="text-sm font-bold text-gray-800 tabular-nums pl-1">{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Punch History */}
                    <div className="pt-2">
                        <div className="flex items-center gap-2 mb-4">
                            <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                Comprehensive Punch Log
                            </p>
                        </div>
                        <div className="relative pl-6 space-y-4">
                            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100" />
                            {punches.map((p, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className={`w-3.5 h-3.5 rounded-full flex-shrink-0 border-2 border-white ring-4 z-10 ${p.type === "IN" ? "bg-emerald-500 ring-emerald-200" : "bg-orange-400 ring-orange-50"}`} />
                                    <div className="flex-1 flex items-center justify-between bg-gray-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-100 transition-all rounded-xl px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${p.type === "IN" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"}`}>
                                                {p.type}
                                            </span>
                                            <div>
                                                <p className="text-xs font-bold text-gray-700">{p.device}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">Recorded via Biometric</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-800 tabular-nums">{p.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-[10px] text-gray-400 font-medium italic">* Data synchronized from cloud server</p>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={onClose} className="text-xs font-bold text-gray-500 hover:text-gray-800 px-4 py-2 transition-colors">
                            Close
                        </button>
                        <button type="button" className="flex items-center gap-2 bg-[#4A45B6] hover:bg-[#3d38a0] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-200 active:scale-95">
                            <RefreshCw className="w-3.5 h-3.5" />
                            Sync Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BiometricAttendance() {
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [perPage, setPerPage] = useState(10);
    const [perPageOpen, setPerPageOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const closeModal = useCallback(() => setSelected(null), []);

    const filtered = MOCK_DATA.filter((r) => {
        const q = search.toLowerCase();
        return r.code.includes(q) || r.name.toLowerCase().includes(q) || r.date.includes(q);
    }).slice(0, perPage);

    function handleReset() {
        setStartDate("");
        setEndDate("");
        setSearch("");
    }

    return (
        <>
            {selected && <BiometricDetailModal record={selected} onClose={closeModal} />}

            <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-6 lg:p-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                    <span className="hover:text-violet-600 cursor-pointer transition-colors">Attendance</span>
                    <span className="text-gray-300 mx-1">›</span>
                    <span className="text-gray-600 font-medium">Create / Edit Policy</span>
                </nav>

                {/* Page Title */}
                <div className="flex items-center gap-2.5 mb-5">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Biometric Attendance</h1>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-6 py-4 border-b border-gray-100">
                        {/* Search */}
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-transparent transition"
                            />
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            {/* Search Button */}
                            <button
                                type="button"
                                className="flex items-center gap-1.5 bg-[#4A45B6] hover:bg-[#3d38a0] text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors"
                            >
                                <Search className="w-3.5 h-3.5" />
                                Search
                            </button>

                            {/* Filter Toggle */}
                            <button
                                type="button"
                                onClick={() => setShowFilters((p) => !p)}
                                className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg border transition-colors ${showFilters
                                    ? "bg-violet-50 border-violet-200 text-violet-700"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:text-violet-600"
                                    }`}
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                {showFilters ? "Hide Filters" : "Show Filters"}
                            </button>

                            {/* Per Page */}
                            <div className="relative ml-auto sm:ml-0 flex items-center gap-1.5">
                                <span className="text-xs text-gray-500 hidden sm:inline">Per Page:</span>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setPerPageOpen((p) => !p)}
                                        className="flex items-center gap-1.5 text-xs font-semibold border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 hover:border-violet-300 transition-colors min-w-[64px]"
                                    >
                                        {perPage} <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                    </button>
                                    {perPageOpen && (
                                        <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                                            {PER_PAGE_OPTIONS.map((n) => (
                                                <button
                                                    key={n}
                                                    type="button"
                                                    onClick={() => { setPerPage(n); setPerPageOpen(false); }}
                                                    className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${n === perPage ? "bg-violet-50 text-violet-700" : "text-gray-600 hover:bg-gray-50"}`}
                                                >
                                                    {n}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="px-4 sm:px-6 py-4 bg-white border-b border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Start Date</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        placeholder="mm/dd/yyyy"
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 transition w-full sm:w-48"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">End Date</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        placeholder="mm/dd/yyyy"
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 transition w-full sm:w-48"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="bg-[#4A45B6] hover:bg-[#3d38a0] text-white text-xs font-semibold px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-semibold px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-blue-50 border-b border-blue-100">
                        <div className="w-4 h-4 rounded-full border border-blue-300 flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        </div>
                        <p className="text-xs text-blue-600">Biometric attendance data from device</p>
                    </div>

                    {/* Table — desktop */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-white">
                                    {["#", "EMPLOYEE CODE", "EMPLOYEE NAME", "DATE", "CLOCK IN", "CLOCK OUT", "TOTAL ENTRIES", "ACTIONS"].map((h) => (
                                        <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((row, i) => (
                                    <tr
                                        key={row.id}
                                        className="border-b border-gray-50 hover:bg-violet-50/30 transition-colors"
                                    >
                                        <td className="px-4 py-3.5 text-gray-500 text-xs font-medium">{row.id}</td>
                                        <td className="px-4 py-3.5 text-gray-700 font-semibold text-xs">{row.code}</td>
                                        <td className="px-4 py-3.5 text-gray-800 text-xs font-medium">{row.name}</td>
                                        <td className="px-4 py-3.5 text-gray-500 text-xs">{row.date}</td>
                                        <td className="px-4 py-3.5">
                                            <span className="text-emerald-500 font-semibold text-xs tabular-nums">{row.clockIn}</span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="text-orange-500 font-semibold text-xs tabular-nums">{row.clockOut}</span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
                                                {row.entries}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    title="View Biometric Details"
                                                    onClick={() => setSelected(row)}
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    title="Sync"
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Cards — mobile */}
                    <div className="sm:hidden divide-y divide-gray-100">
                        {filtered.map((row) => (
                            <div key={row.id} className="px-4 py-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{row.name}</p>
                                        <p className="text-xs text-gray-400">Code: {row.code} · {row.date}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setSelected(row)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Clock In</p>
                                        <p className="text-xs font-semibold text-emerald-500 tabular-nums">{row.clockIn}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Clock Out</p>
                                        <p className="text-xs font-semibold text-orange-500 tabular-nums">{row.clockOut}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Entries</p>
                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
                                            {row.entries}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6 py-3 border-t border-gray-100 bg-white">
                        <p className="text-xs text-gray-400">
                            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> of{" "}
                            <span className="font-semibold text-gray-600">{MOCK_DATA.length}</span> records
                        </p>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3].map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${p === 1 ? "bg-[#4A45B6] text-white" : "text-gray-500 hover:bg-violet-50 hover:text-violet-600"}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
