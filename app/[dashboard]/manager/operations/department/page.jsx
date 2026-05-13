"use client";

import { useState, useEffect, useCallback } from "react";
import {
    ChevronRight,
    Plus,
    Building2,
    Search,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    Loader2,
    AlertCircle,
    RefreshCw,
    Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import { getDepartments, deleteDepartment } from "@/services/departmentService";

// ─── Breadcrumb ──────────────────────────────────────────────────────────────
function Breadcrumb() {
    return (
        <nav className="flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase text-gray-400">
            <span className="text-[#737686] -tracking-tight font-semibold">Department</span>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-[#4A45B6] font-semibold">Department Management</span>
        </nav>
    );
}

// ─── Page Header ─────────────────────────────────────────────────────────────
function PageHeader({ onAdd }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                
                <h1 className="mt-2 text-2xl font-semibold text-gray-800 tracking-tight">
                    Departments
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Manage your organization's departments and their details.
                </p>
            </div>
            <button
                onClick={onAdd}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-150 whitespace-nowrap"
            >
                <Plus size={15} />
                Add Department
            </button>
        </div>
    );
}

// ─── Stats Cards ─────────────────────────────────────────────────────────────
function StatsCards({ total, active, inactive }) {
    const cards = [
        {
            label: "Total Departments",
            value: total,
            color: "bg-indigo-50 text-indigo-700 border-indigo-100",
            dot: "bg-indigo-500",
        },
        {
            label: "Active",
            value: active,
            color: "bg-green-50 text-green-700 border-green-100",
            dot: "bg-green-500",
        },
        {
            label: "Inactive",
            value: inactive,
            color: "bg-gray-50 text-gray-500 border-gray-200",
            dot: "bg-gray-400",
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {cards.map((c) => (
                <div
                    key={c.label}
                    className={`rounded-xl border px-5 py-4 flex items-center gap-3 ${c.color}`}
                >
                    <span className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${c.dot}`} />
                    <div>
                        <p className="text-xs font-medium opacity-70">{c.label}</p>
                        <p className="text-2xl font-semibold leading-tight">{value_display(c.value)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function value_display(val) {
    if (val === null || val === undefined) return "—";
    return val;
}

// ─── Search & Filter Bar ─────────────────────────────────────────────────────
function SearchFilterBar({ search, onSearch, statusFilter, onStatusFilter, onRefresh, loading }) {
    return (
        <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
                <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Search by name or code…"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-150 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
            </div>

            {/* Status filter */}
            <div className="relative">
                <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilter(e.target.value)}
                    className="appearance-none rounded-lg border border-gray-200 bg-gray-50 pl-8 pr-8 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <ChevronRightIcon size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>

            {/* Refresh */}
            <button
                onClick={onRefresh}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-600 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 disabled:opacity-50"
            >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
        </div>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ active }) {
    return active ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-semibold text-green-600">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Active
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            Inactive
        </span>
    );
}

// ─── Table ────────────────────────────────────────────────────────────────────
function DepartmentTable({ departments, onEdit, onDelete, deletingId }) {
    if (departments.length === 0) {
        return (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                <Building2 size={36} className="text-gray-200" />
                <p className="text-sm font-medium">No departments found</p>
                <p className="text-xs text-gray-400">Try adjusting your search or filters.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100">
                        {["#", "Department Name", "Code", "Head of Department", "Status", "Actions"].map((h) => (
                            <th
                                key={h}
                                className="pb-3 pt-1 text-left text-xs font-semibold uppercase tracking-wide text-gray-400 px-3 first:pl-0 last:pr-0 last:text-right"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {departments.map((dept, idx) => (
                        <tr
                            key={dept.id ?? idx}
                            className="group hover:bg-indigo-50/40 transition-colors duration-100"
                        >
                            <td className="py-3.5 px-3 pl-0 text-gray-400 text-xs font-medium">
                                {idx + 1}
                            </td>
                            <td className="py-3.5 px-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                                        <Building2 size={14} className="text-indigo-500" />
                                    </div>
                                    <span className="font-medium text-gray-800">{dept.name || "—"}</span>
                                </div>
                            </td>
                            <td className="py-3.5 px-3">
                                <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">
                                    {dept.code || "—"}
                                </span>
                            </td>
                            <td className="py-3.5 px-3 text-gray-600">
                                {dept.manager || <span className="text-gray-300 italic">Not assigned</span>}
                            </td>
                            <td className="py-3.5 px-3">
                                <StatusBadge active={dept.isActive} />
                            </td>
                            <td className="py-3.5 px-3 pr-0 text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                    <button
                                        onClick={() => onEdit(dept)}
                                        className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-150"
                                        title="Edit"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(dept)}
                                        disabled={deletingId === dept.id}
                                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150 disabled:opacity-50"
                                        title="Delete"
                                    >
                                        {deletingId === dept.id
                                            ? <Loader2 size={14} className="animate-spin" />
                                            : <Trash2 size={14} />}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, totalItems, pageSize, onPage }) {
    if (totalPages <= 1) return null;

    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, totalItems);

    return (
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
                Showing <span className="font-semibold text-gray-600">{from}–{to}</span> of{" "}
                <span className="font-semibold text-gray-600">{totalItems}</span> departments
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPage(page - 1)}
                    disabled={page === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={14} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, i, arr) => {
                        if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
                        acc.push(p);
                        return acc;
                    }, [])
                    .map((p, i) =>
                        p === "…" ? (
                            <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-xs">…</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPage(p)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all ${p === page
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                                    }`}
                            >
                                {p}
                            </button>
                        )
                    )}

                <button
                    onClick={() => onPage(page + 1)}
                    disabled={page === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRightIcon size={14} />
                </button>
            </div>
        </div>
    );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ department, onConfirm, onCancel, loading }) {
    if (!department) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-full flex flex-col max-w-sm rounded-2xl bg-white shadow-xl p-6 mx-4 items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-4">
                    <Trash2 size={20} className="text-red-500" />
                </div>
                <h3 className="text-base font-semibold text-gray-800">Delete Department</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-700">{department.name}</span>?
                </p>
                <div className="mt-6 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-all disabled:opacity-60"
                    >
                        {loading && <Loader2 size={13} className="animate-spin" />}
                        {loading ? "Deleting…" : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Error Banner ─────────────────────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
    if (!message) return null;
    return (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span className="flex-1">{message}</span>
            <button onClick={onDismiss} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

export default function DepartmentListPage() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);

    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const tenantId = useTenant();
    const router = useRouter();

    // ── Fetch ──────────────────────────────────────────────────────────────
    const fetchDepartments = useCallback(async () => {
        if (!tenantId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await getDepartments(tenantId);
            setDepartments(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load departments.");
        } finally {
            setLoading(false);
        }
    }, [tenantId]);

    useEffect(() => {
        fetchDepartments();
    }, [fetchDepartments]);

    // ── Filter + search ────────────────────────────────────────────────────
    const filtered = departments.filter((d) => {
        const matchesSearch =
            !search ||
            d.name?.toLowerCase().includes(search.toLowerCase()) ||
            d.code?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "active" && d.isActive) ||
            (statusFilter === "inactive" && !d.isActive);
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // Reset to page 1 when filters change
    useEffect(() => { setPage(1); }, [search, statusFilter]);

    // ── Stats ──────────────────────────────────────────────────────────────
    const totalActive = departments.filter((d) => d.isActive).length;
    const totalInactive = departments.length - totalActive;

    // ── Delete ─────────────────────────────────────────────────────────────
    async function handleDeleteConfirm() {
        if (!deleteTarget) return;
        setDeletingId(deleteTarget.id);
        try {
            await deleteDepartment(tenantId, deleteTarget.id);
            setDepartments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete department.");
            setDeleteTarget(null);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50/60 px-4 py-8 sm:px-6 lg:px-10">
            <div className="w-full space-y-6">

                {/* Header */}
                <PageHeader onAdd={() => router.push(`/${tenantId}/admin/operations/department/add`)} />

                {/* Stats */}
                <StatsCards
                    total={departments.length}
                    active={totalActive}
                    inactive={totalInactive}
                />

                {/* Error */}
                <ErrorBanner message={error} onDismiss={() => setError(null)} />

                {/* Table Card */}
                <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">

                    {/* Section Header */}
                    <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                            <Building2 size={16} className="text-indigo-600" />
                        </div>
                        <h2 className="text-base font-semibold text-gray-700">Department List</h2>
                        {!loading && (
                            <span className="ml-auto text-xs font-semibold text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">
                                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>

                    {/* Search & Filter */}
                    <SearchFilterBar
                        search={search}
                        onSearch={setSearch}
                        statusFilter={statusFilter}
                        onStatusFilter={setStatusFilter}
                        onRefresh={fetchDepartments}
                        loading={loading}
                    />

                    {/* Table or Loader */}
                    {loading ? (
                        <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                            <Loader2 size={28} className="animate-spin text-indigo-400" />
                            <p className="text-sm">Loading departments…</p>
                        </div>
                    ) : (
                        <DepartmentTable
                            departments={paginated}
                            onEdit={(dept) => router.push(`/${tenantId}/admin/operations/department/edit/${dept.id}`)}
                            onDelete={(dept) => setDeleteTarget(dept)}
                            deletingId={deletingId}
                        />
                    )}

                    {/* Pagination */}
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalItems={filtered.length}
                        pageSize={PAGE_SIZE}
                        onPage={setPage}
                    />
                </div>
            </div>

            {/* Delete Modal */}
            <DeleteModal
                department={deleteTarget}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
                loading={!!deletingId}
            />
        </div>
    );
}