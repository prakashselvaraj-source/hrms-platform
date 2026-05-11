"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import {
  RefreshCw,
  Calculator,
  Lock,
  FileText,
  Eye,
  SlidersHorizontal,
  Download,
  Play,
  ChevronRight,
  Zap,
  X,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Search,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllPayslips, runPayrollCycle } from "@/services/payrollService";

// ─── Payslip Preview Modal ────────────────────────────────────────────────────────
function PayslipModal({ isOpen, onClose, employee }) {
  if (!isOpen || !employee) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32" />
             <div className="relative z-10 flex justify-between items-start">
                <div>
                   <h2 className="text-3xl font-black">{employee.name}</h2>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">
                     {employee.dept} • EMP-ID: {employee.id || 'N/A'}
                   </p>
                </div>
                <div className="text-right">
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Payroll Period</p>
                   <p className="text-xl font-bold mt-1">April 2025</p>
                </div>
             </div>
          </div>

          {/* Body */}
          <div className="p-8 lg:p-10 space-y-10">
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Earnings</h4>
                <div className="space-y-4">
                   <DetailRow label="Basic Salary" value={employee.gross || "₹0"} />
                   <DetailRow label="HRA" value="₹0" />
                   <DetailRow label="Special Allowance" value="₹0" isHighlight />
                </div>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deductions</h4>
                <div className="space-y-4">
                   <DetailRow label="Income Tax" value={employee.deductions || "₹0"} isNegative />
                   <DetailRow label="Provident Fund" value="₹0" isNegative />
                   <DetailRow label="LOP Deduction" value={employee.lop || "₹0"} isNegative />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 flex items-center justify-between border border-slate-100">
               <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Net Payable</p>
                  <p className="text-3xl font-black text-slate-900 mt-1">{employee.net}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400">Scheduled Disbursement</p>
                  <p className="text-xs font-black text-indigo-600 uppercase mt-1">Direct Bank Deposit</p>
               </div>
            </div>
          </div>

          <div className="px-8 pb-8 flex gap-4">
             <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Approve & Send
             </button>
             <button onClick={onClose} className="px-8 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
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
       <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors">{label}</span>
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
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!tenant) return;
    fetchData();
  }, [tenant]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllPayslips(tenant);
      const data = res.data;
      const formatted = (Array.isArray(data) ? data : data?.content || []).map(p => ({
        id: p.id,
        name: p.employeeName || "Unknown Employee",
        dept: p.department || "General",
        gross: `₹${p.grossTotal?.toLocaleString() || '0'}`,
        deductions: `₹${p.totalDeductions?.toLocaleString() || '0'}`,
        lop: `₹${p.lopDeduction?.toLocaleString() || '0'}`,
        net: `₹${p.amount?.toLocaleString() || '0'}`,
        status: p.status || "DRAFT",
        avatar: (p.employeeName || "U").charAt(0)
      }));
      setEmployees(formatted.length > 0 ? formatted : mockEmployees);
    } catch (err) {
      console.error("Failed to fetch payslips:", err);
      setEmployees(mockEmployees);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPayroll = async () => {
    if (!confirm("Are you sure you want to execute the payroll cycle for all employees? This will move records to the final payout stage.")) return;
    
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
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Accessing Secure Ledger...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 lg:p-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em] group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Command Center
            </button>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Processing Ledger</h1>
              <p className="text-slate-500 text-sm font-medium">Verify and execute salary disbursements for April 2025 Cycle.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search employees or departments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-medium w-full sm:w-80 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                />
             </div>
             <button 
               onClick={handleRunPayroll}
               disabled={processing}
               className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 disabled:opacity-50"
             >
               {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
               Execute Full Calculation
             </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <QuickAction icon={<Calculator className="text-indigo-600" />} label="Recalculate LOP" count="12 cases" />
           <QuickAction icon={<RefreshCw className="text-emerald-600" />} label="Sync Attendance" count="3 pending" />
           <QuickAction icon={<Zap className="text-amber-600" />} label="One-time Bonus" count="5 additions" />
           <QuickAction icon={<FileText className="text-rose-600" />} label="Tax Exemptions" count="8 reviews" />
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
           <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Disbursement Roster</h3>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                 <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Processed</span>
                 <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> Review</span>
                 <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500" /> Hold</span>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Profile</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deductions</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Pay</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {filteredEmployees.map((emp, i) => (
                     <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                {emp.avatar}
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-900">{emp.name}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{emp.dept}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-6 text-sm font-bold text-slate-600">{emp.gross}</td>
                        <td className="px-6 py-6 text-sm font-bold text-rose-500">{emp.deductions}</td>
                        <td className="px-6 py-6 text-sm font-black text-slate-900">{emp.net}</td>
                        <td className="px-6 py-6">
                           <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${
                             emp.status === 'PROCESSED' || emp.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 
                             emp.status === 'REVIEW' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                           }`}>
                             {emp.status}
                           </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => setSelectedEmployee(emp)}
                                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-90"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="h-10 px-4 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-90">
                                Approve
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>

           <div className="px-10 py-8 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Showing {filteredEmployees.length} of {employees.length} entries
              </p>
              <div className="flex items-center gap-2">
                 {[1, 2, 3].map(p => (
                   <button key={p} className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all ${
                     p === 1 ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'
                   }`}>
                     0{p}
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <PayslipModal 
        isOpen={!!selectedEmployee} 
        onClose={() => setSelectedEmployee(null)} 
        employee={selectedEmployee} 
      />
    </div>
  );
}

function QuickAction({ icon, label, count }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer flex items-center gap-5">
       <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
          {icon}
       </div>
       <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
          <h4 className="text-sm font-black text-slate-900">{count}</h4>
       </div>
    </div>
  );
}

const mockEmployees = [
  { id: 1, name: "Marcus Thorne", dept: "Engineering", avatar: "MT", gross: "₹84,500", deductions: "₹12,400", lop: "₹0", net: "₹72,100", status: "PROCESSED" },
  { id: 2, name: "Sarah Jenkins", dept: "Product Design", avatar: "SJ", gross: "₹72,000", deductions: "₹9,800", lop: "₹1,450", net: "₹60,750", status: "REVIEW" },
  { id: 3, name: "David Chen", dept: "Operations", avatar: "DC", gross: "₹65,000", deductions: "₹8,400", lop: "₹0", net: "₹56,600", status: "HOLD" },
  { id: 4, name: "Elena Rodriguez", dept: "Marketing", avatar: "ER", gross: "₹59,000", deductions: "₹0", lop: "₹0", net: "₹59,000", status: "DRAFT" },
];