"use client";

import { useState, useEffect } from "react";
import {
  User, Building2, Phone, Mail,
  Camera, Save, ShieldCheck, Briefcase,
  Globe, CheckCircle2, Edit3, Lock,
  ChevronRight, AlertCircle, KeyRound,
  Shield, MapPin, BadgeCheck
} from "lucide-react";
import { getAdminProfile, updateAdminProfile } from "@/services/adminService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// ─── Field Component ──────────────────────────────────────────────────────────
function Field({ label, value, onChange, disabled, locked, icon: Icon, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div className="relative group">
        {Icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Icon size={16} />
          </span>
        )}
        <input
          type={type}
          disabled={disabled || locked}
          value={value}
          onChange={onChange}
          className={`
            w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3 rounded-xl text-sm font-semibold
            border transition-all duration-300 outline-none
            ${locked
              ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
              : disabled
                ? "bg-slate-50 border-transparent text-slate-700 cursor-default"
                : "bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 shadow-sm"
            }
          `}
        />
        {locked && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
            <Lock size={14} />
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, subtitle, icon: Icon, children }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="px-8 py-8">{children}</div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", mobileNumber: "",
    designation: "", photoUrl: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) { setLoading(false); return; }
        const res = await getAdminProfile(email);
        const data = res.data;
        setProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          mobileNumber: data.mobileNumber || "",
          designation: data.designation || "",
          photoUrl: data.photoUrl || ""
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const field = (key) => ({
    value: formData[key],
    onChange: (e) => setFormData({ ...formData, [key]: e.target.value }),
    disabled: !editMode
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {
        ...profile,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobileNumber: formData.mobileNumber,
        designation: formData.designation,
        photoUrl: formData.photoUrl
      };
      await updateAdminProfile(updateData);
      setProfile(updateData);
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      mobileNumber: profile.mobileNumber || "",
      designation: profile.designation || "",
      photoUrl: profile.photoUrl || ""
    });
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Refining your profile view...</p>
      </div>
    );
  }

  const initials = `${formData.firstName[0] || ""}${formData.lastName[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
              Profile <ChevronRight size={12} /> Personal Details
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {editMode ? (
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3"
                >
                  <button
                    onClick={handleCancel}
                    className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    Discard
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 disabled:opacity-70"
                  >
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                    {saving ? "Saving..." : "Apply Changes"}
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Edit3 size={16} className="text-indigo-600" />
                  Edit Profile
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── Sidebar: Identity ── */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center relative overflow-hidden">
              {/* Background Decor */}
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-indigo-600 to-violet-600" />
              
              <div className="relative pt-6 flex flex-col items-center">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-3xl bg-white p-1 shadow-2xl">
                    <div className="w-full h-full rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center overflow-hidden">
                      {formData.photoUrl ? (
                        <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-3xl font-black text-indigo-600 tracking-tighter">{initials}</span>
                      )}
                    </div>
                  </div>
                  {editMode && (
                    <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform cursor-pointer">
                      <Camera size={18} />
                    </button>
                  )}
                </div>

                <div className="mt-6">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                    {formData.firstName} {formData.lastName}
                  </h2>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mt-3 bg-indigo-50 px-3 py-1.5 rounded-full inline-block">
                    {formData.designation || "Executive Manager"}
                  </p>
                </div>

                <div className="w-full mt-8 pt-8 border-t border-slate-50 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Access Role</span>
                    <span className="text-slate-900 font-bold flex items-center gap-1.5 text-xs">
                      <ShieldCheck size={14} className="text-indigo-600" />
                      Super Administrator
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">Account Status</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5 text-xs">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Verified Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
               <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{profile?.user?.email}</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                    <p className="text-sm font-bold text-slate-700">{formData.mobileNumber || "Not Linked"}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="lg:col-span-8 space-y-6">
            
            <SectionCard 
              title="Personal Details" 
              subtitle="Update your basic information and public profile identity." 
              icon={User}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="First Name" icon={User} {...field("firstName")} />
                <Field label="Last Name" icon={User} {...field("lastName")} />
                <Field label="Professional Title" icon={Briefcase} {...field("designation")} />
                <Field label="Mobile Contact" icon={Phone} {...field("mobileNumber")} type="tel" />
                <div className="md:col-span-2">
                   <Field label="Profile Image URL" icon={Globe} {...field("photoUrl")} />
                </div>
              </div>
            </SectionCard>

            <SectionCard 
              title="Security & Protection" 
              subtitle="Manage your authentication preferences and account safety." 
              icon={Shield}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                      <KeyRound size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Account Password</p>
                      <p className="text-xs text-slate-500 mt-0.5">Last updated 2 months ago</p>
                    </div>
                  </div>
                  <button className="px-5 py-2 text-xs font-bold text-indigo-600 bg-white border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-all">
                    Change Password
                  </button>
                </div>

                <div className="flex items-center justify-between p-5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/50 rounded-xl flex items-center justify-center text-white">
                      <BadgeCheck size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">2-Step Verification</p>
                      <p className="text-xs text-indigo-100 mt-0.5 opacity-80">Enable extra layer of security</p>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-indigo-400 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Notification Banner */}
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-3xl flex gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-amber-900">Information Privacy</p>
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  Your personal data is encrypted and used only for organizational identification. 
                  We never share your contact details with third-party vendors.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}