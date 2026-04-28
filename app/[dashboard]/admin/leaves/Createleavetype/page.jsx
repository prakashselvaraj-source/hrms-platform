"use client";

import { useState } from "react";
import { useTenant } from "@/hooks/useTenant";
import { createLeaveType } from "@/services/leaveService";

const COLOR_MAP = {
  "#7F77DD": "Purple",
  "#E24B4A": "Red",
  "#378ADD": "Blue",
  "#1D9E75": "Green",
  "#EF9F27": "Amber",
  "#888780": "Gray",
  "#D4537E": "Pink",
};

const COLORS = Object.keys(COLOR_MAP);

export default function CreateLeaveType({ onBack, onSubmit }) {
  const [leaveName, setLeaveName] = useState("");
  const [leaveCode, setLeaveCode] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState("#7F77DD");
  const [status, setStatus] = useState("active");
  const [errors, setErrors] = useState({});

  const [paid, setPaid] = useState(true);
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [attachmentRequired, setAttachmentRequired] = useState(false);

  const [loading, setLoading] = useState(false);

  const tenantId = useTenant();

  const handleCodeChange = (e) => {
    setLeaveCode(e.target.value.toUpperCase().slice(0, 4));
  };

  const validate = () => {
    const newErrors = {};
    if (!leaveName.trim()) newErrors.leaveName = "Leave name is required.";
    if (!leaveCode.trim()) newErrors.leaveCode = "Leave code is required.";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      if (!tenantId) {
        alert("Invalid tenant");
        return;
      }

      const payload = {
        name: leaveName,
        code: leaveCode,
        description,
        color: selectedColor,
        active: status === "active",
        paid,
        requiresApproval,
        attachmentRequired,
      };

      
      const res = await createLeaveType(tenantId, payload);
      const created = res.data;

      localStorage.setItem("currentLeaveTypeId", created.id);

      if (onSubmit) {
        onSubmit(created);
      }
    } catch (err) {
      console.error(err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to create leave type");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 mx-auto w-full  px-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-medium text-gray-900 mb-1">
            Create leave type
          </h1>
          <p className="text-[13px] text-gray-500">
            Create basic leave type. Configure rules in next step.
          </p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] px-3.5 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      </div>

      {/* Form card */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col gap-5 shadow-sm">
        {/* Leave name */}
        <div>
          <label className="text-[12px] font-medium text-gray-500 block mb-1.5">
            Leave name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={leaveName}
            onChange={(e) => setLeaveName(e.target.value)}
            placeholder="e.g. Casual Leave"
            className={`w-full text-sm px-3 py-2 rounded-lg border bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition ${
              errors.leaveName ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.leaveName && (
            <p className="text-[11px] text-red-500 mt-1">{errors.leaveName}</p>
          )}
        </div>

        {/* Leave code */}
        <div>
          <label className="text-[12px] font-medium text-gray-500 block mb-1.5">
            Leave code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={leaveCode}
            onChange={handleCodeChange}
            maxLength={4}
            placeholder="CL"
            className={`w-full text-sm px-3 py-2 rounded-lg border bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition tracking-widest font-mono uppercase ${
              errors.leaveCode ? "border-red-400" : "border-gray-200"
            }`}
          />
          <p className="text-[11px] text-gray-400 mt-1">Max 4 characters</p>
          {errors.leaveCode && (
            <p className="text-[11px] text-red-500 mt-0.5">
              {errors.leaveCode}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-[12px] font-medium text-gray-500 block mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe when this leave type applies..."
            className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition resize-y font-sans"
          />
        </div>

        {/* leave behaviour */}
        <div>
          <label className="text-[12px] font-medium text-gray-500 block mb-2.5">
            Leave Behavior
          </label>

          <div className="flex flex-col gap-3">
            {/* Paid */}
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
              <div className="flex flex-col">
                <span className="text-sm text-gray-700">Paid Leave</span>
                <span className="text-xs text-gray-400">
                  Employee is paid during leave
                </span>
              </div>
              <button
                onClick={() => setPaid(!paid)}
                className={`w-10 h-5 rounded-full transition ${
                  paid ? "bg-indigo-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`h-5 w-5 bg-white rounded-full shadow transform transition ${
                    paid ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {/* Requires Approval */}
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-700">Requires Approval</span>
              <button
                onClick={() => setRequiresApproval(!requiresApproval)}
                className={`w-10 h-5 rounded-full transition ${
                  requiresApproval ? "bg-indigo-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`h-5 w-5 bg-white rounded-full shadow transform transition ${
                    requiresApproval ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            {/* Attachment Required */}
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-700">Attachment Required</span>
              <button
                onClick={() => setAttachmentRequired(!attachmentRequired)}
                className={`w-10 h-5 rounded-full transition ${
                  attachmentRequired ? "bg-indigo-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`h-5 w-5 bg-white rounded-full shadow transform transition ${
                    attachmentRequired ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="text-[12px] font-medium text-gray-500 block mb-2.5">
            Color
          </label>
          <div className="flex gap-2.5 flex-wrap">
            {COLORS.map((hex) => (
              <button
                key={hex}
                onClick={() => setSelectedColor(hex)}
                title={COLOR_MAP[hex]}
                className="w-7 h-7 rounded-full border-2 border-transparent transition-all cursor-pointer focus:outline-none"
                style={{
                  backgroundColor: hex,
                  outline:
                    selectedColor === hex
                      ? `2.5px solid ${hex}`
                      : "2.5px solid transparent",
                  outlineOffset: "2px",
                }}
              />
            ))}
          </div>

          {/* Color preview */}
          <div className="mt-3 flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg transition-colors"
              style={{ backgroundColor: selectedColor }}
            />
            <span className="text-[13px] font-medium text-gray-800">
              {COLOR_MAP[selectedColor]}
            </span>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-[12px] font-medium text-gray-500 block mb-2.5">
            Status
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setStatus("active")}
              className={`px-4 py-1.5 text-[13px] rounded-lg font-medium border transition cursor-pointer ${
                status === "active"
                  ? "bg-[#534AB7] border-[#534AB7] text-[#EEEDFE]"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatus("inactive")}
              className={`px-4 py-1.5 text-[13px] rounded-lg font-medium border transition cursor-pointer ${
                status === "inactive"
                  ? "bg-[#534AB7] border-[#534AB7] text-[#EEEDFE]"
                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="border-t border-gray-100 pt-5 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex items-center gap-1.5 px-5 py-2.5 text-[14px] font-medium rounded-lg 
  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#534AB7] hover:bg-[#4740a3]"} 
  text-[#EEEDFE] transition border-none`}
          >
            {loading ? "Creating..." : "Create leave type"}
          </button>
        </div>
      </div>
    </div>
  );
}
