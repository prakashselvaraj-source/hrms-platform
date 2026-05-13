"use client";

import { useState } from "react";
import { X, Upload, Users, Info, CheckCircle2 } from "lucide-react";

const ALL_DEPARTMENTS = [
  "Engineering", "Product", "HR", "Finance", "Marketing", "Operations", "Design", "Sales",
];
const ALL_ROLES = [
  "Developer", "Senior Engineer", "Manager", "Designer", "Analyst", "Director", "QA Engineer",
];
const ALL_EMPLOYEES = [
  { id: 1, name: "Ananya Sharma", avatar: "AS", color: "bg-violet-400" },
  { id: 2, name: "Rahul Verma", avatar: "RV", color: "bg-blue-400" },
  { id: 3, name: "Priya Singh", avatar: "PS", color: "bg-pink-400" },
  { id: 4, name: "Amit Kumar", avatar: "AK", color: "bg-amber-400" },
  { id: 5, name: "Neha Patel", avatar: "NP", color: "bg-emerald-400" },
  { id: 6, name: "Rajesh Gupta", avatar: "RG", color: "bg-red-400" },
];

function TagInput({ label, allOptions, selected, onAdd, onRemove, placeholder }) {
  const [input, setInput] = useState("");
  const suggestions = allOptions.filter(
    (o) => !selected.includes(o) && o.toLowerCase().includes(input.toLowerCase())
  );

  return (

    <div className="border-l-4 rounded-sm border-[#4A45B6] p-4">
      <p className="text-xs font-bold text-[#434655] uppercase tracking-widest mb-3">
        {label}

      </p>
      <div className="flex bg-[#F2F4F6] p-2 rounded-sm flex-wrap gap-2 mb-3">
        {selected.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 bg-[#4A45B6] text-white text-xs font-medium px-2.5 py-1 rounded-full"
          >
            {item}
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="hover:text-violet-900 ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="text-xs text-gray-500 outline-none bg-transparent min-w-[120px] flex-1"
        />
      </div>
      {input && suggestions.length > 0 && (
        <div className="border border-gray-100 rounded-lg shadow-sm overflow-hidden">
          {suggestions.slice(0, 5).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onAdd(s);
                setInput("");
              }}
              className="w-full text-left  px-3 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AssignmentTab({ data, onChange }) {
  const [empSearch, setEmpSearch] = useState("");

  const filteredEmps = ALL_EMPLOYEES.filter(
    (e) =>
      !data.assignedEmployees.includes(e.id) &&
      e.name.toLowerCase().includes(empSearch.toLowerCase())
  );

  function addEmp(id) {
    onChange("assignedEmployees", [...data.assignedEmployees, id]);
    setEmpSearch("");
  }

  function removeEmp(id) {
    onChange(
      "assignedEmployees",
      data.assignedEmployees.filter((e) => e !== id)
    );
  }

  function selectAll() {
    onChange("assignedEmployees", ALL_EMPLOYEES.map((e) => e.id));
  }

  return (
    <div className="space-y-5">
      {/* Departments */}
      <TagInput
        label="Assign to Departments"
        allOptions={ALL_DEPARTMENTS}
        selected={data.departments}
        onAdd={(v) => onChange("departments", [...data.departments, v])}
        onRemove={(v) =>
          onChange("departments", data.departments.filter((d) => d !== v))
        }
        placeholder="Add department..."
      />

      {/* Roles */}
      <TagInput
        label="Assign to Roles"
        allOptions={ALL_ROLES}
        selected={data.roles}
        onAdd={(v) => onChange("roles", [...data.roles, v])}
        onRemove={(v) =>
          onChange("roles", data.roles.filter((r) => r !== v))
        }
        placeholder="Add role..."
      />

      {/* Employees */}
      <div className="border-l-4 rounded-sm border-[#4A45B6] p-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
          Assign to Employees (Individual / Bulk)
        </p>

        {/* Selected employees */}
        <div className="flex flex-wrap gap-2 mb-3">
          {data.assignedEmployees.map((id) => {
            const emp = ALL_EMPLOYEES.find((e) => e.id === id);
            if (!emp) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 bg-[#4A45B6] text-white text-xs font-medium px-2.5 py-1 rounded-full"
              >
                <span
                  className={`w-4 h-4 rounded-full ${emp.color} inline-flex items-center justify-center text-[9px] text-white font-bold`}
                >
                  {emp.avatar[0]}
                </span>
                {emp.name}
                <button
                  type="button"
                  onClick={() => removeEmp(id)}
                  className="hover:text-violet-900 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
          <input
            type="text"
            value={empSearch}
            onChange={(e) => setEmpSearch(e.target.value)}
            placeholder="Search employees..."
            className="text-xs text-gray-500 outline-none bg-transparent min-w-[140px] flex-1"
          />
        </div>

        {/* Employee suggestions */}
        {empSearch && filteredEmps.length > 0 && (
          <div className="border border-gray-100 rounded-lg shadow-sm overflow-hidden mb-3">
            {filteredEmps.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => addEmp(e.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700"
              >
                <span
                  className={`w-6 h-6 rounded-full ${e.color} flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0`}
                >
                  {e.avatar}
                </span>
                {e.name}
              </button>
            ))}
          </div>
        )}

        {/* Bulk actions */}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4A45B6] border border-violet-200 rounded-lg px-3 py-1.5 hover:bg-violet-50"
          >
            <Upload className="w-3.5 h-3.5" />
            Bulk Assign via CSV
          </button>
          <button
            type="button"
            onClick={selectAll}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#4A45B6] hover:underline"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Select All Employees
          </button>

          {data.assignedEmployees.length > 0 && (
            <button
              type="button"
              onClick={() => onChange("assignedEmployees", [])}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-600 ml-auto"
            >
              <X className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}
        </div>

        {data.assignedEmployees.length > 0 && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="bg-[#4A45B6] hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2 rounded-lg"
            >
              Apply Assignments
            </button>
          </div>
        )}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 bg-[#007B71]/10 border border-blue-100 rounded-xl px-4 py-3">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs ">

          Assigning this policy will override any existing attendance rules for the
          selected entities from the next billing cycle.
        </p>
      </div>
    </div>
  );
}
