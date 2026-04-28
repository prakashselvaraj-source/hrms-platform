"use client";

import { useState, useMemo } from "react";
import {

    ChevronDown,
    Plus,
    Pencil,
    UserPlus,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    SearchIcon,
} from "lucide-react";

// ─── Static Data ─────────────────────────────────────────────────────────────
const INITIAL_POLICIES = [
    {
        id: 1,
        name: "Standard Office",
        accentColor: "bg-[#712AE2]",
        workingHours: "9 hrs / day",
        shiftType: "Fixed",
        shiftColor: "bg-blue-100 text-blue-700",
        assignedEmployees: 42,
        avatars: ["bg-amber-300", "bg-blue-300", "bg-pink-300"],
        status: "Active",
        department: "Engineering",
    },
    {
        id: 2,
        name: "Flexible WFH",
        accentColor: "bg-emerald-500",
        workingHours: "8 hrs / day",
        shiftType: "Flexible",
        shiftColor: "bg-emerald-100 text-emerald-700",
        assignedEmployees: 84,
        avatars: ["bg-green-300", "bg-teal-300", "bg-cyan-300"],
        status: "Active",
        department: "Engineering",
    },
    {
        id: 3,
        name: "Night Shift",
        accentColor: "bg-[#E2E8F0]",
        workingHours: "8.5 hrs / day",
        shiftType: "Fixed",
        shiftColor: "bg-blue-100 text-blue-700",
        assignedEmployees: 284,
        avatars: ["bg-purple-300", "bg-indigo-300", "bg-blue-300"],
        status: "Inactive",
        department: "Engineering",
    },
    {
        id: 4,
        name: "Field Staff",
        accentColor: "bg-amber-300",
        workingHours: "10 hrs / day",
        shiftType: "Flexible",
        shiftColor: "bg-emerald-100 text-emerald-700",
        assignedEmployees: 381,
        avatars: ["bg-amber-300", "bg-red-300", "bg-pink-300"],
        status: "Active",
        department: "Marketing",
    },
];

const TABS = ["General", "Working Hours", "Shifts", "Attendance Rules"];
const DEPARTMENTS = ["Engineering", "Marketing", "HR", "Finance", "Operations"];
const SHIFT_TYPES = ["All Shift Types", "Fixed", "Flexible", "Remote"];
const ITEMS_PER_PAGE = 4;

// ─── Avatar Stack ─────────────────────────────────────────────────────────────
function AvatarStack({ avatars, count }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
                {avatars.slice(0, 3).map((c, i) => (
                    <div
                        key={i}
                        className={`w-6 h-6 rounded-full ${c} border-2 border-white`}
                    />
                ))}
            </div>
            <span className="text-xs text-gray-500">+{count} employees</span>
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusDot({ status }) {
    const active = status === "Active";
    return (
        <span className="flex items-center gap-1.5 text-sm">
            <span
                className={`w-2 h-2 rounded-full ${active ? "bg-emerald-500" : "bg-gray-400"}`}
            />
            <span className={active ? "text-emerald-600" : "text-gray-400"}>
                {status}
            </span>
        </span>
    );
}

// ─── Create / Edit Policy Drawer ──────────────────────────────────────────────
function PolicyDrawer({ open, onClose, editPolicy, onSave }) {
    const [activeTab, setActiveTab] = useState("General");
    const [policyName, setPolicyName] = useState(editPolicy?.name || "");
    const [policyCode, setPolicyCode] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [shiftType, setShiftType] = useState("Fixed");

    // Reset when editPolicy changes
    useMemo(() => {
        if (editPolicy) {
            setPolicyName(editPolicy.name || "");
            setIsActive(editPolicy.status === "Active");
            setShiftType(editPolicy.shiftType || "Fixed");
        } else {
            setPolicyName("");
            setPolicyCode("");
            setDescription("");
            setIsActive(true);
            setShiftType("Fixed");
        }
    }, [editPolicy]);

    function handleSave() {
        if (!policyName.trim()) return;
        onSave({
            name: policyName.trim(),
            shiftType,
            status: isActive ? "Active" : "Inactive",
        });
        onClose();
    }

    if (!open) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 z-30"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-40 flex flex-col overflow-hidden">
                {/* Breadcrumb */}
                <div className="px-5 pt-4 pb-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400">
                        Attendance &rsaquo;{" "}
                        <span className="text-gray-600">
                            {editPolicy ? "Create / Edit Policy" : "Create / Edit Policy"}
                        </span>
                    </p>
                </div>

                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">
                            {editPolicy ? "Edit Policy" : "Create New Policy"}
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Icon row */}
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-500">
                            {editPolicy ? "Edit Policy" : "|Create New Policy"}
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-5 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-xs font-medium py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${activeTab === tab
                                ? "border-violet-600 text-violet-600"
                                : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
                    {activeTab === "General" && (
                        <>
                            {/* Policy Name + Code */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                        POLICY NAME <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={policyName}
                                            onChange={(e) => setPolicyName(e.target.value)}
                                            className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 pr-8"
                                        >
                                            <option value="">Monthly</option>
                                            <option value="Standard Office">Standard Office</option>
                                            <option value="Flexible WFH">Flexible WFH</option>
                                            <option value="Night Shift">Night Shift</option>
                                            <option value="Field Staff">Field Staff</option>
                                            {policyName && !["Standard Office", "Flexible WFH", "Night Shift", "Field Staff"].includes(policyName) && (
                                                <option value={policyName}>{policyName}</option>
                                            )}
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                        POLICY CODE
                                    </label>
                                    <input
                                        type="text"
                                        value={policyCode}
                                        onChange={(e) => setPolicyCode(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
                                        placeholder="e.g. POL-001"
                                    />
                                </div>
                            </div>

                            {/* Policy Name text input */}
                            <div>
                                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                    POLICY NAME <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={policyName}
                                    onChange={(e) => setPolicyName(e.target.value)}
                                    placeholder="Enter policy name"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-semibold text-gray-700 mb-1 block">
                                    DESCRIPTION
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Monthly"
                                    rows={4}
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                                />
                            </div>

                            {/* Policy Active toggle */}
                            <div
                                className={`flex items-start gap-3 rounded-xl p-4 border ${isActive
                                    ? "bg-emerald-50 border-emerald-200"
                                    : "bg-gray-50 border-gray-200"
                                    }`}
                            >
                                <button
                                    onClick={() => setIsActive(!isActive)}
                                    className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? "bg-emerald-500" : "bg-gray-300"
                                        }`}
                                >
                                    {isActive && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        Policy Active
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        When active, this policy will be enforced for all assigned
                                        employees.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "Working Hours" && (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-600">Working Hours Configuration</p>
                            <p className="text-xs text-gray-400 mt-1">Set daily working hours and break times</p>
                        </div>
                    )}

                    {activeTab === "Shifts" && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-700 mb-1 block">SHIFT TYPE</label>
                                <div className="relative">
                                    <select
                                        value={shiftType}
                                        onChange={(e) => setShiftType(e.target.value)}
                                        className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 pr-8"
                                    >
                                        <option value="Fixed">Fixed</option>
                                        <option value="Flexible">Flexible</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "Attendance Rules" && (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-gray-600">Attendance Rules</p>
                            <p className="text-xs text-gray-400 mt-1">Configure late arrival, overtime and absence rules</p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={!policyName.trim()}
                        className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                    >
                        {editPolicy ? "Save Changes" : "Create Policy"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AttendancePolicies() {
    const [policies, setPolicies] = useState(INITIAL_POLICIES);
    const [search, setSearch] = useState("");
    const [shiftFilter, setShiftFilter] = useState("All Shift Types");
    const [deptFilter, setDeptFilter] = useState("Engineering");
    const [currentPage, setCurrentPage] = useState(1);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editPolicy, setEditPolicy] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // ── Filtering ──────────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        return policies.filter((p) => {
            const matchSearch =
                !search || p.name.toLowerCase().includes(search.toLowerCase());
            const matchShift =
                shiftFilter === "All Shift Types" || p.shiftType === shiftFilter;
            const matchDept =
                deptFilter === "Engineering" || p.department === deptFilter || !deptFilter;
            return matchSearch && matchShift && matchDept;
        });
    }, [policies, search, shiftFilter, deptFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // ── Actions ────────────────────────────────────────────────────────────────
    function handleCreate() {
        setEditPolicy(null);
        setDrawerOpen(true);
    }

    function handleEdit(policy) {
        setEditPolicy(policy);
        setDrawerOpen(true);
    }

    function handleDelete(id) {
        setPolicies((prev) => prev.filter((p) => p.id !== id));
        setDeleteId(null);
    }

    function handleSave(data) {
        if (editPolicy) {
            setPolicies((prev) =>
                prev.map((p) =>
                    p.id === editPolicy.id
                        ? {
                            ...p,
                            name: data.name,
                            shiftType: data.shiftType,
                            shiftColor:
                                data.shiftType === "Fixed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-emerald-100 text-emerald-700",
                            status: data.status,
                        }
                        : p
                )
            );
        } else {
            const newPolicy = {
                id: Date.now(),
                name: data.name,
                accentColor:
                    data.shiftType === "Fixed" ? "bg-violet-500" : "bg-emerald-500",
                workingHours: "8 hrs / day",
                shiftType: data.shiftType,
                shiftColor:
                    data.shiftType === "Fixed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700",
                assignedEmployees: 0,
                avatars: ["bg-gray-300", "bg-gray-400", "bg-gray-500"],
                status: data.status,
                department: deptFilter !== "Engineering" ? deptFilter : "Engineering",
            };
            setPolicies((prev) => [...prev, newPolicy]);
        }
    }

    function handleToggleStatus(id) {
        setPolicies((prev) =>
            prev.map((p) =>
                p.id === id
                    ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" }
                    : p
            )
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* ── Top Header ──────────────────────────────────────────────────────── */}


            {/* ── Main Content ────────────────────────────────────────────────────── */}
            <div className="px-6 py-6">
                {/* Page Header */}
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Attendance Policies
                        </h1>
                        <p className="text-sm text-gray-400 mt-1 max-w-xl">
                            Configure organizational rules for working hours, shift flexibility,
                            and employee assignments to maintain workspace efficiency.
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors flex-shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Create Policy
                    </button>
                </div>

                {/* ── Filter Row ──────────────────────────────────────────────────── */}
                <div className="flex items-center gap-3 mt-5 mb-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search policies by name..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
                        />
                    </div>

                    {/* Shift Type Filter */}
                    <div className="relative">
                        <select
                            value={shiftFilter}
                            onChange={(e) => {
                                setShiftFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 cursor-pointer"
                        >
                            {SHIFT_TYPES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Department Filter */}
                    <div className="relative">
                        <select
                            value={deptFilter}
                            onChange={(e) => {
                                setDeptFilter(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 cursor-pointer"
                        >
                            {DEPARTMENTS.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                {/* ── Table ───────────────────────────────────────────────────────── */}
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr] px-5 py-3 border-b border-gray-100 bg-gray-50">
                        {["POLICY NAME", "WORKING HOURS", "SHIFT TYPE", "ASSIGNED EMPLOYEES", "STATUS", "ACTIONS"].map(
                            (col) => (
                                <p
                                    key={col}
                                    className="text-[10px] font-bold text-gray-400 uppercase tracking-wide"
                                >
                                    {col}
                                </p>
                            )
                        )}
                    </div>

                    {/* Table Rows */}
                    {paginated.length === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <Search className="w-8 h-8 text-gray-300 mb-2" />
                            <p className="text-sm font-semibold text-gray-500">No policies found</p>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        paginated.map((policy, idx) => (
                            <div
                                key={policy.id}
                                className={`grid grid-cols-[2fr_1fr_1fr_2fr_1fr_1fr] px-5 py-4 items-center ${idx < paginated.length - 1 ? "border-b border-gray-50" : ""
                                    } hover:bg-gray-50/50 transition-colors`}
                            >
                                {/* Policy Name */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-1 h-8 rounded-full ${policy.accentColor}`}
                                    />
                                    <span className="text-sm font-semibold text-gray-800">
                                        {policy.name}
                                    </span>
                                </div>

                                {/* Working Hours */}
                                <span className="text-sm text-gray-600">{policy.workingHours}</span>

                                {/* Shift Type */}
                                <span
                                    className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${policy.shiftColor}`}
                                >
                                    {policy.shiftType}
                                </span>

                                {/* Assigned Employees */}
                                <AvatarStack
                                    avatars={policy.avatars}
                                    count={policy.assignedEmployees}
                                />

                                {/* Status */}
                                <button
                                    onClick={() => handleToggleStatus(policy.id)}
                                    title="Click to toggle status"
                                >
                                    <StatusDot status={policy.status} />
                                </button>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(policy)}
                                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(policy)}
                                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-300 transition-colors"
                                        title="Assign employees"
                                    >
                                        <UserPlus className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(policy.id)}
                                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-300 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {/* ── Pagination ─────────────────────────────────────────────────── */}
                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                            Showing {paginated.length} of {filtered.length} policies
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setCurrentPage(p)}
                                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${p === currentPage
                                        ? "bg-violet-600 text-white"
                                        : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Delete Confirmation Modal ────────────────────────────────────────── */}
            {deleteId && (
                <>
                    <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setDeleteId(null)} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 p-6 w-80">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 text-center mb-1">
                            Delete Policy
                        </h3>
                        <p className="text-xs text-gray-500 text-center mb-5">
                            This action cannot be undone. All employee assignments will be removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 border border-gray-300 text-gray-600 text-sm font-semibold py-2 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ── Create / Edit Drawer ─────────────────────────────────────────────── */}
            <PolicyDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                editPolicy={editPolicy}
                onSave={handleSave}
            />
        </div>
    );
}