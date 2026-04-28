"use client";
import { Label, Input, Select, Toggle, SectionBox } from "./primitives";

const SECTION = "accrualRules";

export default function AccrualRulesTab({ leaveData = {}, updateConfig }) {
  const config = leaveData?.config?.[SECTION] ?? {};

  const set = (field, value) => updateConfig(SECTION, field, value);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-3 gap-5">
        <div>
          <Label>Accrual Type</Label>
          <Select
            value={config.accrualType ?? "Monthly"}
            onChange={(val) => set("accrualType", val)}
            options={["Monthly", "Quarterly", "Annually", "Bi-Monthly"]}
          />
        </div>
        <div>
          <Label>Leaves Per Cycle</Label>
          <Input value={config.leavesPerCycle ?? ""} onChange={(val) => set("leavesPerCycle", val)} placeholder="e.g. 1.5" />
        </div>
        <div>
          <Label>Max Annual Quota</Label>
          <Input value={config.maxAnnualQuota ?? ""} onChange={(val) => set("maxAnnualQuota", val)} placeholder="e.g. 12" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div>
          <Label>Max Balance Cap</Label>
          <Select
            value={config.maxBalanceCap ?? "Monthly"}
            onChange={(val) => set("maxBalanceCap", val)}
            options={["Monthly", "Quarterly", "Annually", "Unlimited"]}
          />
        </div>
        <div>
          <Label>Accrual Start</Label>
          <Input value={config.accrualStart ?? ""} onChange={(val) => set("accrualStart", val)} placeholder="e.g. Date of joining" />
        </div>
        <div>
          <Label>Pro-Rate for New Joiners</Label>
          <Input value={config.proRate ?? ""} onChange={(val) => set("proRate", val)} placeholder="e.g. Yes / No" />
        </div>
      </div>

      <SectionBox title="Carry Forward Rules">
        <div className="grid grid-cols-3 gap-5">
          <div>
            <Label>Carry Forward Allowed</Label>
            <Toggle
              enabled={config.carryForward ?? true}
              onToggle={() => set("carryForward", !(config.carryForward ?? true))}
              label
            />
          </div>
          <div>
            <Label>Max Carry Forward Days</Label>
            <Input value={config.maxCarryForwardDays ?? "5"} onChange={(val) => set("maxCarryForwardDays", val)} placeholder="e.g. 5" />
          </div>
          <div>
            <Label>Expiry</Label>
            <Select
              value={config.expiry ?? "End of the year"}
              onChange={(val) => set("expiry", val)}
              options={["End of the year", "End of the quarter", "End of the month", "Never"]}
            />
          </div>
        </div>
      </SectionBox>
    </div>
  );
}