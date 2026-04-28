"use client";

import {
  Eye, Filter, Hourglass, CircleX, BadgeCheck,
  ChevronDown, X, Plus,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";
import { useTenant } from "@/hooks/useTenant";
import { getAllLeaveRequests } from "@/services/user/leaveService";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  approved: {
    icon: BadgeCheck,
    iconColor: "text-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    label: "Approved",
  },
  pending: {
    icon: Hourglass,
    iconColor: "text-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-400",
    label: "Pending",
  },
  rejected: {
    icon: CircleX,
    iconColor: "text-red-500",
    badge: "bg-red-50 text-red-600 ring-red-200",
    dot: "bg-red-500",
    label: "Rejected",
  },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ring-1 uppercase tracking-wider ${cfg.badge}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

// ─── Input base ───────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-[12px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeaveManagement() {
  const router   = useRouter();
  const tenantId = useTenant();

  const [data, setData]               = useState([]);
  const [token, setToken]             = useState("");
  const [requestType, setRequestType] = useState("All Requests");
  const [selectedRow, setSelectedRow] = useState(null);

  // Filter modal state
  const [showModal, setShowModal] = useState(false);
  const [period, setPeriod]       = useState("Last month");
  const [fromDate, setFromDate]   = useState("");
  const [toDate, setToDate]       = useState("");
  const [leaveType, setLeaveType] = useState("All");

  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 1, totalElements: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") setToken(localStorage.getItem("token") || "");
  }, []);

useEffect(() => {
  if (!tenantId || !token) return;

  const fetchRequests = async () => {
    try {
      const response = await getAllLeaveRequests(
        tenantId,
        token,
        pagination.page,
        pagination.size
      );

      const fmtDate = (d) =>
        d
          ? new Date(d).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—";

      const list = (response?.data || []).map((item) => ({
        id: item.id,
        status: item.status?.toLowerCase() || "pending",
        employee: item.employeeName,
        leaveType: item.leaveType || "Leave",
        type: "Paid",
        period: `${fmtDate(item.startDate)} – ${fmtDate(item.endDate)}`,
        taken: item.dayType || "1 Day(s)",
        requestDate: fmtDate(item.startDate),
      }));

      setData(list);

      setPagination((prev) => ({
        ...prev,
        ...response.pagination,
      }));

    } catch (err) {
      console.error(err);
    }
  };

  fetchRequests();
}, [tenantId, token, pagination.page]);

  const filtered = data.filter((r) =>
    requestType === "All Requests" || r.status === requestType.toLowerCase()
  );

  const TABLE_HEADERS = [
    "Status", "Employee Name", "Leave Type", "Type",
    "Leave Period", "Days / Hours Taken", "Request Date", "Action",
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 font-sans">
      <Header />

      <main className="p-4 md:p-6">

        {/* ── Page Header ── */}
        <div className="mb-5">
          <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">My Leave Requests</h1>
          <p className="text-[12px] text-gray-400 mt-1 font-medium">Track and manage your leave history.</p>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* ── Toolbar ── */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              {/* Request type filter */}
              <div className="relative">
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-[12px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 cursor-pointer shadow-sm transition-all"
                >
                  <option>All Requests</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
                <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Filter button */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 hover:text-gray-700 transition-all shadow-sm"
              >
                <Filter size={13} />
                Filter
              </button>
            </div>

            {/* Add Request */}
            <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm">
              <Plus size={13} />
              Add Request
            </button>
          </div>

          {/* ── Table ── */}
          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {TABLE_HEADERS.map((h) => (
                    <th
                      key={h}
                      className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-[13px] text-gray-400">
                      No leave requests found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3.5 text-[12px] font-medium text-gray-800">{item.employee}</td>
                      <td className="px-4 py-3.5 text-[12px] text-gray-600">{item.leaveType}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 uppercase tracking-wider">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[12px] text-gray-600 whitespace-nowrap">{item.period}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-gray-100 text-[12px] font-bold text-gray-700">
                          {item.taken}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-[11px] text-gray-400 whitespace-nowrap font-medium">{item.requestDate}</td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => router.push(`/${tenantId}/leaveManagement/leaverequeststatus/${item.id}`)}
                          className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          <Eye size={12} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Footer count ── */}
          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40 flex justify-between">
            <p className="text-[11px] text-gray-400 font-medium">
              Showing <span className="text-gray-700 font-semibold">{filtered.length}</span> of{" "}
              <span className="text-gray-700 font-semibold">{data.length}</span> requests
            </p>

            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40 flex justify-between items-center">

 <div className="flex items-center gap-1.5">

  {/* Prev */}
  <button
    disabled={pagination.page === 0}
    onClick={() =>
      setPagination((p) => ({ ...p, page: p.page - 1 }))
    }
    className="w-7 h-7 rounded-lg border flex items-center justify-center disabled:opacity-30"
  >
    <ChevronLeft size={13} />
  </button>

  {/* Page Info */}
  <div className="px-3 h-7 rounded-lg bg-indigo-600 text-white text-[11px] flex items-center">
    {pagination.page + 1} / {pagination.totalPages}
  </div>

  {/* Next */}
  <button
    disabled={pagination.page + 1 >= pagination.totalPages}
    onClick={() =>
      setPagination((p) => ({ ...p, page: p.page + 1 }))
    }
    className="w-7 h-7 rounded-lg border flex items-center justify-center disabled:opacity-30"
  >
    <ChevronRight size={13} />
  </button>
</div>
</div>
          </div>
        </div>
      </main>

      {/* ── Filter Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-[90%] sm:w-[380px] rounded-2xl shadow-2xl border border-gray-100 p-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Filter size={13} className="text-indigo-500" />
                </div>
                <h2 className="text-[15px] font-semibold text-gray-900">Filter Requests</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Period */}
            <div className="mb-4">
              <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Period</label>
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className={inputCls + " appearance-none pr-8 cursor-pointer"}
                >
                  <option value="Last month">Last Month</option>
                  <option value="Last Week">Last Week</option>
                  <option value="Last six month">Last 6 Months</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* From / To */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">From</label>
                <input
                  type="date" value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">To</label>
                <input
                  type="date" value={toDate} min={fromDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Leave Type */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Leave Type</label>
              <div className="relative">
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className={inputCls + " appearance-none pr-8 cursor-pointer"}
                >
                  <option value="All">All</option>
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="comp">Comp Off</option>
                  <option value="optional">Optional Holiday</option>
                  <option value="permission">Permission</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              <button className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold transition-colors shadow-sm">
                Apply Filters
              </button>
              <button
                onClick={() => { setPeriod("Last month"); setFromDate(""); setToDate(""); setLeaveType("All"); }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[12px] font-semibold hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Details Modal ── */}
      {selectedRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setSelectedRow(null)} />
          <div className="relative bg-white w-[420px] rounded-2xl shadow-2xl border border-gray-100 p-6">

            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-semibold text-gray-900">Leave Details</h2>
              <button
                onClick={() => setSelectedRow(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { label: "Status",       value: <StatusBadge status={selectedRow.status} /> },
                { label: "Employee",     value: selectedRow.employee },
                { label: "Leave Type",   value: selectedRow.leaveType },
                { label: "Type",         value: selectedRow.type },
                { label: "Leave Period", value: selectedRow.period },
                { label: "Taken",        value: selectedRow.taken },
                { label: "Request Date", value: selectedRow.requestDate },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-[11px] font-medium text-gray-400">{label}</span>
                  <span className="text-[12px] font-medium text-gray-800">{value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedRow(null)}
              className="mt-5 w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 text-[12px] font-semibold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}