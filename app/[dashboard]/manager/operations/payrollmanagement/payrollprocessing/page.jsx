"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import {
  RefreshCw, Calculator, Lock, FileText,
  Eye, SlidersHorizontal, Download, Play,
  ChevronRight, Zap, X, Send, Loader2,
  AlertCircle, CheckCircle2, Search,
  ArrowLeft, IndianRupee, ShieldCheck,
  TrendingDown, Users, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllPayslips, runPayrollCycle, getAdminPayrollOverview } from "@/services/payrollService";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon, iconBg, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex items-center gap-6"
    >
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-transform group-hover:scale-110 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          {trend && <span className="text-emerald-500 mr-1">↑</span>}
          {sub}
        </p>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
    PROCESSED: "bg-blue-50 text-blue-600 border-blue-100",
    SENT: "bg-indigo-50 text-indigo-600 border-indigo-100",
    DRAFT: "bg-amber-50 text-amber-600 border-amber-100",
    FAILED: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest ${styles[status] || "bg-slate-50 text-slate-400 border-slate-100"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'PAID' ? 'bg-emerald-500' : status === 'DRAFT' ? 'bg-amber-500' : 'bg-blue-500'}`} />
      {status}
    </span>
  );
}

// ─── Payslip Preview Modal ────────────────────────────────────────────────────────

function PayslipModal({ isOpen, onClose, payslip }) {
  if (!isOpen || !payslip) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 px-10 py-12 text-white relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32" />
             <div className="relative z-10 flex justify-between items-start">
                <div className="space-y-2">
                   <h2 className="text-4xl font-black tracking-tight">{payslip.name}</h2>
                   <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
                     {payslip.dept} • EMP-ID: {payslip.employeeId || 'N/A'}
                   </p>
                </div>
                <div className="text-right">
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Cycle Period</p>
                   <p className="text-2xl font-bold mt-1 text-indigo-400">{payslip.period || 'Current Month'}</p>
                </div>
             </div>
          </div>

          {/* Body */}
          <div className="p-10 space-y-12">
            <div className="grid grid-cols-2 gap-16">
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Earnings</h4>
                </div>
                <div className="space-y-4">
                   <DetailRow label="Gross Salary" value={payslip.gross} />
                   <DetailRow label="Allowances" value="₹0" />
                   <DetailRow label="Incentives" value="₹0" isHighlight />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <TrendingDown className="w-4 h-4 text-rose-500 rotate-180" />
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deductions</h4>
                </div>
                <div className="space-y-4">
                   <DetailRow label="Statutory Tax" value={payslip.deductions} isNegative />
                   <DetailRow label="Provident Fund" value="₹0" isNegative />
                   <DetailRow label="LOP Adjustment" value={payslip.lop || "₹0"} isNegative />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[2rem] p-8 flex items-center justify-between border border-slate-100">
               <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Disbursement</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tight">{payslip.net}</p>
               </div>
               <div className="text-right">
                  <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                    <ShieldCheck size={12} /> Verified
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status: {payslip.status}</p>
               </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 pb-10 flex gap-4">
             <button className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Approve for Cycle
             </button>
             <button onClick={onClose} className="px-10 bg-slate-100 text-slate-600 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                Close
             </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function DetailRow({ label, value, isHighlight, isNegative }) {
  return (
    <div className="flex justify-between items-center group">
       <span className="text-sm font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{label}</span>
       <span className={`text-sm font-black ${
         isNegative ? 'text-rose-500' : isHighlight ? 'text-indigo-600' : 'text-slate-900'
       }`}>{value}</span>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function PayrollProcessing() {
  const router = useRouter();
  const tenant = useTenant();
  
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [overview, setOverview] = useState(null);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const [payslipsRes, overRes] = await Promise.all([
        getAllPayslips(tenant),
        getAdminPayrollOverview(tenant).catch(() => ({ data: null }))
      ]);
      
      const data = payslipsRes.data;
      const formatted = (Array.isArray(data) ? data : data?.content || []).map(p => ({
        id: p.id,
        name: p.employeeName || "Unknown",
        employeeId: p.employeeId || "N/A",
        dept: p.employeeDepartment || "General",
        gross: `₹${p.grossEarnings?.toLocaleString() || '0'}`,
        deductions: `₹${p.totalDeductions?.toLocaleString() || '0'}`,
        net: `₹${p.netSalary?.toLocaleString() || '0'}`,
        status: p.status || "DRAFT",
        period: p.month,
        avatar: (p.employeeName || "U").charAt(0)
      }));
      
      setEmployees(formatted);
      setOverview(overRes.data);
    } catch (err) {
      console.error("Failed to fetch processing ledger:", err);
    } finally {
      setLoading(false);
    }
  }, [tenant]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRunPayroll = async () => {
    if (!confirm("Confirm Payroll Execution: This will finalize all DRAFT records and move them to PROCESSED status. Proceed?")) return;
    
    setProcessing(true);
    try {
      await runPayrollCycle(tenant);
      alert("Payroll cycle executed successfully!");
      fetchData();
    } catch (err) {
      alert("Execution failed: " + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) || 
    emp.dept.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && employees.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Syncing Secure Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="space-y-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em] group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Payroll Center
            </button>
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight text-slate-900">Processing Ledger</h1>
              <p className="text-slate-500 text-sm font-medium">Verify and execute salary disbursements for <span className="text-indigo-600 font-bold">{overview?.currentMonth || "Current Cycle"}</span>.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text"
                  placeholder="Search ledger..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 pr-8 py-4.5 bg-white border border-slate-100 rounded-3xl text-sm font-bold w-full sm:w-80 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                />
             </div>
             <button 
               onClick={handleRunPayroll}
               disabled={processing}
               className="flex items-center gap-3 bg-slate-900 text-white px-10 py-4.5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
             >
               {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
               {processing ? "Executing..." : "Execute Full Cycle"}
             </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <StatCard 
             icon={<IndianRupee className="text-indigo-600" />} 
             iconBg="bg-indigo-50"
             label="Est. Monthly Payout" 
             value={`₹${overview?.totalPayrollCost?.toLocaleString() || '0'}`}
             sub="GROSS TOTAL"
           />
           <StatCard 
             icon={<Users className="text-emerald-600" />} 
             iconBg="bg-emerald-50"
             label="Processed / Total" 
             value={`${overview?.employeesProcessed || 0} / ${overview?.totalEmployees || 0}`}
             sub="WORKFORCE COVERAGE"
           />
           <StatCard 
             icon={<Lock className="text-amber-600" />} 
             iconBg="bg-amber-50"
             label="Cycle Status" 
             value={overview?.cycleStatus || "DRAFT"}
             sub="SYSTEM LOGS"
           />
           <StatCard 
             icon={<CheckCircle2 className="text-blue-600" />} 
             iconBg="bg-blue-50"
             label="Audit Completion" 
             value={`${((overview?.employeesProcessed / overview?.totalEmployees) * 100 || 0).toFixed(0)}%`}
             sub="READY FOR PAYOUT"
           />
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                  <Calculator size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Disbursement Roster</h3>
              </div>
              <div className="hidden sm:flex items-center gap-6">
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" /> PAID
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <div className="w-2 h-2 rounded-full bg-amber-500" /> DRAFT
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <div className="w-2 h-2 rounded-full bg-blue-500" /> PROCESSED
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Employee</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gross Salary</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deductions</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Net Pay</th>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {filteredEmployees.map((emp, i) => (
                     <motion.tr 
                       key={emp.id || i}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: i * 0.02 }}
                       className="group hover:bg-slate-50/50 transition-all cursor-default"
                     >
                        <td className="px-12 py-7">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                {emp.avatar}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{emp.name}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{emp.dept}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-7 text-sm font-bold text-slate-600">{emp.gross}</td>
                        <td className="px-8 py-7 text-sm font-bold text-rose-500">{emp.deductions}</td>
                        <td className="px-8 py-7 text-sm font-black text-slate-900">{emp.net}</td>
                        <td className="px-8 py-7">
                           <StatusBadge status={emp.status} />
                        </td>
                        <td className="px-12 py-7 text-right">
                           <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => setSelectedPayslip(emp)}
                                className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-400 flex items-center justify-center hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg transition-all"
                                title="Preview Details"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button className="h-10 px-6 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200">
                                Approve
                              </button>
                           </div>
                        </td>
                     </motion.tr>
                   ))}
                </tbody>
              </table>
           </div>

           <div className="px-12 py-10 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Ledger View • Showing {filteredEmployees.length} of {employees.length} entries
              </p>
              <div className="flex items-center gap-2">
                 {[1].map(p => (
                   <button key={p} className="w-10 h-10 rounded-xl font-black text-[10px] bg-slate-900 text-white shadow-xl shadow-slate-200">
                     01
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <PayslipModal 
        isOpen={!!selectedPayslip} 
        onClose={() => setSelectedPayslip(null)} 
        payslip={selectedPayslip} 
      />
    </div>
  );
}