"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, DollarSign, Info, Check } from "lucide-react";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${checked ? "bg-[#4A45B6]" : "bg-gray-200"
        }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ${checked ? "translate-x-5" : "translate-x-0"
          }`}
      />
    </button>
  );
}

function InlineSelect({ value, onChange, options, placeholder = "Select option" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex bg-[#F2F4F6] items-center 
        justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700  hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all duration-200 shadow-sm"
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto   animate-in fade-in zoom-in duration-200">
          {options.map((option, idx) => {
            const isSelected = option === value;
            return (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${isSelected
                    ? "bg-[#4F279B] text-white font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {option}
                  {isSelected && <Check className="w-3.5 h-3.5 text-violet-600" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const LOP_BASIS_OPTIONS = [
  "Attendance shortage (recommended)",
  "Calendar days",
  "Working days",
];

export default function PayrollMappingTab({ data, onChange }) {
  return (
    <div className="space-y-7">
      {/* Payroll Inclusions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center">
            <DollarSign className="w-3 h-3 text-violet-600" />
          </div>
          <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Payroll Inclusions
          </p>
        </div>
        <div className="space-y-3">
          {[
            {
              key: "includeWorkingDays",
              label: "Include Working Days",
              desc: "Factor in actual hours logged during standard working hours.",
            },
            {
              key: "includePaidHolidays",
              label: "Include Paid Holidays",
              desc: "Count public and company-defined holidays as working days for payroll.",
            },
            {
              key: "includeApprovedLeaves",
              label: "Include Approved Leaves",
              desc: "Paid time off that has been verified and approved by management.",
            },
            {
              key: "includeOvertimePay",
              label: "Include Overtime Pay",
              desc: "Calculate additional compensation for hours exceeding the standard shift.",
              disabled: true,
            },
          ].map(({ key, label, desc, disabled }) => (
            <div
              key={key}
              className={`flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3.5 ${disabled ? "opacity-50" : ""
                }`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
              <Toggle
                checked={data[key]}
                onChange={(val) => !disabled && onChange(key, val)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* LOP Configuration */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold text-[10px]">
            ₹
          </div>
          <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            LOP (Loss of Pay) Configuration
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              LOP Calculation Basis
            </label>
            <InlineSelect
              value={data.lopBasis}
              onChange={(val) => onChange("lopBasis", val)}
              options={LOP_BASIS_OPTIONS}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Half Day LOP Factor
            </label>
            <input
              type="number"
              value={data.halfDayLopFactor}
              onChange={(e) => onChange("halfDayLopFactor", e.target.value)}
              step={0.1}
              min={0}
              max={1}
              className="w-full border bg-[#F2F4F6] border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Factor applied to daily salary for half-day absences.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Working Days in Month
            </label>
            <input
              type="number"
              value={data.workingDaysMonth}
              onChange={(e) => onChange("workingDaysMonth", e.target.value)}
              min={1}
              max={31}
              className="w-full border bg-[#F2F4F6] border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Late Mark LOP Factor (per incident)
            </label>
            <input
              type="number"
              value={data.lateMarkLopFactor}
              onChange={(e) => onChange("lateMarkLopFactor", e.target.value)}
              step={0.01}
              min={0}
              max={1}
              className="w-full border bg-[#F2F4F6] border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Deduction multiplier for each late arrival incident.
            </p>
          </div>
        </div>

        {/* LOP Formula */}
        <div className="mt-4 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-violet-500" />
            <p className="text-xs font-bold text-violet-700">LOP Formula</p>
          </div>
          <p className="text-xs text-violet-600 font-mono">
            LOP = (Monthly Basic / Working Days) × [ (Full Absences) + (Half
            Absences × Factor) + (Late Marks × Late Factor) ]
          </p>
        </div>
      </div>
    </div>
  );
}
