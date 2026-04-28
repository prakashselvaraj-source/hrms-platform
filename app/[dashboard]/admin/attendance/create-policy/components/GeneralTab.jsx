"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, CheckCircle2, Check } from "lucide-react";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative  inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${checked ? "bg-[#4A45B6]" : "bg-gray-200"
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

  const displayLabel = value || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex    items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-[#F2F4F6] hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all duration-200 shadow-sm"
      >
        <span className="truncate">{displayLabel}</span>
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

const POLICY_NAMES = [
  "Monthly",
  "Standard Office",
  "Flexible WFH",
  "Night Shift",
  "Field Staff",
  "Weekly",
  "Daily",
];

export default function GeneralTab({ data, onChange }) {
  return (
    <div className="space-y-6">
      {/* Row 1: Policy Name | Policy Code | Effective From */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Policy Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Policy Name <span className="text-red-500">*</span>
          </label>
          <InlineSelect
            value={data.policyName}
            onChange={(val) => onChange("policyName", val)}
            options={POLICY_NAMES}
          />
        </div>

        {/* Policy Code */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Policy Code
          </label>
          <input
            type="text"
            value={data.policyCode}
            onChange={(e) => onChange("policyCode", e.target.value)}
            placeholder="e.g. POL-001"
            className="w-full border bg-[#F2F4F6] border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>

        {/* Effective From */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Effective From
          </label>
          <input
            type="date"
            value={data.effectiveFrom}
            onChange={(e) => onChange("effectiveFrom", e.target.value)}
            className="w-full border bg-[#F2F4F6] border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
          Description
        </label>
        <textarea
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Monthly"
          rows={5}
          className="w-full border bg-[#F2F4F6] border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
        />
      </div>

      {/* Policy Active */}
      <div className="flex items-center justify-between bg-violet-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <CheckCircle2
            className={`w-5 h-5 mt-0.5 flex-shrink-0 ${data.policyActive ? "text-violet-600" : "text-gray-400"
              }`}
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">Policy Active</p>
            <p className="text-xs text-gray-500 mt-0.5">
              When active, this policy will be enforced for all assigned employees
              starting from the effective date.
            </p>
          </div>
        </div>
        <Toggle
          checked={data.policyActive}
          onChange={(val) => onChange("policyActive", val)}
        />
      </div>
    </div>
  );
}
