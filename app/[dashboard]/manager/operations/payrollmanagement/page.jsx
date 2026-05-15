"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import {
  Download,
  Play,
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Zap,
  ChevronRight,
  ArrowUpRight,
  Settings,
  History,
  FileText,
  Calculator,
  Loader2,
  PieChart,
  Calendar,
  RefreshCw,
  Terminal,
  Activity,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAdminPayrollOverview, adminSeedPayrollData, finalizePayouts } from "@/services/payrollService";
import "./payroll.css";

/* ─── Reusable Components ─────────────────────────────────────── */

function PremiumStatCard({ label, value, icon, trend, subtext, color }) {
    const colors = {
        indigo: { bg: "rgba(99, 102, 241, 0.1)", icon: "#6366f1", trend: "bg-indigo-50 text-indigo-600" },
        emerald: { bg: "rgba(16, 185, 129, 0.1)", icon: "#10b981", trend: "bg-emerald-50 text-emerald-600" },
        amber: { bg: "rgba(245, 158, 11, 0.1)", icon: "#f59e0b", trend: "bg-amber-50 text-amber-600" },
        rose: { bg: "rgba(244, 63, 94, 0.1)", icon: "#f43f5e", trend: "bg-rose-50 text-rose-600" },
    };
    const c = colors[color] || colors.indigo;

    return (
        <motion.div 
            whileHover={{ y: -5 }}
            className="payroll-stat-card"
        >
            <div className="stat-header">
                <div className="stat-icon-box" style={{ backgroundColor: c.bg }}>
                    <span style={{ color: c.icon }}>{icon}</span>
                </div>
                {trend && (
                    <div className={`stat-trend ${c.trend}`}>
                        {trend}
                    </div>
                )}
            </div>
            <div className="stat-body">
                <span className="label">{label}</span>
                <div className="value">{value}</div>
                {subtext && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subtext}</p>}
            </div>
        </motion.div>
    );
}

function PremiumModuleCard({ title, desc, icon, onClick, color }) {
    return (
        <motion.div 
            whileHover={{ y: -5 }}
            onClick={onClick}
            className="module-card"
        >
            <div className="module-icon-box">
                {icon}
            </div>
            <div className="module-content">
                <h4>{title}</h4>
                <p>{desc}</p>
            </div>
            <div className="mt-auto pt-4 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Enter Module</span>
                <ArrowRight size={14} className="text-indigo-400" />
            </div>
        </motion.div>
    );
}

/* ─── Main page ─────────────────────────────────────────────────────── */

export default function AdminPayrollDashboard() {
  const router = useRouter();
  const tenant = useTenant();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (!tenant) return;
    const fetchOverview = async () => {
      try {
        const res = await getAdminPayrollOverview(tenant);
        setOverview(res.data);
      } catch (err) {
        console.error("Failed to fetch admin payroll overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [tenant]);

  const displayData = overview ? {
    totalPayrollCost: overview.totalPayrollCost || 0,
    employeesProcessed: overview.employeesProcessed || 0,
    totalEmployees: overview.totalEmployees || 0,
    totalDeductions: overview.totalDeductions || 0,
    lopCases: overview.lopCases || 0,
    currentMonth: overview.currentMonth || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    cycleStatus: overview.cycleStatus || "DRAFT",
    currentStep: overview.currentStep || 1, 
    alerts: overview.alerts || []
  } : {
    totalPayrollCost: 0,
    employeesProcessed: 0,
    totalEmployees: 0,
    totalDeductions: 0,
    lopCases: 0,
    currentMonth: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    cycleStatus: "INITIALIZING",
    currentStep: 1,
    alerts: []
  };

  const timelineSteps = [
    { id: 1, label: "Setup", icon: <Calculator size={16} /> },
    { id: 2, label: "Attendance", icon: <Calendar size={16} /> },
    { id: 3, label: "Anomalies", icon: <AlertCircle size={16} /> },
    { id: 4, label: "Execution", icon: <Play size={16} /> },
    { id: 5, label: "Compliance", icon: <FileText size={16} /> },
    { id: 6, label: "Payouts", icon: <DollarSign size={16} /> },
  ];

  const handleSyncAttendance = async () => {
    setLoading(true);
    try {
      const res = await getAdminPayrollOverview(tenant);
      setOverview(res.data);
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
        await adminSeedPayrollData(tenant);
        const res = await getAdminPayrollOverview(tenant);
        setOverview(res.data);
    } catch (err) {
        alert("Seeding failed: " + (err.response?.data || err.message));
    } finally {
        setSeeding(false);
    }
  };

  const handleFinalizePayouts = async () => {
    setLoading(true);
    try {
        await finalizePayouts(tenant);
        const res = await getAdminPayrollOverview(tenant);
        setOverview(res.data);
    } catch (err) {
        alert("Finalization failed: " + (err.response?.data || err.message));
    } finally {
        setLoading(false);
    }
  };

  if (loading && !overview) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfcfd]">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="mt-6 text-sm font-black text-slate-400 uppercase tracking-widest">Compiling Financial Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 pb-20">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-[1400px] mx-auto px-8 h-24 flex items-center justify-between">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 flex items-center justify-center shadow-xl shadow-indigo-100">
                    <DollarSign size={28} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Payroll Management</h1>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Real-time Control Panel • {displayData.currentMonth}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={handleSyncAttendance}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Sync Data
                </button>
                {displayData.currentStep === 5 ? (
                    <button 
                        onClick={handleFinalizePayouts}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <DollarSign size={16} />
                        Finalize Payouts
                    </button>
                ) : (
                    <button 
                        onClick={() => router.push(`/${tenant}/admin/operations/payrollmanagement/payrollprocessing`)}
                        className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95"
                    >
                        <Play size={16} className="fill-current" />
                        Execute Cycle
                    </button>
                )}
            </div>
        </div>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="payroll-dashboard"
      >
        
        {/* Stats Grid */}
        <div className="payroll-stats-grid">
            <PremiumStatCard 
                label="Total Payroll Cost"
                value={`$${displayData.totalPayrollCost.toLocaleString()}`}
                icon={<DollarSign size={22} />}
                trend="+4.2%"
                subtext="Projected Estimate"
                color="indigo"
            />
            <PremiumStatCard 
                label="Processed Staff"
                value={`${displayData.employeesProcessed} / ${displayData.totalEmployees}`}
                icon={<Users size={22} />}
                trend="Live"
                subtext="Across All Units"
                color="emerald"
            />
            <PremiumStatCard 
                label="Compliance Pool"
                value={`$${displayData.totalDeductions.toLocaleString()}`}
                icon={<PieChart size={22} />}
                trend="Active"
                subtext="Statutory Deductions"
                color="amber"
            />
            <PremiumStatCard 
                label="Critical Anomalies"
                value={displayData.lopCases}
                icon={<AlertTriangle size={22} />}
                trend={displayData.lopCases > 0 ? "Attention" : "Clear"}
                subtext="Loss of Pay Records"
                color="rose"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Workflow & Modules */}
            <div className="lg:col-span-8 space-y-8">
                
                {/* Workflow Stepper */}
                <div className="workflow-container">
                    <div className="workflow-header">
                        <div className="workflow-info">
                            <h2>Monthly Cycle Progress</h2>
                            <p>Current Stage: {displayData.cycleStatus}</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
                            <Lock size={12} />
                            Lock Final State
                        </button>
                    </div>

                    <div className="stepper-root">
                        <div className="stepper-line">
                            <div 
                                className="stepper-line-progress" 
                                style={{ width: `${(displayData.currentStep - 1) * 20}%` }}
                            />
                        </div>
                        {timelineSteps.map((step, idx) => {
                            const status = idx + 1 < displayData.currentStep ? 'completed' : idx + 1 === displayData.currentStep ? 'active' : 'pending';
                            return (
                                <div key={step.id} className={`step-item ${status}`}>
                                    <div className="step-node">
                                        {status === 'completed' ? <CheckCircle2 size={18} /> : step.icon}
                                    </div>
                                    <span className="step-label">{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Module Navigation */}
                <div className="module-grid">
                    <PremiumModuleCard 
                        title="Salary Structures"
                        desc="Configure components, grades, and individualized salary slabs."
                        icon={<Calculator size={24} className="text-indigo-600" />}
                        onClick={() => router.push(`/${tenant}/admin/operations/payrollmanagement/salarystructure`)}
                    />
                    <PremiumModuleCard 
                        title="Execution Center"
                        desc="Run current cycle payouts and generate batch reports."
                        icon={<RefreshCw size={24} className="text-emerald-600" />}
                        onClick={() => router.push(`/${tenant}/admin/operations/payrollmanagement/payrollprocessing`)}
                    />
                    <PremiumModuleCard 
                        title="Historical Ledger"
                        desc="Access archived cycles and generate compliance documents."
                        icon={<History size={24} className="text-amber-600" />}
                        onClick={() => router.push(`/${tenant}/admin/operations/payrollmanagement/payrollhistory`)}
                    />
                </div>

                {/* Developer Simulation Tools (Replaces old Seed Data) */}
                <div className="dev-tools-banner">
                    <div className="dev-tools-content">
                        <div className="flex items-center gap-3 mb-2">
                            <Terminal size={20} className="text-indigo-400" />
                            <h3>Simulation & Testing Environment</h3>
                        </div>
                        <p>
                            Use seed data to simulate full-month payroll cycles for testing purposes. 
                            This generates synthetic attendance records, LOP cases, and salary structures 
                            to verify system logic without affecting production data.
                        </p>
                    </div>
                    <button 
                        onClick={handleSeedData}
                        disabled={seeding}
                        className="seed-btn"
                    >
                        {seeding ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Zap size={16} />
                        )}
                        <span>{seeding ? "Simulating..." : "Seed Test Data"}</span>
                    </button>
                </div>
            </div>

            {/* Right Column: Alerts & Side Actions */}
            <div className="lg:col-span-4 space-y-8">
                
                {/* Anomalies Panel */}
                <div className="anomalies-card">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Activity size={18} className="text-rose-500" />
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Anomalies</h3>
                        </div>
                        <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-full">
                            {displayData.alerts.length}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {displayData.alerts.map((alert, i) => (
                                <motion.div 
                                    key={alert.id || i}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="anomaly-item"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                                            alert.type === 'error' ? 'bg-rose-500' : 'bg-amber-500'
                                        }`} />
                                        <div className="space-y-1">
                                            <p className="text-[13px] font-black text-slate-800">{alert.title}</p>
                                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{alert.desc}</p>
                                            <div className="flex items-center gap-2 mt-3">
                                                <span className="text-[9px] font-black uppercase text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                                                    {alert.category || "Critical"}
                                                </span>
                                                <ArrowUpRight size={12} className="text-indigo-400" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {displayData.alerts.length === 0 && (
                            <div className="py-10 text-center text-slate-400">
                                <p className="text-xs font-medium">No active anomalies detected.</p>
                            </div>
                        )}
                    </div>

                    <button className="w-full py-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-100 transition-all">
                        View All Verification Required
                    </button>
                </div>

                {/* System Config Quick Access */}
                <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                    <div className="relative z-10 space-y-6">
                        <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-indigo-400">
                            <Settings size={28} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-lg font-black">Global Rules</h4>
                            <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                Configure tax slabs, PF/ESI percentages, and automated payroll dates.
                            </p>
                        </div>
                        <button 
                            onClick={() => router.push(`/${tenant}/admin/operations/payrollmanagement/payrollsystemconfig`)}
                            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-900/40 hover:bg-indigo-700 transition-all active:scale-95"
                        >
                            Configure Rules
                        </button>
                    </div>
                </div>

            </div>
        </div>
      </motion.main>
    </div>
  );
}