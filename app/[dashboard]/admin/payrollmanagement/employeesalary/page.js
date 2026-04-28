"use client";

import { Filter, Plus, PenLine, DollarSign, UserPlus, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

const employees = [
  {
    name: "Arjun Sharma",
    id: "ID: EMP-4021",
    avatar: "AS",
    avatarBg: "bg-blue-100 text-blue-700",
    department: "Engineering",
    role: "Programmer",
    annualCTC: "$96,000",
    monthlyGross: "$8,000",
    basic: "$4,000",
    structure: "FULL-TIME",
  },
  {
    name: "Sanya Gupta",
    id: "ID: EMP-4022",
    avatar: "SG",
    avatarBg: "bg-teal-100 text-teal-700",
    department: "Marketing",
    role: "Designer",
    annualCTC: "$84,000",
    monthlyGross: "$7,000",
    basic: "$3,500",
    structure: "STANDARD",
  },
  {
    name: "Rohan Mehta",
    id: "ID: EMP-4023",
    avatar: "RM",
    avatarBg: "bg-orange-100 text-orange-700",
    department: "Sales",
    role: "Frontend Developer",
    annualCTC: "$72,000",
    monthlyGross: "$6,000",
    basic: "$3,000",
    structure: "INCENTIVE",
  },
  {
    name: "Ananya Singh",
    id: "ID: EMP-4024",
    avatar: "AN",
    avatarBg: "bg-pink-100 text-pink-700",
    department: "Design",
    role: "Full Stack Developer",
    annualCTC: "$108,000",
    monthlyGross: "$9,000",
    basic: "$4,500",
    structure: "FULL-TIME",
  },
];

const badgeStyles = {
  "FULL-TIME": "bg-purple-100 text-purple-700",
  STANDARD: "bg-green-100 text-green-700",
  INCENTIVE: "bg-yellow-100 text-yellow-700",
};

function Badge({ label }) {
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${badgeStyles[label]}`}>
      {label}
    </span>
  );
}

export default function EmployeeSalary() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[#000000]">Employee Salary</h1>
            <p className="text-sm text-[#9F9F9F] mt-0.5">Define components, rules & pay policies</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#181C22] border border-gray-300 rounded-sm bg-[#F9F9FF]">
              <Filter size={14} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-sm">
              <Plus size={14} />
              Assign
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["EMPLOYEE", "DEPARTMENT", "ROLE", "ANNUAL CTC", "MONTHLY GROSS", "BASIC", "STRUCTURE", "ACTION"].map((col) => (
                    <th
                      key={col}
                      className="text-left text-[11px] font-semibold text-[#414753] bg-[#ECEDF7] tracking-wide px-5 py-4 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${emp.avatarBg}`}>
                          {emp.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-sm text-gray-600">{emp.department}</td>
                    <td className="px-5 py-5 text-sm text-gray-600 whitespace-nowrap">{emp.role}</td>
                    <td className="px-5 py-5 text-sm font-bold text-[#0F172A]">{emp.annualCTC}</td>
                    <td className="px-5 py-5 text-sm font-medium text-gray-800">{emp.monthlyGross}</td>
                    <td className="px-5 py-5 text-sm font-medium text-gray-800">{emp.basic}</td>
                    <td className="px-5 py-5">
                      <Badge label={emp.structure} />
                    </td>
                    <td className="px-5 py-5">
                      <button className="flex items-center gap-1.5 text-xs font-medium text-[#4F279B]">
                        <PenLine size={13} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 gap-3">
            <p className="text-xs text-[#64748B]">Showing 4 of 240 employees</p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-xs text-gray-500 hover:bg-gray-100 transition">
                <ChevronLeft size={16} />
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition ${p === 1
                      ? "bg-indigo-600 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                    }`}
                >
                  {p}
                </button>
              ))}
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-xs text-gray-500 hover:bg-gray-100 transition">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <DollarSign size={18} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Total Monthly Payout</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">$245,600</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <UserPlus size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">New Additions</p>
              <p className="text-lg font-bold text-gray-900 mt-0.5">12 Employees</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle size={18} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Payroll Status</p>
              <p className="text-lg font-bold text-green-600 mt-0.5">Verified</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
