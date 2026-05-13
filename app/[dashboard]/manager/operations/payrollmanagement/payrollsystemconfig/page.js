"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Save, Settings, Calendar, Shield, Info, 
  ChevronDown, RefreshCw, Loader2, AlertCircle,
  Percent, Clock, Building, CheckCircle2,
  Lock, ArrowRight, Zap, Calculator
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/hooks/useTenant";
import { getPayrollPolicy, updatePayrollPolicy } from "@/services/payrollService";

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConfigSection({ title, desc, icon, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600">
          {icon}
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h2>
          <p className="text-xs font-medium text-slate-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <div className="p-8 space-y-6">
        {children}
      </div>
    </motion.div>
  );
}

function InputField({ label, value, onChange, type = "text", suffix, placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </label>
      <div className="relative group">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-50 border-none rounded-2xl px-6 py-3.5 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-100 transition-all"
        />
        {suffix && (
          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
        {label}
      </label>
      <div className="relative group">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-slate-50 border-none rounded-2xl px-6 py-3.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:translate-y-0.5 transition-transform" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PayrollSystemConfig() {
  const tenant = useTenant();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [policy, setPolicy] = useState({
    payCycleFrequency: "Monthly",
    standardPayDate: 28,
    avgWorkingDays: 26,
    lopThresholdDays: 2,
    basicPercentage: 40.0,
    hraPercentage: 20.0,
    pfPercentage: 12.0,
    lopDeductionRule: "Deduct based on attendance",
    overtimePolicy: "Include in payroll"
  });

  const fetchPolicy = useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const res = await getPayrollPolicy(tenant);
      if (res.data) setPolicy(res.data);
    } catch (err) {
      console.error("Failed to fetch policy:", err);
    } finally {
      setLoading(false);
    }
  }, [tenant]);

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePayrollPolicy(tenant, policy);
      alert("Configuration saved successfully!");
    } catch (err) {
      console.error("Failed to update policy:", err);
      alert("Failed to update configuration.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, val) => {
    setPolicy(prev => ({ ...prev, [field]: val }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Initializing System Config...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-1"
          >
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              System Configuration
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Global Policy Rules • Financial Thresholds • Compliance Logic
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving Changes..." : "Save Configuration"}
            </button>
          </motion.div>
        </div>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section 1: Cycle Rules */}
          <ConfigSection 
            title="Standard Cycle Rules" 
            desc="Control pay frequency and monthly alignment."
            icon={<Calendar size={24} />}
          >
            <SelectField 
              label="Pay Frequency"
              value={policy.payCycleFrequency}
              onChange={(v) => updateField("payCycleFrequency", v)}
              options={[
                { label: "Monthly", value: "Monthly" },
                { label: "Bi-Weekly", value: "Bi-Weekly" },
                { label: "Weekly", value: "Weekly" }
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="Pay Day"
                type="number"
                value={policy.standardPayDate}
                onChange={(v) => updateField("standardPayDate", parseInt(v))}
                suffix="OF MONTH"
              />
              <InputField 
                label="Avg Working Days"
                type="number"
                value={policy.avgWorkingDays}
                onChange={(v) => updateField("avgWorkingDays", parseInt(v))}
                suffix="DAYS"
              />
            </div>
          </ConfigSection>

          {/* Section 2: Structure Defaults */}
          <ConfigSection 
            title="Structure Defaults" 
            desc="Global ratios for salary component generation."
            icon={<Calculator size={24} />}
          >
            <InputField 
              label="Basic Salary Ratio"
              type="number"
              value={policy.basicPercentage}
              onChange={(v) => updateField("basicPercentage", parseFloat(v))}
              suffix="% OF GROSS"
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="HRA Ratio"
                type="number"
                value={policy.hraPercentage}
                onChange={(v) => updateField("hraPercentage", parseFloat(v))}
                suffix="OF BASIC"
              />
              <InputField 
                label="PF Ratio"
                type="number"
                value={policy.pfPercentage}
                onChange={(v) => updateField("pfPercentage", parseFloat(v))}
                suffix="OF BASIC"
              />
            </div>
          </ConfigSection>

          {/* Section 3: Compliance & LOP */}
          <ConfigSection 
            title="Compliance & LOP" 
            desc="Define loss of pay and attendance thresholds."
            icon={<Shield size={24} />}
          >
            <InputField 
              label="LOP Threshold"
              type="number"
              value={policy.lopThresholdDays}
              onChange={(v) => updateField("lopThresholdDays", parseInt(v))}
              suffix="DAYS"
            />
            <SelectField 
              label="Deduction Rule"
              value={policy.lopDeductionRule}
              onChange={(v) => updateField("lopDeductionRule", v)}
              options={[
                { label: "Deduct based on attendance", value: "Deduct based on attendance" },
                { label: "Fixed Monthly Deduction", value: "Fixed Monthly Deduction" },
                { label: "Manual Adjustment Only", value: "Manual Adjustment Only" }
              ]}
            />
          </ConfigSection>

          {/* Section 4: Advanced Features */}
          <ConfigSection 
            title="Advanced Policy" 
            desc="Overtime and automation preferences."
            icon={<Settings size={24} />}
          >
            <SelectField 
              label="Overtime Policy"
              value={policy.overtimePolicy}
              onChange={(v) => updateField("overtimePolicy", v)}
              options={[
                { label: "Include in payroll cycle", value: "Include in payroll" },
                { label: "Separate Disbursement", value: "Separate Disbursement" },
                { label: "Disabled", value: "Disabled" }
              ]}
            />
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-amber-500">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Automation Note</p>
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed">
                  Changes here affect the next payroll cycle generation. Active cycles will not be impacted.
                </p>
              </div>
            </div>
          </ConfigSection>

        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] pb-10">
          <div className="flex items-center gap-2">
            <Lock size={12} />
            <span>Encrypted Data</span>
          </div>
          <div className="w-1 h-1 bg-slate-200 rounded-full" />
          <div className="flex items-center gap-2">
            <Shield size={12} />
            <span>Policy Enforced</span>
          </div>
        </div>

      </div>
    </div>
  );
}