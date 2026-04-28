"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2, Clock, AlertCircle, Upload, X, FileText,
  Download, User, Calendar, Tag, Activity, Paperclip, Circle,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────
const TASKS = [
  {
    id: 1,
    title: "Submit PAN Card",
    process: "Onboarding",
    assignedBy: "Rebecca Anderson (HR)",
    dueDate: "20 May 2024",
    priority: "High",
    status: "Pending",
    description: "Please upload a clear copy of your PAN card for verification purposes.",
    attachment: "PAN_Card.pdf",
    attachmentSize: "245 KB",
    attachmentDate: "18 May 2024",
    activity: [
      { time: "18 May 2024 10:30 AM", text: "Task created by Rebecca Anderson (HR)" },
      { time: "18 May 2024 10:45 AM", text: "Task assigned to You" },
    ],
  },
  {
    id: 2,
    title: "Complete Induction Training",
    process: "Onboarding",
    assignedBy: "Rebecca Anderson (HR)",
    dueDate: "25 May 2024",
    priority: "Medium",
    status: "In Progress",
    description: "Complete the mandatory induction training modules available on the LMS portal.",
    attachment: null,
    attachmentSize: null,
    attachmentDate: null,
    activity: [
      { time: "18 May 2024 11:00 AM", text: "Task created by Rebecca Anderson (HR)" },
      { time: "19 May 2024 09:15 AM", text: "Status updated to In Progress" },
    ],
  },
  {
    id: 3,
    title: "IT Equipment Acknowledgement",
    process: "Onboarding",
    assignedBy: "Rebecca Anderson (HR)",
    dueDate: "27 May 2024",
    priority: "Medium",
    status: "Pending",
    description: "Sign and return the IT equipment acknowledgement form after receiving your laptop and accessories.",
    attachment: null,
    attachmentSize: null,
    attachmentDate: null,
    activity: [
      { time: "18 May 2024 11:30 AM", text: "Task created by Rebecca Anderson (HR)" },
    ],
  },
  {
    id: 4,
    title: "Accept Company Policies",
    process: "Onboarding",
    assignedBy: "Rebecca Anderson (HR)",
    dueDate: "28 May 2024",
    priority: "Low",
    status: "Pending",
    description: "Review and digitally sign the employee handbook and company policy documents.",
    attachment: null,
    attachmentSize: null,
    attachmentDate: null,
    activity: [
      { time: "18 May 2024 12:00 PM", text: "Task created by Rebecca Anderson (HR)" },
    ],
  },
  {
    id: 5,
    title: "Submit Bank Details",
    process: "Onboarding",
    assignedBy: "Rebecca Anderson (HR)",
    dueDate: "30 May 2024",
    priority: "High",
    status: "Pending",
    description: "Submit your bank account details for salary disbursement setup.",
    attachment: null,
    attachmentSize: null,
    attachmentDate: null,
    activity: [
      { time: "18 May 2024 12:30 PM", text: "Task created by Rebecca Anderson (HR)" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  High:   { dot: "bg-red-500",     text: "text-red-600"    },
  Medium: { dot: "bg-amber-500",   text: "text-amber-600"  },
  Low:    { dot: "bg-emerald-500", text: "text-emerald-600"},
};

const STATUS_CONFIG = {
  Pending:      { bg: "bg-yellow-100 text-yellow-700 border border-yellow-200",   icon: Clock         },
  "In Progress":{ bg: "bg-blue-100 text-blue-700 border border-blue-200",         icon: Activity      },
  Completed:    { bg: "bg-emerald-100 text-emerald-700 border border-emerald-200",icon: CheckCircle2  },
  Overdue:      { bg: "bg-red-100 text-red-700 border border-red-200",            icon: AlertCircle   },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg}`}>
      <Icon size={11} />
      {status}
    </span>
  );
}

function PriorityDot({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG["Low"];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.text}`}>
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {priority}
    </span>
  );
}

// ─── Task Detail Panel ─────────────────────────────────────────
function TaskDetailPanel({ task, onClose, onUpload, onMarkComplete }) {
  const fileRef = useRef();

  if (!task) return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 py-20">
      <FileText size={40} strokeWidth={1} />
      <p className="text-sm">Select a task to view details</p>
    </div>
  );

  return (
    <motion.div
      key={task.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <h3 className="text-base font-semibold text-slate-800 leading-snug">{task.title}</h3>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={task.status} />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors lg:hidden"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Meta fields */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5">
        {[
          { label: "Process",     value: task.process,     icon: Tag      },
          { label: "Assigned By", value: task.assignedBy,  icon: User     },
          { label: "Due Date",    value: task.dueDate,     icon: Calendar },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="col-span-1">
            <p className="text-[11px] text-slate-400 mb-0.5 flex items-center gap-1 uppercase tracking-wide font-medium">
              <Icon size={10} /> {label}
            </p>
            <p className="text-slate-700 font-medium text-xs">{value}</p>
          </div>
        ))}
        <div>
          <p className="text-[11px] text-slate-400 mb-0.5 flex items-center gap-1 uppercase tracking-wide font-medium">
            <Circle size={10} /> Priority
          </p>
          <PriorityDot priority={task.priority} />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Description</p>
        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3 border border-slate-100">
          {task.description}
        </p>
      </div>

      {/* Attachment */}
      <div className="mb-4">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Paperclip size={11} /> Attachment (Proof)
        </p>
        {task.attachment ? (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <FileText size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">{task.attachment}</p>
                <p className="text-[11px] text-slate-400">{task.attachmentSize} · {task.attachmentDate}</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-blue-600 transition-colors">
              <Download size={14} />
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No attachment uploaded yet.</p>
        )}
      </div>

      {/* Activity */}
      <div className="mb-5 flex-1 overflow-y-auto">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Activity</p>
        <div className="relative pl-4">
          {task.activity.map((a, i) => (
            <div key={i} className="relative mb-3 last:mb-0">
              <span className="absolute -left-4 top-1.5 w-2 h-2 rounded-full bg-slate-300 border-2 border-white" />
              {i < task.activity.length - 1 && (
                <span className="absolute -left-[13px] top-3 w-px h-full bg-slate-200" />
              )}
              <p className="text-[11px] text-slate-400 mb-0.5">{a.time}</p>
              <p className="text-xs text-slate-600">{a.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-slate-100">
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) onUpload(task.id, e.target.files[0].name);
          }}
        />
        <button
          onClick={() => fileRef.current.click()}
          className="flex-1 flex items-center justify-center gap-1.5 border border-slate-300 text-slate-700 rounded-lg px-3 py-2 text-xs font-medium hover:bg-slate-50 transition-colors"
        >
          <Upload size={13} /> Upload Proof
        </button>
        <button
          onClick={() => onMarkComplete(task.id)}
          disabled={task.status === "Completed"}
          className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 text-xs font-medium transition-colors"
        >
          <CheckCircle2 size={13} /> Mark as Completed
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function EmployeeTaskView() {
  const [tasks, setTasks] = useState(TASKS);
  const [selectedId, setSelectedId] = useState(1);
  const [activeTab, setActiveTab] = useState("All Tasks");
  const [showDetail, setShowDetail] = useState(false);

  const tabs = ["All Tasks", "Pending", "Completed"];

  const filtered = tasks.filter((t) => {
    if (activeTab === "Pending") return t.status === "Pending";
    if (activeTab === "Completed") return t.status === "Completed";
    return true;
  });

  const selected = tasks.find((t) => t.id === selectedId);

  const handleUpload = (id, fileName) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              attachment: fileName,
              attachmentSize: "—",
              attachmentDate: "Just now",
              activity: [...t.activity, { time: "Just now", text: `Proof uploaded: ${fileName}` }],
            }
          : t
      )
    );
  };

  const handleMarkComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "Completed", activity: [...t.activity, { time: "Just now", text: "Task marked as completed" }] }
          : t
      )
    );
  };

  const handleSelect = (id) => {
    setSelectedId(id);
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1 h-6 rounded-full bg-indigo-500" />
          <h1 className="text-xl font-bold text-slate-800">My Tasks</h1>
          <span className="ml-1 text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-0.5 rounded-full">
            Employee View
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row min-h-[580px]">

            {/* ── Task List ── */}
            <div className={`flex-1 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col ${showDetail ? "hidden lg:flex" : "flex"}`}>
              {/* Tabs */}
              <div className="flex gap-0 border-b border-slate-100 px-5 pt-4">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* List Items */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                    <CheckCircle2 size={32} strokeWidth={1} />
                    <p className="text-sm">No tasks in this category</p>
                  </div>
                ) : (
                  filtered.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleSelect(task.id)}
                      className={`w-full text-left px-5 py-4 hover:bg-slate-50/80 transition-colors border-l-2 ${
                        selectedId === task.id
                          ? "bg-indigo-50/60 border-l-indigo-500"
                          : "border-l-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <p className={`text-sm font-semibold leading-snug ${selectedId === task.id ? "text-indigo-700" : "text-slate-700"}`}>
                          {task.title}
                        </p>
                        <StatusBadge status={task.status} />
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-slate-400">{task.process}</span>
                        <span className={`text-xs font-medium ${task.status === "Overdue" ? "text-red-500" : "text-slate-500"}`}>
                          {task.dueDate}
                        </span>
                        <PriorityDot priority={task.priority} />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* ── Detail Panel ── */}
            <div className={`w-full lg:w-[420px] xl:w-[460px] p-6 overflow-y-auto ${showDetail ? "block" : "hidden lg:block"}`}>
              {showDetail && (
                <button
                  onClick={() => setShowDetail(false)}
                  className="flex items-center gap-1 text-xs text-slate-500 mb-4 lg:hidden hover:text-slate-700 transition-colors"
                >
                  ← Back to list
                </button>
              )}
              <AnimatePresence mode="wait">
                <TaskDetailPanel
                  key={selected?.id}
                  task={selected}
                  onClose={() => setShowDetail(false)}
                  onUpload={handleUpload}
                  onMarkComplete={handleMarkComplete}
                />
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
