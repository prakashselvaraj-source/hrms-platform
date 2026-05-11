"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import {
  Search, Users, ChevronRight, X, Save, Loader2, ArrowLeft,
  CheckCircle, AlertCircle, MapPin, Building, IndianRupee,
  User, Settings, TrendingUp, Shield
} from "lucide-react";
import { getEmployees } from "@/services/employeeService";
import { getAdminSalaryStructure, updateAdminSalaryStructure, getPayrollPolicy, updatePayrollPolicy } from "@/services/payrollService";

// ─── Default empty structure ──────────────────────────────────────────────────
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const num = (v) => Number(v) || 0;

const calcGross = (f) =>
  num(f.basicSalary) + num(f.hra) + num(f.medicalAllowance) +
  num(f.travelAllowance) + num(f.specialAllowance) + num(f.performanceBonus);

const calcDeductions = (f) =>
  num(f.pfContribution) + num(f.esiContribution) + num(f.professionalTax) +
  num(f.tds) + num(f.loanDeduction);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SalaryStructurePage() {
  const router = useRouter();
  const tenant = useTenant();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyStructure);
  const [modalLoading, setModalLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());

  // Policy panel
  const [showPolicy, setShowPolicy] = useState(false);
  const [policy, setPolicy] = useState({ payCycleFrequency: "Monthly", standardPayDate: 28 });
  const [savingPolicy, setSavingPolicy] = useState(false);

  // ── Fetch employees ──────────────────────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const res = await getEmployees(tenant, page, 12);
      const data = res.data;
      setEmployees(data.employees || data.content || data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tenant, page]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  useEffect(() => {
    if (!tenant) return;
    getPayrollPolicy(tenant).then(r => setPolicy(r.data)).catch(() => {});
  }, [tenant]);

  // ── Open salary modal for an employee ───────────────────────────────────────
  const openModal = async (emp) => {
    setSelected(emp);
    setModalLoading(true);
    try {
      const res = await getAdminSalaryStructure(tenant, emp.id);
      const d = res.data || {};
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
        status: d.status ?? "NOT_ASSIGNED",
      });
    } catch {
      setForm(emptyStructure);
    } finally {
      setModalLoading(false);
    }
  };

  // ── Save salary structure ────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAdminSalaryStructure(tenant, selected.id, form);
      setSavedIds((prev) => new Set(prev).add(selected.id));
      setSelected(null);
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // ── Save policy ──────────────────────────────────────────────────────────────
  const handleSavePolicy = async () => {
    setSavingPolicy(true);
    try {
      await updatePayrollPolicy(tenant, policy);
      setShowPolicy(false);
    } catch {}
    finally { setSavingPolicy(false); }
  };

  const filtered = employees.filter((e) =>
    `${e.firstName} ${e.lastName} ${e.department} ${e.designation} ${e.workLocation ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100 px-6 sm:px-10 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest mb-2 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Payroll Center
          </button>
          <h1 className="text-2xl font-black text-slate-900">Salary Structure</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Configure individual salary components for each employee</p>
        </div>
        <button
          onClick={() => setShowPolicy(!showPolicy)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
        >
          <Settings className="w-4 h-4" /> Pay Policies
        </button>
      </div>

      {/* ── Policy Panel ── */}
      {showPolicy && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-6 sm:px-10 py-8">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Global Pay Policy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <PolicyField label="Pay Cycle" value={policy.payCycleFrequency} onChange={v => setPolicy({ ...policy, payCycleFrequency: v })} type="select" options={["Monthly", "Bi-weekly", "Weekly"]} />
            <PolicyField label="Standard Pay Date" value={policy.standardPayDate} onChange={v => setPolicy({ ...policy, standardPayDate: Number(v) })} type="number" />
            <PolicyField label="LOP Rule" value={policy.lopDeductionRule} onChange={v => setPolicy({ ...policy, lopDeductionRule: v })} type="select" options={["Deduct based on attendance", "Fixed monthly"]} />
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={handleSavePolicy} disabled={savingPolicy} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50">
              {savingPolicy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
            <button onClick={() => setShowPolicy(false)} className="px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="px-6 sm:px-10 py-8">
        {/* Search + stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, department, location…"
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest">
            <Users className="w-4 h-4" />
            {employees.length} employees
            <span className="text-emerald-500">· {savedIds.size} configured</span>
          </div>
        </div>

        {/* Employee grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-4" />
                <div className="h-3 bg-slate-100 rounded w-3/4 mb-2" />
                <div className="h-2 bg-slate-50 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((emp) => {
              const isConfigured = savedIds.has(emp.id) || (emp.basicSalary && emp.basicSalary > 0);
              return (
                <button
                  key={emp.id}
                  onClick={() => openModal(emp)}
                  className="bg-white rounded-3xl p-6 text-left hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-200 border border-slate-100 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">
                      {emp.firstName?.charAt(0)}{emp.lastName?.charAt(0)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isConfigured
                        ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                        : <AlertCircle className="w-4 h-4 text-amber-400" />
                      }
                      <span className={`text-[9px] font-black uppercase tracking-wider ${isConfigured ? "text-emerald-500" : "text-amber-400"}`}>
                        {isConfigured ? "Configured" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-black text-slate-900 leading-tight">{emp.firstName} {emp.lastName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{emp.designation || "—"}</p>

                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <Building className="w-3 h-3" /> {emp.department || "—"}
                    </div>
                    {emp.workLocation && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400">
                        <MapPin className="w-3 h-3" /> {emp.workLocation}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Configure</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              );
            })}

            {filtered.length === 0 && (
              <div className="col-span-full py-24 text-center">
                <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No employees found</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-xl text-sm font-black transition-all ${page === i ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-400 hover:border-slate-400"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Per-Employee Salary Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/60 to-purple-50/40 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-lg">
                  {selected.firstName?.charAt(0)}{selected.lastName?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">{selected.firstName} {selected.lastName}</h2>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selected.designation}</span>
                    {selected.workLocation && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-500">
                        <MapPin className="w-3 h-3" /> {selected.workLocation}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            {modalLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
                {/* Location Note */}
                {selected.workLocation && (
                  <div className="flex items-start gap-3 bg-indigo-50 rounded-2xl px-5 py-4 border border-indigo-100">
                    <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                    <p className="text-xs font-bold text-indigo-700 leading-relaxed">
                      Work Location: <span className="font-black">{selected.workLocation}</span> — Set travel allowance based on actual commute distance and city tier.
                    </p>
                  </div>
                )}

                {/* EARNINGS */}
                <div>
                  <SectionHeader icon={<TrendingUp className="w-4 h-4 text-indigo-600" />} title="Earnings Components" color="indigo" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <SalaryField label="Basic Salary" name="basicSalary" value={form.basicSalary} onChange={setForm} required note="Foundation component (~40-50% of CTC)" />
                    <SalaryField label="HRA" name="hra" value={form.hra} onChange={setForm} note="Based on city tier (Metro/Tier-2/Tier-3)" />
                    <SalaryField label="Travel Allowance" name="travelAllowance" value={form.travelAllowance} onChange={setForm} note="Per employee — based on actual work location" highlight />
                    <SalaryField label="Medical Allowance" name="medicalAllowance" value={form.medicalAllowance} onChange={setForm} note="Standard: ₹1,250/month" />
                    <SalaryField label="Special Allowance" name="specialAllowance" value={form.specialAllowance} onChange={setForm} note="Flexible / balancing component" />
                    <SalaryField label="Performance Bonus" name="performanceBonus" value={form.performanceBonus} onChange={setForm} note="Variable — role/KPI based" />
                  </div>
                </div>

                {/* DEDUCTIONS */}
                <div>
                  <SectionHeader icon={<Shield className="w-4 h-4 text-rose-500" />} title="Deductions & Compliance" color="rose" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <SalaryField label="PF Contribution" name="pfContribution" value={form.pfContribution} onChange={setForm} note="12% of Basic (leave blank to auto-calculate)" color="rose" />
                    <SalaryField label="ESI Contribution" name="esiContribution" value={form.esiContribution} onChange={setForm} note="Applicable if gross ≤ ₹21,000/month" color="rose" />
                    <SalaryField label="Professional Tax" name="professionalTax" value={form.professionalTax} onChange={setForm} note="State-specific slab deduction" color="rose" />
                    <SalaryField label="TDS (Income Tax)" name="tds" value={form.tds} onChange={setForm} note="Based on annual income tax slab" color="rose" />
                    <SalaryField label="Loan Deduction" name="loanDeduction" value={form.loanDeduction} onChange={setForm} note="Leave blank if no active loan" color="rose" />
                    <div className="sm:col-span-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Effective From</label>
                      <input type="date" value={form.effectiveFrom} onChange={e => setForm(f => ({ ...f, effectiveFrom: e.target.value }))}
                        className="mt-2 w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all" />
                    </div>
                  </div>
                </div>

                {/* LIVE PREVIEW */}
                <div className="bg-slate-900 rounded-3xl p-6 text-white">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5">Live Salary Preview</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <PreviewBlock label="Monthly Gross" value={calcGross(form)} color="text-white" />
                    <PreviewBlock label="Total Deductions" value={calcDeductions(form)} color="text-rose-400" />
                    <PreviewBlock label="Net Pay" value={calcGross(form) - calcDeductions(form)} color="text-emerald-400" />
                    <PreviewBlock label="Annual CTC" value={calcGross(form) * 12} color="text-indigo-300" />
                  </div>
                </div>
              </div>
            )}

            {/* Modal footer */}
            <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between gap-4 flex-shrink-0 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Changes apply from next payroll cycle</p>
              <div className="flex gap-3">
                <button onClick={() => setSelected(null)} className="px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-all">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-slate-900 text-white px-7 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Structure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SalaryField({ label, name, value, onChange, note, required, highlight, color = "indigo" }) {
  return (
    <div className={`space-y-1.5 ${highlight ? "sm:col-span-2" : ""}`}>
      <div className="flex items-center gap-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        {highlight && <span className="text-[9px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full uppercase tracking-widest">Per Employee</span>}
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

function SectionHeader({ icon, title, color }) {
  return (
    <div className={`flex items-center gap-2.5 pb-3 border-b ${color === "rose" ? "border-rose-100" : "border-indigo-100"}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color === "rose" ? "bg-rose-50" : "bg-indigo-50"}`}>
        {icon}
      </div>
      <h3 className={`text-xs font-black uppercase tracking-widest ${color === "rose" ? "text-rose-600" : "text-indigo-600"}`}>{title}</h3>
    </div>
  );
}

function PreviewBlock({ label, value, color }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-xl font-black ${color}`}>
        ₹{Number(value || 0).toLocaleString("en-IN")}
      </p>
    </div>
  );
}

function PolicyField({ label, value, onChange, type, options }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
      {type === "select" ? (
        <select value={value || ""} onChange={e => onChange(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 transition-all">
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value || ""} onChange={e => onChange(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-400 transition-all" />
      )}
    </div>
  );
}
