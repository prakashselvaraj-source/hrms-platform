"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Clock, Lock, Circle, Check } from "lucide-react";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative  inline-flex h-6 w-11 flex-shrink-0 cursor-pointer  rounded-full border-2 border-transparent 
        transition-colors duration-200 focus:outline-none ${checked ? "bg-white" : "bg-white"
        }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition 
          duration-200 ${checked ? "translate-x-5" : "translate-x-0"
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
        className="w-full flex items-center justify-between border border-gray-200
         rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-[#F2F4F6] hover:border-violet-300
          focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all duration-200 shadow-sm"
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

export default function AttendanceRulesTab({ data, onChange }) {
  return (
    <div className="space-y-7">
      {/* Late & Early Rules */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center">
            <Clock className="w-3 h-3 text-violet-600" />
          </div>
          <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Late &amp; Early Rules
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Late Mark After (mins past shift start)
            </label>
            <input
              type="number"
              value={data.lateMarkAfter}
              onChange={(e) => onChange("lateMarkAfter", e.target.value)}
              placeholder="e.g. 15"
              className="w-full bg-[#F2F4F6] border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Early Exit Threshold (mins before shift end)
            </label>
            <input
              type="number"
              value={data.earlyExitThreshold}
              onChange={(e) => onChange("earlyExitThreshold", e.target.value)}
              placeholder="e.g. 30"
              className="w-full bg-[#F2F4F6] border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Late Marks Before LOP Deduction
            </label>
            <input
              type="number"
              value={data.lateMarksBeforeLop}
              onChange={(e) => onChange("lateMarksBeforeLop", e.target.value)}

              placeholder="—"
              className="w-full bg-[#F2F4F6] border border-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
              Max Late Marks Per Month
            </label>
            <input
              type="number"
              value={data.maxLateMarks}
              onChange={(e) => onChange("maxLateMarks", e.target.value)}

              placeholder="—"
              className="w-full border border-gray-100 rounded-lg px-3 py-2.5 text-sm  bg-gray-50 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Half Day & Absent Rules */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
            <Circle className="w-3 h-3 text-amber-600" />
          </div>
          <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Half Day &amp; Absent Rules
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Half Day If Less Than (hours)
            </label>
            <InlineSelect
              value={data.halfDayHours}
              onChange={(val) => onChange("halfDayHours", val)}
              options={[3, 4, 4.5, 5, 5.5, 6]}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Full Absent If Less Than (hours)
            </label>
            <input
              type="number"
              value={data.fullAbsentHours}
              onChange={(e) => onChange("fullAbsentHours", e.target.value)}
              placeholder="e.g. 2"
              className="w-full bg-[#F2F4F6] border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>
      </div>

      {/* Absence Rules */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
            <Lock className="w-3 h-3 text-red-500" />
          </div>
          <p className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Absence Rules
          </p>
        </div>
        <div className="space-y-3">
          {/* No Login = Absent */}
          <div className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3.5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lock className="w-4 h-4 " />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  No Login = Absent
                </p>
                <p className="text-xs  mt-0.5">
                  Employee marked absent automatically if no punch record exists for the day.
                </p>
              </div>
            </div>
            <Toggle
              checked={data.noLoginAbsent}
              onChange={(val) => onChange("noLoginAbsent", val)}
            />
          </div>

          {/* Continuous Absence Alert */}
          <div className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3.5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Continuous Absence Alert
                </p>
                <p className="text-xs  mt-0.5">
                  Trigger HR notification after 3+ consecutive absent days.
                </p>
              </div>
            </div>
            <Toggle
              checked={data.continuousAbsenceAlert}
              onChange={(val) => onChange("continuousAbsenceAlert", val)}
            />
          </div>

          {/* Enable Time Rounding */}
          <div className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3.5 opacity-60">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Circle className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Enable Time Rounding
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Round check-in/out to nearest 15 minutes for cleaner records.
                </p>
              </div>
            </div>
            <Toggle
              checked={data.enableTimeRounding}
              onChange={(val) => onChange("enableTimeRounding", val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
