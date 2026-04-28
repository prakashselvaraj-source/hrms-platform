"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2, Clock, AlertCircle, Activity, ChevronDown,
  MoreHorizontal, Plus, Search, Filter, X, FileText,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────
const ADMIN_TASKS = [
  {
    id: 1,
    title: "Submit PAN Card",
    process: "Onboarding",
    assignedTo: "John Mathew",
    assignedBy: "Rebecca Anderson",
    dueDate: "20 May 2024",
    dueDateRaw: "2024-05-20",
    priority: "High",
    status: "Pending",
    proof: "PAN_Card.pdf",
  },
  {
    id: 2,
    title: "Complete Induction Training",
    process: "Onboarding",
    assignedTo: "John Mathew",
    assignedBy: "Rebecca Anderson",
    dueDate: "25 May 2024",
    dueDateRaw: "2024-05-25",
    priority: "Medium",
    status: "In Progress",
    proof: null,
  },
  {
    id: 3,
    title: "IT Equipment Acknowledgement",
    process: "Onboarding",
    assignedTo: "John Mathew",
    assignedBy: "Rebecca Anderson",
    dueDate: "27 May 2024",
    dueDateRaw: "2024-05-27",
    priority: "Medium",
    status: "Pending",
    proof: null,
  },
  {
    id: 4,
    title: "Accept Company Policies",
    process: "Onboarding",
    assignedTo: "John Mathew",
    assignedBy: "Rebecca Anderson",
    dueDate: "28 May 2024",
    dueDateRaw: "2024-05-28",
    priority: "Low",
    status: "Pending",
    proof: null,
  },
  {
    id: 5,
    title: "Submit Bank Details",
    process: "Onboarding",
    assignedTo: "John Mathew",
    assignedBy: "Rebecca Anderson",
    dueDate: "30 May 2024",
    dueDateRaw: "2024-05-30",
    priority: "High",
    status: "Pending",
    proof: null,
  },
  {
    id: 6,
    title: "Exit Interview Form",
    process: "Exit Process",
    assignedTo: "David Warner",
    assignedBy: "Rebecca Anderson",
    dueDate: "10 May 2024",
    dueDateRaw: "2024-05-10",
    priority: "High",
    status: "Overdue",
    proof: null,
  },
  {
    id: 7,
    title: "Relieving Document Handover",
    process: "Exit Process",
    assignedTo: "David Warner",
    assignedBy: "Rebecca Anderson",
    dueDate: "12 May 2024",
    dueDateRaw: "2024-05-12",
    priority: "Medium",
    status: "Pending",
    proof: null,
  },
  {
    id: 8,
    title: "Background Verification",
    process: "Onboarding",
    assignedTo: "Priya Sharma",
    assignedBy: "Rebecca Anderson",
    dueDate: "22 May 2024",
    dueDateRaw: "2024-05-22",
    priority: "High",
    status: "Completed",
    proof: "BGV_Report.pdf",
  },
  {
    id: 9,
    title: "NDA Signing",
    process: "Onboarding",
    assignedTo: "Priya Sharma",
    assignedBy: "Rebecca Anderson",
    dueDate: "23 May 2024",
    dueDateRaw: "2024-05-23",
    priority: "Medium",
    status: "Completed",
    proof: "NDA_Signed.pdf",
  },
];

// ─── Helpers ──────────────────────────────────────────────────
const PRIORITY_CONFIG = {
  High:   { dot: "bg-red-500",     text: "text-red-600"     },
  Medium: { dot: "bg-amber-500",   text: "text-amber-600"   },
  Low:    { dot: "bg-emerald-500", text: "text-emerald-600" },
};

const STATUS_CONFIG = {
  Pending:       { bg: "bg-yellow-100 text-yellow-700 border border-yellow-200",   icon: Clock        },
  "In Progress": { bg: "bg-blue-100 text-blue-700 border border-blue-200",         icon: Activity     },
  Completed:     { bg: "bg-emerald-100 text-emerald-700 border border-emerald-200",icon: CheckCircle2 },
  Overdue:       { bg: "bg-red-100 text-red-700 border border-red-200",            icon: AlertCircle  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${cfg.bg}`}>
      <Icon size={11} />
      {status}
    </span>
  );
}

function PriorityDot({ priority }) {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG["Low"];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.text}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
      {priority}
    </span>
  );
}

function Avatar({ name, color = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-100 text-indigo-700",
    violet: "bg-violet-100 text-violet-700",
    rose:   "bg-rose-100 text-rose-700",
  };
  return (
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${colors[color]}`}>
      {name?.charAt(0)}
    </div>
  );
}

function SelectDropdown({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-slate-200 rounded-lg pl-3 pr-7 py-1.5 text-xs text-slate-700 font-medium cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ─── Row Actions Menu ──────────────────────────────────────────
function ActionsMenu({ taskId, openMenu, setOpenMenu, onAction }) {
  const isOpen = openMenu === taskId;
  return (
    <div className="relative">
      <button
        onClick={() => setOpenMenu(isOpen ? null : taskId)}
        className="p-1.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
      >
        <MoreHorizontal size={15} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-36"
          >
            {["View", "Edit", "Reassign", "Delete"].map((action) => (
              <button
                key={action}
                onClick={() => { onAction(action, taskId); setOpenMenu(null); }}
                className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                  action === "Delete"
                    ? "text-red-500 hover:bg-red-50"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {action}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Create Task Modal ─────────────────────────────────────────
function CreateTaskModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "", process: "Onboarding", assignedTo: "", dueDate: "", priority: "Medium", description: "",
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.assignedTo.trim()) return;
    onAdd(form);
    onClose();
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div key={key}>
      <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-800 text-base">Create New Task</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {field("Task Title *", "title", "text", "e.g. Submit Offer Letter")}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Process</label>
            <select
              value={form.process}
              onChange={(e) => setForm((p) => ({ ...p, process: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option>Onboarding</option>
              <option>Exit Process</option>
              <option>Compliance</option>
              <option>Payroll</option>
            </select>
          </div>

          {field("Assign To *", "assignedTo", "text", "Employee name")}
          {field("Due Date", "dueDate", "date")}

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Task description..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 border border-slate-200 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 text-sm font-semibold transition-colors"
          >
            Create Task
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────
function StatCard({ label, count, color }) {
  const colors = {
    yellow:  "bg-yellow-50  border-yellow-200  text-yellow-700",
    blue:    "bg-blue-50    border-blue-200    text-blue-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    red:     "bg-red-50     border-red-200     text-red-700",
  };
  return (
    <div className={`rounded-xl border px-4 py-3 flex flex-col gap-0.5 ${colors[color]}`}>
      <p className="text-2xl font-bold">{count}</p>
      <p className="text-xs font-medium opacity-80">{label}</p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function AdminTaskView() {
  const [tasks, setTasks] = useState(ADMIN_TASKS);
  const [processFilter, setProcessFilter] = useState("All Process");
  const [userFilter, setUserFilter]       = useState("All Users");
  const [statusFilter, setStatusFilter]   = useState("All Status");
  const [openMenu, setOpenMenu]           = useState(null);
  const [showCreate, setShowCreate]       = useState(false);
  const [search, setSearch]               = useState("");

  const processes = ["All Process", ...new Set(ADMIN_TASKS.map((t) => t.process))];
  const users     = ["All Users",   ...new Set(ADMIN_TASKS.map((t) => t.assignedTo))];
  const statuses  = ["All Status",  "Pending", "In Progress", "Completed", "Overdue"];

  const filtered = tasks.filter((t) => {
    const byProcess = processFilter === "All Process" || t.process === processFilter;
    const byUser    = userFilter    === "All Users"   || t.assignedTo === userFilter;
    const byStatus  = statusFilter  === "All Status"  || t.status === statusFilter;
    const bySearch  = !search || t.title.toLowerCase().includes(search.toLowerCase()) ||
                      t.assignedTo.toLowerCase().includes(search.toLowerCase());
    return byProcess && byUser && byStatus && bySearch;
  });

  const handleAddTask = (form) => {
    const formatted = form.dueDate
      ? new Date(form.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : "TBD";
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: form.title,
        process: form.process,
        assignedTo: form.assignedTo,
        assignedBy: "Rebecca Anderson",
        dueDate: formatted,
        priority: form.priority,
        status: "Pending",
        proof: null,
      },
    ]);
  };

  const handleAction = (action, taskId) => {
    if (action === "Delete") {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const stats = {
    Pending:       tasks.filter((t) => t.status === "Pending").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Completed:     tasks.filter((t) => t.status === "Completed").length,
    Overdue:       tasks.filter((t) => t.status === "Overdue").length,
  };

  const COLUMNS = [
    "Task Title", "Process", "Assigned To", "Assigned By",
    "Due Date", "Priority", "Status", "Proof", "Actions",
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-violet-500" />
            <h1 className="text-xl font-bold text-slate-800">Tasks</h1>
            <span className="ml-1 text-xs bg-violet-100 text-violet-700 font-semibold px-2.5 py-0.5 rounded-full">
              Admin (HR) View
            </span>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors shadow-sm shadow-indigo-200"
          >
            <Plus size={15} /> Create Task
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Pending"     count={stats["Pending"]}     color="yellow"  />
          <StatCard label="In Progress" count={stats["In Progress"]} color="blue"    />
          <StatCard label="Completed"   count={stats["Completed"]}   color="emerald" />
          <StatCard label="Overdue"     count={stats["Overdue"]}     color="red"     />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks or employees…"
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <SelectDropdown value={processFilter} onChange={setProcessFilter} options={processes} />
              <SelectDropdown value={userFilter}    onChange={setUserFilter}    options={users}     />
              <SelectDropdown value={statusFilter}  onChange={setStatusFilter}  options={statuses}  />
              <button className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors font-medium">
                <Filter size={12} /> More Filters
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {COLUMNS.map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-slate-500 font-semibold text-[11px] uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/70 transition-colors"
                    onClick={() => setOpenMenu(null)}
                  >
                    {/* Task Title */}
                    <td className="px-4 py-3.5 font-semibold text-slate-700 max-w-[180px]">
                      <p className="truncate">{task.title}</p>
                    </td>

                    {/* Process */}
                    <td className="px-4 py-3.5">
                      <span className="bg-slate-100 text-slate-600 rounded-md px-2 py-0.5 font-medium">
                        {task.process}
                      </span>
                    </td>

                    {/* Assigned To */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Avatar name={task.assignedTo} color="indigo" />
                        <span className="text-slate-600 whitespace-nowrap">{task.assignedTo}</span>
                      </div>
                    </td>

                    {/* Assigned By */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Avatar name={task.assignedBy} color="violet" />
                        <span className="text-slate-500 whitespace-nowrap truncate max-w-[120px]">{task.assignedBy}</span>
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`font-medium ${task.status === "Overdue" ? "text-red-500" : "text-slate-500"}`}>
                        {task.dueDate}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3.5">
                      <PriorityDot priority={task.priority} />
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={task.status} />
                    </td>

                    {/* Proof */}
                    <td className="px-4 py-3.5">
                      {task.proof ? (
                        <div className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors">
                          <FileText size={12} />
                          <span className="underline underline-offset-2">{task.proof}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <ActionsMenu
                        taskId={task.id}
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                        onAction={handleAction}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                <Search size={32} strokeWidth={1} />
                <p className="text-sm">No tasks match your filters</p>
                <button
                  onClick={() => { setProcessFilter("All Process"); setUserFilter("All Users"); setStatusFilter("All Status"); setSearch(""); }}
                  className="text-xs text-indigo-600 hover:underline mt-1"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Showing {filtered.length} of {tasks.length} tasks</span>
              <span className="font-medium text-slate-500">{tasks.length} total</span>
            </div>
          )}
        </div>

      </div>

      {/* Create Task Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateTaskModal onClose={() => setShowCreate(false)} onAdd={handleAddTask} />
        )}
      </AnimatePresence>
    </div>
  );
}
