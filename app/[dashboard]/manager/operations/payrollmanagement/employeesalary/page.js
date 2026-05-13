"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import {
  Filter, Plus, PenLine, DollarSign, UserPlus, CheckCircle, 
  ChevronLeft, ChevronRight, Search, Loader2, ArrowLeft,
  TrendingUp, Shield, IndianRupee, X, Save, AlertCircle,
  Building, MapPin, Users, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getEmployees, updateEmployee, getEmployeeById } from "@/services/employeeService";
import { 
  getAdminSalaryStructure, 
  updateAdminSalaryStructure, 
  getAdminPayrollOverview 
} from "@/services/payrollService";

// ─── Constants & Helpers ──────────────────────────────────────────────────────
const emptyStructure = {
  basicSalary: "",
  hra: "",
  medicalAllowance: "",
  travelAllowance: "",
  specialAllowance: "",
  performanceBonus: "",
  pfContribution: "",
  esiContribution: "",
  professionalTax: "",
  tds: "",
  loanDeduction: "",
  effectiveFrom: new Date().toISOString().split("T")[0],
};

const num = (v) => Number(v) || 0;

const calcGross = (f) =>
  num(f.basicSalary) + num(f.hra) + num(f.medicalAllowance) +
  num(f.travelAllowance) + num(f.specialAllowance) + num(f.performanceBonus);

const calcDeductions = (f) =>
  num(f.pfContribution) + num(f.esiContribution) + num(f.professionalTax) +
  num(f.tds) + num(f.loanDeduction);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, colorClass, subValue }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex items-center gap-5 hover:shadow-md transition-all"
    >
      <div className={`w-14 h-14 rounded-2xl ${colorClass} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-0.5">{label}</p>
        <p className="text-xl font-black text-slate-900">{value}</p>
        {subValue && <p className="text-[10px] font-bold text-slate-400 mt-0.5">{subValue}</p>}
      </div>
    </motion.div>
  );
}

function SalaryField({ label, name, value, onChange, note, required, highlight, color = "indigo" }) {
  return (
    <div className={`space-y-1.5 ${highlight ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      </div>
      <div className="relative">
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black ${color === "rose" ? "text-rose-400" : "text-indigo-400"}`}>
          <IndianRupee className="w-3.5 h-3.5" />
        </div>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange((prev) => ({ ...prev, [name]: e.target.value }))}
          placeholder="0.00"
          className={`w-full bg-slate-50 border rounded-2xl pl-9 pr-4 py-3 text-sm font-bold text-slate-700 focus:outline-none transition-all placeholder:text-slate-300 ${
            highlight
              ? "border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-indigo-50/40"
              : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          }`}
        />
      </div>
      {note && <p className="text-[10px] font-medium text-slate-400 ml-1">{note}</p>}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function EmployeeSalary() {
  const router = useRouter();
  const tenant = useTenant();

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [overview, setOverview] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [form, setForm] = useState(emptyStructure);
  const [modalLoading, setModalLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Fetch Data ──────────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const [empRes, overRes] = await Promise.all([
        getEmployees(tenant, page, 10),
        getAdminPayrollOverview(tenant).catch(() => ({ data: null }))
      ]);
      
      const empData = empRes.data;

      console.log("getEmployees", empRes);
      console.log("getAdminPayrollOverview", overRes);
      setEmployees(empData.employees || empData.content || empData || []);
      setOverview(overRes.data);
    } catch (err) {
      console.error("Failed to fetch salary data:", err);
    } finally {
      setLoading(false);
    }
  }, [tenant, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Salary Configuration Workflow ───────────────────────────────────────────
  const openModal = async (emp) => {
    setSelectedEmp(emp);
    setModalLoading(true);
    try {
      const [structRes, empRes] = await Promise.all([
        getAdminSalaryStructure(tenant, emp.id),
        getEmployeeById(emp.id, tenant)
      ]);

      // Ensure we have the full employee record for the eventual update
      setSelectedEmp(empRes.data || emp);
     
       const d = structRes.data || {};
      setForm({
        basicSalary: d.basicSalary ?? "",
        hra: d.hra ?? "",
        medicalAllowance: d.medicalAllowance ?? "",
        travelAllowance: d.travelAllowance ?? "",
        specialAllowance: d.specialAllowance ?? "",
        performanceBonus: d.performanceBonus ?? "",
        pfContribution: d.pfContribution ?? "",
        esiContribution: d.esiContribution ?? "",
        professionalTax: d.professionalTax ?? "",
        tds: d.tds ?? "",
        loanDeduction: d.loanDeduction ?? "",
        effectiveFrom: d.effectiveFrom ?? new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      setForm(emptyStructure);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update the detailed Salary Structure components
      await updateAdminSalaryStructure(tenant, selectedEmp.id, form);
      
      // 2. Calculate the new summary values
      const gross = calcGross(form);
      const ctc = gross * 12;
      const basic = num(form.basicSalary);

      // 3. Automatically synchronize with the Employee table in the database
      await updateEmployee(selectedEmp.id, {
        ...selectedEmp,
        monthlyGross: gross,
        annualCtc: ctc,
        basicSalary: basic
      }, tenant);

      setSelectedEmp(null);
      fetchData(); // Refresh list to show updated values in table
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const 
  filteredEmployees = employees.filter(emp => 
    `${emp.firstName} ${emp.lastName} ${emp.department} ${emp.designation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em] group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Operations Center
            </button>
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Employee Salaries</h1>
              <p className="text-slate-500 text-sm font-medium">Define, audit and manage salary components across your organization.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search name or role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-11 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-medium w-full sm:w-80 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                />
             </div>
             <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95">
                <Plus size={14} />
                New Component
             </button>
          </div>
        </div>

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<IndianRupee className="text-indigo-600" />} 
            label="Est. Monthly Payout" 
            value={`₹${overview?.totalPayrollCost?.toLocaleString() || '0'}`}
            colorClass="bg-indigo-50"
            subValue={`Cycle: ${overview?.currentMonth || '—'}`}
          />
          <StatCard 
            icon={<CheckCircle className="text-emerald-600" />} 
            label="Net Payout" 
            value={`₹${overview?.totalNetPayout?.toLocaleString() || '0'}`}
            colorClass="bg-emerald-50"
            subValue="Final disbursement"
          />
          <StatCard 
            icon={<Users className="text-blue-600" />} 
            label="Processed / Total" 
            value={`${overview?.employeesProcessed || 0} / ${overview?.totalEmployees || 0}`}
            colorClass="bg-blue-50"
            subValue="Employees in cycle"
          />
          <StatCard 
            icon={<TrendingUp className="text-amber-600" />} 
            label="Critical LOP Cases" 
            value={overview?.lopCases || 0}
            colorClass="bg-amber-50"
            subValue="Requires manual review"
          />
        </div>

        {/* ── Employee Roster ── */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Salary Disbursement Roster</h3>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">
                <Filter size={14} /> Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee Profile</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Department & Role</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Basic</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Gross</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Annual CTC</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-10 py-6"><div className="h-12 bg-slate-50 rounded-2xl w-full" /></td>
                    </tr>
                  ))
                ) : filteredEmployees.map((emp, i) => (
                  <motion.tr 
                    key={emp.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-black text-lg group-hover:scale-110 transition-transform">
                          {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {emp.employeeId || emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-xs font-bold text-slate-700">{emp.designation || "Not Set"}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{emp.department || "General"}</p>
                    </td>
                    <td className="px-6 py-6 text-sm font-bold text-slate-600">₹{emp.basicSalary?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-6 text-sm font-black text-slate-900">₹{emp.monthlyGross?.toLocaleString() || '0'}</td>
                    <td className="px-6 py-6">
                      <span className="text-sm font-black text-indigo-600">₹{emp.annualCtc?.toLocaleString() || '0'}</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button 
                        onClick={() => openModal(emp)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#4F279B] hover:text-indigo-600 transition-colors"
                      >
                        <PenLine size={13} />
                        Configure
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-10 py-8 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing {filteredEmployees.length} of {employees.length} entries
            </p>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setPage(i)}
                  className={`w-10 h-10 rounded-xl font-black text-[10px] transition-all ${
                  page === i ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'bg-white text-slate-400 hover:bg-slate-100 border border-slate-200'
                }`}>
                  0{i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Salary Configuration Modal ── */}
      <AnimatePresence>
        {selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmp(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/60 to-purple-50/40 flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">
                    {selectedEmp.firstName?.charAt(0)}{selectedEmp.lastName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">{selectedEmp.firstName} {selectedEmp.lastName}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedEmp.designation} • {selectedEmp.department}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEmp(null)}
                  className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              {modalLoading ? (
                <div className="flex-1 flex items-center justify-center p-20">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                  {/* Earnings */}
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-indigo-100">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">Earnings Components</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <SalaryField label="Basic Salary" name="basicSalary" value={form.basicSalary} onChange={setForm} note="~40-50% of CTC" />
                      <SalaryField label="HRA" name="hra" value={form.hra} onChange={setForm} note="City tier based" />
                      <SalaryField label="Travel Allowance" name="travelAllowance" value={form.travelAllowance} onChange={setForm} note="Conveyance" />
                      <SalaryField label="Medical Allowance" name="medicalAllowance" value={form.medicalAllowance} onChange={setForm} note="Standard tax-free component" />
                      <SalaryField label="Special Allowance" name="specialAllowance" value={form.specialAllowance} onChange={setForm} note="Balancing component" />
                      <SalaryField label="Performance Bonus" name="performanceBonus" value={form.performanceBonus} onChange={setForm} note="Variable component" />
                    </div>
                  </div>

                  {/* Deductions */}
                  <div>
                    <div className="flex items-center gap-2.5 pb-3 border-b border-rose-100">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-rose-500" />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-rose-600">Deductions & Compliance</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <SalaryField label="PF Contribution" name="pfContribution" value={form.pfContribution} onChange={setForm} color="rose" />
                      <SalaryField label="ESI Contribution" name="esiContribution" value={form.esiContribution} onChange={setForm} color="rose" />
                      <SalaryField label="Professional Tax" name="professionalTax" value={form.professionalTax} onChange={setForm} color="rose" />
                      <SalaryField label="TDS (Income Tax)" name="tds" value={form.tds} onChange={setForm} color="rose" />
                      <SalaryField label="Loan Deduction" name="loanDeduction" value={form.loanDeduction} onChange={setForm} color="rose" />
                      <div className="sm:col-span-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Effective From</label>
                        <input type="date" value={form.effectiveFrom} onChange={e => setForm(f => ({ ...f, effectiveFrom: e.target.value }))}
                          className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 relative z-10">Calculated Pay Summary</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 relative z-10">
                      <PreviewBlock label="Monthly Gross" value={calcGross(form)} color="text-white" />
                      <PreviewBlock label="Deductions" value={calcDeductions(form)} color="text-rose-400" />
                      <PreviewBlock label="Net Payable" value={calcGross(form) - calcDeductions(form)} color="text-emerald-400" />
                      <PreviewBlock label="Annual CTC" value={calcGross(form) * 12} color="text-indigo-300" />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between gap-4 flex-shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-2 text-slate-400">
                  <Info className="w-3.5 h-3.5" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Applied to next payroll</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedEmp(null)}
                    className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Structure
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PreviewBlock({ label, value, color }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-xl font-black ${color}`}>
        ₹{num(value).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

