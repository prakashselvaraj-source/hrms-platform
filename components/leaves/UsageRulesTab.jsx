"use client";
import { Label } from "./primitives";

const processOptions = [
  {
    id: "halfDay",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-indigo-500">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 2v16M10 2a8 8 0 010 16" fill="currentColor" opacity="0.2" />
        <path d="M10 2a8 8 0 010 16" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    label: "Allow Half-Day Leave",
    description: "Enable 0.5 unit leave requests",
    defaultOn: true,
  },
  {
    id: "backdate",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-indigo-400">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4l-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6.5 5.5L4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4 3l2 2.5M4 3l2.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    label: "Allow Backdated Applications",
    description: "Allow applying for past dates",
    defaultOn: false,
  },
  {
    id: "portal",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-indigo-400">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    label: "Portal Application Mandatory",
    description: "Override manual entry for HR",
    defaultOn: true,
  },
  {
    id: "lock",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-indigo-400">
        <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Lock After Payroll Processing",
    description: "Prevent changes once salary is run",
    defaultOn: true,
  },
];

function NumberField({ label, value, onChange, hint }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-14 text-sm text-gray-800
                     bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
          Days
        </span>
      </div>
      {hint && <p className="text-[10px] text-gray-400 mt-1.5 leading-snug">{hint}</p>}
    </div>
  );
}

const SECTION = "usageRules";

const defaultToggles = Object.fromEntries(processOptions.map((o) => [o.id, o.defaultOn]));

export default function UsageRulesTab({ leaveData = {}, updateConfig }) {
  const config = leaveData?.config?.[SECTION] ?? {};

  const set = (field, value) => updateConfig(SECTION, field, value);

  const toggles = { ...defaultToggles, ...config.processOptions };

  const flip = (id) => {
    const updated = { ...toggles, [id]: !toggles[id] };
    set("processOptions", updated);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <NumberField
          label="Max Per Request"
          value={config.maxPerRequest ?? "2"}
          onChange={(val) => set("maxPerRequest", val)}
          hint="Maximum days allowed in a single application"
        />
        <NumberField
          label="Min Notice Days"
          value={config.minNoticeDays ?? "1"}
          onChange={(val) => set("minNoticeDays", val)}
          hint="Advance notice period required before leave"
        />
        <NumberField
          label="Max Per Month"
          value={config.maxPerMonth ?? "3"}
          onChange={(val) => set("maxPerMonth", val)}
          hint="Total limit within a calendar month"
        />
      </div>

      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-5">
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-indigo-500">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
            Process Options
          </span>
        </div>

        <div className="divide-y divide-indigo-100/70">
          {processOptions.map((opt, idx) => (
            <div
              key={opt.id}
              className={`flex items-center justify-between py-4 ${idx === 0 ? "pt-0" : ""} ${
                idx === processOptions.length - 1 ? "pb-0" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center shadow-sm">
                  {opt.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{opt.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{opt.description}</p>
                </div>
              </div>
              <button
                onClick={() => flip(opt.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0 ml-4
                            ${toggles[opt.id] ? "bg-indigo-600" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
                              ${toggles[opt.id] ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}