"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Settings, PlusCircle, MinusCircle, ChevronDown } from "lucide-react";

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        {icon}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function ComponentItem({ name, sub, barColor }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-[#717785]">{sub}</p>
        </div>
        <button className="text-xs text-indigo-600 font-medium hover:underline">Edit</button>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 mt-2">
        <div className={`h-1.5 rounded-full ${barColor} w-2/5`} />
      </div>
    </div>
  );
}

function SelectField({ label, options, value, onChange }) {
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
    <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
      <label className="text-xs font-semibold text-[#717785] tracking-wide uppercase">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-md px-4 py-2.5 text-sm text-gray-700 bg-[#F2F4F6] border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-200 text-left transition-all"
        style={{ boxShadow: "0 0 0 1px #E5E7EB inset" }}
      >
        <span>{value}</span>
        <ChevronDown size={14} className={`text-[#717785] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-16 bg-white border border-gray-100 rounded-md shadow-lg py-1">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${value === option ? "text-white font-semibold bg-[#4A45B6]" : "text-gray-700"
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

function InputField({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-[#717785] tracking-wide uppercase">{label}</label>
      <input
        type="text"
        defaultValue={value}
        className=" rounded-md px-4 py-2.5 text-sm text-gray-700 bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-indigo-200"
      />
    </div>
  );
}

export default function SalaryStructure() {
  const [payCycle, setPayCycle] = useState("Monthly");
  const [lopRule, setLopRule] = useState("Deduct based on attendance");
  const [overtime, setOvertime] = useState("Include in payroll");

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-[#000000]">Salary Structure</h1>
            <p className="text-sm text-[#9F9F9F] mt-0.5">Define components, rules & pay policies</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#4A45B6] rounded-sm self-start sm:self-auto">
            <Plus size={15} />
            Create Components
          </button>
        </div>

        {/* Earnings & Deductions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCard
            title="Earnings components"
            icon={<PlusCircle size={18} className="text-[#005AB4]" />}
          >
            <ComponentItem name="Basic Salary" sub="40% of CTC" barColor="bg-indigo-400" />
          </SectionCard>

          <SectionCard
            title="Deduction components"
            icon={<MinusCircle size={18} className="text-[#964400]" />}
          >
            <ComponentItem name="Provident Fund" sub="12% of Basic" barColor="bg-[#C3465B]" />
            <ComponentItem name="Professional Tax" sub="Fixed" barColor="bg-[#C3465B]" />
          </SectionCard>
        </div>

        {/* Pay Policy Configuration */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings size={16} className="text-[#4F279B]" />
            <h2 className="text-sm font-semibold text-[#181C22]">Pay policy configuration</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <SelectField
              label="Pay Cycle"
              value={payCycle}
              onChange={setPayCycle}
              options={["Monthly", "Bi-weekly", "Weekly", "Fortnightly"]}
            />
            <InputField label="Pay Date" value="28" />
            <SelectField
              label="LOP Rule"
              value={lopRule}
              onChange={setLopRule}
              options={["Deduct based on attendance", "Fixed monthly deduction", "Pro-rata basis"]}
            />
            <SelectField
              label="Overtime"
              value={overtime}
              onChange={setOvertime}
              options={["Include in payroll", "Exclude from payroll", "Manual adjustment"]}
            />
            <InputField label="LOP Threshold (Days)" value="2" />
            <InputField label="Working Days/Month" value="26" />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button className="px-5 py-2.5 text-sm font-medium border border-[#C1C6D5] text-gray-700 rounded-sm hover:bg-gray-50 transition">
              Discard changes
            </button>
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-[#4A45B6] rounded-md">
              Apply Configuration
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
