"use client";

import {
  Download,
  Play,
  DollarSign,
  Users,
  Minus,
  AlertCircle,
  CheckCircle2,
  Circle,
  Lock,
  AlertTriangle,
  Info,
  CircleMinus,
} from "lucide-react";

const statsCards = [
  {
    icon: <DollarSign size={18} className="text-blue-500" />,
    iconBg: "bg-blue-50",
    label: "TOTAL PAYROLL COST",
    value: "$1,284,500",
    subtext: "Cycle: April 2025",
    badge: "+4.2%",
    badgeColor: "text-green-600 bg-green-50",
    borderColor: "border-t-4 border-[#4A45B6]"
  },
  {
    icon: <Users size={18} className="text-green-500" />,
    iconBg: "bg-green-50",
    label: "EMPLOYEES PROCESSED",
    value: "1,240 / 1,240",
    subtext: "All departments synced",
    badge: "100%",
    badgeColor: "text-green-600 bg-green-50",
    borderColor: "border-t-4 border-[#10B981]"
  },
  {
    icon: <CircleMinus size={18} className="text-orange-500" />,
    iconBg: "bg-orange-50",
    label: "TOTAL DEDUCTIONS",
    value: "$342,100",
    subtext: "Includes PF, TDS & Health",
    badge: "-2.1%",
    badgeColor: "text-red-600 bg-red-50",
    borderColor: "border-t-4 border-[#F97316]"
  },
  {
    icon: <AlertCircle size={18} className="text-red-500" />,
    iconBg: "bg-red-50",
    label: "LOP CASES",
    value: "42",
    subtext: "Pending verification",
    badge: "+12 new",
    badgeColor: "text-orange-600 bg-orange-50",
    borderColor: "border-t-4 border-[#EF4444]"
  },
];

const timelineSteps = [
  { label: "SALARY\nSTRUCTURE", status: "done" },
  { label: "ATTENDANCE\nSYNC", status: "done" },
  { label: "INPUT\nREVIEW", status: "done" },
  { label: "RUN\nPAYROLL", status: "active" },
  { label: "COMPLIANCE\nCHECK", status: "pending" },
  { label: "FUNDS\nTRANSFER", status: "pending" },
  { label: "PAYOUT\nCOMPLETE", status: "pending" },
];

const alerts = [
  {
    type: "error",
    dot: "bg-red-500",
    bg: "bg-[#FEF2F2] border-[#FEE2E2]",
    title: "Ravi Kumar — 7 LOP days",
    desc: "Requires manual review for sick leave.",
  },
  {
    type: "warning",
    dot: "bg-yellow-500",
    bg: "bg-[#FFF7ED] border-[#FFEDD5]",
    title: "3 employees missing attendance",
    desc: "IT Department — sync pending.",
  },
  {
    type: "info",
    dot: "bg-blue-500",
    bg: "bg-[#EFF6FF] border-[#DBEAFE]",
    title: "Bank account mismatch",
    desc: "1 new joiner needs verification.",
  },
];

function StepIcon({ status }) {
  if (status === "done")
    return (
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center z-10">
        <CheckCircle2 size={16} className="text-white" />
      </div>
    );
  if (status === "active")
    return (
      <div className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center z-10">
        <div className="w-3 h-3 rounded-full bg-indigo-600" />
      </div>
    );
  return (
    <div className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center z-10">
      <Circle size={10} className="text-gray-300" />
    </div>
  );
}

export default function PayrollOverview() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-[#0F172A]">Payroll Overview</h1>
            <p className="text-sm text-[#64748B] mt-0.5">
              Manage and monitor the current month's disbursement cycle
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#334155] border border-[#E2E8F0] rounded-sm bg-[#FFFFFF]">
              <Download size={15} />
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#4A45B6] rounded-md">
              Run Payroll Cycle
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, i) => (
            <div key={i} className={`bg-white rounded-md shadow-sm p-5 ${card.borderColor}`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                  {card.icon}
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#64748B] tracking-wide mb-3">{card.label}</p>
              <p className="text-2xl font-bold text-[#0F172A] mb-3">{card.value}</p>
              <p className="text-xs text-[#94A3B8]">{card.subtext}</p>
            </div>
          ))}
        </div>

        {/* Payroll Timeline */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            <h2 className="text-sm font-semibold text-gray-800">
              Payroll timeline — April 2025
            </h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center font-semibold gap-1.5 text-xs text-[#4A45B6] bg-[#EFF6FF] rounded-sm px-3 py-1.5">
                <Lock size={12} />
                Lock Payroll
              </button>
              <span className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] px-3 py-1.5 rounded-sm">
                IN PROGRESS
              </span>
            </div>
          </div>

          {/* Stepper */}
          <div className="relative flex items-start justify-between overflow-x-auto pb-2">
            {/* Background line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 z-0" />
            {/* Progress line */}
            <div
              className="absolute top-4 left-4 h-0.5 bg-indigo-600 z-0"
              style={{ width: `calc(${(3 / 6) * 100}% - 8px)` }}
            />

            {timelineSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center flex-1 min-w-[60px]">
                <StepIcon status={step.status} />
                <p
                  className={`text-center mt-2 whitespace-pre-line leading-tight text-[10px] font-semibold tracking-wide ${
                    step.status === "pending" ? "text-[#64748B]" : "text-[#334155]"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Anomalies */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-orange-500" />
            <h2 className="text-sm font-semibold text-gray-800">Alerts & anomalies</h2>
          </div>

          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-4 rounded-lg border ${alert.bg}`}
              >
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${alert.dot}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{alert.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <button className="text-sm uppercase font-bold text-[#64748B]">
              VIEW ALL ALERTS
            </button>
          </div>
        </div>  

      </div>
    </div>
  );
}