"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Zap, Info, Check, Timer } from "lucide-react";

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
        className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 
   bg-[#F2F4F6] hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all duration-200 shadow-sm"
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
                    ? "bg-[#4F279B]  text-white font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  {option}
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#712AE2]" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const CALC_BASIS_OPTIONS = [
  "Daily threshold (Over 8 hrs)",
  "Weekly threshold",
  "Monthly threshold",
];

export default function OvertimeTab({ data, onChange }) {
  return (
    <div className="space-y-6">
      {/* Enable Overtime Tracking */}
      <div className="flex items-center justify-between border border-gray-100 rounded-xl px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-9 h-9 rounded-full bg-[#E2DFFF] flex items-center justify-center flex-shrink-0">
            <Timer className="w-4 h-4 text-[#4A45B6]" />

          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Enable Overtime Tracking
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Allow employees to log and claim overtime hours.
            </p>
          </div>
          <Toggle
            checked={data.enableOvertimeTracking}
            onChange={(val) => onChange("enableOvertimeTracking", val)}
          />

        </div>

      </div>

      {data.enableOvertimeTracking && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Overtime Configuration */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-[#712AE2] uppercase tracking-widest">
              Overtime Configuration
            </p>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Calculation Basis
              </label>
              <InlineSelect
                value={data.calcBasis}
                onChange={(val) => onChange("calcBasis", val)}
                options={CALC_BASIS_OPTIONS}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Min Hours to Trigger
              </label>
              <input
                type="number"
                value={data.minHoursToTrigger}
                onChange={(e) => onChange("minHoursToTrigger", e.target.value)}
                step={0.5}
                min={0}
                className="w-full border bg-[#F2F4F6] border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Max OT Hours (Monthly)
              </label>
              <input
                type="number"
                value={data.maxOtHours}
                onChange={(e) => onChange("maxOtHours", e.target.value)}
                min={0}
                className="w-full border border-gray-200 bg-[#F2F4F6] rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
          </div>

          {/* Right: Overtime Approvals */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-[#712AE2] uppercase tracking-widest">
              Overtime Approvals
            </p>

            {/* Manager Approval Required */}
            <div className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Manager Approval Required
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  All overtime entries must be reviewed by direct managers.
                </p>
              </div>
              <Toggle
                checked={data.managerApprovalRequired}
                onChange={(val) => onChange("managerApprovalRequired", val)}
              />

            </div>

            {/* Auto-cap Enforcement */}
            <div className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3.5 opacity-60">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Auto-cap Enforcement
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Automatically prevent logging hours beyond the set maximum.
                </p>
              </div>
              <Toggle
                checked={data.autoCapEnforcement}
                onChange={(val) => onChange("autoCapEnforcement", val)}
              />

            </div>

            {/* Info note */}
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                Approvals follow the standard organisation hierarchy unless custom
                workflow is defined.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
