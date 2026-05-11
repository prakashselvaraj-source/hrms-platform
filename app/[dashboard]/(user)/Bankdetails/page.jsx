"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import {
  Landmark,
  UserCircle,
  Wallet,
  CheckCircle2,
  CreditCard,
  ArrowLeft,
  ShieldCheck,
  Lock,
  ExternalLink,
  ChevronRight,
  Info,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getBankDetails } from "@/services/payrollService";

export default function BankDetailsPage() {
  const router = useRouter();
  const tenant = useTenant();
  const [loading, setLoading] = useState(true);
  const [bankData, setBankData] = useState(null);
  const [selected, setSelected] = useState("direct");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!tenant) return;
    const fetchBankData = async () => {
      try {
        const res = await getBankDetails(tenant);
        setBankData(res.data);
        if (res.data?.disbursementPreference) {
          setSelected(res.data.disbursementPreference.toLowerCase());
        }
      } catch (err) {
        console.error("Failed to fetch bank details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBankData();
  }, [tenant]);

  // Mock data as fallback for UI demonstration if backend is empty
  const displayData = bankData || {
    bankName: "HDFC Bank",
    accountNumber: "•••• •••• 4201",
    ifscCode: "HDFC0001242",
    branchName: "Mumbai Central, Main St.",
    accountType: "Personal Savings",
    panNumber: "ABCDE1234F",
    kycStatus: "Verified",
    isPrimary: true,
    isVerified: true
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium font-sans">Accessing secure vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 lg:p-12 font-sans text-slate-900">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest mb-4 group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Back to Payroll
            </button>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Personal Bank Details
            </h1>
            <p className="text-slate-500 text-sm">
              Securely manage your salary disbursement accounts and tax identifiers.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-[120px]">
              <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Security Status</p>
              <p className="text-xs font-bold text-emerald-600">
                {displayData.kycStatus === "Verified" ? "Compliance Verified" : "Verification Pending"}
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <motion.div variants={itemVariants} className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
              <div className="w-20 h-20 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                <Lock className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black">End-to-End Encryption</h2>
                <p className="text-indigo-100 text-sm max-w-md leading-relaxed">
                  Your banking information is protected by industry-standard AES-256 encryption. Our payroll team never sees your full account numbers.
                </p>
              </div>
            </div>
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg active:scale-95 whitespace-nowrap">
              Learn More About Security
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bank Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 sm:p-10">
                <div className="flex items-start justify-between mb-10">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                      <Landmark className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-slate-900">{displayData.bankName}</h3>
                        {displayData.isPrimary && (
                          <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white px-3 py-1 rounded-full shadow-sm shadow-emerald-100">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mt-1 flex items-center gap-1.5">
                        <CheckCircle2 className={`w-4 h-4 ${displayData.isVerified ? "text-emerald-500" : "text-slate-300"}`} />
                        {displayData.isVerified ? "Account Verified" : "Verification In Progress"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
                  >
                    {isEditing ? "Cancel" : "Request Update"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <DetailField label="Account Number" value={displayData.accountNumber} secure />
                  <DetailField label="IFSC Code" value={displayData.ifscCode} />
                  <DetailField label="Branch Name" value={displayData.branchName} />
                  <DetailField label="Account Type" value={displayData.accountType} />
                </div>
              </div>

              <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
                <Info className="w-4 h-4 text-slate-400" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Next salary payout is scheduled to this account
                </p>
              </div>
            </motion.div>

            {/* Disbursement Preferences */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Disbursement Preference</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PreferenceCard
                  id="direct"
                  title="Direct Deposit"
                  description="Primary method. Funds arrive within 24 hours of payroll processing."
                  icon={<Wallet className="w-6 h-6" />}
                  active={selected === "direct"}
                  onClick={() => setSelected("direct")}
                />
                <PreferenceCard
                  id="wallet"
                  title="Digital Wallet"
                  description="Secondary method. Link your preferred digital wallet for instant access."
                  icon={<CreditCard className="w-6 h-6" />}
                  active={selected === "wallet"}
                  onClick={() => setSelected("wallet")}
                />
              </div>
            </motion.div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Tax Info Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 space-y-8">
              <div className="flex items-center gap-3">
                <UserCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tax Information</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">PAN Card Number</p>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex items-center justify-between">
                    <p className="text-sm font-black text-slate-900 tracking-widest uppercase">{displayData.panNumber}</p>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Compliance Status</p>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <p className="text-xs font-black text-emerald-700">{displayData.kycStatus}</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 text-[10px] font-black text-slate-400 bg-slate-50 rounded-2xl hover:text-slate-600 hover:bg-slate-100 transition-all uppercase tracking-widest">
                Download Tax Forms
              </button>
            </motion.div>

            {/* Support/FAQ */}
            <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-6 shadow-xl shadow-slate-200">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black">Changing Accounts?</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  For security reasons, bank account updates require HR approval and may take up to 2 billing cycles to take effect.
                </p>
              </div>
              <button className="w-full py-3 text-xs font-bold border border-white/20 rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                View Policy <ExternalLink className="w-3 h-3" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Footer Actions */}
        <motion.div variants={itemVariants} className="flex justify-end pt-4">
          <button className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-sm shadow-2xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center gap-3 group">
            Save Disbursement Preferences
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function DetailField({ label, value, secure }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">{label}</p>
      <p className={`text-sm font-black text-slate-900 bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-4 ${secure ? "tracking-widest" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function PreferenceCard({ title, description, icon, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 relative group ${active
          ? "border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-100/50"
          : "border-slate-100 bg-white hover:border-indigo-200"
        }`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-colors ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"
        }`}>
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className={`font-black text-sm ${active ? "text-slate-900" : "text-slate-600"}`}>{title}</h4>
        <p className="text-[10px] font-bold text-slate-400 leading-relaxed">{description}</p>
      </div>

      {active && (
        <div className="absolute top-6 right-6">
          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
        </div>
      )}
    </div>
  );
}
