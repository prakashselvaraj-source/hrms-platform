"use client";
import { Label, Select } from "./primitives";

const workScheduleOptions = [
  { id: "sat1", label: "1st Saturday Working" },
  { id: "sat3", label: "3rd Saturday Working" },
  { id: "sat5", label: "5th Saturday Working" },
];

const SECTION = "restrictions";

export default function RestrictionsTab({ leaveData = {}, updateConfig }) {
  const config = leaveData?.config?.[SECTION] ?? {};

  const set = (field, value) => updateConfig(SECTION, field, value);

  const scheduleToggles = config.scheduleToggles ?? { sat1: false, sat3: true, sat5: false };

  const flipSchedule = (id) => {
    const updated = { ...scheduleToggles, [id]: !scheduleToggles[id] };
    set("scheduleToggles", updated);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Warning Banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-amber-500 shrink-0 mt-0.5">
          <path
            d="M9.005 3.36L2.28 15a1 1 0 00.866 1.5h13.708a1 1 0 00.866-1.5L10.995 3.36a1.15 1.15 0 00-1.99 0z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="#FEF3C7"
          />
          <path d="M10 8v3.5M10 13.5v.5" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-amber-700">Restriction Configuration</p>
          <p className="text-xs text-amber-600 mt-0.5">
            These rules are strictly enforced. Violations will auto-reject the leave request.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>Max Consecutive Days</Label>
          <input
            type="number"
            min="0"
            value={config.maxConsecDays ?? "2"}
            onChange={(e) => set("maxConsecDays", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800
                       bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <Label>Sandwich Rule</Label>
          <Select
            value={config.sandwichRule ?? "Disabled (Not Counted)"}
            onChange={(val) => set("sandwichRule", val)}
            options={[
              "Disabled (Not Counted)",
              "Enabled (Counted)",
              "Weekends Only",
              "Holidays Only",
              "Weekends & Holidays",
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>Min Service Period</Label>
          <Select
            value={config.minServicePeriod ?? "After Probation"}
            onChange={(val) => set("minServicePeriod", val)}
            options={["After Probation", "Immediately", "After 3 Months", "After 6 Months", "After 1 Year"]}
          />
        </div>
        <div>
          <Label>Gender Restriction</Label>
          <Select
            value={config.genderRestriction ?? "All Genders"}
            onChange={(val) => set("genderRestriction", val)}
            options={["All Genders", "Male Only", "Female Only", "Non-Binary Only"]}
          />
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center gap-2 mb-4">
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-indigo-500">
            <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 8h14" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 2v3M13 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-bold text-gray-800">Work Schedule Rules</span>
        </div>

        <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden bg-white divide-x divide-gray-200">
          {workScheduleOptions.map((opt) => (
            <div
              key={opt.id}
              className={`flex-1 flex items-center justify-between px-5 py-4 transition-colors
                          ${scheduleToggles[opt.id] ? "bg-indigo-50/60" : "bg-white"}`}
            >
              <button
                onClick={() => flipSchedule(opt.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0
                            ${scheduleToggles[opt.id] ? "bg-indigo-600" : "bg-gray-200"}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
                              ${scheduleToggles[opt.id] ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
              <span
                className={`text-sm font-medium ml-3 ${scheduleToggles[opt.id] ? "text-indigo-700" : "text-gray-500"}`}
              >
                {opt.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}