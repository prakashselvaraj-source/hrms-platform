"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Clock, Info, CalendarX, AlertCircle, Bell, BellDot, BellDotIcon, Check } from "lucide-react";

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
        className="w-full flex items-center justify-between border border-gray-200 rounded-sm  
        px-3 py-2.5 text-sm text-gray-700 bg-[#F2F4F6] hover:border-violet-300 focus:outline-none 
        focus:ring-2 focus:ring-violet-300 transition-all duration-200 shadow-sm"
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

const SHIFT_TYPES = ["Fixed", "Flexible", "Remote", "Rotational"];

export default function ShiftsTab({ data, onChange }) {
  const startH = data.shiftStart || "09:00 AM";
  const endH = data.shiftEnd || "06:00 PM";

  return (
    <div className="space-y-6">
      {/* Shift Type & Name */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Shift Type
          </label>
          <InlineSelect
            value={data.shiftType}
            onChange={(val) => onChange("shiftType", val)}
            options={SHIFT_TYPES}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
            Shift Name
          </label>
          <input
            type="text"
            value={data.shiftName}
            onChange={(e) => onChange("shiftName", e.target.value)}
            placeholder="e.g. Morning Shift"
            className="w-full border border-gray-200 bg-[#F2F4F6] rounded-sm px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
        </div>
      </div>

      {/* Shift Start & End Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Shift Start Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="time"
              value={data.shiftStart}
              onChange={(e) => onChange("shiftStart", e.target.value)}
              className="w-full border border-gray-200 rounded-sm bg-[#F2F4F6] pl-9 pr-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Shift End Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="time"
              value={data.shiftEnd}
              onChange={(e) => onChange("shiftEnd", e.target.value)}
              className="w-full border border-gray-200 bg-[#F2F4F6] rounded-sm bg-red pl-9 pr-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-300"
            />
          </div>
        </div>
      </div>

      {/* Grace Time Settings */}
      <div className="border bg-[#F2F4F6]  border-gray-100 rounded-sm p-4">

        <div className="flex items-center  gap-2 mb-4">
          <Clock className="w-4 h-4 text-violet-500" />
          <p className="text-sm font-semibold text-gray-700">Grace Time Settings</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Late Entry (mins)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={data.lateEntryMins}
                onChange={(e) => onChange("lateEntryMins", e.target.value)}
                min={0}
                max={120}
                className="w-20 border border-gray-200 bg-[#F2F4F6] rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <span className="text-xs text-gray-400">Allow after start time</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Early Exit (mins)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={data.earlyExitMins}
                onChange={(e) => onChange("earlyExitMins", e.target.value)}
                min={0}
                max={120}
                className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <span className="text-xs text-gray-400">Allow before end time</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="border border-gray-100 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Live Preview
          </p>
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
        <div className="p-4 space-y-2">
          <div className="border-[#712AE2] border-l-4 px-4 py-2">
            <p className="text-xs font-bold text-[#712AE2] py-2  uppercase tracking-wide">
              Configuration Overview

            </p>
            <p className="text-sm text-gray-600">
              {data.shiftType} shift:{" "}
              <span className="font-semibold">{data.shiftStart} — {data.shiftEnd}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CalendarX className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              Late mark triggered{" "}
              <span className="font-semibold text-amber-600">
                {data.lateEntryMins} mins
              </span>{" "}
              after {data.shiftStart}
            </p>
          </div>
          <div className="flex items-center gap-2">

            <Bell className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              Early exit alert if check-out{" "}
              <span className="font-semibold text-emerald-600">
                {data.earlyExitMins} mins
              </span>{" "}
              before shift end
            </p>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Employees will be expected to maintain 8 hours of total daily attendance.
          </p>
        </div>
      </div>
    </div>
  );
}
