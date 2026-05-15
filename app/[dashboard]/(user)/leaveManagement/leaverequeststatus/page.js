"use client";

import {
  Eye, Filter, Hourglass, CircleX, BadgeCheck,
  ChevronDown, X, Plus, ChevronRight, ChevronLeft,
  Search, Calendar, Download, History, ArrowRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/header";
import { useTenant } from "@/hooks/useTenant";
import { getMyLeaveRequests } from "@/services/user/leaveService";

// ─── Constants & Styles ───────────────────────────────────────────────────

const STATUS_CONFIG = {
  approved: {
    icon: BadgeCheck,
    iconColor: "text-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    label: "Approved",
  },
  pending: {
    icon: Hourglass,
    iconColor: "text-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    label: "Pending",
  },
  rejected: {
    icon: CircleX,
    iconColor: "text-red-500",
    badge: "bg-red-50 text-red-700 border-red-100",
    label: "Rejected",
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${cfg.badge}`}>
      <Icon size={12} className={cfg.iconColor} />
      {cfg.label}
    </span>
  );
}

const inputCls =
  "bg-white border border-gray-200 rounded-xl px-4 py-2 text-[12px] font-medium text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all shadow-sm";

// ─── Main Component ───────────────────────────────────────────────────────────

export default function LeaveRequestStatus() {
  const router = useRouter();
  const tenantId = useTenant();

  const [data, setData] = useState([]);
  const [token, setToken] = useState("");
  const [requestType, setRequestType] = useState("All Requests");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalPages: 1, totalElements: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") setToken(localStorage.getItem("token") || "");
  }, []);

  useEffect(() => {
    if (!tenantId || !token) return;
    fetchRequests();
  }, [tenantId, token, pagination.page]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getMyLeaveRequests(tenantId, token, pagination.page, pagination.size);
      
      const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

      const list = (response || []).map((item) => ({
        id: item.id,
        status: item.status?.toLowerCase() || "pending",
        employee: item.employeeName,
        leaveType: item.leaveType || "Leave",
        period: `${fmtDate(item.startDate)} – ${fmtDate(item.endDate)}`,
        taken: item.dayType || "1 Day(s)",
        requestDate: fmtDate(item.startDate),
      }));

      setData(list);
      if (response.pagination) setPagination(prev => ({ ...prev, ...response.pagination }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter((r) =>
    requestType === "All Requests" || r.status === requestType.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <Header />

      <main className="max-w-[1400px] mx-auto p-4 lg:p-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Employee Portal</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Request <span className="text-indigo-600">History</span></h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Review and manage your past leave applications.</p>
          </motion.div>

          <div className="flex items-center gap-3">
            <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm">
              <Download size={20} />
            </button>
            <button 
              onClick={() => router.push(`/${tenantId}/leaveManagement`)}
              className="flex items-center gap-2.5 bg-indigo-600 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              <Plus size={16} />
              New Request
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
          
          {/* Toolbar */}
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-[12px] font-bold text-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 cursor-pointer shadow-sm transition-all"
                >
                  <option>All Requests</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[12px] font-bold text-gray-500 hover:bg-gray-50 transition-all shadow-sm"
              >
                <Filter size={14} />
                Filters
              </button>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search requests..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[12px] font-medium text-gray-700 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all w-full sm:w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 text-left border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leave Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Period</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Duration</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requested On</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  [1,2,3,4,5].map(i => (
                    <tr key={i}>
                      <td colSpan={6} className="px-6 py-6"><div className="h-4 bg-gray-50 animate-pulse rounded w-full" /></td>
                    </tr>
                  ))
                ) : filtered.length > 0 ? (
                  filtered.map((item) => (
                    <tr key={item.id} className="group hover:bg-indigo-50/20 transition-colors">
                      <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-indigo-500">
                            <Calendar size={14} />
                          </div>
                          <span className="text-[13px] font-bold text-gray-700">{item.leaveType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[12px] font-medium text-gray-500">{item.period}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-gray-100 rounded-lg text-[11px] font-bold text-gray-600">{item.taken}</span>
                      </td>
                      <td className="px-6 py-4 text-[12px] font-medium text-gray-400">{item.requestDate}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => router.push(`/${tenantId}/leaveManagement/leaverequeststatus/${item.id}`)}
                          className="p-2 bg-white border border-gray-100 rounded-lg text-indigo-600 opacity-0 group-hover:opacity-100 hover:bg-indigo-50 transition-all shadow-sm"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic text-sm">No leave records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/20 flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
              Showing <span className="text-gray-900">{filtered.length}</span> results
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page === 0}
                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition-all bg-white shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="px-4 h-9 flex items-center bg-indigo-600 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-md shadow-indigo-100">
                Page {pagination.page + 1}
              </div>
              <button
                disabled={pagination.page + 1 >= pagination.totalPages}
                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-indigo-600 disabled:opacity-30 transition-all bg-white shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <History size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Quick Summary</h3>
            </div>
            <p className="text-[12px] font-medium text-gray-500 leading-relaxed mb-4">
              You have taken 4 total days off this year. 
              Your current attendance consistency is 92%.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-lg">4 Paid Leave</span>
              <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase rounded-lg">0 Unpaid Leave</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-[24px] p-6 text-white shadow-xl shadow-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <History size={22} className="text-indigo-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest">History Insights</h3>
            </div>
            <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-6">
              Only requests for the current financial year are shown. 
              Archive records can be requested from HR.
            </p>
            <button className="w-full py-3 bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all">
              Request Archive Data
            </button>
          </div>
        </div>
      </main>

      {/* Filter Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[28px] shadow-2xl p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <Filter size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">Filters</h2>
                    <p className="text-xs text-gray-500 font-medium">Refine your request history.</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-all"><X size={20} /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Time Period</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="date" className={inputCls} placeholder="From" />
                    <input type="date" className={inputCls} placeholder="To" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Request Status</label>
                  <select className={`${inputCls} w-full py-3 appearance-none`}>
                    <option>All Statuses</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Apply Filters</button>
                <button onClick={() => setShowModal(false)} className="px-6 py-3 border border-gray-200 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all">Reset</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}