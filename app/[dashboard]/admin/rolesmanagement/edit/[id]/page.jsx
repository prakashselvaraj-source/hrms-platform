"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Shield, Users, Lock, Save, Loader2 } from "lucide-react";
import { getRoleById, updateRole } from "@/services/roleService";
import { useTenant } from "@/hooks/useTenant";

const ACCESS_LEVELS = [
  { id: "FULL", name: "Full Access", color: "bg-blue-500", desc: "Complete system control" },
  { id: "HIGH", name: "High Access", color: "bg-orange-500", desc: "Sensitive data management" },
  { id: "MID", name: "Mid Access", color: "bg-green-500", desc: "Team & Project management" },
  { id: "LOW", name: "Low Access", color: "bg-gray-500", desc: "Basic employee access" },
];

const BADGE_COLORS = {
  FULL: "bg-blue-500 text-white",
  HIGH: "bg-orange-400 text-white",
  MID: "bg-green-500 text-white",
  LOW: "bg-gray-400 text-white",
};

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = useTenant();
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("mid");
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
        alert("Failed to load role details.");
      } finally {
        setFetching(false);
      }
    };
    fetchRole();
  }, [params.id, tenantId]);

  const validate = () => {
    const newErrors = {};
    if (!roleName.trim()) newErrors.roleName = "Role name is required.";
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
      alert("Failed to update role.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 text-[#4A45B6] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb / Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#4A45B6] transition-colors mb-6 group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Roles
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[#4A45B6]/10 rounded-lg">
              <Shield className="text-[#4A45B6]" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-[#1E293B]">Edit Role</h1>
          </div>
          <p className="text-[#64748B] text-sm">
            Modify the role identity and access level for your organization.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

            {/* Role Name */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Role Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Finance Manager"
                  className={`w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/20 transition-all ${errors.roleName ? "border-red-400" : "border-[#E2E8F0] focus:border-[#4A45B6]"
                    }`}
                />
              </div>
              {errors.roleName && (
                <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.roleName}</p>
              )}
            </div>

            {/* Access Level Selection */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-3">
                Access Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACCESS_LEVELS.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setSelectedLevel(level.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${selectedLevel === level.id
                      ? "border-[#4A45B6] bg-[#4A45B6]/5 ring-1 ring-[#4A45B6]"
                      : "border-[#E2E8F0] hover:border-[#CBD5E1] bg-white"
                      }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${level.color}`} />
                    <div>
                      <p className="text-sm font-medium text-[#1E293B]">{level.name}</p>
                      <p className="text-[11px] text-[#64748B]">{level.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the responsibilities of this role..."
                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm focus:outline-none focus:border-[#4A45B6] focus:ring-2 focus:ring-[#4A45B6]/20 transition-all resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 border border-[#E2E8F0] text-[#64748B] font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] flex items-center justify-center gap-2 bg-[#4A45B6] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#3D389E] transition-all shadow-lg shadow-[#4A45B6]/20 disabled:opacity-70 text-sm"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    Update Role
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
          <Lock className="text-blue-500 shrink-0" size={20} />
          <p className="text-xs text-blue-700 leading-relaxed">
            Note: Updating the role's identity does not reset its permissions. You can still modify module access
            from the main Roles dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
