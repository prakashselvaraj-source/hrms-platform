"use client";

import { useState } from "react";
import {
    RefreshCw,
    Calculator,
    Lock,
    FileText,
    Eye,
    SlidersHorizontal,
    Download,
    Play,
    ChevronRight,
    Zap,
    X,
    Send,
} from "lucide-react";

const progressBars = [
    { label: "Processed", pct: 84, color: "bg-green-500", textColor: "text-green-600" },
    { label: "Under review", pct: 10, color: "bg-orange-400", textColor: "text-orange-500" },
    { label: "On hold", pct: 6, color: "bg-red-500", textColor: "text-red-500" },
];

const quickActions = [
    { label: "Run full payroll calculation", icon: Calculator, primary: true, modal: "runPayroll" },
    { label: "Recalculate LOP deductions", icon: RefreshCw, primary: false, modal: null },
    { label: "Lock payroll (Admin)", icon: Lock, primary: false, modal: null },
    { label: "Generate payslips", icon: FileText, primary: false, modal: null },
];

const employees = [
    {
        name: "Marcus Thorne",
        dept: "Engineering",
        avatar: "MT",
        avatarBg: "bg-slate-200 text-slate-600",
        gross: "$8,450.00",
        deductions: "$1,240.00",
        lop: "$0.00",
        lopNeg: false,
        net: "$7,210.00",
        status: "PROCESSED",
        actionBtn: "Hold",
        actionPrimary: false,
    },
    {
        name: "Sarah Jenkins",
        dept: "Product Design",
        avatar: "SJ",
        avatarBg: "bg-teal-100 text-teal-700",
        gross: "$7,200.00",
        deductions: "$980.00",
        lop: "-$145.00",
        lopNeg: true,
        net: "$6,075.00",
        status: "REVIEW",
        actionBtn: "Hold",
        actionPrimary: false,
    },
    {
        name: "David Chen",
        dept: "Operations",
        avatar: "DC",
        avatarBg: "bg-orange-100 text-orange-700",
        gross: "$6,500.00",
        deductions: "$840.00",
        lop: "$0.00",
        lopNeg: false,
        net: "$5,660.00",
        status: "HOLD",
        actionBtn: "Release",
        actionPrimary: true,
    },
    {
        name: "Elena Rodriguez",
        dept: "Marketing",
        avatar: "ER",
        avatarBg: "bg-pink-100 text-pink-700",
        gross: "$5,900.00",
        deductions: "$0.00",
        lop: "$0.00",
        lopNeg: false,
        net: "$5,900.00",
        status: "DRAFT",
        actionBtn: "Hold",
        actionPrimary: false,
    },
];

const statusStyles = {
    PROCESSED: "bg-green-100 text-green-700",
    REVIEW: "bg-orange-100 text-orange-700",
    HOLD: "bg-red-100 text-red-700",
    DRAFT: "bg-gray-100 text-gray-500",
};

const runPayrollDetails = [
    { label: "Employees to process", value: "104", color: "text-gray-900" },
    { label: "LOP cases detected", value: "12", color: "text-orange-500" },
    { label: "Missing attendance", value: "3", color: "text-orange-500" },
    { label: "Estimated net payroll", value: "₹24,18,500", color: "text-indigo-600" },
];

// ─── Payslip Modal ─────────────────────────────────────────────────────────────
function PayslipModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-[#4A45B6] px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Ananya Iyer</h2>
                        <p className="text-indigo-200 text-sm mt-0.5">
                            Engineering &nbsp;•&nbsp; Employee ID: EMP-2025-084
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-indigo-200 text-xs font-semibold uppercase tracking-wide">Payroll Period</p>
                        <p className="text-white font-semibold text-base mt-0.5">April 2025</p>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Earnings */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Earnings</p>
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Basic Salary</span>
                                    <span className="text-sm font-semibold text-gray-900">₹34,000</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-indigo-600">Overtime</span>
                                    <span className="text-sm font-semibold text-indigo-600">+ ₹2,000</span>
                                </div>
                            </div>
                            <div className="mt-5 bg-[#F2F3FD] border border-gray-100 rounded-md px-4 py-3 flex justify-between items-center">
                                <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase">Gross Earnings</span>
                                <span className="text-lg font-bold text-[#0F172A]">₹74,250</span>
                            </div>
                        </div>

                        {/* Deductions */}
                        <div>
                            <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">Deductions</p>
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Provident Fund</span>
                                    <span className="text-sm font-semibold text-gray-900">₹10,200</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">TDS (Tax)</span>
                                    <span className="text-sm font-semibold text-gray-900">₹4,250</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-700">Prof. Tax</span>
                                    <span className="text-sm font-semibold text-gray-900">₹200</span>
                                </div>
                            </div>
                            <div className="mt-5 bg-[#F2F3FD] border border-[#F2F3FD] rounded-md  px-4 py-3 flex justify-between items-center">
                                <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase">Total Deductions</span>
                                <span className="text-lg font-bold text-[#BA1A1A]">₹14,650</span>
                            </div>
                        </div>
                    </div>

                    {/* Net Pay */}
                    <div className="mt-5 bg-indigo-50 border border-indigo-100 rounded-md px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-[#465F89]">Net Pay — April 2025</p>
                            <p className="text-xs text-[#465F89B2] mt-0.5">Paid via Direct Deposit on May 1st, 2025</p>
                        </div>
                        <p className="text-3xl font-extrabold text-[#4A45B6] whitespace-nowrap">₹72,400</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-[#4A45B6] rounded-md hover:opacity-90 transition">
                        <Send size={15} />
                        Send payslip
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-700 border border-[#E2E8F0] rounded-md">
                        <Download size={15} />
                        Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Run Payroll Modal ─────────────────────────────────────────────────────────
function RunPayrollModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-[#1E293B]">Run Payroll — April 2025</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-400"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    <div className="flex gap-3 bg-indigo-50 border border-[#E0E7FF] rounded-md px-4 py-3.5">
                        <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                        <p className="text-sm text-gray-700 leading-relaxed">
                            This will calculate salaries for all 104 employees.
                            <br />
                            LOP deductions will be applied automatically.
                        </p>
                    </div>
                    <div className="flex flex-col gap-8">
                        {runPayrollDetails.map((row) => (
                            <div key={row.label} className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{row.label}</span>
                                <span className={`text-sm font-bold ${row.color}`}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 pb-5">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-[#475569] border border-gray-200 rounded-md hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button className="px-5 py-2.5 text-sm font-semibold text-white bg-[#4A45B6] rounded-md hover:opacity-90 transition">
                        Confirm & run payroll
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function PayrollProcessing() {
    const [payslipOpen, setPayslipOpen] = useState(false);
    const [runPayrollOpen, setRunPayrollOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 p-5 sm:p-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-5">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold text-[#181C22]">Payroll Processing</h1>
                        <p className="text-sm text-[#6B7280] mt-0.5">Review, calculate & approve payroll</p>
                    </div>
                    <button
                        onClick={() => setRunPayrollOpen(true)}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm text-[#FFFFFF] font-semibold bg-[#4A45B6] rounded-md self-start sm:self-auto shadow-sm hover:opacity-90 transition"
                    >
                        <Play size={14} />
                        Run payroll
                    </button>
                </div>

                {/* Top Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Processing Status */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-2">
                                <RefreshCw size={15} className="text-indigo-500" />
                                <h2 className="text-sm font-semibold text-gray-800">Processing status</h2>
                            </div>
                            <span className="text-xs text-gray-400 font-medium">MARCH 2024</span>
                        </div>
                        <div className="space-y-5">
                            {progressBars.map((bar) => (
                                <div key={bar.label}>
                                    <div className="flex justify-between mb-1.5">
                                        <span className="text-sm text-gray-600">{bar.label}</span>
                                        <span className={`text-sm font-semibold ${bar.textColor}`}>{bar.pct}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-2 rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={15} className="text-[#4A45B6]" />
                            <h2 className="text-sm font-semibold text-[#181C22]">Quick actions</h2>
                        </div>
                        <div className="space-y-2.5">
                            {quickActions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={() => action.modal === "runPayroll" && setRunPayrollOpen(true)}
                                    className={`w-3/4 flex items-center gap-4 justify-between px-4 py-3 rounded-lg text-sm font-medium transition ${action.primary
                                        ? "bg-[#4A45B6] text-white shadow-sm hover:opacity-90"
                                        : "bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <action.icon size={15} className={action.primary ? "text-white" : "text-gray-500"} />
                                        {action.label}
                                    </div>
                                    <ChevronRight size={14} className={action.primary ? "text-white/70" : "text-gray-400"} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Employee Payroll Details */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                        <h2 className="text-sm font-semibold text-[#181C22]">Employee payroll details</h2>
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-[#E5E7EB] text-[#6B7280]">
                                <SlidersHorizontal size={14} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-[#E5E7EB] text-[#6B7280]">
                                <Download size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    {["EMPLOYEE", "GROSS SALARY", "TOTAL DEDUCTIONS", "LOP DEDUCTION", "NET PAY", "STATUS", "ACTIONS"].map((col) => (
                                        <th key={col} className="text-left text-[11px] font-semibold text-[#6B7280] tracking-wide px-5 py-3 whitespace-nowrap">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp, i) => (
                                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${emp.avatarBg}`}>
                                                    {emp.avatar}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{emp.name}</p>
                                                    <p className="text-xs text-gray-400">{emp.dept}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-[#181C22] font-semibold">{emp.gross}</td>
                                        <td className="px-5 py-4 text-sm text-gray-700">{emp.deductions}</td>
                                        <td className={`px-5 py-4 text-sm font-medium ${emp.lopNeg ? "text-red-500" : "text-gray-700"}`}>
                                            {emp.lop}
                                        </td>
                                        <td className="px-5 py-4 text-sm font-semibold text-purple-600">{emp.net}</td>
                                        <td className="px-5 py-4">
                                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${statusStyles[emp.status]}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                {/* Eye icon → opens PayslipModal */}
                                                <button
                                                    onClick={() => setPayslipOpen(true)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-md text-[#4A45B6] hover:bg-indigo-50 transition"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-sm transition ${emp.actionPrimary
                                                        ? "bg-[#4A45B6] text-white hover:opacity-90"
                                                        : "border border-gray-200 bg-[#F3F4F6] text-[#4B5563] hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {emp.actionBtn}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 gap-3">
                        <p className="text-xs text-[#6B7280]">Showing 4 of 128 employees</p>
                        <div className="flex items-center gap-1">
                            <button className="px-3 py-1.5 text-xs text-gray-500 rounded-md hover:bg-gray-50 transition">
                                Previous
                            </button>
                            {[1, 2, 3].map((p) => (
                                <button
                                    key={p}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-xs font-medium transition ${p === 1 ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button className="px-3 py-1.5 text-xs text-gray-500 rounded-md hover:bg-gray-50 transition">
                                Next
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modals */}
            <PayslipModal isOpen={payslipOpen} onClose={() => setPayslipOpen(false)} />
            <RunPayrollModal isOpen={runPayrollOpen} onClose={() => setRunPayrollOpen(false)} />
        </div>
    );
}