"use client";
import { ChevronDown } from "lucide-react";

const combinationLeaveTypes = [
  {
    id: "sl", code: "SL", name: "Sick Leave",
    description: "Clubbing with health-related leave",
    iconBg: "bg-orange-100",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-orange-500">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 2v3M13 2v3M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 12h2m2 0h2M10 10v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    defaultRule: "Strict Block",
  },
  {
    id: "opt", code: "OPT", name: "Optional Holiday",
    description: "Regional or festive holidays",
    iconBg: "bg-green-100",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-green-600">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 2v3M13 2v3M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M7 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    defaultRule: "Allow",
  },
  {
    id: "lop", code: "LOP", name: "Loss of Pay",
    description: "Unpaid absence adjustments",
    iconBg: "bg-red-100",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-red-500">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 7v3.5M10 13v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    defaultRule: "Strict Block",
  },
  {
    id: "perm", code: "PERM", name: "Permission",
    description: "Short duration time-off",
    iconBg: "bg-yellow-100",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 text-yellow-500">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    defaultRule: "Strict Block",
  },
];

const ruleOptions = ["Strict Block", "Soft Block", "Allow", "Allow with Approval"];

const defaultRules = Object.fromEntries(combinationLeaveTypes.map((l) => [l.id, l.defaultRule]));

const SECTION = "combinationRules";

export default function CombinationTab({ leaveData = {}, updateConfig }) {
  const config = leaveData?.config?.[SECTION] ?? {};

  const rules = { ...defaultRules, ...config };

  const setRule = (id, val) => updateConfig(SECTION, id, val);
  const isAllowed = (rule) => rule === "Allow" || rule === "Allow with Approval";

  return (
    <div className="p-6">
      <div className="divide-y divide-gray-100">
        {combinationLeaveTypes.map((leave) => {
          const allowed = isAllowed(rules[leave.id]);
          return (
            <div key={leave.id} className="flex items-center justify-between py-5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${leave.iconBg}`}>
                  {leave.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {leave.name}{" "}
                    <span className="text-gray-400 font-normal">({leave.code})</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{leave.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${allowed ? "text-green-600" : "text-red-500"}`}>
                  {allowed ? "ALLOWED" : "BLOCKED"}
                </span>
                <div className="relative w-44">
                  <select
                    value={rules[leave.id]}
                    onChange={(e) => setRule(leave.id, e.target.value)}
                    className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 text-sm
                               text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-8 cursor-pointer"
                  >
                    {ruleOptions.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}