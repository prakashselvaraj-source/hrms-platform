"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import { 
  Download, 
  FileText, 
  Banknote, 
  Building2, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck, 
  ChevronRight,
  ExternalLink,
  Printer,
  Eye,
  Loader2,
  Calendar,
  DollarSign,
  PieChart,
  ArrowDownCircle,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getPayrollOverview, getPayslips, seedPayrollData } from "@/services/payrollService";

export default function PayrollPage() {
  const router = useRouter();
  const tenant = useTenant();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [payslips, setPayslips] = useState([]);
  const [activePayslip, setActivePayslip] = useState(null);

  useEffect(() => {
    if (!tenant) return;
    const fetchData = async () => {
      try {
        const [overviewRes, payslipsRes] = await Promise.allSettled([
          getPayrollOverview(tenant),
          getPayslips(tenant, { size: 5 })
        ]);

        if (overviewRes.status === "fulfilled") setOverview(overviewRes.value.data);
        if (payslipsRes.status === "fulfilled") {
          const data = payslipsRes.value.data;
          const slips = Array.isArray(data) ? data : data?.content || data?.payslips || [];
          setPayslips(slips);
          if (slips.length > 0) setActivePayslip(slips[0]);
        }
      } catch (err) {
        console.error("Failed to load payroll data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tenant]);

  // Fallback / Mock Data if backend returns empty (for demonstration)
  const displayOverview = overview || {
    netTakeHome: 8450,
    ytdEarnings: 98400,
    ytdTax: 12500,
    nextPayDay: "Mar 31, 2026",
    bankName: "Chase Bank",
    accountLastFour: "4201"
  };

  const displayPayslips = payslips.length > 0 ? payslips : [
    { id: 1, month: "March 2026", period: "Mar 01 - Mar 31", amount: 8450, status: "Processed", date: "2026-03-31" },
    { id: 2, month: "February 2026", period: "Feb 01 - Feb 28", amount: 8450, status: "Processed", date: "2026-02-28" },
    { id: 3, month: "January 2026", period: "Jan 01 - Jan 31", amount: 8200, status: "Processed", date: "2026-01-31" },
  ];

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

  if (loading && !overview) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Preparing your financial overview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-10 font-sans text-slate-900">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Payroll & Earnings
            </h1>
            <p className="text-slate-500 text-lg max-w-xl">
              Track your salary, view payslips, and manage your financial compliance.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
            <button 
              onClick={async () => {
                try {
                  await seedPayrollData(tenant);
                  window.location.reload();
                } catch (err) {
                  alert("Failed to seed data: " + err.message);
                }
              }}
              className="flex items-center gap-2 bg-indigo-50 text-indigo-600 border border-indigo-100 px-5 py-3 rounded-2xl font-bold hover:bg-indigo-100 transition-all active:scale-95"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Seed Data</span>
            </button>
            <button 
              onClick={() => router.push(`/${tenant}/Bankdetails`)}
              className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <Building2 className="w-4 h-4" />
              <span>Bank Details</span>
            </button>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95">
              <Printer className="w-4 h-4" />
              <span>Tax Summary</span>
            </button>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <OverviewCard 
            title="Net Salary" 
            value={`$${displayOverview.netTakeHome.toLocaleString()}`} 
            subText="Current Month"
            icon={<Banknote className="w-6 h-6 text-emerald-600" />}
            color="bg-emerald-50"
            trend="+2.4% vs last month"
          />
          <OverviewCard 
            title="YTD Earnings" 
            value={`$${displayOverview.ytdEarnings.toLocaleString()}`} 
            subText="Total for 2026"
            icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
            color="bg-indigo-50"
          />
          <OverviewCard 
            title="Taxes Paid" 
            value={`$${displayOverview.ytdTax.toLocaleString()}`} 
            subText="Year-to-date"
            icon={<ShieldCheck className="w-6 h-6 text-rose-600" />}
            color="bg-rose-50"
          />
          <OverviewCard 
            title="Next Payday" 
            value={displayOverview.nextPayDay} 
            subText="Scheduled"
            icon={<Calendar className="w-6 h-6 text-amber-600" />}
            color="bg-amber-50"
          />
        </motion.div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Payslips */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-black flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Recent Payslips
                </h2>
                <button className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">
                  View All History
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  {displayPayslips.map((slip) => (
                    <div 
                      key={slip.id}
                      onClick={() => setActivePayslip(slip)}
                      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                        activePayslip?.id === slip.id 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100" 
                          : "bg-white border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          activePayslip?.id === slip.id ? "bg-white/20" : "bg-slate-50 text-slate-400 group-hover:bg-white"
                        }`}>
                          <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`text-sm font-black ${activePayslip?.id === slip.id ? "text-white" : "text-slate-900"}`}>
                            {slip.month}
                          </p>
                          <p className={`text-[10px] font-bold ${activePayslip?.id === slip.id ? "text-indigo-100" : "text-slate-400"}`}>
                            {slip.period}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                          <p className={`text-sm font-black ${activePayslip?.id === slip.id ? "text-white" : "text-slate-900"}`}>
                            ${slip.amount.toLocaleString()}.00
                          </p>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${
                            activePayslip?.id === slip.id ? "text-indigo-100" : "text-emerald-500"
                          }`}>
                            {slip.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className={`p-2 rounded-lg transition-all ${
                            activePayslip?.id === slip.id ? "bg-white/20 hover:bg-white/30" : "bg-slate-50 text-slate-400 hover:text-indigo-600"
                          }`}>
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className={`p-2 rounded-lg transition-all ${
                            activePayslip?.id === slip.id ? "bg-white text-indigo-600" : "bg-slate-50 text-slate-400 hover:text-indigo-600"
                          }`}>
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Breakdown based on active payslip */}
            <AnimatePresence mode="wait">
              {activePayslip && (
                <motion.div 
                  key={activePayslip.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">Salary Breakdown</h3>
                        <p className="text-slate-500 text-sm mt-1">Detailed structural analysis for {activePayslip.month}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gross Total</p>
                        <p className="text-2xl font-black text-indigo-600">$10,250.00</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Earnings */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Earnings & Allowances</h4>
                        </div>
                        <div className="space-y-4">
                          <BreakdownItem label="Basic Pay" value="$6,500.00" />
                          <BreakdownItem label="House Rent Allowance (HRA)" value="$2,100.00" />
                          <BreakdownItem label="Special Allowance" value="$850.00" />
                          <BreakdownItem label="Performance Bonus" value="$800.00" highlight />
                        </div>
                      </div>

                      {/* Deductions */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                          <ArrowDownCircle className="w-4 h-4 text-rose-500" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Statutory Deductions</h4>
                        </div>
                        <div className="space-y-4">
                          <BreakdownItem label="Provident Fund (PF)" value="-$780.00" negative />
                          <BreakdownItem label="Income Tax (TDS)" value="-$950.00" negative />
                          <BreakdownItem label="Professional Tax" value="-$70.00" negative />
                          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-sm font-black text-slate-900">Total Deductions</span>
                            <span className="text-sm font-black text-rose-500">-$1,800.00</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Net Take Home Banner */}
                    <div className="mt-10 p-6 bg-emerald-600 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-100">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                          <Banknote className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Net Take-Home Pay</p>
                          <p className="text-3xl font-black">${activePayslip.amount.toLocaleString()}.00</p>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-xs font-medium opacity-90 leading-relaxed max-w-[240px]">
                          Payment was successfully credited to your **{displayOverview.bankName}** account (••••{displayOverview.accountLastFour}) on **{new Date(activePayslip.date).toLocaleDateString()}**.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Payment Method Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 space-y-6">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                Payment Method
              </h3>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                  <Building2 className="w-6 h-6 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">{displayOverview.bankName}</p>
                  <p className="text-[10px] font-bold text-slate-400">Checking ••••{displayOverview.accountLastFour}</p>
                </div>
              </div>
              <button 
                onClick={() => router.push(`/${tenant}/Bankdetails`)}
                className="w-full py-4 text-xs font-black text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-all"
              >
                Manage Payment Methods
              </button>
            </div>

            {/* Savings & Retirement */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 relative overflow-hidden shadow-xl shadow-slate-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-400" />
                Retirement Fund
              </h3>
              <div className="space-y-1">
                <p className="text-3xl font-black">$12,450.20</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employer & Employee PF Contribution</p>
              </div>
              <div className="pt-4 space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Monthly Contribution</span>
                  <span>$1,250.00</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-indigo-500" />
                </div>
              </div>
              <button className="w-full py-3 text-xs font-bold border border-white/20 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                View PF Statement <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Support Link */}
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Salary Discrepancy?</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  If you notice any issues with your payment, please raise a ticket with HR immediately.
                </p>
              </div>
              <button 
                onClick={() => router.push(`/${tenant}/support`)}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Contact Payroll Support
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function OverviewCard({ title, value, subText, icon, color, trend }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4 transition-transform hover:-translate-y-1 group">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-slate-400 transition-colors" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{title}</p>
        <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-[10px] font-bold text-slate-500">{subText}</p>
          {trend && (
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function BreakdownItem({ label, value, negative, highlight }) {
  return (
    <div className="flex items-center justify-between group">
      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
      <span className={`text-sm font-black ${
        negative ? "text-rose-500" : highlight ? "text-indigo-600" : "text-slate-900"
      }`}>
        {value}
      </span>
    </div>
  );
}
