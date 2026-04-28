"use client";
import { useEffect, useState, useCallback } from "react";
import { Download, ChevronDown, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, CalendarDays } from "lucide-react";
import { getAllLeaveRequests, updateLeaveStatus } from "@/services/user/leaveService";
import { useTenant } from "@/hooks/useTenant";
import { useRouter } from "next/navigation";

// ─── Static sample data ───────────────────────────────────────────────────────

const SAMPLE_REQUESTS = [
  {
    id: 1,
    employeeName: "Pam Beesley",
    employeeDesignation: "Receptionist",
    avatar: "PB",
    avatarBg: "bg-pink-400",
    leaveType: "Casual Leave",
    startDate: "2024-10-24",
    endDate: "2024-10-25",
    numberOfDays: 2,
    reason: "Family function",
    appliedOn: "2024-10-20",
    status: "PENDING",
  },
  {
    id: 2,
    employeeName: "Jim Halpert",
    employeeDesignation: "Sales",
    avatar: "JH",
    avatarBg: "bg-blue-400",
    leaveType: "Earned Leave",
    startDate: "2024-11-01",
    endDate: "2024-11-03",
    numberOfDays: 3,
    reason: "Planned vacation",
    appliedOn: "2024-10-18",
    status: "PENDING",
  },
  {
    id: 3,
    employeeName: "Ryan Kumar",
    employeeDesignation: "Office Analyst",
    avatar: "RK",
    avatarBg: "bg-orange-400",
    leaveType: "Sick Leave",
    startDate: "2024-10-20",
    endDate: "2024-10-21",
    numberOfDays: 2,
    reason: "Doctor appointment",
    appliedOn: "2024-10-19",
    status: "APPROVED",
  },
  {
    id: 4,
    employeeName: "Toby Henderson",
    employeeDesignation: "Office Manager",
    avatar: "TH",
    avatarBg: "bg-purple-400",
    leaveType: "Casual Leave",
    startDate: "2024-10-26",
    endDate: "2024-10-26",
    numberOfDays: 1,
    reason: "Personal work",
    appliedOn: "2024-10-22",
    status: "REJECTED",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    textColor: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
  },
  APPROVED: {
    label: "Approved",
    textColor: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    textColor: "text-red-600",
    bg: "bg-red-50",
    ring: "ring-red-200",
  },
};

const fmtDate = (d) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, iconColor, accentColor, badgeText, badgeBg, badgeText2, value, label }) {
  return (
    <div className={`relative flex-1 min-w-[130px] bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 overflow-hidden`}>
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl ${accentColor}`} />
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${badgeBg}`}>
          <Icon size={15} className={iconColor} />
        </div>
        <span className={`text-[9px] font-bold tracking-widest uppercase ${badgeText2}`}>{badgeText}</span>
      </div>
      <p className={`text-3xl font-semibold ${iconColor}`}>{value}</p>
      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{label}</p>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ring-1 ${cfg.bg} ${cfg.textColor} ${cfg.ring}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${status === "PENDING" ? "bg-amber-500" : status === "APPROVED" ? "bg-emerald-500" : "bg-red-500"}`} />
      {cfg.label}
    </span>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

function ActionButtons({ status, onApprove, onReject, onView }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onView}
        className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
      >
        View
      </button>

      {status === "PENDING" && (
        <>
          <button
            onClick={onApprove}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-150 flex items-center gap-1"
          >
            <CheckCircle size={11} />
            Approve
          </button>
          <button
            onClick={onReject}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 transition-all duration-150 flex items-center gap-1"
          >
            <XCircle size={11} />
            Reject
          </button>
        </>
      )}

      {status === "APPROVED" && (
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide flex items-center gap-1">
          <CheckCircle size={11} />
          Processed
        </span>
      )}

      {status === "REJECTED" && (
        <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide flex items-center gap-1">
          <XCircle size={11} />
          Rejected
        </span>
      )}
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({ open, action, onConfirm, onCancel }) {
  if (!open) return null;
  const isApprove = action === "APPROVED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl w-[380px] p-7 shadow-2xl border border-gray-100">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${isApprove ? "bg-emerald-50" : "bg-red-50"}`}>
          {isApprove
            ? <CheckCircle size={22} className="text-emerald-500" />
            : <XCircle size={22} className="text-red-400" />
          }
        </div>

        <h2 className="text-[15px] font-semibold text-gray-900 mb-2">
          {isApprove ? "Approve Leave Request?" : "Reject Leave Request?"}
        </h2>
        <p className="text-[13px] text-gray-500 mb-7 leading-relaxed">
          This action will{" "}
          <span className={`font-semibold ${isApprove ? "text-emerald-600" : "text-red-500"}`}>
            {isApprove ? "approve" : "reject"}
          </span>{" "}
          the leave request. The employee will be notified of this decision.
        </p>

        <div className="flex justify-end gap-2.5">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[13px] font-medium border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-[13px] font-semibold rounded-xl text-white transition-all ${isApprove
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-red-500 hover:bg-red-600"
              }`}
          >
            Yes, {isApprove ? "Approve" : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Table Headers ────────────────────────────────────────────────────────────

const TABLE_HEADERS = ["Employee", "Leave Type", "Period", "Days", "Reason", "Applied On", "Status", "Actions"];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeaveRequests() {
  const [rows, setRows] = useState(SAMPLE_REQUESTS);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 1, totalElements: 0 });
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isLoading, setIsLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null, action: null });

  const router = useRouter();
  const tenantId = useTenant();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || "");
    }
  }, []);

  const fetchRequests = useCallback(
    async (page = 0) => {
      if (!tenantId || !token) return;
      try {
        setIsLoading(true);
        const response = await getAllLeaveRequests(tenantId, token, page, pagination.size);
        const rawData = response?.data || [];

        const processedData = rawData.map((item) => {
          let u = { ...item };
          if (!u.numberOfDays && u.startDate && u.endDate) {
            const diff = Math.abs(new Date(u.endDate) - new Date(u.startDate));
            u.numberOfDays = Math.ceil(diff / 86400000) + 1;
          }
          if (!u.employeeName && u.name) u.employeeName = u.name;
          if (!u.employeeDesignation && u.role) u.employeeDesignation = u.role;
          if (!u.avatar && u.employeeName)
            u.avatar = u.employeeName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
          if (!u.avatarBg) {
            const colors = ["bg-pink-400", "bg-blue-400", "bg-orange-400", "bg-purple-400", "bg-indigo-400"];
            u.avatarBg = colors[u.id % colors.length] || "bg-gray-400";
          }
          return u;
        });

        setRows(processedData);
        setPagination(response?.pagination || { page: 0, totalPages: 1, totalElements: 0, size: 10 });
        setStats(response?.stats || { pending: 0, approved: 0, rejected: 0, total: 0 });
      } catch (err) {
        console.error("Failed to fetch leave requests:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [tenantId, token, pagination.size]
  );

  useEffect(() => {
    if (tenantId && token) fetchRequests();
  }, [tenantId, token, fetchRequests]);

  // Compute stats from local rows when API not available
  useEffect(() => {
    setStats({
      pending: rows.filter((r) => r.status === "PENDING").length,
      approved: rows.filter((r) => r.status === "APPROVED").length,
      rejected: rows.filter((r) => r.status === "REJECTED").length,
      total: rows.length,
    });
  }, [rows]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateLeaveStatus(tenantId, token, id, status);
    } catch (err) {
      console.error("Failed to update leave status:", err);
    }
  };

  const updateStatus = (id, newStatus) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));

  const confirmAction = async () => {
    const { id, action } = confirmModal;
    await handleUpdateStatus(id, action);
    updateStatus(id, action);
    setConfirmModal({ open: false, id: null, action: null });
  };

  const handleView = (row) => {
    router.push(`/${tenantId}/admin/operations/leaveManagement/leave-request/${row.id}`);
  };

  const filtered = rows.filter((r) => {
    const typeOk = typeFilter === "All Types" || r.leaveType === typeFilter;
    const statusOk = statusFilter === "All Status" || r.status === statusFilter;
    return typeOk && statusOk;
  });

  return (
    <div className="min-h-screen bg-gray-50/70 p-6 font-sans">

      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-gray-900 tracking-tight">Leave Requests</h1>
        <p className="text-[12px] text-indigo-500 mt-1 font-medium">
          ↑ 8 pending · 34 approved this month
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <StatCard
          icon={Clock}
          iconColor="text-amber-600"
          accentColor="bg-amber-400"
          badgeBg="bg-amber-50"
          badgeText="Needs Review"
          badgeText2="text-amber-500"
          value={stats.pending}
          label="Pending"
        />
        <StatCard
          icon={CheckCircle}
          iconColor="text-emerald-600"
          accentColor="bg-emerald-400"
          badgeBg="bg-emerald-50"
          badgeText="Completed"
          badgeText2="text-emerald-500"
          value={stats.approved}
          label="Approved"
        />
        <StatCard
          icon={XCircle}
          iconColor="text-red-500"
          accentColor="bg-red-400"
          badgeBg="bg-red-50"
          badgeText="Rejected"
          badgeText2="text-red-400"
          value={stats.rejected}
          label="Rejected"
        />
        <StatCard
          icon={CalendarDays}
          iconColor="text-indigo-600"
          accentColor="bg-indigo-400"
          badgeBg="bg-indigo-50"
          badgeText="Total Volume"
          badgeText2="text-indigo-500"
          value={stats.total}
          label="Total This Month"
        />
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Type Filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-[12px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 cursor-pointer shadow-sm transition-all"
            >
              <option>All Types</option>
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Earned Leave</option>
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-[12px] font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 cursor-pointer shadow-sm transition-all"
            >
              <option>All Status</option>
              <option>PENDING</option>
              <option>APPROVED</option>
              <option>REJECTED</option>
            </select>
            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Export */}
        <button className="flex items-center gap-1.5 text-[12px] font-semibold text-indigo-600 border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-3.5 py-2 transition-colors">
          <Download size={12} />
          Export
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
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
              filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors group">

                  {/* Employee */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-full ${row.avatarBg} flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-sm`}
                      >
                        {row.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-[12px] leading-tight">{row.employeeName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{row.employeeDesignation}</p>
                      </div>
                    </div>
                  </td>

                  {/* Leave Type */}
                  <td className="px-4 py-3.5">
                    <span className="text-[12px] text-gray-700 font-medium whitespace-nowrap">{row.leaveType}</span>
                  </td>

                  {/* Period */}
                  <td className="px-4 py-3.5">
                    <div className="text-[11px] text-gray-600 whitespace-nowrap leading-relaxed">
                      <span>{fmtDate(row.startDate)}</span>
                      <span className="mx-1 text-gray-300">–</span>
                      <span>{fmtDate(row.endDate)}</span>
                    </div>
                  </td>

                  {/* Days */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-[12px] font-bold text-gray-700">
                      {row.numberOfDays}
                    </span>
                  </td>

                  {/* Reason */}
                  <td className="px-4 py-3.5 text-[12px] text-gray-500 max-w-[120px] truncate">{row.reason}</td>

                  {/* Applied On */}
                  <td className="px-4 py-3.5 text-[11px] text-gray-400 whitespace-nowrap font-medium">
                    {fmtDate(row.appliedOn)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={row.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <ActionButtons
                      status={row.status}
                      onView={() => handleView(row)}
                      onApprove={() => setConfirmModal({ open: true, id: row.id, action: "APPROVED" })}
                      onReject={() => setConfirmModal({ open: true, id: row.id, action: "REJECTED" })}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ── Table Footer ── */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-50 bg-gray-50/40">
          <p className="text-[11px] text-gray-400 font-medium">
            Showing{" "}
            <span className="text-gray-600 font-semibold">{filtered.length}</span>{" "}
            of{" "}
            <span className="text-gray-600 font-semibold">{pagination.totalElements || rows.length}</span>{" "}
            requests
          </p>

          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.page === 0}
              onClick={() => fetchRequests(pagination.page - 1)}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={13} />
            </button>

            <div className="px-3 h-7 rounded-lg bg-indigo-600 text-white text-[11px] font-semibold flex items-center justify-center min-w-[52px]">
              {pagination.page + 1} / {pagination.totalPages}
            </div>

            <button
              disabled={pagination.page + 1 >= pagination.totalPages}
              onClick={() => fetchRequests(pagination.page + 1)}
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirm Modal ── */}
      <ConfirmModal
        open={confirmModal.open}
        action={confirmModal.action}
        onConfirm={confirmAction}
        onCancel={() => setConfirmModal({ open: false, id: null, action: null })}
      />
    </div>
  );
}