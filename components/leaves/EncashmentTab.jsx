"use client";
import { Label, Select } from "./primitives";

const SECTION = "encashmentRules";

export default function EncashmentTab({ leaveData = {}, updateConfig }) {
  const config = leaveData?.config?.[SECTION] ?? {};

  const set = (field, value) => updateConfig(SECTION, field, value);

  const encashEnabled = config.encashEnabled ?? true;

  return (
    <div className="p-6 space-y-6">
      {/* Header banner */}
      <div className="flex items-center justify-between bg-indigo-50/60 border border-indigo-100 rounded-xl px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-indigo-600">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6.5v1M10 12.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path
                d="M8 9.5c0-.83.67-1.5 1.5-1.5h1a1.5 1.5 0 010 3h-1a1.5 1.5 0 000 3h1c.83 0 1.5-.67 1.5-1.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Encashment Enabled for Casual Leave</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Allow employees to redeem unused leave balance for monetary benefits
            </p>
          </div>
        </div>
        <button
          onClick={() => set("encashEnabled", !encashEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-6
                      ${encashEnabled ? "bg-indigo-600" : "bg-gray-300"}`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
                            ${encashEnabled ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div>
          <Label>Encashment Frequency</Label>
          <Select
            value={config.frequency ?? "Half-Yearly"}
            onChange={(val) => set("frequency", val)}
            options={["Half-Yearly", "Monthly", "Quarterly", "Annually", "On Resignation", "On Retirement"]}
          />
        </div>
        <div>
          <Label>Minimum Balance Required</Label>
          <input
            type="number"
            min="0"
            value={config.minBalance ?? "4"}
            onChange={(e) => set("minBalance", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div>
          <Label>Max Encashable Per Cycle</Label>
          <input
            type="text"
            value={config.maxPerCycle ?? "No limit"}
            onChange={(e) => set("maxPerCycle", e.target.value)}
            placeholder="No limit"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400 bg-white
                       focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div>
          <Label>Encashment On</Label>
          <Select
            value={config.encashOn ?? "Resignation"}
            onChange={(val) => set("encashOn", val)}
            options={["Resignation", "Retirement", "Annually", "On Request", "End of Year"]}
          />
        </div>
        <div>
          <Label>Tax Treatment</Label>
          <Select
            value={config.taxTreatment ?? "Taxable"}
            onChange={(val) => set("taxTreatment", val)}
            options={["Taxable", "Non-Taxable", "Partially Taxable"]}
          />
        </div>
        <div />
      </div>
    </div>
  );
}