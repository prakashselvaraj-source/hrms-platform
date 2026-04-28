"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Banknote, Building2, Upload, Bell, HelpCircle } from "lucide-react";

const payslips = [
  { label: "LATEST", month: "Mar 2026", net: "$8,450.00", status: "latest" },
  { label: "PROCESSED", month: "Feb 2026", net: "$8,450.00", status: "processed" },
  { label: "PROCESSED", month: "Jan 2026", net: "$8,200.00", status: "processed" },
];

const earnings = [
  { name: "Basic Pay", amount: "$6,500.00", sign: "" },
  { name: "Performance Bonus", amount: "$800.00", sign: "+" },
];

const deductions = [
  { name: "Provident Fund (PF)", amount: "$780.00" },
  { name: "Income Tax (TDS)", amount: "$950.00" },
  { name: "Professional Tax", amount: "$70.00" },
];

export default function PayrollPage() {
  const router = useRouter();
  const [activePayslip, setActivePayslip] = useState(0);

  const grossEarnings = 10250;
  const totalDeductions = 1800;
  const netTakeHome = 8450;

  return (
    <div className="min-h-screen w-full  font-sans">

      {/* ── Top Bar ── */}


      {/* ── Main Content ── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5 sm:space-y-6">

        {/* ── Page Header + Buttons ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-xl font-bold text-[#1E293B] tracking-tight">
              Payroll &amp; Salary
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your earnings, deductions, and tax compliance documents.
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 shrink-0">
            <button onClick={() => router.push('/Bankdetails')} className="flex items-center gap-1.5 px-3 sm:px-4 py-2 border border-[#712AE2] 
            text-[#712AE2] rounded-lg text-xs sm:text-sm font-medium hover:bg-indigo-50 transition-colors whitespace-nowrap">
              <Building2 size={14} />
              Bank Details
            </button>
            <button className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#712AE2] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#4F46E5] transition-colors shadow-sm whitespace-nowrap">
              <Upload size={14} />
              Export Report
            </button>
          </div>
        </div>

        {/* ── Recent Payslips ── */}

        <div className="bg-[#F2F4F6] rounded-2xl  border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <FileText size={16} className="text-[#712AE2]" />
            <h2 className="font-semibold text-[#1E293B] text-sm sm:text-base">Recent Payslips</h2>
          </div>

          {/* 1 col on mobile → 3 cols on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {payslips.map((slip, i) => (
              <div
                key={i}
                onClick={() => setActivePayslip(i)}
                className={`rounded-xl  border-l-4 p-4 sm:p-5 cursor-pointer transition-all duration-200 ${activePayslip === i
                    ? "border-[#712AE2] bg-[#F5F3FF]"
                    : "border-gray-100  bg-white hover:border-indigo-200 hover:bg-indigo-50/30 "
                  }`}
              >
                {/* Mobile: horizontal layout */}
                <div className="flex items-center justify-between sm:block">
                  <div>
                    <span
                      className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${slip.status === "latest"
                          ? "bg-[#712AE2] text-white"
                          : "bg-gray-100 text-gray-500"
                        }`}
                    >
                      {slip.label}
                    </span>
                    <p className="text-[#1E293B] font-bold text-base sm:text-lg mt-2 sm:mt-3 leading-none">
                      {slip.month}
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">{slip.net} Net</p>
                  </div>

                  {/* Mobile: icon-only button */}
                  <button
                    className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-[#712AE2] text-[#712AE2] hover:bg-indigo-50 transition-colors shrink-0"
                    aria-label="Download payslip"
                  >
                    <Download size={15} />
                  </button>
                </div>

                {/* Desktop: full-width button */}
                <button className="hidden sm:flex mt-4 w-full items-center justify-center bg-[#E2DFFF] gap-2 py-2 rounded-lg border border-[#712AE2] text-[#712AE2] text-sm font-medium hover:bg-indigo-50 transition-colors">
                  <Download size={14} />
                  Download Payslip
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Salary Breakdown ── */}
        <div className="bg-white rounded-2xl border-l-5 border-[#712AE2] p-4 sm:p-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5 sm:mb-6">
            <div>
              <h2 className="font-semibold text-[#1E293B] text-sm sm:text-base">Salary Breakdown</h2>
              <p className="text-gray-400 text-xs mt-0.5">Monthly structural analysis (Current cycle)</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Gross Earnings
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[#712AE2] mt-0.5">
                ${grossEarnings.toLocaleString()}.00
              </p>
            </div>
          </div>

          {/* 1 col on mobile → 2 col on sm+ */}
          <div className="grid grid-cols-1  sm:grid-cols-2 gap-6 sm:gap-8">

            {/* Earnings */}
            <div className="p-3">
              <div className="flex items-center  gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[#712AE2] shrink-0"></span>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-emerald-500">
                  Earnings &amp; Allowances
                </span>

              </div>
              <div className="space-y-3 sm:space-y-4">
                {earnings.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5 sm:py-3 border-b border-gray-50"
                  >
                    <span className="text-[#1E293B] text-sm">{item.name}</span>
                    <span
                      className={`font-semibold text-sm ${item.sign === "+" ? "text-emerald-500" : "text-[#1E293B]"
                        }`}
                    >
                      {item.sign}{item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deductions */}
            <div className=" bg-[#F2F4F680] p-3 rounded">

              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0"></span>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase  text-red-500">
                  Deductions
                </span>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {deductions.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5 sm:py-3 border-b border-gray-50"
                  >
                    <span className="text-[#1E293B] text-sm">{item.name}</span>
                    <span className="font-semibold text-sm text-red-500">-${item.amount}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[#1E293B] font-semibold text-sm">Total Deductions</span>
                  <span className="font-bold text-red-500">-${totalDeductions.toLocaleString()}.00</span>
                </div>
              </div>

            </div>



          </div>

          {/* ── Net Take-Home Banner ── */}
          <div className=" mt-3 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                <Banknote size={20} className="text-white" />
              </div>
              <div>
                <p className=" text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
                  Net Take-Home
                </p>
                <p className=" font-bold text-2xl sm:text-3xl mt-0.5">
                  ${netTakeHome.toLocaleString()}.00
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed sm:text-right sm:max-w-[230px]">
              Estimated payment scheduled for Mar 31, 2026 via Direct Deposit to ending ••••4201.
            </p>
          </div>

        </div>


      </div>
    </div>
  );
}
