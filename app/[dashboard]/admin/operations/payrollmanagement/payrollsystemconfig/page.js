"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarCog, Settings2, Save, Lock, RefreshCw, AlertTriangle, Info, ChevronDown, Settings, ShieldCogCorner } from "lucide-react";

const initialToggles = {
  autoSync: true,
  autoLOP: true,
  overtime: false,
  autoSend: true,
};

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${enabled ? "bg-[#4A45B6]" : "bg-gray-200"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 mt-0.5 ${enabled ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

function ToggleRow({ label, sub, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#334155] truncate">{label}</p>
        <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{sub}</p>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

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
    <div className="flex flex-col gap-1.5 relative w-full" ref={dropdownRef}>
      <label className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#181C22] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
      >
        <span>{value}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-16 bg-white border border-gray-100 rounded-md shadow-lg py-1 overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${value === option ? "text-white font-semibold bg-[#4A45B6]" : "text-gray-700 hover:bg-gray-50"
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

function InputField({ label, value, suffix }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase">{label}</label>
      <div className="relative flex items-center group">
        <input
          type="text"
          defaultValue={value}
          className={`w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#181C22] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${suffix ? 'pr-20 sm:pr-28' : ''}`}
        />
        {suffix && (
          <span className="absolute right-4 text-[10px] sm:text-xs text-gray-400 pointer-events-none font-medium bg-white pl-1">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default function PayrollSystemConfig() {
  const [toggles, setToggles] = useState(initialToggles);
  const [payCycle, setPayCycle] = useState("Monthly");

  const toggle = (key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen bg-gray-50 p-5 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Payroll System Configuration</h1>
          <p className="text-sm text-[#94A3B8]">Update global payroll parameters and automation rules</p>
        </div>

        {/* Top 2-column section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Pay Cycle Config */}
          <div className="bg-white rounded-md border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-indigo-50 flex items-center justify-center">
                <CalendarCog size={16} className="text-indigo-500" />
              </div>
              <h2 className="text-sm font-semibold text-[#1E293B]">Pay cycle configuration</h2>
            </div>

            <div className="space-y-4">
              <SelectDropdown
                label="Pay Cycle"
                value={payCycle}
                onChange={setPayCycle}
                options={["Monthly", "Weekly", "Bi-weekly"]}
              />

              <InputField label="Pay Date" value="28" suffix="of the month" />
              <InputField label="Working Days/Month" value="26" />

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-gray-400 tracking-widest uppercase">LOP Threshold (Days)</label>
                <input
                  type="text"
                  defaultValue="2"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#181C22] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
                <p className="text-[10px] text-indigo-400 mt-0.5 leading-relaxed">Loss of Pay automatically triggers after this threshold</p>
              </div>
            </div>
          </div>

          {/* System Features */}
          <div className="bg-white rounded-md border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-sm bg-indigo-50 flex items-center justify-center">
                <Settings size={16} className="text-indigo-500" />
              </div>
              <h2 className="text-sm font-semibold text-[#1E293B]">System features</h2>
            </div>

            <div className="divide-y divide-gray-50">
              <ToggleRow
                label="Auto-sync attendance"
                sub="Pull biometric data at 11:59 PM daily"
                enabled={toggles.autoSync}
                onToggle={() => toggle("autoSync")}
              />
              <ToggleRow
                label="Auto-calculate LOP"
                sub="Based on leave policies & threshold"
                enabled={toggles.autoLOP}
                onToggle={() => toggle("autoLOP")}
              />
              <ToggleRow
                label="Include overtime in payroll"
                sub="Add pre-approved overtime bonuses"
                enabled={toggles.overtime}
                onToggle={() => toggle("overtime")}
              />
              <ToggleRow
                label="Auto-send payslips"
                sub="Email payslips once payroll is approved"
                enabled={toggles.autoSend}
                onToggle={() => toggle("autoSend")}
              />
            </div>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="bg-white rounded-md border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-sm bg-indigo-50 flex items-center justify-center">
              <ShieldCogCorner size={16} className="text-indigo-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#181C22]">Admin controls</h2>
              <p className="text-xs text-gray-400 mt-0.5">Critical system actions and overrides</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-3 w-full">
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#4A45B6] rounded-md hover:opacity-90 transition w-full sm:w-auto">
                <Save size={14} />
                Save all settings
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#334155] border border-[#E2E8F0] rounded-md bg-white hover:bg-gray-50 transition w-full sm:w-auto">
                <Lock size={14} />
                Lock April 2025 payroll
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#334155] border border-[#E2E8F0] rounded-md bg-white hover:bg-gray-50 transition w-full sm:w-auto">
                <RefreshCw size={14} />
                Reopen payroll
              </button>
            </div>

            <div className="border-t border-gray-50 flex justify-end">
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-orange-500 rounded-md hover:opacity-90 transition w-full sm:w-auto">
                <AlertTriangle size={14} />
                Override calculations
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 mt-4 rounded-md border border-[#EDE9FE] bg-[#F5F3FF]">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Info size={14} className="text-[#5B21B6] flex-shrink-0" />
            <span className="text-[#5B21B6]">Last system update: Today at 09:12 AM by Admin</span>
          </div>
          <button className="text-sm font-medium text-[#5B21B6] hover:underline self-start sm:self-auto">
            View History
          </button>
        </div>

      </div>
    </div>
  );
}