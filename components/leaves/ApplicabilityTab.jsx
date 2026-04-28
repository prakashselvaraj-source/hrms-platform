"use client";
import { Label, Select, SectionBox } from "./primitives";

function ChipGroup({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onToggle(o)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors
                      ${
                        selected.includes(o)
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"
                      }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

const deptOptions = ["Engineering", "HR", "Finance", "Marketing", "Operations", "Sales"];
const typeOptions = ["Full-time", "Part-time", "Contract", "Intern", "Probation"];
const locOptions = ["Head Office", "Branch - Mumbai", "Branch - Delhi", "Remote"];

const SECTION = "applicabilityRules";

export default function ApplicabilityTab({ leaveData = {}, updateConfig }) {
  const config = leaveData?.config?.[SECTION] ?? {};

  const set = (field, value) => updateConfig(SECTION, field, value);

  const departments = config.departments ?? [];
  const employeeTypes = config.employeeTypes ?? [];
  const locations = config.locations ?? [];

  const toggleItem = (field, arr, val) => {
    const updated = arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
    set(field, updated);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="max-w-xs">
        <Label>Apply To</Label>
        <Select
          value={config.applyTo ?? "All Employees"}
          onChange={(val) => set("applyTo", val)}
          options={["All Employees", "Specific Departments", "Specific Locations", "Custom"]}
        />
      </div>

      <SectionBox title="Departments">
        <ChipGroup
          options={deptOptions}
          selected={departments}
          onToggle={(v) => toggleItem("departments", departments, v)}
        />
      </SectionBox>

      <SectionBox title="Employee Types">
        <ChipGroup
          options={typeOptions}
          selected={employeeTypes}
          onToggle={(v) => toggleItem("employeeTypes", employeeTypes, v)}
        />
      </SectionBox>

      <SectionBox title="Locations">
        <ChipGroup
          options={locOptions}
          selected={locations}
          onToggle={(v) => toggleItem("locations", locations, v)}
        />
      </SectionBox>
    </div>
  );
}