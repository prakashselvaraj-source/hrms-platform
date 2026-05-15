"use client";

import { getAllRoles, updateRole, deleteRole } from "@/services/roleService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Edit2, Trash2, Shield, ChevronRight, CheckCircle2, Lock, Unlock, ShieldCheck, Loader2, XCircle, CirclePlus } from "lucide-react";
import { useTenant } from "@/hooks/useTenant";

const modules = [
  "Employee Management",
  "Leave Management",
  "Attendance",
  "Policies",
  "Reports",
  "Roles & Permissions",
  "System Settings",
];

const columns = ["View", "Create", "Edit", "Delete", "Approve", "Export"];

const initialPermissions = {
  "Employee Management": { View: true, Create: true, Edit: true, Delete: true, Approve: true, Export: true },
  "Leave Management": { View: true, Create: true, Edit: true, Delete: true, Approve: true, Export: true },
  Attendance: { View: true, Create: true, Edit: true, Delete: true, Approve: true, Export: true },
  Policies: { View: true, Create: true, Edit: true, Delete: false, Approve: false, Export: true },
  Reports: { View: true, Create: false, Edit: false, Delete: false, Approve: false, Export: true },
  "Roles & Permissions": { View: true, Create: true, Edit: true, Delete: true, Approve: false, Export: false },
  "System Settings": { View: true, Create: true, Edit: true, Delete: false, Approve: false, Export: false },
};

const ACCESS_STYLE = {
  FULL: {
    label: "Full Access",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
    iconBg: "bg-emerald-50",
    icon: ShieldCheck,
  },
  HIGH: {
    label: "High Level",
    badge: "bg-indigo-50 text-indigo-600 border-indigo-100",
    iconBg: "bg-indigo-50",
    icon: Shield,
  },
  MID: {
    label: "Mid Level",
    badge: "bg-amber-50 text-amber-600 border-amber-100",
    iconBg: "bg-amber-50",
    icon: Lock,
  },
  LOW: {
    label: "Restricted",
    badge: "bg-slate-50 text-slate-500 border-slate-100",
    iconBg: "bg-slate-50",
    icon: Unlock,
  },
};

export default function RolesPage() {
  const route = useRouter();
  const params = useParams();
  const [roles, setRoles] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const tenantId = useTenant();

  useEffect(() => {
    const getRoles = async () => {
      try {
        if (!tenantId) return;
        setLoading(true);
        const response = await getAllRoles(tenantId);
        setRoles(response.data || []);
        if (response.data?.length > 0) {
          setActiveRole(response.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setLoading(false);
      }
    };
    getRoles();
  }, [tenantId]);

  const handleSaveChanges = async () => {
    try {
      if (!activeRole || !tenantId) return;
      await updateRole(activeRole, { permissions }, tenantId);
      toast.success("Permissions updated successfully!");
    } catch (error) {
      console.error("Error updating permissions:", error);
      toast.error("Failed to update permissions.");
    }
  };

  const openDeleteModal = (e, role) => {
    e.stopPropagation();
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete || !tenantId) return;

    try {
      await deleteRole(roleToDelete.id, tenantId);
      const updatedRoles = roles.filter(r => r.id !== roleToDelete.id);
      setRoles(updatedRoles);
      if (activeRole === roleToDelete.id) {
        setActiveRole(updatedRoles[0]?.id || null);
      }
      setShowDeleteModal(false);
      toast.success("Role deleted successfully");
      setRoleToDelete(null);
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role.");
    }
  };

  const activeRoleData = roles?.find(r => r.id === activeRole);

  const togglePermission = (mod, col) => {
    setPermissions((prev) => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [col]: !prev[mod][col],
      },
    }));
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10">

        {/* Header - Compact Pro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
              <span>Operations</span>
              <ChevronRight size={12} className="opacity-40" />
              <span className="text-indigo-600">Roles Hub</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Access Intelligence</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 opacity-70">Defining cross-functional permission logic</p>
          </div>

          <button
            onClick={() => route.push(`/${params.dashboard}/admin/operations/rolesmanagement/createrole`)}
            className="px-6 py-3 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center gap-2"
          >
            <CirclePlus size={18} /> Create New Role
          </button>
        </div>

        {/* Two-column Interface Module */}
        <div className="flex flex-col xl:flex-row gap-8">

          {/* LEFT: Role Registry - Compact Nexus Navigation */}
          <div className="w-full xl:w-96 shrink-0">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white shadow-2xl shadow-slate-200/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/60 bg-white/40 flex items-center justify-between">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Role Registry</h3>
                <span className="text-[9px] font-black text-indigo-600 bg-white px-2.5 py-1 rounded-full border border-indigo-50 shadow-sm">
                  {roles?.length || 0} Entities
                </span>
              </div>

              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="py-10 text-center flex flex-col items-center gap-3">
                    <Loader2 size={24} className="text-indigo-600 animate-spin" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scanning Protocols...</p>
                  </div>
                ) : (
                  roles.map((role) => {
                    const style = ACCESS_STYLE[role.accessLevel] || ACCESS_STYLE.LOW;
                    const Icon = style.icon;
                    const isActive = activeRole === role.id;

                    return (
                      <div
                        key={role.id}
                        onClick={() => setActiveRole(role.id)}
                        className={`group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border ${isActive
                          ? "bg-white border-indigo-100 shadow-lg shadow-indigo-50"
                          : "bg-transparent border-transparent hover:bg-white/60 hover:border-white"
                          }`}
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${isActive ? style.iconBg + " text-indigo-600 ring-4 ring-indigo-50/50" : "bg-slate-50 text-slate-400"}`}>
                          <Icon size={18} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-bold tracking-tight truncate ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                            {role.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${style.badge}`}>
                              {style.label}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              {role.users || 0} Units
                            </span>
                          </div>
                        </div>

                        <div className={`flex items-center gap-1 transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              route.push(`/${params.dashboard}/admin/operations/rolesmanagement/edit/${role.id}`);
                            }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={(e) => openDeleteModal(e, role)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Permissions Matrix - Compact High Density */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white shadow-2xl shadow-slate-200/20 overflow-hidden">
              <div className="px-8 py-5 border-b border-white/60 bg-white/40 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Access Intelligence Grid</h3>
                  <p className="text-[13px] font-bold text-indigo-600 tracking-tight mt-1">
                    {activeRoleData?.name || "Select Operational Node"} — Logic Calibration
                  </p>
                </div>
                <button
                  onClick={handleSaveChanges}
                  className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  <CheckCircle2 size={14} /> Commit Changes
                </button>
              </div>

              <div className="overflow-x-auto p-4">
                <table className="w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Module Domain</th>
                      {columns.map((col) => (
                        <th key={col} className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((mod) => (
                      <tr key={mod} className="group">
                        <td className="px-6 py-4 bg-white/60 rounded-l-xl border border-r-0 border-white group-hover:border-indigo-100 transition-all shadow-sm">
                          <p className="text-[13px] font-bold text-slate-900 tracking-tight">{mod}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-70">Functional Unit</p>
                        </td>
                        {columns.map((col, idx) => (
                          <td key={col} className={`px-4 py-4 bg-white/60 border-y border-white group-hover:border-indigo-100 transition-all shadow-sm ${idx === columns.length - 1 ? 'rounded-r-xl border-r' : ''}`}>
                            <div className="flex justify-center">
                              <input
                                type="checkbox"
                                checked={permissions[mod]?.[col] ?? false}
                                onChange={() => togglePermission(mod, col)}
                                className="w-5 h-5 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-600 focus:ring-offset-0 cursor-pointer transition-all hover:scale-105"
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Compact Nexus */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl max-w-sm w-full p-10 text-center animate-in zoom-in duration-200 border border-white">
            <div className="w-16 h-16 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 ring-8 ring-rose-50/50">
              <Trash2 className="text-rose-500" size={32} />
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Protocol Termination?</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-10 leading-relaxed">
              Confirming deletion of <span className="text-rose-600">{roleToDelete?.name}</span>. This action is irreversible.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-rose-100 active:scale-95"
              >
                Execute Deletion
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-4 bg-white border border-slate-200 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition-all active:scale-95"
              >
                Abort Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
