"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Shield, Users, Lock, Save, Loader2, Info, ShieldCheck, Unlock } from "lucide-react";
import { getRoleById, updateRole } from "@/services/roleService";
import { useTenant } from "@/hooks/useTenant";

const ACCESS_LEVELS = [
  { id: "FULL", name: "Full Access", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", icon: ShieldCheck, desc: "Complete system control" },
  { id: "HIGH", name: "High Access", color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", icon: Shield, desc: "Sensitive data management" },
  { id: "MID", name: "Mid Access", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", icon: Lock, desc: "Team & Project management" },
  { id: "LOW", name: "Low Access", color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-100", icon: Unlock, desc: "Basic employee access" },
];

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = useTenant();
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("MID");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (!params.id || !tenantId) return;
        const response = await getRoleById(params.id, tenantId);
        const role = response.data;
        setRoleName(role.name || "");
        setDescription(role.description || "");
        setSelectedLevel(role.accessLevel || "MID");
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchRole();
  }, [params.id, tenantId]);

  const validate = () => {
    const newErrors = {};
    if (!roleName.trim()) newErrors.roleName = "Role identity is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: roleName,
        description: description,
        accessLevel: selectedLevel
      };
      await updateRole(params.id, payload, tenantId);
      router.back();
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Secure Records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] pb-20">
      <div className="max-w-[800px] mx-auto px-4 sm:px-8 py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
            <span>Operations</span>
            <ChevronRight size={12} className="opacity-40" />
            <span className="hover:text-indigo-600 cursor-pointer" onClick={() => router.back()}>Roles Hub</span>
            <ChevronRight size={12} className="opacity-40" />
            <span className="text-indigo-600">Edit Entity</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Modify Protocol</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 opacity-70">Adjusting functional access identity</p>
        </div>

        {/* Main Interface Module - Compact Glass */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white shadow-2xl shadow-slate-200/20 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Role Identity Field */}
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Users size={12} className="text-indigo-600" /> Role Identity <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="e.g. Finance Operations Hub"
                className={`w-full px-5 py-3.5 bg-white/60 border rounded-xl text-[13px] font-bold text-slate-700 focus:outline-none transition-all shadow-inner ${errors.roleName ? "border-rose-300" : "border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5"}`}
              />
              {errors.roleName && (
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide mt-1">{errors.roleName}</p>
              )}
            </div>

            {/* Access Protocol Selection - High Density Grid */}
            <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck size={12} className="text-indigo-600" /> Access Protocol
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ACCESS_LEVELS.map((level) => {
                  const Icon = level.icon;
                  const isActive = selectedLevel === level.id;
                  
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setSelectedLevel(level.id)}
                      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group ${isActive 
                        ? "bg-white border-indigo-600 shadow-xl shadow-indigo-50 ring-4 ring-indigo-600/5" 
                        : "bg-white/60 border-slate-100 hover:border-indigo-200 hover:bg-white"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isActive ? level.bg + " " + level.color : "bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600"}`}>
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[13px] font-black tracking-tight ${isActive ? "text-slate-900" : "text-slate-600"}`}>{level.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-tight mt-0.5">{level.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Functional Description */}
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Info size={12} className="text-indigo-600" /> Operational Context
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the functional responsibilities of this unit..."
                className="w-full px-5 py-3.5 bg-white/60 border border-slate-200 rounded-xl text-[13px] font-bold text-slate-700 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all resize-none shadow-inner"
              />
            </div>

            {/* Action Matrix */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3.5 bg-white border border-slate-200 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-95"
              >
                Cancel Protocol
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] flex items-center justify-center gap-2 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Save size={16} /> Update Protocol
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Intelligence Note */}
        <div className="mt-8 p-6 bg-indigo-50/50 backdrop-blur-sm border border-indigo-100 rounded-2xl flex gap-4">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
            <Lock size={14} />
          </div>
          <p className="text-[11px] text-indigo-900 font-medium leading-relaxed">
            <span className="font-black uppercase tracking-widest block mb-1">Consistency Check</span>
            Modifying the role's identity does not reset its surgical permissions. You can still calibrate module access from the primary Roles Hub.
          </p>
        </div>
      </div>
    </div>
  );
}
