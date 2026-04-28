"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Sparkles, Zap, Megaphone } from "lucide-react";
import Image from "next/image";

const employees = [
  "Alice Johnson",
  "Bob Martinez",
  "Carol Lee",
  "David Kim",
  "Eva Patel",
];

const roles = [
  "Lead UI/UX Designer",
  "Principal Engineer",
  "Senior Product Manager",
  "Staff Engineer",
  "Director of Design",
];

function CustomDropdown({ placeholder, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F2F4F6] rounded-md text-left focus:outline-none"
      >
        <span className={value ? "text-[#464554] text-sm font-normal" : "text-[#191C1E] text-sm font-normal"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-[#71717A] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-[#E4E4E7] rounded-md shadow-lg overflow-hidden">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="px-4 py-2.5 text-sm text-[#464554] hover:bg-[#4A45B6] hover:text-white cursor-pointer transition-colors"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PromotionForm() {
  const [employee, setEmployee] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [prevDesignation, setPrevDesignation] = useState("");
  const [promotionDate, setPromotionDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [salaryAdj, setSalaryAdj] = useState("");
  const [promoLetter, setPromoLetter] = useState("");
  const [reason, setReason] = useState("");

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-10 font-sans bg-[#F8F9FA]">
      {/* Header Section */}
      <div className="max-w-[960px] mx-auto mb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full  bg-[#E1E0FF] text-[10px] font-semibold tracking-widest text-[#13144A] uppercase mb-4">
          New Promotion Announcement
        </span>
        <h1 className="text-3xl sm:text-[38px] font-bold text-[#191C1E] leading-tight mb-2">
          Elevate Your Talent
        </h1>
        <p className="text-[#464554] text-sm leading-relaxed max-w-[480px]">
          Crafting a recognition moment that celebrates growth and professional achievement
          within the Editorial HR ecosystem.
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-[960px] mx-auto bg-white rounded-2xl shadow-2xl">
        {/* Card Header — Purple Gradient */}

        <div className="rounded-t-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F279B] px-5 py-7 sm:px-8 sm:py-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-white text-xl sm:text-[22px] font-bold mb-1">
              Promotion Details
            </h2>
            <p className="text-[#C4B5FD] text-xs sm:text-sm">
              Finalize the organizational shift for your team member.
            </p>
          </div>
          <div className="absolute right-6 sm:right-20 top-1/2 -translate-y-1/2 opacity-20 sm:opacity-100">
            <Image src="/images/icon.png" alt="star icon" width={50} height={80} className="brightness-40" />
          </div>
        </div>



        {/* Form Body */}
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          {/* Row 1: Employee | Previous Designation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">
                Employee
              </label>
              <CustomDropdown
                placeholder="Select an employee..."
                options={employees}
                value={employee}
                onChange={setEmployee}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">
                Previous Designation
              </label>
              <input
                type="text"
                value={prevDesignation}
                onChange={(e) => setPrevDesignation(e.target.value)}
                className="w-full px-4 py-3 bg-[#F4F4F5] rounded-md text-sm text-[#71717A] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: New Designation | Promotion Date | Effective Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">
                New Designation
              </label>
              <CustomDropdown
                placeholder="Choose role..."
                options={roles}
                value={newDesignation}
                onChange={setNewDesignation}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">
                Promotion Date
              </label>
              <div>
                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={promotionDate}
                  onChange={(e) => setPromotionDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F4F4F5] rounded-md text-sm text-[#464554] placeholder-[#A1A1AA] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">
                Effective Date
              </label>
              <div>
                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F4F4F5] rounded-md text-sm text-[#464554] placeholder-[#A1A1AA] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Salary Adjustment | Promotion Letter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">
                Salary Adjustment
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#71717A] font-medium select-none">
                  $
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={salaryAdj}
                  onChange={(e) => setSalaryAdj(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 bg-[#F2F4F6] rounded-md text-sm text-[#464554] placeholder-[#A1A1AA] focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-[#A1A1AA] mt-1.5 ml-0.5">Annual increase amount</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">
                Promotion Letter
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#71717A] font-medium select-none">
                  $
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={promoLetter}
                  onChange={(e) => setPromoLetter(e.target.value)}
                  className="w-full pl-7 pr-4 py-3 bg-[#F2F4F6] rounded-md text-sm text-[#464554] placeholder-[#A1A1AA] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Reason for Promotion */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-[#464554] mb-2">
              Reason for Promotion
            </label>
            <textarea
              rows={4}
              placeholder="Describe the exceptional performance and impact..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 bg-[#F2F4F6] rounded-md text-sm text-[#464554] placeholder-[#A1A1AA] resize-none focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4">
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-[#464554] hover:text-[#464554] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold text-white transition-opacity hover:opacity-90 bg-[#4648D4]"
            >
              <Megaphone size={15} />
              Save &amp; Announce
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
