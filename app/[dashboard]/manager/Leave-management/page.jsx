"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import {
    ChevronRight, HomeIcon, Calendar, ChevronDown, Download, AlertTriangle,
    Check, XCircle, ChevronLeft, X, AlertCircle, Clock, Plus, Filter,
    Search, ShieldCheck, MapPin, MoreVertical, Trash2, Edit2, Settings2,
    CalendarDays, Briefcase, Users, LayoutGrid
} from "lucide-react";
import {
    getAllLeaveRequests,
    updateLeaveStatus,
    getLeaveTypes,
    createLeaveType,
    saveLeavePolicy
} from "@/services/leaveService";
import {
    getAllHolidays,
    createHoliday,
    deleteHoliday,
    updateHoliday
} from "@/services/holidayService";
import { useTenant } from "@/hooks/useTenant";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const TABS = [
    { id: "requests", label: "Requests", icon: Clock },
    { id: "policies", label: "Leave Policies", icon: ShieldCheck },
    { id: "holidays", label: "Holidays", icon: CalendarDays },
];

/* ─── Reusable Components ─── */

function StatusPill({ status }) {
    const styles = {
        "Approved": "bg-emerald-50 text-emerald-700 border-emerald-100",
        "Rejected": "bg-rose-50 text-rose-700 border-rose-100",
        "Pending": "bg-amber-50 text-amber-700 border-amber-100"
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${styles[status] || styles.Pending}`}>
            {status.toUpperCase()}
        </span>
    );
}

/* ─── Main Component ─── */

export default function SuperAdminLeaveHub() {
    const tenant = useTenant();
    const [activeTab, setActiveTab] = useState("requests");
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, totalTypes: 0 });
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ totalPages: 1, totalElements: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'type' or 'holiday' or 'reject'
    const [selectedItem, setSelectedItem] = useState(null);

    const router = useRouter();
    const perPage = 10;

    // Fetch Requests
    const fetchRequests = useCallback(async () => {
        if (!tenant) return;
        try {
            const res = await getAllLeaveRequests(tenant, page - 1, perPage);
            const rawData = res.data?.data || [];
            const formatted = rawData.map(lr => {
                const start = new Date(lr.startDate);
                const end = new Date(lr.endDate);
                return {
                    id: lr.id,
                    name: lr.employeeName,
                    role: lr.employeeDesignation || "Employee",
                    leaveType: lr.leaveType,
                    startDate: lr.startDate,
                    endDate: lr.endDate,
                    dateRange: `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
                    days: Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1,
                    appliedOn: new Date(lr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    status: lr.status?.charAt(0).toUpperCase() + lr.status?.slice(1).toLowerCase() || "Pending",
                    reason: lr.reason,
                    avatar: lr.employeeName?.charAt(0) || "U",
                };
            });

            setRequests(formatted);
            if (res.data?.stats) setStats(prev => ({ ...prev, ...res.data.stats }));
            if (res.data?.pagination) setPagination(res.data.pagination);
        } catch (error) {
            toast.error("Failed to fetch requests");
        }
    }, [tenant, page]);

    // Fetch Leave Types
    const fetchLeaveTypes = useCallback(async () => {
        if (!tenant) return;
        try {
            const res = await getLeaveTypes(tenant);
            setLeaveTypes(res.data || []);
            setStats(prev => ({ ...prev, totalTypes: res.data?.length || 0 }));
        } catch (error) {
            toast.error("Failed to fetch leave types");
        }
    }, [tenant]);

    // Fetch Holidays
    const fetchHolidays = useCallback(async () => {
        if (!tenant) return;
        try {
            const res = await getAllHolidays(tenant);
            setHolidays(res.data || []);
        } catch (error) {
            toast.error("Failed to fetch holidays");
        }
    }, [tenant]);

    useEffect(() => {
        if (!tenant) return;
        setLoading(true);
        Promise.all([fetchRequests(), fetchLeaveTypes(), fetchHolidays()])
            .finally(() => setLoading(false));
    }, [tenant, fetchRequests, fetchLeaveTypes, fetchHolidays]);

    const handleStatusUpdate = async (id, status, reason = "") => {
        try {
            await updateLeaveStatus(tenant, id, status, reason);
            toast.success(`Request ${status.toLowerCase()} successfully`);
            fetchRequests();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(`Failed to ${status.toLowerCase()} request`);
        }
    };

    const handleCreateType = async (data) => {
        try {
            await createLeaveType(tenant, data);
            toast.success("Leave type created");
            fetchLeaveTypes();
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Failed to create leave type");
        }
    };

    const handleCreateHoliday = async (data) => {
        try {
            await createHoliday(data, tenant);
            toast.success("Holiday added");
            fetchHolidays();
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Failed to add holiday");
        }
    };

    const handleDeleteHoliday = async (id) => {
        if (!confirm("Delete this holiday?")) return;
        try {
            await deleteHoliday(id, tenant);
            toast.success("Holiday deleted");
            fetchHolidays();
        } catch (error) {
            toast.error("Failed to delete holiday");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">

            {/* ── Header ── */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <ShieldCheck className="text-[#4A45B6]" size={32} />
                            Leave Management Hub
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">Global leave controls, policies, and holiday scheduling</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { router.push(`/${tenant}/manager/operations/leaveManagement`) }}
                            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <Plus size={16} /> Add Type
                        </button>
                        <button
                            onClick={() => { setModalType('holiday'); setIsModalOpen(true); }}
                            className="px-4 py-2 bg-[#4A45B6] text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#3b37a3] transition-all shadow-lg shadow-indigo-200"
                        >
                            <CalendarDays size={16} /> New Holiday
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Pending Approvals", value: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Approved Today", value: stats.approved, icon: Check, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Total Leave Types", value: stats.totalTypes, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Active Holidays", value: holidays.length, icon: CalendarDays, color: "text-rose-600", bg: "bg-rose-50" },
                ].map((s, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={s.label}
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                                <s.icon size={24} />
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Global</span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-3xl font-black text-slate-900">{s.value}</h3>
                            <p className="text-sm font-semibold text-slate-500 mt-1">{s.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── Tabs ── */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm w-fit">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                ? "bg-[#4A45B6] text-white shadow-md shadow-indigo-100"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tab Content ── */}
            <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                <AnimatePresence mode="wait">
                    {activeTab === "requests" && (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800">Pending Requests</h2>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search employee..."
                                            className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#4A45B6] w-64"
                                        />
                                    </div>
                                    <button className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100"><Filter size={18} /></button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left border-b border-slate-50">
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest px-4">Employee</th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest px-4">Type</th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest px-4">Duration</th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest px-4 text-center">Days</th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest px-4">Status</th>
                                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {requests.length === 0 ? (
                                            <tr><td colSpan={6} className="py-20 text-center text-slate-400 font-medium">No pending requests found</td></tr>
                                        ) : (
                                            requests.map(req => (
                                                <tr key={req.id} className="group hover:bg-slate-50/50 transition-all">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[#4A45B6] font-bold text-sm">
                                                                {req.avatar}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-800 text-sm">{req.name}</p>
                                                                <p className="text-slate-400 text-xs font-medium">{req.role}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">{req.leaveType}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <p className="text-sm font-semibold text-slate-600">{req.dateRange}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Applied {req.appliedOn}</p>
                                                    </td>
                                                    <td className="py-4 px-4 text-center font-black text-slate-700 text-sm">{req.days}</td>
                                                    <td className="py-4 px-4"><StatusPill status={req.status} /></td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                            {req.status === "Pending" && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleStatusUpdate(req.id, "APPROVED")}
                                                                        className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                                    >
                                                                        <Check size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => { setSelectedItem(req); setModalType('reject'); setIsModalOpen(true); }}
                                                                        className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                                    >
                                                                        <X size={16} />
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-200 transition-all">
                                                                <MoreVertical size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "policies" && (
                        <motion.div
                            key="policies"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-6"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Leave Policies</h2>
                                    <p className="text-sm text-slate-400 font-medium">Configure leave entitlements and quotas per category</p>
                                </div>
                                <button
                                    onClick={() => { setModalType('type'); setIsModalOpen(true); }}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all"
                                >
                                    <Plus size={16} /> Define New Type
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {leaveTypes.map((type, idx) => (
                                    <div key={type.id || idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 text-slate-400 hover:text-slate-600"><Edit2 size={14} /></button>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 font-black text-xl">
                                                {type.code || type.name?.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{type.name}</h4>
                                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Active Policy</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Annual Quota</span>
                                                <span className="text-sm font-black text-slate-800">{type.daysPerYear || 12} Days</span>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                                                <span className="text-xs font-bold text-slate-400 uppercase">Carry Forward</span>
                                                <span className="text-sm font-black text-slate-800">{type.canCarryForward ? "Enabled" : "Disabled"}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "holidays" && (
                        <motion.div
                            key="holidays"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-6"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Public Holidays</h2>
                                    <p className="text-sm text-slate-400 font-medium">Manage the company-wide holiday calendar</p>
                                </div>
                                <button
                                    onClick={() => { setModalType('holiday'); setIsModalOpen(true); }}
                                    className="px-4 py-2 bg-[#4A45B6] text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#3b37a3] transition-all"
                                >
                                    <Plus size={16} /> Add Holiday
                                </button>
                            </div>

                            <div className="space-y-3">
                                {holidays.length === 0 ? (
                                    <div className="py-20 text-center text-slate-400 font-medium bg-slate-50 rounded-3xl">No holidays scheduled for this year</div>
                                ) : (
                                    holidays.map(h => (
                                        <div key={h.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex flex-col items-center justify-center text-rose-600">
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{new Date(h.date).toLocaleString('default', { month: 'short' })}</span>
                                                    <span className="text-lg font-black leading-none">{new Date(h.date).getDate()}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800">{h.name}</h4>
                                                    <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                        <Calendar size={10} /> {new Date(h.date).toLocaleDateString(undefined, { weekday: 'long' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={() => handleDeleteHoliday(h.id)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}
        </AnimatePresence>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {modalType === 'type' && <CreateTypeModal onCancel={() => setIsModalOpen(false)} onSave={handleCreateType} />}
              {modalType === 'holiday' && <CreateHolidayModal onCancel={() => setIsModalOpen(false)} onSave={handleCreateHoliday} />}
              {modalType === 'reject' && (
                <RejectModal 
                  request={selectedItem} 
                  onCancel={() => setIsModalOpen(false)} 
                  onConfirm={(id, reason) => handleStatusUpdate(id, "REJECTED", reason)}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

    );
}

/* ─── Sub-Modals ─── */

function CreateTypeModal({ onCancel, onSave }) {
    const [formData, setFormData] = useState({ name: "", code: "", daysPerYear: 12 });
    return (
        <div className="p-8">
            <h3 className="text-xl font-black text-slate-900 mb-2">Define Leave Type</h3>
            <p className="text-sm text-slate-400 mb-6">Create a new leave category for the organization</p>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Type Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Sick Leave"
                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 font-bold"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Short Code</label>
                        <input
                            type="text"
                            placeholder="e.g. SL"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 font-bold uppercase"
                            maxLength={3}
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Annual Days</label>
                        <input
                            type="number"
                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 font-bold"
                            value={formData.daysPerYear}
                            onChange={(e) => setFormData({ ...formData, daysPerYear: parseInt(e.target.value) })}
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3 mt-8">
                <button onClick={onCancel} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Discard</button>
                <button onClick={() => onSave(formData)} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">Save Policy</button>
            </div>
        </div>
    );
}

function CreateHolidayModal({ onCancel, onSave }) {
    const [formData, setFormData] = useState({ name: "", date: "" });
    return (
        <div className="p-8">
            <h3 className="text-xl font-black text-slate-900 mb-2">New Public Holiday</h3>
            <p className="text-sm text-slate-400 mb-6">Add a holiday to the company-wide calendar</p>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Event Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Independence Day"
                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 font-bold"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Select Date</label>
                    <input
                        type="date"
                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 font-bold"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </div>
            </div>
            <div className="flex items-center gap-3 mt-8">
                <button onClick={onCancel} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={() => onSave(formData)} className="flex-1 py-3 bg-[#4A45B6] text-white rounded-xl font-bold text-sm hover:bg-[#3b37a3] transition-all shadow-lg shadow-indigo-100">Schedule Holiday</button>
            </div>
        </div>
    );
}

function RejectModal({ request, onCancel, onConfirm }) {
    const [reason, setReason] = useState("");
    return (
        <div className="p-8">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mb-6">
                <XCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Reject Request?</h3>
            <p className="text-sm text-slate-500 mb-6">
                You are rejecting leave for <span className="font-bold text-slate-900">{request.name}</span>. Please provide a reason below.
            </p>
            <textarea
                placeholder="Type your reason here..."
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-rose-500 min-h-[120px] font-medium"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex items-center gap-3 mt-8">
                <button onClick={onCancel} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={() => onConfirm(request.id, reason)} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-100">Confirm Rejection</button>
            </div>
        </div>
    );
}
