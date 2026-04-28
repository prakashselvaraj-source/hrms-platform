"use client";
import { useState } from "react";

const leaveData = [
  { id: 1, employee: "Prof. Tommie Howell", email: "tommie.h@example.com", avatar: "TH", leaveType: "Sick Leave", dot: "#ef4444", year: 2025, allocated: 10.0, used: 0.0, remaining: 10.0, carried: 0.0, adjustment: 0.0 },
  { id: 2, employee: "Rosemary Okuneva", email: "rosemary.o@example.com", avatar: "RO", leaveType: "Annual Leave", dot: "#f97316", year: 2025, allocated: 23.0, used: 0.0, remaining: 23.0, carried: 2.0, adjustment: 0.0 },
  { id: 3, employee: "Prof. Tommie Howell", email: "tommie.h@example.com", avatar: "TH", leaveType: "Marriage Leave", dot: "#a855f7", year: 2025, allocated: 7.0, used: 0.0, remaining: 7.0, carried: 0.0, adjustment: 0.0 },
  { id: 4, employee: "Prof. Tommie Howell", email: "tommie.h@example.com", avatar: "TH", leaveType: "Personal Leave", dot: "#3b82f6", year: 2025, allocated: 5.0, used: 0.0, remaining: 5.0, carried: 0.0, adjustment: 0.0 },
  { id: 5, employee: "Prof. Tommie Howell", email: "tommie.h@example.com", avatar: "TH", leaveType: "Compensatory Leave", dot: "#10b981", year: 2025, allocated: 1.0, used: 0.0, remaining: 1.0, carried: 0.0, adjustment: 0.0 },
  { id: 6, employee: "Prof. Tommie Howell", email: "tommie.h@example.com", avatar: "TH", leaveType: "Emergency Leave", dot: "#f59e0b", year: 2025, allocated: 5.0, used: 0.0, remaining: 5.0, carried: 0.0, adjustment: 0.0 },
  { id: 7, employee: "Warren Jones", email: "warren.j@example.com", avatar: "WJ", leaveType: "Personal Leave", dot: "#3b82f6", year: 2025, allocated: 5.0, used: 0.0, remaining: 5.0, carried: 0.0, adjustment: 0.0 },
  { id: 8, employee: "Warren Jones", email: "warren.j@example.com", avatar: "WJ", leaveType: "Emergency Leave", dot: "#f59e0b", year: 2025, allocated: 5.0, used: 0.0, remaining: 5.0, carried: 0.0, adjustment: 0.0 },
];

const avatarColors = {
  TH: "bg-indigo-500",
  RO: "bg-rose-500",
  WJ: "bg-emerald-600",
};

function Avatar({ initials }) {
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${avatarColors[initials] || "bg-slate-500"}`}>
      {initials}
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex items-center gap-1.5">
      <button className="p-1.5 rounded-md text-indigo-400 hover:bg-indigo-50 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
      <button className="p-1.5 rounded-md text-indigo-400 hover:bg-indigo-50 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      <button className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
      <button className="p-1.5 rounded-md text-red-400 hover:bg-red-50 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

function CustomSelect({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-1 relative min-w-[180px]">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </label>

      {/* Selected Box */}
      <div
        onClick={() => setOpen(!open)}
        className="bg-white border border-slate-200 rounded-sm px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:border-indigo-400 transition"
      >
        <span>{selected?.label}</span>
        <span className="text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-sm shadow-lg z-50 overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${
                value === opt.value ? "bg-indigo-100 text-indigo-700" : ""
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default function LeaveBalances() {
  const [employee, setEmployee] = useState("all");
  const [leaveType, setLeaveType] = useState("all");
  const [year, setYear] = useState("2025");
  const [filtered, setFiltered] = useState(leaveData);

  const applyFilters = () => {
    setFiltered(
      leaveData.filter((row) => {
        const empMatch = employee === "all" || row.employee === employee;
        const typeMatch = leaveType === "all" || row.leaveType === leaveType;
        const yearMatch = year === "all" || String(row.year) === year;
        return empMatch && typeMatch && yearMatch;
      })
    );
  };

  const reset = () => {
    setEmployee("all");
    setLeaveType("all");
    setYear("2025");
    setFiltered(leaveData);
  };

  const employeeOptions = [
    { value: "all", label: "All Employees" },
    ...Array.from(new Set(leaveData.map((d) => d.employee))).map((e) => ({ value: e, label: e })),
  ];
  const leaveTypeOptions = [
    { value: "all", label: "All Leave Types" },
    ...Array.from(new Set(leaveData.map((d) => d.leaveType))).map((t) => ({ value: t, label: t })),
  ];
  const yearOptions = [
    { value: "all", label: "All Years" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
  ];

  const columns = ["Employee", "Leave Type", "Year", "Allocated", "Used", "Remaining", "Carried", "Adjustment", "Actions"];

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Leave Balances</h1>
            <p className="text-sm text-slate-400 mt-0.5">Manage and track employee leave allocations and usage.</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Leave Balance
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-5 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <CustomSelect label="Employee" options={employeeOptions} value={employee} onChange={setEmployee} />
            <CustomSelect label="Leave Type" options={leaveTypeOptions} value={leaveType} onChange={setLeaveType} />
            <CustomSelect label="Year" options={yearOptions} value={year} onChange={setYear} />
            <div className="flex items-end gap-2 ml-auto">
              <button
                onClick={applyFilters}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold text-sm px-5 py-2 rounded-lg transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={reset}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-50 hover:bg-indigo-50/40 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                  >
                    {/* Employee */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={row.avatar} />
                        <div>
                          <div className="font-semibold text-slate-800 text-sm leading-tight">{row.employee}</div>
                          <div className="text-xs text-slate-400">{row.email}</div>
                        </div>
                      </div>
                    </td>
                    {/* Leave Type */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: row.dot }} />
                        <span className="text-slate-700 font-medium whitespace-nowrap">{row.leaveType}</span>
                      </div>
                    </td>
                    {/* Year */}
                    <td className="px-4 py-3 text-slate-600">{row.year}</td>
                    {/* Allocated */}
                    <td className="px-4 py-3 text-slate-700 font-medium">{row.allocated.toFixed(2)}</td>
                    {/* Used */}
                    <td className="px-4 py-3 text-slate-500">{row.used.toFixed(2)}</td>
                    {/* Remaining */}
                    <td className="px-4 py-3">
                      <span className="text-indigo-600 font-semibold">{row.remaining.toFixed(2)}</span>
                    </td>
                    {/* Carried */}
                    <td className="px-4 py-3 text-slate-500">{row.carried.toFixed(2)}</td>
                    {/* Adjustment */}
                    <td className="px-4 py-3 text-slate-500">{row.adjustment.toFixed(2)}</td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <ActionButtons />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <span className="text-sm text-slate-400">
              Showing 1 to {filtered.length} of {filtered.length} promotions
            </span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors disabled:opacity-40" disabled>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-bold shadow-sm">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}