"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Download, Send, MoreHorizontal, SlidersHorizontal, X, 
  MoreVertical, Loader2, Search, Filter, Mail, FileText, 
  CheckCircle, AlertCircle, Calendar, Users, Wallet, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/hooks/useTenant";
import { 
  getAdminPayrollOverview, 
  getAllPayslips, 
  runPayrollCycle, 
  downloadPayslip 
} from "@/services/payrollService";

export default function PayslipManagement() {
  const tenantId = useTenant();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [emailChecked, setEmailChecked] = useState(true);
  const [zipChecked, setZipChecked] = useState(false);

  // Fetch Stats & Payslips
  const fetchData = useCallback(async () => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const [statsRes, payslipsRes] = await Promise.all([
        getAdminPayrollOverview(tenantId),
        getAllPayslips(tenantId, { page, size: 10 })
      ]);
      
      setStats(statsRes.data);
      setPayslips(payslipsRes.data.content || []);
      setTotalPages(payslipsRes.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch payroll data:", error);
    } finally {
      setLoading(false);
    }
  }, [tenantId, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Generate Cycle
  const handleGenerate = async () => {
    setProcessing(true);
    try {
      await runPayrollCycle(tenantId);
      await fetchData();
      setModalOpen(false);
    } catch (error) {
      alert("Failed to generate payslips. Please ensure salary structures are configured.");
    } finally {
      setProcessing(false);
    }
  };

  // Handle Individual Download
  const handleDownload = async (payslipId, employeeName) => {
    try {
      const res = await downloadPayslip(tenantId, payslipId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Payslip_${employeeName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const statusStyle = {
    PROCESSED: "bg-indigo-50 text-indigo-600 border-indigo-100",
    PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
    SENT: "bg-blue-50 text-blue-600 border-blue-100",
    DRAFT: "bg-slate-50 text-slate-500 border-slate-100",
    VOID: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const statCards = stats ? [
    {
      label: "TOTAL EMPLOYEES",
      value: stats.totalEmployees || 0,
      sub: stats.currentMonth,
      icon: <Users className="w-4 h-4" />,
      color: "border-indigo-500"
    },
    {
      label: "PROCESSED",
      value: stats.employeesProcessed || 0,
      badge: `${Math.round((stats.employeesProcessed / stats.totalEmployees) * 100) || 0}%`,
      sub: "Generated Payslips",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "border-emerald-500"
    },
    {
      label: "PAYROLL COST",
      value: `₹${(stats.totalPayrollCost || 0).toLocaleString()}`,
      sub: "Total Disbursement",
      icon: <Wallet className="w-4 h-4" />,
      color: "border-amber-500"
    },
    {
      label: "LOP CASES",
      value: stats.lopCases || 0,
      sub: "Loss of Pay detected",
      icon: <AlertCircle className="w-4 h-4" />,
      color: "border-rose-500"
    }
  ] : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              Payslip Archive 
              <span className="text-xs font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">
                {stats?.currentMonth || "April 2025"}
              </span>
            </h1>
            <p className="text-sm text-slate-500 font-medium tracking-tight">Manage, review and distribute employee payslips for the current cycle.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <Download size={14} />
              Export Report
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white bg-slate-900 rounded-2xl hover:bg-black transition-all shadow-lg shadow-slate-200"
            >
              <Send size={14} />
              Generate Cycle
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-[2rem] border border-slate-100 animate-pulse" />
            ))
          ) : (
            statCards.map((card) => (
              <div key={card.label} className={`bg-white rounded-[2rem] shadow-sm border-l-4 ${card.color} p-6 flex flex-col justify-between hover:shadow-md transition-all`}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 tracking-[0.15em] uppercase">{card.label}</p>
                  <div className="p-2 bg-slate-50 rounded-xl text-slate-400">{card.icon}</div>
                </div>
                <div className="mt-4">
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-black text-slate-900">{card.value}</p>
                    {card.badge && (
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{card.badge}</span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{card.sub}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 border-b border-slate-50 gap-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Disbursement Ledger</h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search Employee..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <button className="p-2.5 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/30">
                  {["EMPLOYEE", "NET PAYOUT", "STATUS", "DATE", "ACTION"].map((col) => (
                    <th key={col} className="text-left text-[10px] font-black text-slate-400 tracking-[0.2em] px-8 py-5">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                   Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan="5" className="px-8 py-4"><div className="h-8 bg-slate-50 rounded-xl animate-pulse" /></td>
                    </tr>
                   ))
                ) : (
                  payslips.filter(p => p.employeeName.toLowerCase().includes(search.toLowerCase())).map((ps) => (
                    <tr key={ps.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center text-indigo-500 font-black text-xs">
                            {ps.employeeName?.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 leading-tight">{ps.employeeName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{ps.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-black text-slate-900">₹{ps.amount?.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{ps.period}</p>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${statusStyle[ps.status] || statusStyle.DRAFT}`}>
                          {ps.status}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar size={14} className="text-slate-300" />
                          <span className="text-xs font-bold">{ps.date || "Scheduled"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleDownload(ps.id, ps.employeeName)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="Download PDF"
                          >
                            <Download size={16} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all" title="Email Employee">
                            <Mail size={16} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {!loading && payslips.length === 0 && (
                   <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center">
                        <FileText size={48} className="text-slate-100 mb-4" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No payslips generated yet</p>
                        <button onClick={() => setModalOpen(true)} className="mt-4 text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest">Run Initial Cycle</button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-slate-50/20 gap-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
              Showing {payslips.length} of {stats?.totalEmployees || 0} entries
            </p>
            <div className="flex items-center gap-2">
              <button 
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${page === i ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-50"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={page === totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
               onClick={() => !processing && setModalOpen(false)}
             />
             <motion.div
                className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
             >
                {/* Modal Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                  <h2 className="text-base font-black text-slate-900 uppercase tracking-widest">Execute Payroll Cycle</h2>
                  <button onClick={() => !processing && setModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition">
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 space-y-8">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-[1.5rem] p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Cycle</p>
                      <p className="text-sm font-black text-indigo-900 mt-1">{stats?.currentMonth || "April 2025"}</p>
                      <p className="text-[11px] font-medium text-indigo-600 mt-1">
                        System will process {stats?.totalEmployees || 0} employee records based on their configured salary structures.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Disbursement Options</p>
                    <label className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                       <input 
                         type="checkbox" 
                         checked={emailChecked} 
                         onChange={() => setEmailChecked(!emailChecked)} 
                         className="w-5 h-5 accent-indigo-600 rounded-lg"
                       />
                       <div>
                         <p className="text-xs font-black text-slate-700">Email Employee Copies</p>
                         <p className="text-[10px] font-medium text-slate-400 mt-0.5">Automatically send encrypted PDF payslips via email.</p>
                       </div>
                    </label>
                    <label className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                       <input 
                         type="checkbox" 
                         checked={zipChecked} 
                         onChange={() => setZipChecked(!zipChecked)} 
                         className="w-5 h-5 accent-indigo-600 rounded-lg"
                       />
                       <div>
                         <p className="text-xs font-black text-slate-700">Download Batch ZIP</p>
                         <p className="text-[10px] font-medium text-slate-400 mt-0.5">Generate a single compressed archive of all PDFs.</p>
                       </div>
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 bg-slate-50/50 flex items-center justify-end gap-3">
                  <button
                    disabled={processing}
                    onClick={() => setModalOpen(false)}
                    className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleGenerate}
                    disabled={processing}
                    className="flex items-center gap-2 px-8 py-2.5 text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                  >
                    {processing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                    {processing ? "Processing..." : "Run Cycle"}
                  </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}