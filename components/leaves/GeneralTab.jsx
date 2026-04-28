"use client";
import { Label, Input, Select } from "./primitives";

const colorOptions = [
  { id: "blue", bg: "bg-blue-500" },
  { id: "red", bg: "bg-red-500" },
  { id: "green", bg: "bg-green-500" },
  { id: "purple", bg: "bg-purple-600" },
];

const SECTION = "generalConfig";

export default function GeneralTab({ leaveData = {}, updateConfig }) {
  const config = leaveData?.config?.[SECTION] ?? {};

  const set = (field, value) => updateConfig(SECTION, field, value);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label>Leave Name</Label>
          <Input
            value={config.name ?? leaveData?.name ?? ""}
            onChange={(val) => set("name", val)}
          />
        </div>
        <div>
          <Label>Leave Code</Label>
          <Input
            value={config.code ?? leaveData?.code ?? ""}
            onChange={(val) => set("code", val)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label>Description</Label>
          <textarea
            value={config.description ?? leaveData?.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe this leave type..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-300 resize-none"
          />
        </div>
        <div className="space-y-4">
          <div>
            <Label>Leave Unit</Label>
            <Select
              value={config.unit ?? "Full Day"}
              onChange={(val) => set("unit", val)}
              options={["Full Day", "Half Day", "Hours"]}
            />
          </div>
          <div>
            <Label>Leave Type</Label>
            <Select
              value={config.type ?? "Paid"}
              onChange={(val) => set("type", val)}
              options={["Paid", "Unpaid", "Optional"]}
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Color Tag</Label>
        <div className="flex gap-2">
          {colorOptions.map((c) => (
            <button
              key={c.id}
              onClick={() => set("color", c.id)}
              className={`w-7 h-7 rounded-full ${c.bg} transition-transform hover:scale-110
                          ${(config.color ?? "blue") === c.id ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}