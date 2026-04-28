import { ChevronDown } from "lucide-react";

export function Label({ children }) {
  return (
    <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
      {children}
    </label>
  );
}

export function Input({ value, onChange, placeholder = "" }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-white
      focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-300"
    />
  );
}

export function Select({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                   text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-9 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
}

export function Toggle({ enabled, onToggle, label }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                    ${enabled ? "bg-indigo-600" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform
                          ${enabled ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
      {label && (
        <span className={`text-xs font-semibold ${enabled ? "text-indigo-600" : "text-gray-400"}`}>
          {enabled ? "Enabled" : "Disabled"}
        </span>
      )}
    </div>
  );
}

export function SectionBox({ title, children }) {
  return (
    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-5">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-4">
        {title}
      </p>
      {children}
    </div>
  );
}