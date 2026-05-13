"use client";


import { getAllRoles, getRoleById, updateRole, deleteRole } from "@/services/roleService";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Edit2, Trash2, Shield } from "lucide-react";
import { useTenant } from "@/hooks/useTenant";

// const roles = [
//   {
//     id: 1,
//     name: "Master Admin",
//     users: 3,
//     badge: "Full",
//     badgeColor: "bg-blue-500 text-white",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-blue-500" stroke="currentColor" strokeWidth={1.8}>
//         <circle cx="12" cy="8" r="4" />
//         <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
//       </svg>
//     ),
//   },
//   {
//     id: 2,
//     name: "HR Admin",
//     users: 5,
//     badge: "High",
//     badgeColor: "bg-orange-400 text-white",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-orange-400" stroke="currentColor" strokeWidth={1.8}>
//         <rect x="3" y="7" width="18" height="13" rx="2" />
//         <path d="M8 7V5a4 4 0 018 0v2" />
//       </svg>
//     ),
//   },
//   {
//     id: 3,
//     name: "Manager",
//     users: 9,
//     badge: "Mid",
//     badgeColor: "bg-green-500 text-white",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-green-500" stroke="currentColor" strokeWidth={1.8}>
//         <rect x="2" y="3" width="20" height="14" rx="2" />
//         <path d="M8 21h8M12 17v4" />
//       </svg>
//     ),
//   },
//   {
//     id: 4,
//     name: "Staff (Employee)",
//     users: 49,
//     badge: "Low",
//     badgeColor: "bg-gray-400 text-white",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#94A3B8]" stroke="currentColor" strokeWidth={1.8}>
//         <path d="M17 21v-2a4 4 0 00-8 0v2" />
//         <circle cx="9" cy="7" r="4" />
//         <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
//       </svg>
//     ),
//   },
// ];


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
    label: "Full",
    badge: "bg-[#CFFAFE] text-[#0891B2]",
    iconBg: "bg-amber-50",
    emoji: "👑",
  },
  HIGH: {
    label: "High",
    badge: "bg-[#E0E7FF] text-[#4F46E5]",
    iconBg: "bg-blue-50",
    emoji: "👨‍💼",
  },
  MID: {
    label: "Mid",
    badge: "bg-[#D1FAE5] text-[#059669]",
    iconBg: "bg-teal-50",
    emoji: "📁",
  },
  LOW: {
    label: "Low",
    badge: "bg-[#E2E8F0] text-[#475569]",
    iconBg: "bg-orange-50",
    emoji: "👨",
  },
};

export default function RolesPage() {
  const route = useRouter();
  const params = useParams();
  const [roles, setRoles] = useState();
  const [activeRole, setActiveRole] = useState(1);
  const [permissions, setPermissions] = useState(initialPermissions);

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const tenantId = useTenant();

  // Fetch all roles on load
  useEffect(() => {
    const getRoles = async () => {
      try {
        if (!tenantId) return;
        const response = await getAllRoles(tenantId);
        setRoles(response.data);
        if (response.data?.length > 0 && !activeRole) {
          setActiveRole(response.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    getRoles();
  }, [tenantId]);

  // Fetch specific role details when activeRole changes
  // useEffect(() => {
  //   const fetchRoleDetails = async () => {
  //     try {
  //       if (!activeRole || !tenantId) return;
  //       const response = await getRoleById(activeRole, tenantId);
  //       if (response.data?.permissions) {
  //         setPermissions(response.data.permissions);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching role details:", error);
  //     }
  //   };
  //   fetchRoleDetails();
  // }, [activeRole, tenantId]);

  const handleSaveChanges = async () => {
    try {
      if (!activeRole || !tenantId) return;
      await updateRole(activeRole, { permissions }, tenantId);
      alert("Permissions updated successfully!");
    } catch (error) {
      console.error("Error updating permissions:", error);
      alert("Failed to update permissions.");
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
      setRoles(roles.filter(r => r.id !== roleToDelete.id));
      if (activeRole === roleToDelete.id) {
        setActiveRole(roles.find(r => r.id !== roleToDelete.id)?.id || null);
      }
      setShowDeleteModal(false);
      setRoleToDelete(null);
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Failed to delete role.");
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
    <div className="min-h-screen p-6 bg-gray-50/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Roles & Permissions</h1>
          <p className="text-sm text-[#64748B] mt-0.5 font-medium">Define access levels for each role in the system</p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#4A45B6] transition-all hover:bg-[#3D389E] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-[#4A45B6]/20" onClick={() => { route.push(`/${params.dashboard}/admin/rolesmanagement/createrole`) }}>
          <span className="text-lg leading-none">+</span> Create Role
        </button>
      </div>


      {/* Two-column layout */}
      <div className="flex flex-col gap-6">
        {/* LEFT: Role List */}
        <div className="w-full lg:w-fit shrink-0">
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100">
            <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] ml-4 mt-2 mb-4 p-3">Roles ({roles?.length || 0})</p>
            <ul className="space-y-2">
              {roles?.map((role) => {
                const style = ACCESS_STYLE[role.accessLevel] || ACCESS_STYLE.LOW;
                return (
                  <li
                    key={role.id}
                    onClick={() => setActiveRole(role.id)}
                    className={`flex items-center gap-4 p-4 cursor-pointer transition-all relative group ${activeRole === role.id
                      ? "bg-[#2563EB]/10 border-l-4 border-[#2563EB]"
                      : "hover:bg-gray-50"
                      }`}
                  >


                    <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${style.iconBg} flex items-center justify-center text-2xl shadow-sm`}>
                      {style.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-[#1E293B] truncate">{role.name}</p>
                      <p className="text-xs font-medium text-[#94A3B8] mt-0.5">{role.users || 0} users</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          route.push(`/${params.dashboard}/admin/rolesmanagement/edit/${role.id}`);
                        }}
                        className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => openDeleteModal(e, role)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <span className={`text-[12px] font-bold px-3 py-1 rounded-md ${style.badge}`}>
                      {style.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>


        {/* RIGHT: Permissions Table */}
        <div className="flex-1 bg-[#FFFFFF] rounded-2xl shadow-sm p-5 overflow-x-auto">
          {/* Table Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#1E293B]">
                {activeRoleData?.name || "Select a Role"} – Permissions
              </h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                {activeRoleData?.badge ? `${activeRoleData.badge} access level` : "Define module access"} • Modify with caution
              </p>
            </div>
            <button
              onClick={handleSaveChanges}
              className="bg-[#000000] transition-colors text-white text-sm font-medium px-3 py-2 rounded-md shadow-sm hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>


          {/* Table */}
          <div className="min-w-[560px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="">
                  <th className="text-left text-xs font-semibold text-[#94A3B8] uppercase pb-3 pr-4 w-44">
                    Module
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className="text-center text-xs font-semibold text-[#94A3B8] uppercase pb-3 px-2"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((mod) => (
                  <tr key={mod} className="">
                    <td className="py-3.5 pr-4 text-sm text-[#334155] font-medium">{mod}</td>
                    {columns.map((col) => (
                      <td key={col} className="py-3.5 px-2 text-center">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={permissions[mod]?.[col] ?? false}
                            onChange={() => togglePermission(mod, col)}
                            className="w-[18px] h-[18px] rounded border border-[#CBD5E1] text-[#2563EB] accent-[#2563EB] focus:ring-[#2563EB] focus:ring-offset-0 cursor-pointer transition-all"
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="text-red-500" size={28} />
            </div>

            <h3 className="text-xl font-bold text-[#1E293B] mb-2">Delete Role?</h3>
            <p className="text-sm text-[#64748B] mb-8">
              Are you sure, you want to delete <span className="font-bold text-[#1E293B]">{roleToDelete?.name} </span>?
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-500/20"
              >
                Yes, Delete Role
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-[#64748B] font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


