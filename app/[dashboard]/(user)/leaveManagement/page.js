"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar, FileText, Upload, ChevronDown, CheckCircle2,
  Clock, BarChart2, SendHorizontal, X, CheckCircle, AlertCircle,
} from "lucide-react";
import Header from "./components/header";
import {
  getAllLeavePolicy,
  getAllLeaveTypes,
  getAllLeaveTypesWithUserIdAndYear,
  submitLeaveRequest,
  getMyLeaveRequests,
} from "@/services/user/leaveService";
import { useTenant } from "@/hooks/useTenant";
import { useRouter } from "next/navigation";

// ─── Static data ──────────────────────────────────────────────────────────────

const statusStyles = {
  APPROVED: { icon: CheckCircle2, iconColor: "text-emerald-500", badgeColor: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  PENDING: { icon: Clock, iconColor: "text-amber-500", badgeColor: "bg-amber-50 text-amber-700 ring-amber-200" },
  REJECTED: { icon: AlertCircle, iconColor: "text-red-500", badgeColor: "bg-red-50 text-red-700 ring-red-200" },
};

const policyNotes = [
  "Medical certificate required for sick leave exceeding 3 days.",
  "Vacation requests must be submitted 15 days in advance.",
  "Comp off expires after 60 days of earning.",
];

const optionalHolidays = [
  "Eid al-Fitr (21-Mar-2026)",
  "Good Friday (03-Apr-2026)",
  "Bakrid (28-May-2026)",
  "Diwali/Deepavali (09-Nov-2026)",
];

// ─── Field Label ──────────────────────────────────────────────────────────────

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

// ─── Input base class ─────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all placeholder:text-gray-400 shadow-sm";

// ─── Custom Select Component ──────────────────────────────────────────────────

function CustomSelect({ options, value, onChange, placeholder, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputCls} flex items-center justify-between text-left transition-all duration-200 ${
          isOpen ? "ring-2 ring-indigo-100 border-indigo-300" : ""
        } ${!selectedOption ? "text-gray-400" : "text-gray-800"}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {Icon && <Icon size={14} className="text-gray-400 shrink-0" />}
          <span className="truncate font-medium">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150 origin-top">
          <div className="max-h-60 overflow-y-auto py-1.5 custom-scrollbar">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-[12px] text-gray-400 text-center italic">No options available</div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-[13px] transition-all flex items-center justify-between group ${
                    value === opt.value 
                      ? "bg-indigo-50 text-indigo-700 font-semibold" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {value === opt.value && <CheckCircle size={14} className="text-indigo-500 animate-in zoom-in duration-200" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeaveManagement() {
  
  const [leaveType, setLeaveType]           = useState("");
  const [fromDate, setFromDate]             = useState("");
  const [toDate, setToDate]                 = useState("");
  const [fromTime, setFromTime]             = useState("09:00");
  const [toTime, setToTime]                 = useState("09:00");
  const [teamMailId, setTeamMailId]         = useState("");
  const [reason, setReason]                 = useState("");
  const [annually, setAnnually]             = useState(true);
  const [selectedHoliday, setSelectedHoliday] = useState("");
  const [applyWithOption, setApplyWithOption] = useState("start-total");
  const [dayType, setDayType]               = useState("Full Day");
  const [attachment, setAttachment]         = useState(null);
  const [dragActive, setDragActive]         = useState(false);
  const [showModal, setShowModal]           = useState(false);
  const [submitError, setSubmitError]       = useState("");

  const [leaveTypes, setLeaveTypes]           = useState([]);
  const [leavePolicy, setLeavePolicy]         = useState([]);
  const [leaveStats, setLeaveStats]           = useState(null);
  const [recentRequests, setRecentRequests]   = useState([]);
  const [token, setToken]                     = useState("");
  const [year]                        = useState(new Date().getFullYear());

  const tenantId = useTenant();
  const router = useRouter();

  const selectedLeaveObj  = leaveTypes?.find((t) => t.id === leaveType);
  const selectedLeaveName = selectedLeaveObj?.name?.toLowerCase() || selectedLeaveObj?.code?.toLowerCase() || "";
  const isPermission = selectedLeaveName.includes("permission");
  const isOptional   = selectedLeaveName.includes("optional");
  const isRegular    = !isPermission && !isOptional && leaveType !== "";

  useEffect(() => {
    if (typeof window !== "undefined") setToken(localStorage.getItem("token") || "");
  }, []);

  useEffect(() => {
    if (!tenantId || !token) return;

    const run = async () => {
      try {
        const stats = await getAllLeaveTypesWithUserIdAndYear(tenantId, year);
        setLeaveStats(stats?.summary || null);
      } catch (e) { console.error(e); }

      try {
        const types = await getAllLeaveTypes(tenantId);
        setLeaveTypes(Array.isArray(types) ? types : (types?.leaveTypes || []));
      } catch (e) { console.error(e); }

      try {
        const policy = await getAllLeavePolicy(tenantId);
        setLeavePolicy(Array.isArray(policy) ? policy : (policy?.leavePolicy || []));
      } catch (e) { console.error(e); }

      try {
        const requests = await getMyLeaveRequests(tenantId, token, 0, 5);
        setRecentRequests(Array.isArray(requests) ? requests : []);
      } catch (e) { console.error(e); }
    };

    run();
  }, [tenantId, token, year, showModal]);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [showModal]);

  const validateFile = (file) => {
    if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      alert("Only PDF, JPG, PNG files are allowed"); return false;
    }
    if (file.size > 5 * 1024 * 1024) { alert("File must be less than 5MB"); return false; }
    return true;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) setAttachment(file);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) setAttachment(file);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("leaveType", leaveType);
    formData.append("fromDate", fromDate);
    formData.append("toDate", toDate);
    formData.append("fromTime", fromTime);
    formData.append("toTime", toTime);
    formData.append("teamMailId", teamMailId);
    formData.append("reason", reason);
    formData.append("dayType", dayType);
    formData.append("applyWithOption", applyWithOption);
    formData.append("selectedHoliday", selectedHoliday);
    if (attachment) formData.append("attachment", attachment);
    try {
      await submitLeaveRequest(tenantId, token, formData);
      setSubmitError("");
      setShowModal(true);
    } catch (e) {
      console.error(e);
      const errorMsg = e.response?.data?.error || e.response?.data?.message || e.message || "An unexpected error occurred";
      setSubmitError(errorMsg);
      setShowModal(true);
    }
  };

  const fmtDate = (d) => d
    ? new Date(d).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })
    : "";

  const calcPermissionHours = () => {
    if (applyWithOption === "start-total") return `${toTime} Hr(s)`;
    const diff = (new Date(`1970-01-01T${toTime}`) - new Date(`1970-01-01T${fromTime}`)) / 3600000;
    return `${diff} Hr(s)`;
  };

  return (
    <div className="min-h-screen bg-gray-50/70 font-sans">
      <Header />

      <main className="p-4 md:p-6">

        {/* ── Leave Report ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-5 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <BarChart2 size={14} className="text-indigo-500" />
              </div>
              <span className="text-[13px] font-semibold text-gray-900">Leave Report</span>
            </div>

            <div className="flex items-center gap-0.5 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setAnnually(true)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${annually ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Annually
              </button>
              <button
                onClick={() => setAnnually(false)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${!annually ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.isArray(leaveStats) && leaveStats.map((item, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-white p-3 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-400 rounded-l-xl" />
                <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2 truncate pl-1">{item.leaveType}</p>
                <div className="flex items-end gap-1 pl-1">
                  <span className="text-2xl font-semibold text-gray-900">{item.count}</span>
                  <span className="text-[11px] text-gray-400 pb-0.5">/ {item?.accrual?.maxAnnualQuota || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* ── Form ── */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Form header strip */}
            <div className="bg-indigo-600 text-white px-5 py-3 flex items-center gap-2.5">
              <span className="text-indigo-300 text-[11px] font-semibold tracking-wider">CRTX-DE-0010</span>
              <span className="text-indigo-400">·</span>
              <span className="text-[13px] font-medium">Shivani Devendran</span>
            </div>

            <div className="p-5">
              {/* Form title */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-indigo-500" />
                </div>
                <div>
                  <h2 className="text-[14px] font-semibold text-gray-900">Leave Request Form</h2>
                  <p className="text-[11px] text-gray-400 mt-0.5">Provide details for your absence period.</p>
                </div>
              </div>

              {/* Leave Type */}
              <div className="mb-4">
                <FieldLabel>Leave Type</FieldLabel>
                <div className="relative">
                  <CustomSelect
                    options={leaveTypes.map(t => ({ value: t.id, label: t.name }))}
                    value={leaveType}
                    onChange={(val) => { setLeaveType(val); setSelectedHoliday(""); }}
                    placeholder="Select leave type"
                    icon={FileText}
                  />
                </div>
              </div>

              {/* Optional: Applicable Days */}
              {isOptional && (
                <div className="mb-4">
                  <FieldLabel>Applicable Days</FieldLabel>
                  <div className="space-y-2.5 mt-1">
                    {optionalHolidays.map((h) => (
                      <label key={h} className="flex items-center gap-2.5 text-[12px] text-gray-700 cursor-pointer group">
                        <input
                          type="radio" name="holiday" value={h}
                          checked={selectedHoliday === h}
                          onChange={(e) => setSelectedHoliday(e.target.value)}
                          className="accent-indigo-600 w-4 h-4"
                        />
                        {h}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Permission: Apply With */}
              {isPermission && (
                <div className="mb-4">
                  <FieldLabel required>Apply With</FieldLabel>
                  <div className="space-y-2.5 mt-1">
                    {[
                      { value: "start-total", label: "Start time and total hours" },
                      { value: "start-end",   label: "Start time and end time" },
                    ].map(({ value, label }) => (
                      <label key={value} className="flex items-center gap-2.5 text-[12px] text-gray-700 cursor-pointer">
                        <input
                          type="radio" name="applyWith" value={value}
                          checked={applyWithOption === value}
                          onChange={(e) => setApplyWithOption(e.target.value)}
                          className="accent-indigo-600 w-4 h-4"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Date fields */}
              {leaveType && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <FieldLabel>From Date</FieldLabel>
                    <input
                      type="date" value={fromDate}
                      onChange={(e) => { setFromDate(e.target.value); setToDate(e.target.value); }}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <FieldLabel>To Date</FieldLabel>
                    <input
                      type="date" value={toDate} min={fromDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              {/* Regular: Day type + total */}
              {isRegular && fromDate && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[12px] text-gray-500 min-w-[150px]">{fmtDate(fromDate)}</span>
                    <div className="relative flex-1">
                      <CustomSelect
                        options={[
                          { value: "Full Day", label: "Full Day" },
                          { value: "First Half", label: "First Half" },
                          { value: "Second Half", label: "Second Half" },
                        ]}
                        value={dayType}
                        onChange={setDayType}
                        placeholder="Select day type"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
                    <span className="text-[12px] font-medium text-indigo-700">Total</span>
                    <span className="text-[12px] font-bold text-indigo-800">1 Day(s)</span>
                  </div>
                </div>
              )}

              {/* Permission: Time fields + total */}
              {isPermission && fromDate && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[12px] text-gray-500 min-w-[150px]">{fmtDate(fromDate)}</span>
                    <input
                      type="time" value={fromTime}
                      onChange={(e) => { setFromTime(e.target.value); setToTime(e.target.value); }}
                      className={inputCls + " flex-1"}
                    />
                    <input
                      type="time" value={toTime} min={fromTime}
                      onChange={(e) => (applyWithOption === "start-total" || e.target.value > fromTime) && setToTime(e.target.value)}
                      className={inputCls + " flex-1"}
                    />
                  </div>
                  <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
                    <span className="text-[12px] font-medium text-indigo-700">Total</span>
                    <span className="text-[12px] font-bold text-indigo-800">{calcPermissionHours()}</span>
                  </div>
                </div>
              )}

              {/* Team Mail ID */}
              <div className="mb-4">
                <FieldLabel>Team Mail ID</FieldLabel>
                <input
                  type="email" value={teamMailId} placeholder="team@company.com"
                  onChange={(e) => setTeamMailId(e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Reason */}
              <div className="mb-4">
                <FieldLabel>Reason</FieldLabel>
                <textarea
                  value={reason} rows={4} placeholder="Briefly explain the reason for leave..."
                  onChange={(e) => setReason(e.target.value)}
                  className={inputCls + " resize-none"}
                />
              </div>

              {/* Attachment */}
              <div className="mb-6">
                <FieldLabel>Attachment (Optional)</FieldLabel>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} id="fileUpload" className="hidden" />
                <div
                  onClick={() => document.getElementById("fileUpload").click()}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    dragActive ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-gray-50/60 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                    <Upload size={16} className="text-gray-400" />
                  </div>
                  <p className="text-[12px] text-gray-500 font-medium">Click or drag to upload</p>
                  <p className="text-[10px] text-gray-400">PDF, JPG, PNG — up to 5MB</p>
                  {attachment && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle size={12} /> {attachment.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5">
                <button className="px-5 py-2.5 rounded-xl border border-red-200 text-red-400 text-[12px] font-semibold hover:bg-red-50 transition-colors">
                  Cancel Request
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  Submit Request
                  <SendHorizontal size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="flex flex-col gap-4">

            {/* Balance card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Calendar size={13} className="text-indigo-500" />
                  </div>
                  <span className="text-[12px] font-semibold text-gray-900">08-APR-2026</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {isPermission ? "Hour(s)" : "Day(s)"}
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-xl">
                  <span className="text-[11px] font-medium text-gray-500">Total Available</span>
                  <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">2</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3">
                  <span className="text-[11px] font-medium text-gray-400">Current Booking</span>
                  <span className="text-[12px] font-bold text-gray-800">1</span>
                </div>
                <div className="border-t border-gray-100 pt-2.5 flex justify-between items-center py-2 px-3">
                  <span className="text-[11px] font-medium text-gray-400">Balance Available</span>
                  <span className="text-[12px] font-bold text-gray-800">1</span>
                </div>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[12px] font-semibold text-gray-900">Recent Requests</span>
                <button className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors" onClick={() => router.push(`/${tenantId}/leaveManagement/leaverequeststatus`)}>View All</button>
              </div>
              <div className="space-y-2">
                {recentRequests.length === 0 ? (
                  <p className="text-[11px] text-gray-400 text-center py-4 italic">No recent requests</p>
                ) : (
                  recentRequests.map((req) => {
                    const style = statusStyles[req.status] || statusStyles.PENDING;
                    const Icon = style.icon;
                    const fmtRange = `${new Date(req.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase()} – ${new Date(req.endDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase()}`;
                    return (
                      <div key={req.id} className="flex items-center justify-between bg-gray-50 px-3 py-2.5 rounded-xl">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
                            <Icon size={14} className={style.iconColor} />
                          </div>
                          <div>
                            <p className="text-[12px] font-medium text-gray-800">{req.leaveType}</p>
                            <p className="text-[10px] text-gray-400">{fmtRange}</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ring-1 uppercase tracking-wider ${style.badgeColor}`}>
                          {req.status}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Policy Notes */}
            <div className="bg-indigo-600 rounded-2xl p-5">
              <h3 className="text-[11px] font-bold text-indigo-200 uppercase tracking-widest mb-3">Quick Policy Notes</h3>
              <ul className="space-y-2.5">
                {policyNotes.map((note, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[11px] text-indigo-100 leading-relaxed">
                    <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                      <CheckCircle size={10} className="text-white" />
                    </span>
                    {note}
                  </li>
                ))}
              </ul>
              <button className="mt-4 w-full py-2 rounded-xl text-[11px] font-bold text-indigo-200 border border-indigo-500 hover:bg-indigo-500 transition-colors uppercase tracking-wider">
                Read Full Policy
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Success Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-[440px] p-7 shadow-2xl border border-gray-100">

            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X size={15} />
            </button>

            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${submitError ? "bg-red-50" : "bg-indigo-50"}`}>
              {submitError ? <AlertCircle size={22} className="text-red-600" /> : <CheckCircle size={22} className="text-indigo-600" />}
            </div>

            <h2 className="text-[16px] font-semibold text-gray-900 mb-1">
              {submitError ? "Submission Failed" : "Leave Submitted Successfully"}
            </h2>
            <p className="text-[12px] text-gray-400 mb-6">
              {submitError ? submitError : "Your request has been sent for approval."}
            </p>

            {!submitError && (
              <>
                {/* Requester */}
                <div className="flex items-center gap-3 mb-5">
                  <img src="https://i.pravatar.cc/40" className="w-9 h-9 rounded-full ring-2 ring-white shadow" alt="avatar" />
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">Shivani Singh</p>
                    <p className="text-[11px] text-indigo-600 font-medium">EMP-1024</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex gap-4 items-start mb-6 pl-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  </div>
                  <div className="flex flex-col gap-5">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-700">Submitted</p>
                      <p className="text-[10px] text-gray-400">Request created</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-amber-600">Pending Approval</p>
                      <div className="flex items-center gap-2 mt-1">
                        <img src="https://i.pravatar.cc/41" className="w-6 h-6 rounded-full" alt="approver" />
                        <div>
                          <p className="text-[11px] font-medium text-gray-700">Marcus Thorne</p>
                          <p className="text-[10px] text-indigo-500">CC-EMP-001</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex gap-2.5">
              {!submitError && (
                <button className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold transition-colors">
                  Send Follow-up Email
                </button>
              )}
              <button
                onClick={() => setShowModal(false)}
                className={`py-2.5 rounded-xl text-[12px] font-semibold transition-colors ${
                  submitError 
                    ? "w-full bg-red-600 hover:bg-red-700 text-white" 
                    : "px-4 border border-red-200 text-red-400 hover:bg-red-50"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}