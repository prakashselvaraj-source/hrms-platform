"use client";

import { useState, useMemo } from "react";
import {
    Search,
    Calendar,
    ChevronDown,
    X,
    Moon,
    SlidersHorizontal
} from "lucide-react";

// ─── Static Data ────────────────────────────────────────────────────────────
const ALL_EMPLOYEES = [
    {
        id: 1,
        name: "Prof. Tommie Howell",
        shift: "Morning Shift",
        status: "PRESENT",
        clockIn: "08:00 AM",
        clockInDate: "2025-04-18",
        duration: "8.5h",
        extra: "+0.5h OT",
        extraColor: "text-violet-600",
        progress: 100,
        avatar: "TH",
        avatarBg: "bg-amber-200",
    },
    {
        id: 2,
        name: "Amie Jerde",
        shift: "Morning Shift",
        status: "PRESENT",
        clockIn: "08:15 AM",
        clockInDate: "2025-04-18",
        duration: "7.2h",
        note: "Early departure",
        noteColor: "text-amber-500",
        progress: 85,
        avatar: "AJ",
        avatarBg: "bg-blue-200",
    },
    {
        id: 3,
        name: "Caitlyn Harvey",
        shift: "General Shift",
        status: "PRESENT",
        clockIn: "09:00 AM",
        clockInDate: "2025-04-18",
        duration: "4.5h",
        progress: 50,
        avatar: "CH",
        avatarBg: "bg-pink-200",
    },
    {
        id: 4,
        name: "Prof. Tommie Howell",
        shift: "Morning Shift",
        status: "ON LEAVE",
        clockIn: null,
        clockInDate: "2025-04-18",
        duration: null,
        noData: true,
        avatar: "TH",
        avatarBg: "bg-amber-200",
    },
    {
        id: 5,
        name: "Darrin Weber",
        shift: "Night Shift",
        status: "PRESENT",
        clockIn: "10:00 PM",
        clockInDate: "2025-04-17",
        duration: "8.0h",
        progress: 100,
        avatar: "DW",
        avatarBg: "bg-green-200",
    },
    {
        id: 6,
        name: "Rest Day",
        shift: null,
        status: "REST",
        restDay: true,
        clockInDate: "2025-04-18",
        avatar: "—",
        avatarBg: "bg-gray-200",
    },
    {
        id: 7,
        name: "Rosemarie Kozey",
        shift: "Morning Shift",
        status: "PRESENT",
        clockIn: "07:55 AM",
        clockInDate: "2025-04-18",
        duration: "9.0h",
        extra: "+1.0h OT",
        extraColor: "text-violet-600",
        progress: 100,
        avatar: "RK",
        avatarBg: "bg-purple-200",
    },
    {
        id: 8,
        name: "Micheal Rau",
        shift: "Evening Shift",
        status: "ABSENT",
        clockIn: "02:00 PM",
        clockInDate: "2025-04-18",
        duration: "6.0h",
        progress: 75,
        avatar: "MR",
        avatarBg: "bg-orange-200",
    },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
function AvatarCircle({ initials, bg }) {
    return (
        <div
            className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center text-sm font-semibold text-gray-700 flex-shrink-0`}
        >
            {initials}
        </div>
    );
}

function StatusBadge({ status }) {
    if (!status || status === "REST") return null;
    const map = {
        PRESENT: "bg-[#007B71] text-white",
        "ON LEAVE": "bg-[#9A0A00] text-white",
        ABSENT: "bg-[#D97706] text-white",

    };

    return (
        <span
            className={`text-[10px] font-bold px-2 py-1 rounded ${map[status] || "bg-gray-100 text-gray-600"
                }`}
        >
            {status}
        </span>
    );
}

function ProgressBar({ value }) {
    return (
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
            <div
                className="bg-[#4F279B] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${value}%` }}
            />
        </div>
    );
}

function EmployeeCard({ emp }) {
    if (emp.restDay) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[160px] text-center">
                <Moon className="w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-400">Rest Day</p>
                <p className="text-xs text-gray-400">No shift scheduled</p>
                <span className="mt-3 text-[10px] bg-gray-100 text-gray-400 font-semibold px-2 py-0.5 rounded">
                    OFF
                </span>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 transition-shadow hover:shadow-sm">
            <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                    <AvatarCircle initials={emp.avatar} bg={emp.avatarBg} />
                    <div>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {emp.name}
                        </p>
                        <p className="text-xs text-gray-400">{emp.shift}</p>
                    </div>
                </div>
                <StatusBadge status={emp.status} />
            </div>

            {emp.noData ? (
                <p className="text-xs text-gray-400 text-center mt-5 uppercase tracking-wide">
                    No Attendance Founded
                </p>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                                Clock In
                            </p>
                            <p className="text-sm font-semibold text-gray-800">{emp.clockIn}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                                Duration
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                                {emp.duration}{" "}
                                {emp.extra && (
                                    <span className={`text-xs font-semibold ${emp.extraColor}`}>
                                        {emp.extra}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                                Daily Progress
                            </p>
                            {emp.note ? (
                                <p className={`text-[10px] font-medium ${emp.noteColor}`}>
                                    ⚠ {emp.note}
                                </p>
                            ) : (
                                <p className="text-[10px] text-gray-500 font-medium">
                                    {emp.progress}%
                                </p>
                            )}
                        </div>
                        <ProgressBar value={emp.progress} />
                    </div>
                </>
            )}
        </div>
    );
}

function DateInput({ label, value, onChange }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500 font-medium">{label}</label>
            <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                    type="date"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-9 pr-3 py-2 border border-gray-200 rounded-sm text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white w-40 cursor-pointer"
                />
            </div>
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function AttendanceOverview() {
    // Input states (what user types / picks — before Apply)
    const [searchInput, setSearchInput] = useState("");
    const [dateFromInput, setDateFromInput] = useState("");
    const [dateToInput, setDateToInput] = useState("");
    const [statusInput, setStatusInput] = useState("All Status");

    // Applied states (actually used for filtering)
    const [appliedSearch, setAppliedSearch] = useState("");
    const [appliedDateFrom, setAppliedDateFrom] = useState("");
    const [appliedDateTo, setAppliedDateTo] = useState("");
    const [appliedStatus, setAppliedStatus] = useState("All Status");
    const [statusOpen, setStatusOpen] = useState(false);

    const statusOptions = ["All Status", "PRESENT", "ON LEAVE", "ABSENT"];

    // ── Apply Filters ──────────────────────────────────────────────────────────
    function handleApply() {
        setAppliedSearch(searchInput.trim().toLowerCase());
        setAppliedDateFrom(dateFromInput);
        setAppliedDateTo(dateToInput);
        setAppliedStatus(statusInput);
    }

    // ── Reset everything ───────────────────────────────────────────────────────
    function handleReset() {
        setSearchInput("");
        setDateFromInput("");
        setDateToInput("");
        setStatusInput("All Status");
        setAppliedSearch("");
        setAppliedDateFrom("");
        setAppliedDateTo("");
        setAppliedStatus("All Status");
    }

    // ── Remove individual applied filter chip ──────────────────────────────────
    function removeChip(type) {
        if (type === "search") {
            setSearchInput("");
            setAppliedSearch("");
        } else if (type === "from") {
            setDateFromInput("");
            setAppliedDateFrom("");
        } else if (type === "to") {
            setDateToInput("");
            setAppliedDateTo("");
        } else if (type === "status") {
            setStatusInput("All Status");
            setAppliedStatus("All Status");
        }
    }

    // ── Filtering logic ────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        return ALL_EMPLOYEES.filter((emp) => {
            // 1. Name search (skip Rest Day tile)
            if (appliedSearch && !emp.restDay) {
                if (!emp.name.toLowerCase().includes(appliedSearch)) return false;
            }

            // 2. Date range — compare clockInDate (ISO yyyy-mm-dd)
            if (emp.clockInDate) {
                if (appliedDateFrom && emp.clockInDate < appliedDateFrom) return false;
                if (appliedDateTo && emp.clockInDate > appliedDateTo) return false;
            }

            // 3. Status filter (skip Rest Day tile)
            if (appliedStatus !== "All Status" && !emp.restDay) {
                if (emp.status !== appliedStatus) return false;
            }

            return true;
        });
    }, [appliedSearch, appliedDateFrom, appliedDateTo, appliedStatus]);

    // ── Summary stats (always from full list for workforce total) ──────────────
    const totalCount = ALL_EMPLOYEES.filter((e) => !e.restDay).length;
    const presentCount = filtered.filter((e) => e.status === "PRESENT").length;
    const onLeaveCount = filtered.filter((e) => e.status === "ON LEAVE").length;

    const hasActiveFilters =
        appliedSearch ||
        appliedDateFrom ||
        appliedDateTo ||
        appliedStatus !== "All Status";

    const hasInputChanges =
        searchInput ||
        dateFromInput ||
        dateToInput ||
        statusInput !== "All Status";

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* ── Main Content ──────────────────────────────────────────────────── */}

            <div className="px-6 py-6">

                <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                    <span>ATTENDANCE MANAGEMENT</span>
                    <span>›</span>
                    <span className="text-gray-600 font-medium">TEAM ATTENDANCE OVERVIEW</span>
                </div>

                <h1 className="text-xl font-semibold text-gray-900 mb-2">
                    Team Attendance Overview
                </h1>

                {/* ── Filter Row ──────────────────────────────────────────────────── */}
                <div className="flex flex-wrap items-end gap-3 mb-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[220px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or employee"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleApply()}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xs text-sm text-[#6B7280]
                             placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F279B] bg-white"
                        />

                    </div>

                    <DateInput label="Date From" value={dateFromInput} onChange={setDateFromInput} />
                    <DateInput label="Date To" value={dateToInput} onChange={setDateToInput} />

                    {/* Status */}
                    <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500 font-medium invisible select-none">
                            s
                        </label>
                        <div className="relative w-[180px]">
                            {/* Selected Box */}
                            <button
                                type="button"
                                onClick={() => setStatusOpen(!statusOpen)}
                                className="w-full flex items-center justify-between pl-3 pr-3 py-2 border border-gray-200 rounded-sm text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300"
                            >
                                {statusInput}
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {/* Dropdown List */}
                            {statusOpen && (
                                <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                                    {statusOptions.map((status) => (
                                        <li key={status}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStatusInput(status);
                                                    setStatusOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2
                            ${statusInput === status ? "bg-[#4F279B] text-white font-semibold"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                            >


                                                {status}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Clear Filters — visible when inputs have values */}
                    {hasInputChanges && (
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1 text-sm text-violet-600 font-medium hover:text-violet-800 py-2 self-end"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* ── Action Buttons ───────────────────────────────────────────────── */}
                <div className="flex items-center gap-3 mb-5">
                    <button
                        onClick={handleApply}
                        className="bg-[#4F279B] hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-semibold px-4 py-2 rounded-sm transition-colors"
                    >


                        Apply Filters
                    </button>
                    <button
                        onClick={handleReset}

                        className="text-[#434655] text-sm font-semibold px-4 py-2 rounded-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>

                {/* ── Active Filter Chips ──────────────────────────────────────────── */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {appliedSearch && (
                            <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full font-medium">
                                Search: &quot;{appliedSearch}&quot;
                                <button onClick={() => removeChip("search")} className="ml-0.5 hover:text-violet-900">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {appliedDateFrom && (
                            <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full font-medium">
                                From: {appliedDateFrom}
                                <button onClick={() => removeChip("from")} className="ml-0.5 hover:text-violet-900">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {appliedDateTo && (
                            <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full font-medium">
                                To: {appliedDateTo}
                                <button onClick={() => removeChip("to")} className="ml-0.5 hover:text-violet-900">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {appliedStatus !== "All Status" && (
                            <span className="inline-flex items-center gap-1 text-xs bg-violet-50 text-violet-700 border border-violet-200 px-2.5 py-1 rounded-full font-medium">
                                Status: {appliedStatus}
                                <button onClick={() => removeChip("status")} className="ml-0.5 hover:text-violet-900">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        <span className="text-xs text-gray-400 self-center">
                            {filtered.filter((e) => !e.restDay).length} result
                            {filtered.filter((e) => !e.restDay).length !== 1 ? "s" : ""}
                        </span>
                    </div>
                )}

                {/* ── Cards Grid or Empty State ────────────────────────────────────── */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Search className="w-10 h-10 text-gray-300 mb-3" />
                        <p className="text-gray-600 font-semibold text-sm">No employees found</p>
                        <p className="text-gray-400 text-xs mt-1">
                            Try adjusting your search or filters
                        </p>
                        <button
                            onClick={handleReset}
                            className="mt-4 text-sm text-violet-600 font-semibold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {filtered.map((emp) => (
                            <EmployeeCard key={emp.id} emp={emp} />
                        ))}
                    </div>
                )}

                {/* ── Summary Footer ───────────────────────────────────────────────── */}

                <div className="bg-[#312E81] text-white rounded-2xl px-6 py-6 flex flex-wrap items-center gap-6">
                    <div>

                        <p className="text-xs font-bold text-[#C7D2FE] uppercase tracking-wide">
                            Total Workforce
                        </p>
                        <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold">{totalCount}</p>
                            <p className="text-xs text-[#A5B4FC]">Employees</p>

                        </div>

                    </div>

                    <div className="w-px h-10 bg-violet-500" />

                    <div>
                        <p className="text-xs font-bold text-[#C7D2FE] uppercase tracking-wide">
                            Present Today
                        </p>
                        <p className="text-2xl font-bold">{presentCount}</p>
                    </div>
                    <div className="w-px h-10 bg-violet-500" />
                    <div>
                        <p className="text-xs font-bold text-[#C7D2FE] uppercase tracking-wide">
                            On Leave
                        </p>
                        <p className="text-2xl font-bold">{onLeaveCount}</p>
                    </div>

                    <div className="ml-auto flex items-center">
                        <div className="flex -space-x-2">
                            {["bg-amber-300", "bg-blue-300", "bg-pink-300"].map((c, i) => (
                                <div
                                    key={i}
                                    className={`w-8 h-8 rounded-full ${c}`}
                                />
                            ))}
                        </div>
                        <div className="w-8 h-8 rounded-full 

                        bg-[#4338CA] border-2 border-violet-700 flex items-center justify-center text-xs font-bold ml-[-8px]">
                            +{totalCount}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
