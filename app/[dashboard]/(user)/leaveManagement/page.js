"use client";

import { useState,useEffect,useRef} from "react";
import {
  Calendar, FileText, Upload, ChevronDown, CheckCircle2,
  Clock, BarChart2, Home, User, CreditCard, Mail, TrendingUp,
  HeadphonesIcon, Settings, Bell, ClipboardList, SendHorizontal,MoreHorizontal
} from "lucide-react";
import Header from "./components/header";

const leaveStats = [
  { label: "SICK LEAVE", value: "04", sub: "/10" },
  { label: "COMP OFF", value: "02", sub: "/5" },
  { label: "CASUAL LEAVE", value: "07", sub: "/14" },
  { label: "OPTIONAL", value: "01", sub: "/02" },
  { label: "LOP", value: "00", sub: "Encashment Earning" },
];

const recentRequests = [
  { type: "Sick Leave", dates: "OCT 11 - OCT 14", status: "APPROVED", icon: CheckCircle2, iconColor: "text-purple-600", badgeColor: "bg-green-100 text-green-700" },
  { type: "Casual Le...", dates: "SEP 05 - SEP 08", status: "PENDING", icon: Clock, iconColor: "text-orange-400", badgeColor: "bg-orange-100 text-orange-600" },
];

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

export default function LeaveManagement() {
 

  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("09:00");
  const [toTime, setToTime] = useState("09:00");
  const [teamMailId, setTeamMailId] = useState("");
  const [reason, setReason] = useState("");
  const [annually, setAnnually] = useState(true);
  const [selectedHoliday, setSelectedHoliday] = useState("");
  const [applyWithOption, setApplyWithOption] = useState("start-total");
  const [dayType, setDayType] = useState("Full Day");
  const [attachment, setAttachment] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [permissionTime, setPermissionTime] = useState();
  const [showModal, setShowModal] = useState(false);

  const isPermission = leaveType === "permission";
  const isOptional = leaveType === "optional";
  const isRegular = !isPermission && !isOptional && leaveType !== "";
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (validateFile(file)) {
      setAttachment(file);
    }

    
  };
  const validateFile = (file) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF, JPG, PNG files are allowed");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File must be less than 5MB");
      return false;
    }

    return true;
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];

    if (file && validateFile(file)) {
      setAttachment(file);
    }
  };

  const handleSubmit = () => {
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

    if (attachment) {
      formData.append("attachment", attachment);
    }

    console.log(formData);
    setShowModal(true);
  }

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

 
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Nav */}
       <Header/>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
          {/* Leave Report */}
          <div className="bg-white rounded-2xl shadow-sm mb-4 p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#191C1E] font-semibold text-base">
                <BarChart2 size={18} className="text-[#4A45B6] hidden md:block" />
                Leave Report
              </div>
              <div className="flex items-center gap-1 bg-[#FFFFFF] rounded-full p-1 text-xs font-medium">
                <button onClick={() => setAnnually(true)} className={`px-3 py-1 rounded-full transition-colors ${annually ? "bg-[#8004DB] text-white" : "text-[#5A605E]"}`}>ANNUALLY</button>
                <button onClick={() => setAnnually(false)} className={`px-3 py-1 rounded-full transition-colors ${!annually ? "bg-purple-600 text-white" : "text-gray-500"}`}>MONTHLY</button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              {leaveStats.map(({ label, value, sub }) => (
                <div key={label} className="rounded-xl p-3 border bg-[#E2DFFF]">
                  <p className="text-[10px] text-[#64748B] font-semibold tracking-wide mb-1">{label}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-[#191C1E]">{value}</span>
                    <span className="text-xs pb-1 text-[#94A3B8]">{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
            {/* Form */}
            <div className="lg:col-span-2 bg-white shadow-sm overflow-hidden">
              <div className="bg-[#4F279B] text-white text-sm font-medium px-5 py-2.5 flex items-center gap-2">
                <span className="text-purple-300 text-xs">CRTX-DE-0010</span>
                <span className="text-purple-300">·</span>
                <span>Shivani Devendran</span>
              </div>

              <div className="p-5 bg-[#F2F4F6]">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-9 h-9 rounded-md bg-[#4A45B61A]/60 flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-[#4A45B6]" />
                  </div>
                  <div>
                    <h2 className="text-[#191C1E] font-semibold text-base">Leave Request Form</h2>
                    <p className="text-[#737686] text-xs mt-0.5">Provide details for your absence period.</p>
                  </div>
                </div>

                {/* Leave Type */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 tracking-wide mb-1.5">LEAVE TYPE</label>
                  <div className="relative">
                    <select
                      value={leaveType}
                      onChange={(e) => { setLeaveType(e.target.value); setSelectedHoliday(""); }}
                      className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-500 focus:outline-none cursor-pointer"
                    >
                      <option value="">Select leave type</option>
                      <option value="sick">Sick Leave</option>
                      <option value="casual">Casual Leave</option>
                      <option value="comp">Comp Off</option>
                      <option value="optional">Optional Holiday</option>
                      <option value="permission">Permission</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* === OPTIONAL HOLIDAY: Applicable Days === */}
                {isOptional && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 tracking-wide mb-2">
                      APPLICABLE DAYS
                    </label>
                    <div className="space-y-3">
                      {optionalHolidays.map((holiday) => (
                        <label key={holiday} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name="holiday"
                            value={holiday}
                            checked={selectedHoliday === holiday}
                            onChange={(e) => setSelectedHoliday(e.target.value)}
                            className="accent-purple-600 w-4 h-4"
                          />
                          {holiday}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* === PERMISSION: Apply With radio === */}
                {isPermission && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 tracking-wide mb-2">
                      APPLY WITH <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: "start-total", label: "Start time and total hours" },
                        { value: "start-end", label: "Start time and end time" },
                      ].map(({ value, label }) => (
                        <label key={value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name="applyWith"
                            value={value}
                            checked={applyWithOption === value}
                            onChange={(e) => setApplyWithOption(e.target.value)}
                            className="accent-purple-600 w-4 h-4"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* === DATE FIELDS (all types except nothing selected) === */}
                {leaveType && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 tracking-wide mb-1.5">FROM DATE</label>
                      <input type="date" value={fromDate} onChange={(e) => {const date = e.target.value ; setFromDate(date); setToDate(date)}} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-[#191C1E] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 tracking-wide mb-1.5">TO DATE</label>
                      <input type="date" value={toDate} min={fromDate} onChange={(e) => setToDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-[#191C1E] focus:outline-none" />
                    </div>
                  </div>
                )}

                {/* === REGULAR LEAVE: Full Day / Half Day row + Total === */}
                {isRegular && fromDate && (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-600 min-w-[120px]">
                        {fromDate ? new Date(fromDate).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) : ""}
                      </span>
                      <div className="relative flex-1">
                        <select
                          value={dayType}
                          onChange={(e) => setDayType(e.target.value)}
                          className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer"
                        >
                          <option>Full Day</option>
                          <option>First Half</option>
                          <option>Second Half</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-200 rounded-md px-4 py-2 text-sm">
                      <span className="text-gray-600 font-medium">Total</span>
                      <span className="font-semibold text-gray-800">1 Day(s)</span>
                    </div>
                  </div>
                )}

                {/* === PERMISSION: Time fields + Total === */}
                {isPermission && fromDate && (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-600 min-w-[120px]">
                        {fromDate ? new Date(fromDate).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }) : ""}
                      </span>
                      <input
                        type="time"
                        value={fromTime}
                        onChange={(e) => {
                          const time = e.target.value;
                          setFromTime(time);
                          setToTime(time);
                        }}
                        className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none"
                      />
                      <input
                        type="time"
                        value={toTime}
                        min={fromTime}
                        onChange={(e) => (applyWithOption === "start-total" || e.target.value > fromTime) && setToTime(e.target.value)}
                        className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between bg-gray-200 rounded-md px-4 py-2 text-sm">
                      <span className="text-gray-600 font-medium">Total</span>
                      <span className="font-semibold text-gray-800">
                        {
                          applyWithOption === "start-total"
                            ? `${toTime} Hr(s)`
                            : `${
                                (new Date(`1970-01-01T${toTime}:00`) -
                                  new Date(`1970-01-01T${fromTime}:00`)) /
                                3600000
                              } Hr(s)`
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* Team Mail ID */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 tracking-wide mb-1.5">TEAM MAIL ID</label>
                  <input type="email" value={teamMailId} onChange={(e) => setTeamMailId(e.target.value)} placeholder="mail id" className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-[#191C1E] focus:outline-none" />
                </div>

                {/* Reason */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 tracking-wide mb-1.5">REASON</label>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly explain the reason for leave..." rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-[#191C1E] focus:outline-none resize-none" />
                </div>

                
                {/* Attachment */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-gray-500 tracking-wide mb-1.5">
                    ATTACHMENT (OPTIONAL)
                  </label>

                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    id="fileUpload"
                    className="hidden"
                  />

                  <div
                    onClick={() => document.getElementById("fileUpload").click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-md py-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors
                      ${dragActive ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}
                    `}
                  >
                    
                    <Upload size={22} className="text-gray-400" />

                    <p className="text-xs text-gray-500 text-center">
                      Click or drag to upload medical certificates
                    </p>

                    <p className="text-[10px] text-gray-400">
                      PDF, JPG, PNG up to 5MB
                    </p>

                    {attachment && (
                      <p className="text-xs text-green-600 mt-2">
                        {attachment.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <button className="px-6 py-2.5 w-full md:w-fit rounded-md border border-[#FF5E5E] text-[#FC0808] text-sm font-medium">cancel request</button>
                  <button className="px-6 py-2.5 w-full md:w-fit rounded-md bg-[#4A45B6] text-white text-sm font-medium flex items-center justify-center gap-2" onClick={handleSubmit} >
                    Submit Request <SendHorizontal size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#F2F4F6] rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={15} className="text-purple-600" />
                    <span className="text-[#191C1E] font-semibold text-sm">08-APR-2026</span>
                  </div>
                  <span className="text-xs text-[#4A45B6] bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                    {isPermission ? "HOUR(S)" : "DAYS(S)"}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[#191C1E] text-xs">TOTAL AVAILABLE</span>
                    <span className="font-bold bg-[#007B71]/10 py-1 px-2 text-[#006058]">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#737686]">CURRENT BOOKING</span>
                    <span className="font-bold text-[#000000] px-2">1</span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="flex justify-between items-center">
                    <span className="text-[#737686] text-xs">BALANCE AVAILABLE</span>
                    <span className="font-bold text-[#000000] px-2">1</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#F2F4F6] rounded-2xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#191C1E] font-semibold text-sm">RECENT REQUESTS</span>
                  <button className="text-[#4A45B6] text-xs font-medium">VIEW ALL</button>
                </div>
                <div className="space-y-3">
                  {recentRequests.map(({ type, dates, status, icon: Icon, iconColor, badgeColor }) => (
                    <div key={type} className="flex items-center justify-between bg-[#FFFFFF] px-2 py-1">
                      <div className="flex items-center gap-2">
                        <Icon size={18} className={iconColor} />
                        <div>
                          <p className="text-gray-700 text-sm font-medium">{type}</p>
                          <p className="text-gray-400 text-[10px]">{dates}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-linear-to-t from-[#4A45B6] to-[#712AE2] rounded-2xl shadow-sm px-4 py-8">
                <h3 className="font-semibold text-sm mb-3 text-[#FFFFFF]">QUICK POLICY NOTES</h3>
                <ul className="space-y-2">
                  {policyNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#FFFFFF]">
                      <span className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full bg-purple-500 flex items-center justify-center text-[8px] font-bold text-white">✓</span>
                      {note}
                    </li>
                  ))}
                </ul>
                <button className="mt-4 w-full py-2 rounded-xl text-[#FFFFFF] text-xs font-semibold backdrop-blur-md bg-[white]/12 uppercase">READ FULL POLICY</button>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showModal && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      
        {/* Modal */}
        <div className="bg-white w-[500px] h-[441px] rounded-[10px] shadow-xl p-6 relative shadow-[7px_10px_27px_11px_#00000021]">

          {/* Title */}
          <h2 className="text-[20px] font-semibold text-[#5E36CD] mb-6">
            Leave form submitted successfully
          </h2>

          {/* User Info */}
          <div className="flex items-start gap-3 mb-6">

            <img
              src="https://i.pravatar.cc/40"
              className="w-8 h-8 rounded-full"
            />

            <div>
              <p className="font-medium text-[14px]">Shivani Singh</p>
              <p className="text-[12px]  text-[#4A45B6]">EMP-1024</p>
              <p className="text-[12px] text-[#767676] mt-1">
                Your request has been sent for approval
              </p>
            </div>

          </div>

          {/* Vertical line */}
          <div className="flex">
              <div className="ml-4 border-l border-[#D9D9D9] h-[70px] relative">

                {/* Pending */}
                <div className="absolute -left-[6px] bottom-[0] w-3 h-3 bg-yellow-400 rounded-full"></div>
                
              </div>
              <div className="flex items-end">
                <p className="text-[12px] text-[#767676] ml-5">Pending</p>
              </div>
              
          </div>
          

          {/* Approver */}
          <div className="flex items-start gap-3 mt-4 ml-10">
            
            <img
              src="https://i.pravatar.cc/41"
              className="w-8 h-8 rounded-full"
            />

            <div>
              <p className="text-[12px] font-medium text-[#191C1E]">Marcus Thorne</p>
              <p className="text-[12px] text-[#4A45B6]">CC-EMP-001</p>
            </div>

          </div>

          {/* Pending Label */}
          

          {/* Buttons */}
          <div className="flex gap-4 mt-10 ml-10">

            <button className="bg-black text-white text-[13px] px-4 py-2 rounded-sm">
              Send Follow-up E-mail
            </button>

            <button
              onClick={()=>{setShowModal(false)}}
              className="border border-red-400 text-red-500 text-[13px] px-4 py-2 rounded-sm"
            >
              close
            </button>

          </div>
        </div>
      </div>)}
    </div>
  );
}