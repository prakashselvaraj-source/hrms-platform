"use client";

import { useState } from "react";
import {
  ChevronRight,
  ArrowLeft,
  Building2,
  Hash,
  UserRound,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

const MANAGERS = [
  { id: 1, name: "Aisha Patel" },
  { id: 2, name: "Marcus Webb" },
  { id: 3, name: "Priya Nair" },
  { id: 4, name: "James Caldwell" },
  { id: 5, name: "Sunita Rao" },
];

function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-medium tracking-wide uppercase text-gray-400">
      <span className="text-[#737686] -tracking-tight font-semibold">
        Department
      </span>
      <ChevronRight size={14} className="text-gray-500" />
      <span className="text-[#4A45B6] font-semibold">Department management</span>
    </nav>
  );
}

function PageHeader({ route }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Breadcrumb />
        <h1 className="mt-2 text-2xl font-semibold text-gray-800 tracking-tight">
          Add Department
        </h1>
      </div>
      <button
        onClick={()=>{route.back()}}    
        className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 shadow-sm hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 transition-all duration-150 whitespace-nowrap"
      >
        <ArrowLeft size={15} />
        Back to list
      </button>
    </div>
  );
}

function FieldWrapper({ label, icon: Icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
        {Icon && <Icon size={13} className="text-gray-400" />}
        {label}
      </label>
      {children}
    </div>
  );
}

function TextInput({ placeholder, value, onChange, name }) {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all duration-150 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
    />
  );
}

function ManagerSelect({ value, onChange }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
        <UserRound size={14} className="text-gray-400" />
      </div>
      <select
        name="manager"
        value={value}
        onChange={onChange}
        className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-10 py-2.5 text-sm text-gray-800 outline-none transition-all duration-150 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 cursor-pointer"
      >
        <option value="">Select Manager</option>
        {MANAGERS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <ChevronDown size={14} className="text-gray-400" />
      </div>
    </div>
  );
}

function StatusToggle({ active, onToggle }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5">
      <button
        type="button"
        onClick={onToggle}
        className="flex-shrink-0 transition-transform duration-150 active:scale-95"
        aria-label="Toggle status"
      >
        {active ? (
          <ToggleRight size={26} className="font-medium cursor-pointer   border-[#534AB7] text-[#534AB7]" />
        ) : (
          <ToggleLeft size={26} className="text-gray-300" />
        )}
      </button>
      <span
        className={`text-sm font-medium transition-colors duration-150 ${
          active ? "text-indigo-600" : "text-gray-400"
        }`}
      >
        {active ? "Active" : "Inactive"}
      </span>
      <span
        className={`ml-auto inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
          active
            ? "bg-green-50 text-green-600 border border-green-200"
            : "bg-gray-100 text-gray-400 border border-gray-200"
        }`}
      >
        {active ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}

function FormCard({ children }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
      {children}
    </div>
  );
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-gray-100">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
        <Icon size={16} className="text-indigo-600" />
      </div>
      <h2 className="text-base font-semibold text-gray-700">{title}</h2>
    </div>
  );
}

function FooterActions({ onCancel }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 mt-6">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 shadow-sm hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 transition-all duration-150"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-all duration-150"
      >
        Save Department
      </button>
    </div>
  );
}

export default function AddDepartmentPage() {
  const [form, setForm] = useState({
    departmentName: "",
    departmentCode: "",
    manager: "",
    statusActive: true,
  });

  const route = useRouter();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleToggleStatus() {
    setForm((prev) => ({ ...prev, statusActive: !prev.statusActive }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submitted:", form);
  }


  function handleCancel() {
    setForm({
      departmentName: "",
      departmentCode: "",
      manager: "",
      statusActive: true,
    });
  }

  return (
    <div className="min-h-screen bg-gray-50/60 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {/* Header */}
        <PageHeader route={route} />

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <FormCard>
            <SectionHeader icon={Building2} title="Department Information" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Department Name */}
              <FieldWrapper label="Department Name" icon={Building2}>
                <TextInput
                  name="departmentName"
                  placeholder="e.g. Human Resources"
                  value={form.departmentName}
                  onChange={handleChange}
                />
              </FieldWrapper>

              {/* Department Code */}
              <FieldWrapper label="Department Code" icon={Hash}>
                <TextInput
                  name="departmentCode"
                  placeholder="e.g. HR001"
                  value={form.departmentCode}
                  onChange={handleChange}
                />
              </FieldWrapper>

              {/* Manager */}
              <FieldWrapper label="Manager (Optional)" icon={UserRound}>
                <ManagerSelect
                  value={form.manager}
                  onChange={handleChange}
                />
              </FieldWrapper>

              {/* Status */}
              <FieldWrapper label="Status">
                <StatusToggle
                  active={form.statusActive}
                  onToggle={handleToggleStatus}
                />
              </FieldWrapper>
            </div>

            {/* Footer Buttons */}
            <FooterActions onCancel={handleCancel} />
          </FormCard>
        </form>
      </div>
    </div>
  );
}   