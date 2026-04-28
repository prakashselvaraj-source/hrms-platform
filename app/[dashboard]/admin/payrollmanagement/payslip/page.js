"use client";

import { useState } from "react";
import { Download, Send, MoreHorizontal, SlidersHorizontal, X, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const statCards = [
  {
    label: "TOTAL PAYSLIPS",
    value: "104",
    sub: "April 2025",
    subColor: "text-[#94A3B8]",
    border: "border-indigo-500",
  },
  {
    label: "GENERATED",
    value: "87",
    badge: "84% complete",
    sub: "Ready for review",
    subColor: "text-[#94A3B8]",
    border: "border-green-500",
  },
  {
    label: "PENDING",
    value: "17",
    sub: "Awaiting processing",
    subColor: "text-[#F59E0B]",
    border: "border-orange-400",
  },
  {
    label: "SENT TO EMPLOYEES",
    value: "72",
    badge: "via email",
    sub: "Confirmed delivery",
    subColor: "text-[#94A3B8]",
    border: "border-red-400",
  },
];

const employees = [
  { initials: "AI", bg: "bg-indigo-100 text-indigo-700", name: "Ananya Iyer", id: "ID: PR-2025-001", dept: "Engineering", month: "April 2025", net: "₹85,500", status: "GENERATED", actions: ["Preview", "Send"] },
  { initials: "RK", bg: "bg-teal-100 text-teal-700", name: "Ravi Kumar", id: "ID: PR-2021-012", dept: "Marketing", month: "April 2025", net: "₹62,400", status: "PENDING", actions: ["Preview", "Process"] },
  { initials: "MN", bg: "bg-pink-100 text-pink-700", name: "Meera Nair", id: "ID: PR-2025-045", dept: "Product", month: "April 2025", net: "₹92,000", status: "GENERATED", actions: ["Preview", "Send"] },
  { initials: "KR", bg: "bg-yellow-100 text-yellow-700", name: "Kiran Raj", id: "ID: PR-2025-008", dept: "Engineering", month: "April 2025", net: "₹78,200", status: "GENERATED", actions: ["Preview", "Sent"] },
  { initials: "DS", bg: "bg-orange-100 text-orange-700", name: "Deepa Suresh", id: "ID: PR-2025-031", dept: "Operations", month: "April 2025", net: "₹54,000", status: "PENDING", actions: ["Preview", "Process"] },
  { initials: "SB", bg: "bg-green-100 text-green-700", name: "Suresh Babu", id: "ID: PR-2025-019", dept: "Sales", month: "April 2025", net: "₹71,800", status: "GENERATED", actions: ["Preview", "Send"] },
  { initials: "LP", bg: "bg-purple-100 text-purple-700", name: "Lakshmi Priya", id: "ID: PR-2025-061", dept: "Human Resources", month: "April 2025", net: "₹68,500", status: "GENERATED", actions: ["Preview", "Sent"] },
  { initials: "AM", bg: "bg-blue-100 text-blue-700", name: "Arjun Menon", id: "ID: PR-2025-054", dept: "Design", month: "April 2025", net: "₹74,100", status: "GENERATED", actions: ["Preview", "Send"] },
];

const statusStyle = {
  GENERATED: "bg-green-100 text-green-700",
  PENDING: "bg-orange-100 text-orange-600",
};

function actionStyle(action) {
  if (action === "Send" || action === "Preview") return "text-indigo-600 hover:underline";
  if (action === "Process") return "text-indigo-600 hover:underline";
  if (action === "Sent") return "text-gray-400 cursor-default";
  return "text-gray-500";
}

export default function PayslipManagement() {
  const [modalOpen, setModalOpen] = useState(false);
  const [emailChecked, setEmailChecked] = useState(true);
  const [zipChecked, setZipChecked] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-5 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[#181C22]">Payslip management — April 2025</h1>
            <p className="text-sm text-[#414753] mt-0.5">Review and process employee payroll for the current month</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#4A45B6] border border-[#4A45B6] rounded-md bg-white hover:bg-gray-50 transition whitespace-nowrap">
              <Download size={14} />
              Download all PDF
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#4A45B6] rounded-md hover:opacity-90 transition whitespace-nowrap"
            >
              <Send size={14} />
              Generate & send all
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className={`bg-white rounded-md shadow-sm border-t-4 ${card.border} px-5 py-4`}>
              <p className="text-[11px] font-semibold text-[#64748B] tracking-wider uppercase mb-2">{card.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-[#0F172A]">{card.value}</p>
                {card.badge && (
                  <span className="text-xs font-bold text-green-600">{card.badge}</span>
                )}
              </div>
              <p className={`text-xs mt-1 ${card.subColor}`}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-[#F1F5F9] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-[#181C22]">Employee Payroll List</h2>
            <div className="flex items-center gap-2">
              <button className="text-[#94A3B8]">
                <SlidersHorizontal size={18} />
              </button>
              <button className="text-[#94A3B8]">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  {["EMPLOYEE", "DEPARTMENT", "MONTH", "NET PAY", "STATUS", "ACTIONS"].map((col) => (
                    <th key={col} className="text-left text-[11px] font-semibold text-[#64748B] tracking-wide px-5 py-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${emp.bg}`}>
                          {emp.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0F172A]">{emp.name}</p>
                          <p className="text-xs text-gray-400">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{emp.dept}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{emp.month}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-[#0F172A]">{emp.net}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${statusStyle[emp.status]}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-4">
                        {emp.actions.map((action) => (
                          <button key={action} className={`text-xs font-bold ${actionStyle(action)}`}>
                            {action}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 gap-3">
            <p className="text-xs text-[#6B7280]">Showing 8 of 104 employees</p>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-400 hover:bg-gray-100">‹</button>
              {[1, 2, 3].map((p) => (
                <button key={p} className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium ${p === 1 ? "bg-[#4A45B6] text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                  {p}
                </button>
              ))}
              <span className="text-xs text-gray-400 px-1">...</span>
              <button className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-500 hover:bg-gray-100">13</button>
              <button className="w-7 h-7 flex items-center justify-center rounded text-xs text-gray-400 hover:bg-gray-100">›</button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9]">
                <h2 className="text-base font-semibold text-[#181C22]">Generate all payslips</h2>
                <button onClick={() => setModalOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition">
                  <X size={15} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-5 space-y-8">
                {/* Info box */}
                <div className="flex gap-3 bg-[#EEF2FF] border border-indigo-100 rounded-md px-4 py-3.5">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  <p className="text-sm text-[#4A45B6] font-bold leading-relaxed">
                    87 payslips will be generated. 17 employees are pending — they will be excluded.
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailChecked}
                      onChange={() => setEmailChecked(!emailChecked)}
                      className="w-4 h-4 accent-[#4A45B6] rounded"
                    />
                    <span className="text-sm text-[#475569]">Email payslips to employees</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={zipChecked}
                      onChange={() => setZipChecked(!zipChecked)}
                      className="w-4 h-4 accent-[#4A45B6] rounded"
                    />
                    <span className="text-sm text-[#475569]">Download ZIP of all PDFs</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 px-6 pb-5">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button className="px-5 py-2.5 text-sm font-semibold text-white bg-[#4A45B6] rounded-md">
                  Generate & send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}