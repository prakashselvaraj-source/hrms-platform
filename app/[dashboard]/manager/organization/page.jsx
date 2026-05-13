"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2, MapPin, Clock, CheckCircle2,
  ArrowRight, Plus, ShieldCheck,
  X, CreditCard,
  Package, Zap, Check, Sparkles,
  Calendar, Bell, Lock, BarChart3,
  FileText, Layers
} from "lucide-react";

import { toast } from "react-hot-toast";
import { useTenant } from "@/hooks/useTenant";
import {
  getTenantDetails,
  completeFullSetup,
  getFullDetails
} from "@/services/organizationService";
import { useRouter } from "next/navigation";

// ─── Constants ───────────────────────────────────────────────────────────────

const STEPS = [
  { id: "company", label: "Company", desc: "Basic details & branding", icon: Building2 },
  { id: "plan", label: "Subscription", desc: "Choose your platform tier", icon: CreditCard },
  { id: "locations", label: "Work Sites", desc: "Physical & remote offices", icon: MapPin },
  { id: "shifts", label: "Time Cycles", desc: "Work hours & schedules", icon: Clock },
  { id: "modules", label: "Features", desc: "Enable platform tools", icon: Package },
  { id: "finalize", label: "Go Live", desc: "Final review & deploy", icon: Sparkles },
];

const PLANS = [
  {
    id: "starter", name: "Starter", price: "$29", period: "/mo",
    description: "Ideal for startups and small teams.",
    features: ["Up to 25 employees", "2 locations", "Basic attendance", "Email support"],
  },
  {
    id: "growth", name: "Growth", price: "$79", period: "/mo",
    description: "Scale with advanced HR & payroll.",
    features: ["Up to 150 employees", "10 locations", "Payroll integration", "Priority support"],
    popular: true,
  },
  {
    id: "enterprise", name: "Enterprise", price: "Custom", period: "",
    description: "Full suite for large corporations.",
    features: ["Unlimited employees", "Global sites", "Custom integrations", "Dedicated manager"],
  },
];

const MODULES = [
  { id: "attendance", icon: Clock, label: "Attendance", desc: "Geo-fenced tracking & facial recognition.", category: "Core" },
  { id: "payroll", icon: CreditCard, label: "Payroll", desc: "Automated tax & salary disbursement.", category: "Finance" },
  { id: "leave", icon: Calendar, label: "Leave Mgmt", desc: "Custom leave types & accrual rules.", category: "Core" },
  { id: "reports", icon: BarChart3, label: "Analytics", desc: "Real-time workforce performance insights.", category: "Admin" },
  { id: "notify", icon: Bell, label: "Smart Alerts", desc: "Automated SMS/Email notifications.", category: "Admin" },
  { id: "docs", icon: FileText, label: "E-Vault", desc: "Secure digital employee document storage.", category: "Compliance" },
  { id: "roles", icon: Lock, label: "Security", desc: "Granular RBAC & access control.", category: "Admin" },
  { id: "departments", icon: Layers, label: "Structure", desc: "Visual org-charts & department trees.", category: "Core" },
];

// ─── Shared Styles ────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-150";
const labelCls =
  "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";
const btnPrimary =
  "group flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm";
const btnBack =
  "text-sm font-medium text-slate-400 hover:text-slate-600 transition";

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ show, onClose, title, subtitle, icon: Icon, children }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-xl w-full max-w-md shadow-xl border border-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="text-xs text-slate-400">{subtitle}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Step: Company ────────────────────────────────────────────────────────────

function CompanyStep({ data, onChange, onNext, readOnly }) {
  const handleLogoChange = (e) => {
    if (readOnly) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange("logoUrl", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload Area */}
      <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl group transition-all hover:border-indigo-300">
        <div className="relative">
          <div className="w-24 h-24 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
            {data.logoUrl ? (
              <img src={data.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 size={32} className="text-slate-300" />
            )}
          </div>
          {!readOnly && (
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors">
              <Plus size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
            </label>
          )}
        </div>
        <div className="text-center mt-4">
          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Company Logo</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Recommended: 512x512px (PNG/JPG)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelCls}>Company Name</label>
          <input className={inputCls} placeholder="Enter your organization name" value={data.companyName} onChange={e => onChange("companyName", e.target.value)} required disabled={readOnly} />
        </div>
        <div>
          <label className={labelCls}>Industry</label>
          <select className={inputCls} value={data.industry} onChange={e => onChange("industry", e.target.value)} disabled={readOnly}>
            <option value="">Select industry</option>
            {["Technology", "Healthcare", "Finance", "Retail", "Manufacturing", "Other"].map(i => <option key={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Organization Size</label>
          <select className={inputCls} value={data.size} onChange={e => onChange("size", e.target.value)} disabled={readOnly}>
            <option value="">Select size</option>
            {["1-10", "11-50", "51-200", "201-500", "500+"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Business Email</label>
          <input className={inputCls} type="email" placeholder="admin@company.com" value={data.email} onChange={e => onChange("email", e.target.value)} disabled={readOnly} />
        </div>
        <div>
          <label className={labelCls}>Contact Phone</label>
          <input className={inputCls} type="tel" placeholder="+1 (555) 000-0000" value={data.phone} onChange={e => onChange("phone", e.target.value)} disabled={readOnly} />
        </div>
        <div>
          <label className={labelCls}>Country</label>
          <select className={inputCls} value={data.country} onChange={e => onChange("country", e.target.value)} disabled={readOnly}>
            <option value="">Select country</option>
            {["India", "United States", "UK", "Canada", "Singapore", "UAE"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Primary Timezone</label>
          <select className={inputCls} value={data.timezone} onChange={e => onChange("timezone", e.target.value)} disabled={readOnly}>
            <option value="">Select timezone</option>
            {["IST (GMT+5:30)", "EST (GMT-5)", "PST (GMT-8)", "GMT+0"].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button onClick={onNext} className={btnPrimary}>
          Continue <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

// ─── Step: Plan ───────────────────────────────────────────────────────────────

function PlanStep({ selected, onSelect, onNext, onBack, readOnly }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PLANS.map(plan => (
          <button
            key={plan.id}
            onClick={() => onSelect(plan.id)}
            className={`relative text-left p-5 rounded-xl border-2 transition-all duration-200
              ${selected === plan.id
                ? "border-indigo-600 bg-indigo-50/30"
                : "border-slate-200 hover:border-indigo-300 bg-white"}
              ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            disabled={readOnly}
          >
            {plan.popular && (
              <span className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Recommended
              </span>
            )}
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white mb-4">
              <Sparkles size={16} />
            </div>
            <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
            <div className="flex items-baseline gap-0.5 mt-1 mb-3">
              <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
              <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">{plan.description}</p>
            <ul className="space-y-2">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                    <Check size={10} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className={btnBack}>← Back</button>
        <button onClick={onNext} disabled={!selected} className={`${btnPrimary} disabled:opacity-40 disabled:cursor-not-allowed`}>
          Next <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Step: Locations ──────────────────────────────────────────────────────────

function LocationsStep({ locations, setLocations, onNext, onBack, readOnly }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", city: "", state: "", country: "", zipCode: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    setLocations([...locations, { ...form, id: Date.now() }]);
    setForm({ name: "", address: "", city: "", state: "", country: "", zipCode: "" });
    setShow(false);
    toast.success("Location added");
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {locations.map(loc => (
          <div key={loc.id} className="group flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-all">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <MapPin size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{loc.name}</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">{loc.address}</p>
              <p className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">{loc.city}, {loc.country}</p>
            </div>
            {!readOnly && (
              <button
                onClick={() => setLocations(locations.filter(l => l.id !== loc.id))}
                className="p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-rose-50 text-rose-400 rounded-md"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        {!readOnly && (
          <button
            onClick={() => setShow(true)}
            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/20 transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Plus size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600">Add New Site</p>
          </button>
        )}
      </div>

      <Modal show={show} onClose={() => setShow(false)} title="Add Work Location" subtitle="Register a new office or site" icon={MapPin}>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className={labelCls}>Site Name</label>
            <input className={inputCls} placeholder="e.g. Headquarters" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Street Address</label>
            <input className={inputCls} placeholder="123 Corporate Way" required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>City</label>
              <input className={inputCls} required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <input className={inputCls} required value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition shadow-sm mt-2">
            Save Location
          </button>
        </form>
      </Modal>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className={btnBack}>← Back</button>
        <button onClick={onNext} disabled={locations.length === 0} className={`${btnPrimary} disabled:opacity-40 disabled:cursor-not-allowed`}>
          Next <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Step: Shifts ─────────────────────────────────────────────────────────────

function ShiftsStep({ shifts, setShifts, onNext, onBack, readOnly }) {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", startTime: "09:00", endTime: "17:00", gracePeriodMinutes: 15 });

  const handleAdd = (e) => {
    e.preventDefault();
    setShifts([...shifts, { ...form, id: Date.now() }]);
    setForm({ name: "", startTime: "09:00", endTime: "17:00", gracePeriodMinutes: 15 });
    setShow(false);
    toast.success("Shift saved");
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {shifts.map(shift => (
          <div key={shift.id} className="group flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-all">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Clock size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">{shift.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                  {shift.startTime} – {shift.endTime}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-medium">Grace: {shift.gracePeriodMinutes}m</span>
              </div>
            </div>
            {!readOnly && (
              <button
                onClick={() => setShifts(shifts.filter(s => s.id !== shift.id))}
                className="p-1.5 opacity-0 group-hover:opacity-100 transition hover:bg-rose-50 text-rose-400 rounded-md"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        {!readOnly && (
          <button
            onClick={() => setShow(true)}
            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/20 transition group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition">
              <Plus size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600">Add New Shift</p>
          </button>
        )}
      </div>

      <Modal show={show} onClose={() => setShow(false)} title="Configure Shift" subtitle="Set working hours and rules" icon={Clock}>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className={labelCls}>Shift Name</label>
            <input className={inputCls} placeholder="e.g. Day Shift" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Start Time</label>
              <input type="time" className={inputCls} required value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>End Time</label>
              <input type="time" className={inputCls} required value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Grace Period (Minutes)</label>
            <input type="number" min="0" max="60" className={inputCls} value={form.gracePeriodMinutes} onChange={e => setForm({ ...form, gracePeriodMinutes: e.target.value })} />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition shadow-sm mt-2">
            Save Shift
          </button>
        </form>
      </Modal>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className={btnBack}>← Back</button>
        <button onClick={onNext} disabled={shifts.length === 0} className={`${btnPrimary} disabled:opacity-40 disabled:cursor-not-allowed`}>
          Next <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Step: Modules ────────────────────────────────────────────────────────────

function ModulesStep({ selected, onToggle, onNext, onBack, readOnly }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MODULES.map(mod => {
          const Icon = mod.icon;
          const isActive = selected.includes(mod.id);
          return (
            <button
              key={mod.id}
              onClick={() => onToggle(mod.id)}
              disabled={readOnly}
              className={`flex items-start gap-3 p-4 rounded-lg border-2 text-left transition-all
                ${isActive ? "border-indigo-600 bg-indigo-50/20" : "border-slate-200 hover:border-indigo-200 bg-white"}
                ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all
                ${isActive ? "bg-indigo-600 text-white" : "bg-slate-50 text-slate-400"}`}>
                <Icon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{mod.label}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wide text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{mod.category}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{mod.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
                ${isActive ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"}`}>
                {isActive && <Check size={11} />}
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className={btnBack}>← Back</button>
        <button onClick={onNext} className={btnPrimary}>
          Review & Finalize <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Step: Finalize ───────────────────────────────────────────────────────────

function FinalizeStep({ company, plan, locations, shifts, modules, onComplete, onBack, saving, readOnly }) {
  const planObj = PLANS.find(p => p.id === plan);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: "Company", val: company.companyName, sub: company.industry, icon: Building2 },
          { label: "Plan", val: planObj?.name, sub: planObj?.price, icon: CreditCard },
          { label: "Locations", val: `${locations.length} Sites`, sub: locations.map(l => l.name).slice(0, 2).join(", "), icon: MapPin },
          { label: "Shifts", val: `${shifts.length} Shifts`, sub: shifts.map(s => s.name).slice(0, 2).join(", "), icon: Clock },
        ].map(row => (
          <div key={row.label} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
              <row.icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{row.label}</p>
              <p className="text-sm font-semibold text-slate-900 truncate">{row.val}</p>
              <p className="text-xs text-slate-400 truncate">{row.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Banner */}
      <div className="p-6 bg-indigo-600 rounded-xl text-white relative overflow-hidden">
        <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-indigo-400 opacity-30 rotate-12" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shrink-0">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <Building2 className="text-indigo-600" size={24} />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1">{readOnly ? "Setup Confirmed" : "Ready to go live?"}</h3>
            <p className="text-indigo-200 text-sm leading-relaxed max-w-md">
              {readOnly
                ? "Your organization is fully configured and live on the platform."
                : "Your configuration is complete. Once deployed, the operations dashboard will be unlocked."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className={btnBack}>← Back</button>
        {!readOnly && (
          <button
            onClick={onComplete}
            disabled={saving}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-lg font-semibold text-sm transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deploying...
              </>
            ) : (
              <>
                <Zap size={15} className="text-yellow-400" />
                Deploy Organization
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrganizationSetupPage() {
  const tenantCode = useTenant();
  const router = useRouter();
  const [step, setStep] = useState("company");
  const [completed, setCompleted] = useState([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState({ companyName: "", industry: "", size: "", email: "", phone: "", country: "", timezone: "", website: "", regNumber: "", logoUrl: "" });
  const [plan, setPlan] = useState("");
  const [locations, setLocations] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [modules, setModules] = useState(["attendance", "leave", "notify", "departments"]);

  useEffect(() => { if (tenantCode) fetchInitialData(); }, [tenantCode]);

  const fetchInitialData = async () => {
    if (!tenantCode) return;
    try {
      setLoading(true);
      const res = await getFullDetails();
      const data = res.data;
      if (data) {
        setCompany({
          companyName: data.companyName || "",
          industry: data.industry || "",
          size: data.companySize || "",
          email: data.businessEmail || "",
          phone: data.phoneNumber || "",
          country: data.country || "",
          timezone: data.timezone || "",
          website: data.website || "",
          regNumber: data.registrationNumber || "",
          logoUrl: data.logoUrl || ""
        });
        setPlan(data.selectedPlan || "");
        if (data.enabledModules?.length > 0) setModules(data.enabledModules);
        if (data.locations?.length > 0) setLocations(data.locations);
        if (data.shifts?.length > 0) setShifts(data.shifts);
        if (data.setupComplete) setDone(true);
      }
    } catch (error) {
      console.error("Failed to load organization settings.", error);
      toast.error("Failed to load organization settings.");
    } finally {
      setLoading(false);
    }
  };

  const advance = (from, to) => {
    setCompleted(c => c.includes(from) ? c : [...c, from]);
    setStep(to);
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const payload = {
        companyName: company.companyName, industry: company.industry, companySize: company.size,
        businessEmail: company.email, phoneNumber: company.phone, country: company.country,
        timezone: company.timezone, website: company.website, registrationNumber: company.regNumber,
        logoUrl: company.logoUrl,
        selectedPlan: plan,
        locations: locations.map(({ id, ...rest }) => rest),
        shifts: shifts.map(({ id, ...rest }) => rest),
        enabledModules: modules
      };
      await completeFullSetup(payload);
      setDone(true);
      toast.success("Organization setup complete!");
    } catch (error) { toast.error("Failed to save changes."); }
    finally { setSaving(false); }
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">Loading workspace...</p>
          <p className="text-xs text-slate-400 mt-0.5">Synchronizing tenant data</p>
        </div>
      </div>
    );
  }

  // ── Step map ──
  const STEP_CONTENT = {
    company: <CompanyStep data={company} onChange={(k, v) => setCompany(p => ({ ...p, [k]: v }))} onNext={() => advance("company", "plan")} readOnly={done} />,
    plan: <PlanStep selected={plan} onSelect={setPlan} onNext={() => advance("plan", "locations")} onBack={() => setStep("company")} readOnly={done} />,
    locations: <LocationsStep locations={locations} setLocations={setLocations} onNext={() => advance("locations", "shifts")} onBack={() => setStep("plan")} readOnly={done} />,
    shifts: <ShiftsStep shifts={shifts} setShifts={setShifts} onNext={() => advance("shifts", "modules")} onBack={() => setStep("locations")} readOnly={done} />,
    modules: <ModulesStep selected={modules} onToggle={id => setModules(m => m.includes(id) ? m.filter(x => x !== id) : [...m, id])} onNext={() => advance("modules", "finalize")} onBack={() => setStep("shifts")} readOnly={done} />,
    finalize: <FinalizeStep company={company} plan={plan} locations={locations} shifts={shifts} modules={modules} onComplete={handleComplete} onBack={() => setStep("modules")} saving={saving} readOnly={done} />,
  };

  const currentStepIdx = STEPS.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 flex flex-col items-center">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── Left Sidebar ── */}
        <aside className="lg:col-span-3 space-y-4 sticky top-6">

          {/* Brand */}
          <div className="flex items-center gap-2.5 px-1 mb-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Org Setup</span>
          </div>

          {/* Steps */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-1">
            {STEPS.map((s, idx) => {
              const isActive = step === s.id;
              const isDone = completed.includes(s.id);
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                    ${isActive ? "bg-indigo-50" : "hover:bg-slate-50"}`}
                >
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-all border
                    ${isActive ? "bg-indigo-600 border-indigo-600 text-white"
                      : isDone ? "bg-indigo-50 border-indigo-100 text-indigo-600"
                        : "bg-white border-slate-200 text-slate-400"}`}>
                    {isDone ? <Check size={12} /> : idx + 1}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${isActive ? "text-indigo-700" : isDone ? "text-slate-600" : "text-slate-400"}`}>
                      {s.label}
                    </p>
                    {isActive && (
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Progress</span>
              <span className="text-xs font-bold text-indigo-600">{Math.round((completed.length / STEPS.length) * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${(completed.length / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-start gap-2.5 p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
            <ShieldCheck size={14} className="shrink-0 mt-0.5 text-indigo-200" />
            <p className="text-[11px] text-indigo-50 leading-relaxed font-medium">
              All data is encrypted and used to personalize your HRM workspace.
            </p>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="lg:col-span-9 space-y-4 w-full">

          {done && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-900">Organization Setup Completed</p>
                  <p className="text-xs text-emerald-700">Your configuration is currently live and active.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push(`/${tenantCode}/manager/dashboard`)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm uppercase tracking-wider"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setDone(false)}
                  className="px-4 py-2 bg-white border border-emerald-200 text-emerald-700 text-[11px] font-bold rounded-lg hover:bg-emerald-50 transition-all uppercase tracking-wider"
                >
                  Update
                </button>
              </div>
            </motion.div>
          )}

          <main className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step Header */}
                <div className="mb-6 pb-5 border-b border-slate-100">
                  <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
                    Step {currentStepIdx + 1} of {STEPS.length}
                  </p>
                  <h1 className="text-xl font-bold text-slate-900">
                    {STEPS.find(s => s.id === step)?.label}
                  </h1>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {STEPS.find(s => s.id === step)?.desc}
                  </p>
                </div>

                {STEP_CONTENT[step]}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

      </div>
    </div>
  );
}