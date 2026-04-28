"use client";


import { useState } from "react";


const roles = [
  {
    id: 1,
    name: "Master Admin",
    users: 3,
    badge: "Full",
    badgeColor: "bg-blue-500 text-white",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-blue-500" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: 2,
    name: "HR Admin",
    users: 5,
    badge: "High",
    badgeColor: "bg-orange-400 text-white",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-orange-400" stroke="currentColor" strokeWidth={1.8}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a4 4 0 018 0v2" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Manager",
    users: 9,
    badge: "Mid",
    badgeColor: "bg-green-500 text-white",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-green-500" stroke="currentColor" strokeWidth={1.8}>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    id: 4,
    name: "Staff (Employee)",
    users: 49,
    badge: "Low",
    badgeColor: "bg-gray-400 text-white",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#94A3B8]" stroke="currentColor" strokeWidth={1.8}>
        <path d="M17 21v-2a4 4 0 00-8 0v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];


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


export default function RolesPage() {
  const [activeRole, setActiveRole] = useState(1);
  const [permissions, setPermissions] = useState(initialPermissions);


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
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1E293B]">Roles &amp; Permissions</h1>
          <p className="text-sm text-[#64748B] mt-0.5">Define access levels for each role in the system</p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#4A45B6] transition-colors text-white text-sm font-medium px-4 py-2 rounded-md shadow">
          <span className="text-base leading-none">+</span> Create Role
        </button>
      </div>


      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* LEFT: Role List */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm pt-4">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest ml-3 mb-3">Roles ({roles.length})</p>
            <ul className="space-y-2">
              {roles.map((role) => (
                <li
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${activeRole === role.id
                    ? "bg-[#2563EB0D] border-l-4 border-[#2563EB] "
                    : "hover:bg-gray-50"
                    }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    {role.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1E293B] truncate">{role.name}</p>
                    <p className="text-xs text-[#94A3B8]">{role.users} users</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${role.badgeColor}`}>
                    {role.badge}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* RIGHT: Permissions Table */}
        <div className="flex-1 bg-[#FFFFFF] rounded-2xl shadow-sm p-5 overflow-x-auto">
          {/* Table Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#1E293B]">Master Admin – Permissions</h2>
              <p className="text-xs text-[#94A3B8] mt-0.5">Full system access • Modify with caution</p>
            </div>
            <button className="bg-[#000000] transition-colors text-white text-sm font-medium px-3 py-2 rounded-md shadow-sm">
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
    </div>
  );
}


