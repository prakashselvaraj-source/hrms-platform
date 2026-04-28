"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Info, Check } from "lucide-react";

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
        className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-300 transition-all duration-200 shadow-sm"
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

const DAYS = ["M", "T", "W", "T", "F", "S", "Su"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKOFF_OPTIONS = ["Sunday", "Saturday", "Saturday & Sunday"];

export default function WorkingHoursTab({ data, onChange }) {
  function toggleDay(idx) {
    const updated = [...data.workingDays];
    updated[idx] = !updated[idx];
    onChange("workingDays", updated);
  }

  return (
    <div className="space-y-7">
      {/* Working Days */}
      <div>
        <p className="text-xs font-bold text-[ #191C1E] uppercase tracking-widest mb-3">
          Working Days
        </p>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((d, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleDay(i)}
              className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${data.workingDays[i]
                ? "bg-[#4A45B6] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Saturday Rule Configuration */}
      <div>
        <p className="text-xs font-bold text-[ #191C1E] uppercase tracking-widest mb-3">
          Saturday Rule Configuration
        </p>
        <div className="space-y-3">
          {[
            { label: "1st & 3rd Saturday — Working", key: "sat1and3" },
            { label: "2nd & 4th Saturday — Weekly Off", key: "sat2and4" },
            { label: "5th Saturday (when applicable) — Working", key: "sat5" },
          ].map(({ label, key }) => (
            <div
              key={key}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3"
            >
              <span className="text-sm text-gray-700">{label}</span>
              <Toggle
                checked={data[key]}
                onChange={(val) => onChange(key, val)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Hours Configuration */}
      <div>
        <p className="text-xs font-bold text-[ #191C1E] uppercase tracking-widest mb-3">
          Hours Configuration
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Daily Working Hours
            </label>
            <input
              type="number"
              value={data.dailyHours}
              onChange={(e) => onChange("dailyHours", e.target.value)}
              min={1}
              max={24}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Weekly Off Day
            </label>
            <InlineSelect
              value={data.weeklyOff}
              onChange={(val) => onChange("weeklyOff", val)}
              options={WEEKOFF_OPTIONS}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Break Duration (mins)
            </label>
            <input
              type="number"
              value={data.breakMins}
              onChange={(e) => onChange("breakMins", e.target.value)}
              min={0}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Monthly Working Days
            </label>
            <input
              type="number"
              value={data.monthlyDays}
              onChange={(e) => onChange("monthlyDays", e.target.value)}
              min={1}
              max={31}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <p className="text-xs font-bold text-[ #191C1E] uppercase tracking-widest mb-3">
          Live Preview
        </p>
        <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-violet-600" />
            <p className="text-sm font-semibold text-violet-800">Policy Summary</p>
          </div>
          <ul className="space-y-1.5 ml-6">
            <li className="flex items-start gap-2 text-xs text-violet-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
              Standard 5-day week (Mon–Fri) plus alternate Saturdays.
            </li>
            <li className="flex items-start gap-2 text-xs text-violet-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
              Full day = {data.dailyHours} hrs of logged work (inclusive of breaks).
            </li>
            <li className="flex items-start gap-2 text-xs text-violet-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
              Mandatory {data.breakMins}-min break auto-deducted or logged.
            </li>
            <li className="flex items-start gap-2 text-xs text-violet-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
              2nd and 4th Saturdays are designated non-working days.
            </li>
          </ul>
        </div>

        {/* Estimated Monthly Hours */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-gray-700">
              Estimated Monthly Hours
            </span>
            <span className="text-sm font-bold text-violet-600">
              {data.monthlyDays * data.dailyHours} hrs
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-[#4A45B6] h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  ((data.monthlyDays * data.dailyHours) / 280) * 100
                )}%`,
              }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            Calculated based on {data.monthlyDays} average working days at{" "}
            {data.dailyHours} hours per day.
          </p>
        </div>
      </div>
    </div>
  );
}
