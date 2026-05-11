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
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { getAdminPayrollOverview, seedPayrollData } from "@/services/payrollService";

export default function AdminPayrollDashboard() {
  const router = useRouter();
  const tenant = useTenant();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Mock data for demonstration if backend is empty
  const displayData = overview || {
    totalPayrollCost: 1284500,
    employeesProcessed: 1240,
    totalEmployees: 1240,
    totalDeductions: 342100,
    lopCases: 42,
    currentMonth: "April 2025",
    cycleStatus: "IN_PROGRESS", // DRAFT, IN_PROGRESS, LOCKED, COMPLETED
    currentStep: 4, // 1 to 7
    alerts: [
      { id: 1, type: "error", title: "Ravi Kumar — 7 LOP days", desc: "Requires manual review for sick leave.", category: "Attendance" },
      { id: 2, type: "warning", title: "3 employees missing attendance", desc: "IT Department — sync pending.", category: "Sync" },
      { id: 3, type: "info", title: "Bank account mismatch", desc: "1 new joiner needs verification.", category: "Compliance" },
    ]
  };

  const timelineSteps = [
    { id: 1, label: "Salary Structure", status: "completed" },
    { id: 2, label: "Attendance Sync", status: "completed" },
    { id: 3, label: "Input Review", status: "completed" },
    { id: 4, label: "Run Payroll", status: "active" },
    { id: 5, label: "Compliance Check", status: "pending" },
    { id: 6, label: "Funds Transfer", status: "pending" },
    { id: 7, label: "Payout Complete", status: "pending" },
  ];

  if (loading && !overview) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-bold font-sans tracking-tight">Initializing Payroll Command Center...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 lg:p-10 font-sans text-slate-900">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <motion.div variants={itemVariants} className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Payroll Management
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Enterprise Control Center • {displayData.currentMonth} Cycle
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <button 
              onClick={async () => {
                if(confirm("This will generate sample payroll records for testing. Continue?")) {
                  try { await seedPayrollData(tenant); window.location.reload(); } catch(e) { alert(e.message); }
                }
              }}
              className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Seed Data</span>
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
              <Download className="w-4 h-4" />
              <span>Global Report</span>
            </button>
            <button 
              onClick={() => router.push(`/${tenant}/admin/operations/payrollmanagement/payrollprocessing`)}
              className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Execute Cycle</span>
            </button>
          </motion.div>
        </div>

        {/* Status Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Payroll Cost" 
            value={`$${displayData.totalPayrollCost.toLocaleString()}`} 
            icon={<DollarSign className="w-5 h-5" />} 
            trend="+4.2%" 
            subtext="vs Last Month"
            color="indigo"
          />
          <StatCard 
            label="Processed Employees" 
            value={`${displayData.employeesProcessed}/${displayData.totalEmployees}`} 
            icon={<Users className="w-5 h-5" />} 
            trend="100%" 
            subtext="All Departments Synced"
            color="emerald"
          />
          <StatCard 
            label="Statutory Deductions" 
            value={`$${displayData.totalDeductions.toLocaleString()}`} 
            icon={<PieChart className="w-5 h-5" />} 
            trend="-2.1%" 
            subtext="PF, TDS & Compliance"
            color="amber"
          />
          <StatCard 
            label="Critical LOP Cases" 
            value={displayData.lopCases} 
            icon={<AlertCircle className="w-5 h-5" />} 
            trend="+12 New" 
            subtext="Manual Review Required"
            color="rose"
          />
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left: Cycle Progress & Workflow */}
          <div className="xl:col-span-2 space-y-8">
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">Current Cycle Workflow</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Status: {displayData.cycleStatus.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button className="flex items-center font-bold gap-2 text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl px-4 py-2 transition-all">
                    <Lock className="w-3 h-3" />
                    Lock Cycle
                  </button>
                </div>
              </div>

              {/* Stepper Component */}
              <div className="relative flex items-start justify-between">
                {/* Connector Line */}
                <div className="absolute top-5 left-10 right-10 h-0.5 bg-slate-100 z-0" />
                <div 
                  className="absolute top-5 left-10 h-0.5 bg-indigo-500 z-0 transition-all duration-1000" 
                  style={{ width: `${(displayData.currentStep - 1) * 16.6}%` }} 
                />

                {timelineSteps.map((step) => (
                  <div key={step.id} className="relative z-10 flex flex-col items-center group flex-1">
                    <StepIcon status={step.id < displayData.currentStep ? 'completed' : step.id === displayData.currentStep ? 'active' : 'pending'} />
                    <p className={`mt-4 text-[10px] font-black uppercase tracking-widest text-center px-1 transition-colors ${
                      step.id <= displayData.currentStep ? 'text-slate-900' : 'text-slate-300'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Module Navigation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ModuleCard 
                title="Salary Structure" 
                desc="Manage components, grades & salary slabs." 
                icon={<Calculator className="w-6 h-6 text-indigo-600" />}
                onClick={() => router.push(`/${tenant}/admin/operations/payrollmanagement/salarystructure`)}
              />
              <ModuleCard 
                title="Processing Center" 
                desc="Execute & review current cycle payouts." 
                icon={<RefreshCw className="w-6 h-6 text-emerald-600" />}
                onClick={() => router.push(`/${tenant}/admin/operations/payrollmanagement/payrollprocessing`)}
              />
              <ModuleCard 
                title="Payroll History" 
                desc="Archived cycles, reports & historical data." 
                icon={<History className="w-6 h-6 text-amber-600" />}
                onClick={() => router.push(`/${tenant}/admin/operations/payrollmanagement/payrollhistory`)}
              />
            </div>
          </div>

          {/* Right: Alerts & Real-time Anomalies */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Anomalies</h3>
                </div>
                <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-3 py-1 rounded-full">{displayData.alerts.length}</span>
              </div>

              <div className="space-y-4">
                {displayData.alerts.map((alert) => (
                  <div key={alert.id} className="group p-4 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                        alert.type === 'error' ? 'bg-rose-500' : alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-800">{alert.title}</p>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">{alert.desc}</p>
                        <div className="flex items-center gap-2 mt-2">
                           <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{alert.category}</span>
                           <ArrowUpRight className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full py-4 text-[10px] font-black text-slate-400 bg-slate-50 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all uppercase tracking-widest border border-dashed border-slate-200">
                View All Verification Required
              </button>
            </motion.div>

            {/* Quick Config */}
            <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              <div className="relative z-10 space-y-6">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black">System Config</h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">
                    Manage payroll dates, tax slabs, and statutory contribution percentages.
                  </p>
                </div>
                <button 
                  onClick={() => router.push(`/${tenant}/admin/operations/payrollmanagement/payrollsystemconfig`)}
                  className="w-full py-3 text-xs font-black bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/20"
                >
                  Configure Rules
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, icon, trend, subtext, color }) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
  };

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }}}
      className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors[color]}`}>
          {icon}
        </div>
        <div className="text-right">
          <span className={`text-xs font-black ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend}
          </span>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{subtext}</p>
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-2xl font-black text-slate-900">{value}</h3>
    </motion.div>
  );
}

function ModuleCard({ title, desc, icon, onClick }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer group"
    >
      <div className="w-14 h-14 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-indigo-50 transition-colors">
        {icon}
      </div>
      <h4 className="text-sm font-black text-slate-900 mb-2">{title}</h4>
      <p className="text-xs text-slate-400 leading-relaxed font-medium">{desc}</p>
      <div className="mt-6 flex items-center gap-2 text-indigo-600">
        <span className="text-[10px] font-black uppercase tracking-widest">Open Module</span>
        <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
}

function StepIcon({ status }) {
  if (status === "completed") {
    return (
      <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
        <CheckCircle2 className="w-5 h-5 text-white" />
      </div>
    );
  }
  if (status === "active") {
    return (
      <div className="w-10 h-10 rounded-2xl border-4 border-indigo-600 bg-white flex items-center justify-center shadow-xl shadow-indigo-100 group-hover:scale-110 transition-transform">
        <div className="w-3 h-3 rounded-full bg-indigo-600 animate-pulse" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-2xl border-2 border-slate-100 bg-white flex items-center justify-center text-slate-200 group-hover:border-slate-300 transition-colors">
      <div className="w-2 h-2 rounded-full bg-slate-100" />
    </div>
  );
}