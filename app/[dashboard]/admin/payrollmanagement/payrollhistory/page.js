"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, CreditCard, Calendar, Users, ArrowUpRight, ChevronDown, SlidersHorizontal, Eye, Download, ChevronLeft, ChevronRight } from "lucide-react";

const statCards = [
  {
    label: "TOTAL DISBURSED (YTD)",
    value: "$12,482,900",
    sub: "+4.2% vs previous year",
    subColor: "text-[#16A34A]",
    subIcon: true,
    icon: <CreditCard size={18} className="text-indigo-400" />,
    iconBg: "bg-indigo-50",
    dark: false,
  },
  {
    label: "AVERAGE MONTHLY",
    value: "$1,040,241",
    sub: "Calculated across last 12 cycles",
    subColor: "text-[#717785]",
    icon: <Calendar size={18} className="text-indigo-400" />,
    iconBg: "bg-indigo-50",
    dark: false,
  },
  {
    label: "TOTAL EMPLOYEES PAID",
    value: "2,840",
    sub: "Global workforce across 12 regions",
    subColor: "text-gray-400",
    icon: <Users size={18} className="text-indigo-400" />,
    iconBg: "bg-indigo-50",
    dark: false,
  },
  {
    label: "NEXT SCHEDULED CYCLE",
    value: "May 28, 2026",
    sub: "Status: Preparation Phase",
    subColor: "text-[#FFFFFF]/80",
    icon: <ArrowUpRight size={18} className="text-white" />,
    iconBg: "bg-indigo-500",
    dark: true,
  },
];

const rows = [
  { initial: "A", month: "April", year: "2026", status: "Processed", gross: "$1,450,200.00", deductions: "-$320,450.00", net: "$1,129,750.00", employees: "2,840" },
  { initial: "M", month: "March", year: "2026", status: "Completed", gross: "$1,442,100.00", deductions: "-$318,200.00", net: "$1,123,900.00", employees: "2,825" },
  { initial: "F", month: "February", year: "2026", status: "Completed", gross: "$1,425,000.00", deductions: "-$315,000.00", net: "$1,110,000.00", employees: "2,810" },
  { initial: "J", month: "January", year: "2026", status: "Completed", gross: "$1,480,000.00", deductions: "-$330,000.00", net: "$1,150,000.00", employees: "2,790" },
];

const statusStyle = {
  Processed: "bg-blue-50 text-blue-600",
  Completed: "bg-green-50 text-green-600",
};
const statusDot = {
  Processed: "bg-blue-500",
  Completed: "bg-green-500",
};

function SelectDropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between sm:justify-start gap-2 px-3 py-2 bg-[#F2F3FD] border border-[#C1C6D580] rounded-md text-sm text-gray-700 cursor-pointer transition select-none"
      >
        <div className="flex items-center gap-2">
          {label && <span className="text-gray-500 font-medium">{label}</span>}
          <span className="font-medium text-[#181C22]">{value}</span>
        </div>
        <ChevronDown size={13} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full min-w-[160px] mt-1 bg-white border border-gray-100 rounded-md shadow-lg py-1 overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${value === option ? "text-white font-semibold bg-[#4A45B6]" : "text-gray-700 hover:bg-gray-50"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PayrollHistory() {
  const [year, setYear] = useState("2026");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Statuses");

  return (
    <div className="min-h-screen bg-gray-50 p-5 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#181C22]">Payroll History</h1>
            <p className="text-sm text-[#6B7280] mt-1 max-w-lg">
              Review, manage, and export historical payroll records for the entire organization.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#4A45B6] rounded-sm hover:opacity-90 transition self-start flex-shrink-0">
            <Upload size={14} />
            Export All History
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <div
              key={i}
              className={`rounded-md shadow-sm px-5 py-5 flex flex-col gap-3 ${card.dark ? "bg-[#4A45B6]" : "bg-white"}`}
            >
              <div className="flex items-start justify-between">
                <p className={`text-[11px] font-semibold tracking-wider uppercase ${card.dark ? "text-[#FFFFFF]/70" : "text-[#717785]"}`}>
                  {card.label}
                </p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                  {card.icon}
                </div>
              </div>
              <p className={`text-2xl font-extrabold leading-tight ${card.dark ? "text-white" : "text-[#181C22]"}`}>
                {card.value}
              </p>
              <div className="flex items-center gap-1">
                {card.subIcon && <ArrowUpRight size={13} className="text-green-500 flex-shrink-0" />}
                <p className={`text-xs ${card.subColor}`}>{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-3">
          <SelectDropdown
            label="Year:"
            value={year}
            onChange={setYear}
            options={["2026", "2025", "2024", "2023"]}
          />
          <SelectDropdown
            label="Department:"
            value={department}
            onChange={setDepartment}
            options={["All Departments", "Engineering", "Marketing", "Sales", "HR"]}
          />
          <SelectDropdown
            label="Status:"
            value={status}
            onChange={setStatus}
            options={["All Statuses", "Processed", "Completed", "Pending"]}
          />
          <button className="justify-end md:ml-auto flex items-center justify-center sm:justify-start gap-2 text-sm font-medium text-[#4A45B6] hover:underline transition py-2 sm:py-0">
            <SlidersHorizontal size={14} />
            Advanced Filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["MONTH/YEAR", "STATUS", "GROSS SALARY", "DEDUCTIONS", "NET PAY", "EMPLOYEES", "ACTIONS"].map((col) => (
                    <th key={col} className="text-left text-[11px] font-semibold text-[#717785] bg-[#F2F3FD] tracking-wide px-5 py-3.5 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {row.initial}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#181C22]">{row.month}</p>
                          <p className="text-xs text-gray-400">{row.year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyle[row.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot[row.status]}`} />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-[#181C22] whitespace-nowrap">{row.gross}</td>
                    <td className="px-5 py-4 text-sm font-medium text-red-500 whitespace-nowrap">{row.deductions}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-[#181C22] whitespace-nowrap">{row.net}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">{row.employees}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button className="text-[#4A45B6]">
                          <Eye size={15} />
                        </button>
                        <button className="text-[#4A45B6]">
                          <Download size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-xs text-[#6B7280]">Showing 4 of 24 records</p>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 transition">
                <ChevronLeft size={13} />
              </button>
              <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:bg-gray-50 transition">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}