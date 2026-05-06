"use client";
import { uploadImage } from "@/services/uploadService";
import { createPromotion } from "@/services/promotion";
import { ChevronDown, Megaphone, Upload, FileText, X, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getEmployees } from "@/services/employeeService";
import { useTenant } from "@/hooks/useTenant";
import { useRouter } from "next/navigation";


// ─── Searchable Employee Picker ───────────────────────────────────────────────
// Shows Name + Employee ID + Designation so same-name employees are never confused.
function EmployeePicker({ employees, selectedId, onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);

  const selected = employees.find((e) => e.id === selectedId);

  const filtered = employees.filter((emp) => {
    const q = query.toLowerCase();
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const id = String(emp.id).toLowerCase();
    const desig = (emp.designation || "").toLowerCase();
    return fullName.includes(q) || id.includes(q) || desig.includes(q);
  });

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setQuery("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F2F4F6] rounded-md text-left focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30"
      >
        {selected ? (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-[#4A45B6]/10 text-[#4A45B6] flex items-center justify-center flex-shrink-0 text-xs font-bold">
              {selected.firstName?.[0]}{selected.lastName?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-[#191C1E] truncate">
                {selected.firstName} {selected.lastName}
              </p>
              <p className="text-[10px] text-[#71717A]">
                ID: {selected.id} &bull; {selected.designation || "—"}
              </p>
            </div>
          </div>
        ) : (
          <span className="text-[#A1A1AA] text-sm">Search by name, ID or designation...</span>
        )}
        <ChevronDown
          size={16}
          className={`text-[#71717A] transition-transform duration-200 flex-shrink-0 ml-2 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-[#E4E4E7] rounded-xl shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[#E4E4E7] bg-[#F8F9FA]">
            <Search size={14} className="text-[#71717A] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type name, employee ID or role..."
              className="w-full text-sm bg-transparent focus:outline-none text-[#191C1E] placeholder-[#A1A1AA]"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="text-[#71717A] hover:text-red-400">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Employee list */}
          <ul className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-[#A1A1AA]">No employees found</li>
            ) : (
              filtered.map((emp) => {
                const isSelected = emp.id === selectedId;
                return (
                  <li
                    key={emp.id}
                    onClick={() => {
                      onSelect(emp.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected
                      ? "bg-[#4A45B6] text-white"
                      : "hover:bg-[#F2F4F6] text-[#191C1E]"
                      }`}
                  >
                    {/* Avatar initials */}
                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isSelected ? "bg-white/20 text-white" : "bg-[#4A45B6]/10 text-[#4A45B6]"
                        }`}
                    >
                      {emp.firstName?.[0]}{emp.lastName?.[0]}
                    </div>

                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-semibold truncate">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className={`text-[10px] truncate ${isSelected ? "text-white/70" : "text-[#71717A]"}`}>
                        ID: {emp.id} &bull; {emp.designation || "No designation"}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
export default function PromotionForm() {
  const [rawEmployees, setRawEmployees] = useState([]);
  // Store the selected employee's ID (not name) to avoid same-name confusion
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [newDesignation, setNewDesignation] = useState("");
  const [prevDesignation, setPrevDesignation] = useState("");
  const [promotionDate, setPromotionDate] = useState("");
  const [annualCtc, setAnnualCtc] = useState("");
  const [salaryAdj, setSalaryAdj] = useState("");
  const [promoLetter, setPromoLetter] = useState(null);
  const [promoLetterUrl, setPromoLetterUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [reason, setReason] = useState("");
  const tenantId = useTenant();
  const fileInputRef = useRef(null);
  const route = useRouter();
  // Button is only active when all required fields are filled and no upload is in progress
  const isFormComplete =
    !!selectedEmployeeId &&
    newDesignation.trim() !== "" &&
    promotionDate !== "" &&
    salaryAdj !== "" &&
    reason.trim() !== "" &&
    !isUploading;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!tenantId) return;
        const empRes = await getEmployees(tenantId);
        setRawEmployees(Array.isArray(empRes.data) ? empRes.data : (empRes.data?.employees || empRes.data?.content || []));
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchData();
  }, [tenantId]);

  // When an employee is picked by ID, auto-fill designation + salary
  const handleEmployeeSelect = (id) => {
    setSelectedEmployeeId(id);
    const emp = rawEmployees.find((e) => e.id === id);
    if (emp) {
      setPrevDesignation(emp.designation || "");
      setAnnualCtc(emp.annualCtc ? emp.annualCtc.toString() : "");
    } else {
      setPrevDesignation("");
      setAnnualCtc("");
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPromoLetter(file);
    setIsUploading(true);
    try {
      const res = await uploadImage(file);
      const url = res.data?.url || res.data?.fileUrl || res.data;
      setPromoLetterUrl(url);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload file");
      setPromoLetter(null);
      setPromoLetterUrl("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmployeeId) {
      alert("Please select an employee.");
      return;
    }
    if (isUploading) {
      alert("File is still uploading. Please wait.");
      return;
    }

    const payload = {
      employeeId: selectedEmployeeId,
      previousDesignation: prevDesignation,
      newDesignation,
      promotionDate,
      annualCtc: annualCtc ? parseFloat(annualCtc) : undefined,
      salaryAdjustment: salaryAdj ? parseFloat(salaryAdj) : 0,
      promotionLetterUrl: promoLetterUrl,
      reason,
      status: "PENDING",
    };

    try {
      const response = await createPromotion(payload, tenantId);
      console.log("Promotion created:", response.data);
      setSelectedEmployeeId(null);
      setPrevDesignation("");
      setAnnualCtc("");
      setNewDesignation("");
      setPromotionDate("");
      setSalaryAdj("");
      setPromoLetter(null);
      setPromoLetterUrl("");
      setReason("");
      route.push(`/${tenantId}/admin/promotion`);
    } catch (error) {
      console.error("Error creating promotion:", error);
      alert("Failed to save promotion. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-10 font-sans bg-[#F8F9FA]">
      {/* Header Section */}
      <div className="max-w-[960px] mx-auto mb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E1E0FF] text-[10px] font-semibold tracking-widest text-[#13144A] uppercase mb-4">
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
        {/* Card Header */}
        <div className="rounded-t-2xl bg-gradient-to-r from-[#8B5CF6] to-[#4F279B] px-5 py-7 sm:px-8 sm:py-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-white text-xl sm:text-[22px] font-bold mb-1">Promotion Details</h2>
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

          {/* Row 1: Employee Picker | Previous Designation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">
                Employee
                <span className="ml-1 text-[#71717A] font-normal normal-case">(search by name, ID or role)</span>
              </label>
              <EmployeePicker
                employees={rawEmployees}
                selectedId={selectedEmployeeId}
                onSelect={handleEmployeeSelect}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">
                Previous Designation
              </label>
              <input
                type="text"
                value={prevDesignation}
                readOnly
                placeholder="Auto-filled on selection"
                className="w-full px-4 py-3 bg-[#F4F4F5] rounded-md text-sm text-[#71717A] focus:outline-none cursor-not-allowed border border-transparent"
              />
            </div>
          </div>

          {/* Row 2: New Designation | Promotion Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">New Designation</label>
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                className="w-full px-4 py-3 bg-[#F2F4F6] rounded-md text-sm text-[#464554] placeholder-[#A1A1AA] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">Promotion Date</label>
              <input
                type="date"
                value={promotionDate}
                onChange={(e) => setPromotionDate(e.target.value)}
                className="w-full px-4 py-3 bg-[#F4F4F5] rounded-md text-sm text-[#464554] focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: Annual CTC | Salary Adjustment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 mb-5">
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">Annual CTC</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#71717A] font-medium select-none">$</span>
                <input
                  type="text"
                  value={annualCtc}
                  readOnly
                  placeholder="Auto-filled"
                  className="w-full pl-7 pr-4 py-3 bg-[#F4F4F5] rounded-md text-sm text-[#71717A] focus:outline-none cursor-not-allowed border border-transparent"
                />
              </div>
              <p className="text-[10px] text-[#A1A1AA] mt-1.5 ml-0.5">Current salary</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#464554] mb-2">Salary Adjustment</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#71717A] font-medium select-none">$</span>
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
          </div>

          {/* Promotion Letter Upload */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-[#464554] mb-2">Promotion Letter</label>
            <div className="relative">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              {!promoLetter ? (
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="w-full flex flex-col items-center justify-center p-4 bg-[#F2F4F6] border-2 border-dashed border-[#C3C6D74D] rounded-xl cursor-pointer hover:bg-gray-100 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#4A45B61A] text-[#4A45B6] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload size={14} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-700">Click to upload letter</p>
                  <p className="text-[9px] text-gray-400">PDF, DOCX (Max 10MB)</p>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 bg-indigo-50 text-[#4A45B6] rounded-lg">
                      <FileText size={16} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-gray-800 truncate">{promoLetter.name}</p>
                      {isUploading ? (
                        <p className="text-[9px] text-[#4A45B6] animate-pulse">Uploading...</p>
                      ) : (
                        <p className="text-[9px] text-gray-400">{(promoLetter.size / 1024 / 1024).toFixed(2)} MB</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setPromoLetter(null); setPromoLetterUrl(""); }}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reason for Promotion */}
          <div className="mb-8">
            <label className="block text-xs font-semibold text-[#464554] mb-2">Reason for Promotion</label>
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
              disabled={!isFormComplete}
              title={!isFormComplete ? "Please fill all required fields" : ""}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold text-white transition-all ${isFormComplete
                ? "bg-[#4648D4] hover:opacity-90 cursor-pointer shadow-md hover:shadow-lg"
                : "bg-[#4648D4]/40 cursor-not-allowed"
                }`}
              onClick={handleSubmit}
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
