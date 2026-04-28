"use client";
import { useState } from "react";
import { Download, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const requests = [
  {
    id: 1,
    name: "Pam Beesley",
    role: "Receptionist",
    avatar: "PB",
    avatarBg: "bg-pink-400",
    leaveType: "Casual Leave",
    periodStart: "Oct 24",
    periodEnd: "Oct 25",
    days: 2,
    reason: "Family function",
    appliedOn: "Oct 20",
    status: "PENDING",
  },
  {
    id: 2,
    name: "Jim Halpert",
    role: "Sales",
    avatar: "JH",
    avatarBg: "bg-blue-400",
    leaveType: "Earned Leave",
    periodStart: "Nov 1",
    periodEnd: "Nov 3",
    days: 3,
    reason: "Planned vacation",
    appliedOn: "Oct 18",
    status: "PENDING",
  },
  {
    id: 3,
    name: "Ryan Kumar",
    role: "Office Analyst",
    avatar: "RK",
    avatarBg: "bg-orange-400",
    leaveType: "Sick Leave",
    periodStart: "Oct 20",
    periodEnd: "Oct 21",
    days: 2,
    reason: "Doctor appointment",
    appliedOn: "Oct 19",
    status: "APPROVED",
  },
  {
    id: 4,
    name: "Toby Henderson",
    role: "Office Manager",
    avatar: "TH",
    avatarBg: "bg-purple-400",
    leaveType: "Casual Leave",
    periodStart: "Oct 26",
    periodEnd: "Oct 26",
    days: 1,
    reason: "Personal work",
    appliedOn: "Oct 22",
    status: "REJECTED",
  },
];

const statusConfig = {
  PENDING:  { label: "PENDING",  textColor: "text-amber-500",  bg: "bg-amber-50"  },
  APPROVED: { label: "APPROVED", textColor: "text-green-600",  bg: "bg-green-50"  },
  REJECTED: { label: "REJECTED", textColor: "text-red-500",    bg: "bg-red-50"    },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, badge, badgeColor, value, label, borderColor, highlight }) {
  return (
    <div className={`flex-1 min-w-[120px] border-l-2 rounded-[5px] ${borderColor} bg-white shadow-[0px_1px_2px_#0000000D] px-5 py-4`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="text-lg">{icon}</div>
        <span className={`text-[9px] font-bold uppercase tracking-widest ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <p className={`text-3xl font-bold ${highlight ? highlight : "text-gray-900"}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

function ActionButtons({ status, onApprove, onReject }) {
  if (status === "REJECTED") {
    return (
      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">
        Insufficient Balance
      </span>
    );
  }

  const approvedStyle =
    status === "APPROVED"
      ? "bg-green-600 text-white"
      : "bg-green-500 hover:bg-green-600 text-white";

  return (
    <div className="flex items-center gap-1.5">
      <button className="text-xs font-semibold px-3 py-1.5 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
        view
      </button>
      <button
        onClick={onApprove}
        className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${approvedStyle} ${
          status === "APPROVED" ? "opacity-80 cursor-default" : ""
        }`}
      >
        Approve
      </button>
      <button
        onClick={onReject}
        className="text-xs font-semibold px-3 py-1.5 rounded border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
      >
        Reject
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeaveRequests() {
  const [rows, setRows]             = useState(requests);
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const updateStatus = (id, newStatus) =>
    setRows((p) => p.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));

  const filtered = rows.filter((r) => {
    const typeOk   = typeFilter   === "All Types"  || r.leaveType === typeFilter;
    const statusOk = statusFilter === "All Status" || r.status    === statusFilter;
    return typeOk && statusOk;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">

      {/* Page header */}
      <div className="mb-1">
        <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
        <p className="text-xs text-indigo-500 mt-0.5">↑ 8 pending · 34 approved this month</p>
      </div>

      {/* Stat cards row */}
      <div className="flex mt-4 gap-4 mb-6   overflow-hidden  ">
        <StatCard
          icon="📋"
          badge="Needs Review"
          badgeColor="text-amber-500"
          borderColor="border-amber-400"
          value="8"
          label="Pending"
        />
        <StatCard
          icon="✅"
          badge="Completed"
          badgeColor="text-green-500"
          borderColor="border-green-400"
          value="34"
          label="Approved"
          highlight="text-green-600"
        />
        <StatCard
          icon="❌"
          badge="Rejected"
          badgeColor="text-red-400"
          borderColor="border-red-400"
          value="3"
          label="Rejected"
          highlight="text-red-500"
        />
        <StatCard
          icon="📅"
          badge="Total Volume"
          badgeColor="text-indigo-500"
          borderColor="border-indigo-400"
          value="45"
          label="Total This Month"
          highlight="text-indigo-700"
        />
      </div>

      {/* Filter row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Type filter */}
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-2 text-xs font-medium text-gray-700
                         focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
            >
              <option>All Types</option>
              <option>Casual Leave</option>
              <option>Sick Leave</option>
              <option>Earned Leave</option>
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-7 py-2 text-xs font-medium text-gray-700
                         focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer"
            >
              <option>All Status</option>
              <option>PENDING</option>
              <option>APPROVED</option>
              <option>REJECTED</option>
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Export */}
        <button className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          <Download size={13} />
          Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {["Employee","Leave Type","Period","Days","Reason","Applied On","Status","Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-3 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((row) => {
              const sc = statusConfig[row.status];
              return (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Employee */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full ${row.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {row.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-xs leading-tight">{row.name}</p>
                        <p className="text-[10px] text-gray-400">{row.role}</p>
                      </div>
                    </div>
                  </td>

                  {/* Leave Type */}
                  <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{row.leaveType}</td>

                  {/* Period */}
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    {row.periodStart} –<br />{row.periodEnd}
                  </td>

                  {/* Days */}
                  <td className="px-4 py-3 text-xs font-semibold text-gray-800">{row.days}</td>

                  {/* Reason */}
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[120px]">{row.reason}</td>

                  {/* Applied On */}
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{row.appliedOn}</td>

                  {/* Status badge */}
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded ${sc.bg} ${sc.textColor}`}>
                      {sc.label}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <ActionButtons
                      status={row.status}
                      onApprove={() => updateStatus(row.id, "APPROVED")}
                      onReject={() => updateStatus(row.id, "REJECTED")}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/30">
          <p className="text-xs text-gray-400">Showing {filtered.length} of 45 requests</p>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors">
              <ChevronLeft size={13} />
            </button>
            <button className="w-6 h-6 rounded bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center">
              1
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400 transition-colors">
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}