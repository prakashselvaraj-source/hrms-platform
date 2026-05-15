"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar, FileText, Upload, ChevronDown, CheckCircle2,
  Clock, BarChart2, SendHorizontal, X, CheckCircle, AlertCircle,
  Info, Paperclip, MessageSquare, History, Plus, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

// ─── Shared Components ──────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Icon size={20} />
        </div>
      )}
      <div>
        <h2 className="text-lg font-bold text-gray-900 leading-tight">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
      {children}
      {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
  );
}

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all placeholder:text-gray-400 shadow-sm";

function CustomSelect({ options, value, onChange, placeholder, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${inputCls} flex items-center justify-between text-left ${isOpen ? "border-indigo-400 ring-4 ring-indigo-500/5" : ""}`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {Icon && <Icon size={16} className="text-gray-400 shrink-0" />}
          <span className="truncate font-medium">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden py-1.5"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-[12px] text-gray-400 text-center italic">No options found</div>
              ) : (
                options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-[13px] transition-all flex items-center justify-between group ${value === opt.value ? "bg-indigo-50 text-indigo-700 font-bold" : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"}`}
                  >
                    <span>{opt.label}</span>
                    {value === opt.value && <CheckCircle size={14} className="text-indigo-500" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeaveManagement() {
  const tenantId = useTenant();
  const router = useRouter();
  const { selectedLeave } = useSelector((state) => state.leave);

  // Form State
  const [leaveType, setLeaveType] = useState(selectedLeave?.id || "");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("09:00");
  const [toTime, setToTime] = useState("09:00");
  const [teamMailId, setTeamMailId] = useState("");
  const [reason, setReason] = useState("");
  const [dayType, setDayType] = useState("Full Day");
  const [attachment, setAttachment] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data State
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [leaveStats, setLeaveStats] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [token, setToken] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [duration, setDuration] = useState(0);
  const [year] = useState(new Date().getFullYear());

  const selectedLeaveObj = leaveTypes?.find((t) => t.id === leaveType);
  const selectedLeaveName = selectedLeaveObj?.name?.toLowerCase() || "";
  const isPermission = selectedLeaveName.includes("permission");

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    setToken(t);
    if (tenantId && t) fetchData();
  }, [tenantId]);

  // Sync with Redux selectedLeave
  useEffect(() => {
    if (selectedLeave?.id) {
      setLeaveType(selectedLeave.id);
    }
  }, [selectedLeave]);

  const fetchData = async () => {
    try {
      const [stats, types, requests, policies] = await Promise.all([
        getAllLeaveTypesWithUserIdAndYear(tenantId, year),
        getAllLeaveTypes(tenantId),
        getMyLeaveRequests(tenantId, token, 0, 5),
        getAllLeavePolicy(tenantId)
      ]);
      setLeaveStats(stats?.summary || []);
      setLeaveTypes(Array.isArray(types) ? types : (types?.leaveTypes || []));
      setRecentRequests(Array.isArray(requests) ? (requests.data || requests) : []);
      setLeavePolicies(policies || []);
    } catch (e) { console.error(e); }
  };

  // ── Validation Logic ───────────────────────────────────────────────────────

  useEffect(() => {
    validateRequest();
  }, [leaveType, fromDate, toDate, dayType, leavePolicies]);

  const validateRequest = () => {
    const errors = [];
    if (!leaveType || !fromDate) {
      setValidationErrors([]);
      setDuration(0);
      return;
    }

    const policy = leavePolicies.find(p => p.leaveType?.id === leaveType);

    // Normalize dates to local midnight for comparison
    const start = new Date(fromDate + 'T00:00:00');
    const end = new Date((toDate || fromDate) + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Calculate Duration
    let days = 0;
    if (toDate && fromDate) {
      const diffTime = Math.abs(end - start);
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    } else {
      days = 1;
    }

    if (dayType !== "Full Day") days = 0.5;
    setDuration(days);

    if (!policy) return;

    const usage = policy.usageRules || {};
    const restrictions = policy.restrictions || {};

    // 2. Check Backdate
    const isBackdated = start < today;
    if (isBackdated && usage.processOptions?.backdate === false) {
      errors.push("Backdated applications are not allowed for this leave type.");
    }

    // 3. Check Notice Period
    if (!isBackdated && usage.minNoticeDays) {
      const noticeDays = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
      if (noticeDays < parseInt(usage.minNoticeDays)) {
        errors.push(`Minimum ${usage.minNoticeDays} days notice is required for this leave type.`);
      }
    }

    // 4. Check Max Per Request
    if (usage.maxPerRequest && days > parseInt(usage.maxPerRequest)) {
      errors.push(`You can only apply for a maximum of ${usage.maxPerRequest} days at a time.`);
    }

    // 5. Check Max Consecutive
    if (restrictions.maxConsecDays && days > parseInt(restrictions.maxConsecDays)) {
      errors.push(`Maximum consecutive days allowed is ${restrictions.maxConsecDays}.`);
    }

    setValidationErrors(errors);
  };

  const handleSubmit = async () => {
    const currentToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : "");
    console.log("Submitting Leave Request:", { leaveType, fromDate, reason, validationErrors, currentToken });

    if (!leaveType || !fromDate || !reason) {
      toast.error("Please fill all required fields");
      console.warn("Validation failed: missing required fields");
      return;
    }

    if (validationErrors.length > 0) {
      toast.error("Please resolve policy violations before submitting.");
      console.warn("Validation failed: policy violations", validationErrors);
      return;
    }

    if (!currentToken) {
      toast.error("Session expired. Please login again.");
      console.warn("Validation failed: missing token");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("leaveType", leaveType); // Backend expects 'leaveType'
    formData.append("fromDate", fromDate);   // Backend expects 'fromDate'
    formData.append("toDate", toDate || fromDate); // Backend expects 'toDate'
    formData.append("fromTime", fromTime);
    formData.append("toTime", toTime);
    formData.append("numberOfDays", duration.toString());
    formData.append("teamMailId", teamMailId);
    formData.append("reason", reason);
    formData.append("dayType", dayType);
    formData.append("year", year.toString());
    if (attachment) formData.append("attachment", attachment);

    try {
      await submitLeaveRequest(tenantId, currentToken, formData);
      toast.success("Request submitted successfully");
      setLeaveType(""); setReason(""); setAttachment(null);
      fetchData();
    } catch (e) {
      const errorDetails = {
        message: e.message,
        response: e.response?.data,
        status: e.response?.status,
        headers: e.response?.headers,
        config: e.config ? { url: e.config.url, method: e.config.method, data: "..." } : null
      };
      console.error("Submission Error Details:", JSON.stringify(errorDetails, null, 2));
      toast.error(e.response?.data?.error || e.response?.data?.message || e.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900">
      <Header />

      <main className="max-w-[1400px] mx-auto p-4 lg:p-8">

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {leaveStats.length > 0 ? (
            leaveStats.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{item.leaveType}</p>
                <div className="flex items-end gap-1">
                  <h3 className="text-2xl font-bold text-gray-800">{item.count}</h3>
                  <span className="text-[11px] text-gray-400 font-medium mb-1">/ {item?.accrual?.maxAnnualQuota || 0}</span>
                </div>
                <div className="mt-3 w-full h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.count / (item?.accrual?.maxAnnualQuota || 1)) * 100}%` }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </motion.div>
            ))
          ) : (
            [1, 2, 3, 4, 5].map(i => <div key={i} className="h-28 bg-white border border-gray-100 animate-pulse rounded-2xl" />)
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Application Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
              <div className="bg-indigo-600 px-8 py-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Request Time Off</h2>
                  <p className="text-indigo-100 text-xs font-medium mt-1 opacity-80">Submit your leave application for review.</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white">
                  <FileText size={24} />
                </div>
              </div>

              <div className="p-8">
                {validationErrors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2"
                  >
                    <div className="flex items-center gap-2 text-rose-600 font-bold text-[11px] uppercase tracking-widest mb-1">
                      <AlertCircle size={14} />
                      Policy Violations Detected
                    </div>
                    {validationErrors.map((err, i) => (
                      <p key={i} className="text-[12px] text-rose-700 font-medium flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-rose-400 shrink-0" />
                        {err}
                      </p>
                    ))}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  {/* Left Column: Core Details */}
                  <div className="space-y-6">
                    <div>
                      <FieldLabel required>Leave Type</FieldLabel>
                      <CustomSelect
                        options={leaveTypes.map(t => ({ value: t.id, label: t.name }))}
                        value={leaveType}
                        onChange={setLeaveType}
                        placeholder="Select leave type"
                        icon={Calendar}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel required>From Date</FieldLabel>
                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <FieldLabel required>To Date</FieldLabel>
                        <input type="date" value={toDate} min={fromDate} onChange={(e) => setToDate(e.target.value)} className={inputCls} />
                        {duration > 0 && (
                          <p className="text-[10px] font-bold text-indigo-500 mt-2 ml-1">
                            Duration: {duration} {duration === 1 ? 'Day' : 'Days'}
                          </p>
                        )}
                      </div>
                    </div>

                    {!isPermission && (
                      <div>
                        <FieldLabel>Day Type</FieldLabel>
                        <CustomSelect
                          options={[
                            { value: "Full Day", label: "Full Day" },
                            { value: "First Half", label: "First Half" },
                            { value: "Second Half", label: "Second Half" },
                          ]}
                          value={dayType}
                          onChange={setDayType}
                          placeholder="Select session"
                          icon={Clock}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column: Reasoning & Files */}
                  <div className="space-y-6">
                    <div>
                      <FieldLabel required>Reason</FieldLabel>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Briefly describe why you are taking leave..."
                        className={`${inputCls} h-[122px] resize-none py-3`}
                      />
                    </div>

                    <div>
                      <FieldLabel>Attachment (Optional)</FieldLabel>
                      <div
                        onClick={() => document.getElementById("fileInput").click()}
                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                        onDragLeave={() => setDragActive(false)}
                        onDrop={(e) => { e.preventDefault(); setAttachment(e.dataTransfer.files[0]); }}
                        className={`border-2 border-dashed rounded-2xl py-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${dragActive ? "border-indigo-400 bg-indigo-50" : "border-gray-200 bg-gray-50/50 hover:bg-white hover:border-indigo-300"
                          }`}
                      >
                        <input type="file" id="fileInput" className="hidden" onChange={(e) => setAttachment(e.target.files[0])} />
                        <Paperclip size={20} className={attachment ? "text-emerald-500" : "text-gray-400"} />
                        <span className="text-[11px] font-bold text-gray-500">{attachment ? attachment.name : "Drag files here or click to upload"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                    <Info size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-wide">Approval takes up to 48 hours</span>
                  </div>
                  <div className="flex gap-4">
                    <button className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-all">Cancel</button>
                    <button
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                      className="px-8 py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? "Submitting..." : "Send Application"}
                      {!isSubmitting && <SendHorizontal size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Status & Info */}
          <div className="space-y-6">

            {/* Quick Status */}
            <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <History size={16} />
                  </div>
                  <h3 className="text-[13px] font-bold text-gray-800 uppercase tracking-widest">Recent Activity</h3>
                </div>
                <button
                  onClick={() => router.push(`/${tenantId}/leaveManagement/leaverequeststatus`)}
                  className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  VIEW ALL <ArrowRight size={10} />
                </button>
              </div>

              <div className="space-y-4">
                {recentRequests.length > 0 ? (
                  recentRequests.slice(0, 3).map((req, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-xs font-bold text-gray-800">{req.leaveType}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{new Date(req.startDate).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-lg uppercase tracking-tighter ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                          req.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {req.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-gray-400 italic">No recent leave requests found.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Policy Notes */}
            <div className="bg-gray-900 rounded-[24px] p-6 text-white shadow-xl shadow-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-indigo-400">
                  <CheckCircle size={18} />
                </div>
                <h3 className="text-[13px] font-bold uppercase tracking-widest">Quick Rules</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Medical certificate for sick leave > 3 days.",
                  "Vacation requests 15 days in advance.",
                  "Comp off expires after 60 days."
                ].map((note, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <p className="text-[11px] text-gray-300 font-medium leading-relaxed">{note}</p>
                  </li>
                ))}
              </ul>
              <button className="w-full mt-8 py-3 bg-indigo-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 transition-all">
                Full Policy Guide
              </button>
            </div>

            {/* Support Widget */}
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-[24px] p-6 text-center">
              <div className="w-10 h-10 bg-white rounded-full mx-auto flex items-center justify-center text-indigo-600 shadow-sm mb-3">
                <MessageSquare size={18} />
              </div>
              <h4 className="text-sm font-bold text-gray-800">Need Assistance?</h4>
              <p className="text-[10px] text-gray-500 font-medium mt-1 mb-4">Contact HR support for any leave clarifications.</p>
              <button className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-widest">Support Portal</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}