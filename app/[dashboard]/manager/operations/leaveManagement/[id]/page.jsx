"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Settings,
  RefreshCw,
  AlertCircle,
  Link,
  Coins,
  Users,
  User,
} from "lucide-react";

import {
  getLeaveConfigByLeaveId,
  getLeaveTypesById,
  createLeavePolicy,
  updateLeavePolicy,
  saveLeavePolicy,
} from "@/services/leaveService";
import { useTenant } from "@/hooks/useTenant";
import { Toggle } from "@/components/leaves/primitives";
import GeneralTab from "@/components/leaves/GeneralTab";
import AccrualRulesTab from "@/components/leaves/AccrualRulesTab";
import UsageRulesTab from "@/components/leaves/UsageRulesTab";
import RestrictionsTab from "@/components/leaves/RestrictionsTab";
import CombinationTab from "@/components/leaves/CombinationTab";
import EncashmentTab from "@/components/leaves/EncashmentTab";
import ApplicabilityTab from "@/components/leaves/ApplicabilityTab";

// ─── Static config ────────────────────────────────────────────────────────────

const leavePolicies = [
  { id: 1, name: "Casual Leave", active: true },
  { id: 2, name: "Sick Leave", active: true },
  { id: 3, name: "Earned Leave", active: true },
  { id: 4, name: "Maternity Leave", active: true },
  { id: 5, name: "Loss of Pay", active: true },
];

const tabs = [
  { label: "General", icon: <Settings size={13} /> },
  { label: "Accrual Rules", icon: <RefreshCw size={13} /> },
  { label: "Usage Rules", icon: <AlertCircle size={13} /> },
  { label: "Restrictions", icon: <AlertCircle size={13} /> },
  { label: "Combination", icon: <Link size={13} /> },
  { label: "Encashment", icon: <Coins size={13} /> },
  { label: "Applicability", icon: <Users size={13} /> },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LeavePolicyConfiguration() {
  const [activePolicy, setActivePolicy] = useState(0);
  const [activeTab, setActiveTab] = useState("General");
  const [isActive, setIsActive] = useState(true);

  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isNewConfig, setIsNewConfig] = useState(false);

  const tenantId = useTenant();
  const { id } = useParams();

  // ── Fetch leave type data from API ────────────────────────────────────────
  useEffect(() => {
    if (!tenantId || !id) return;

    const fetchLeave = async () => {
      setLoading(true);

      try {
        const leaveRes = await getLeaveTypesById(tenantId, id);
        const configRes = await getLeaveConfigByLeaveId(tenantId, id);

        console.log("leaveRes", leaveRes);
        console.log("configRes", configRes);

        const isNew = !configRes?.data;
        setIsNewConfig(isNew);

        const configData = mapResponseToUI(configRes?.data);

        const mergedData = {
          ...leaveRes.data,
          config: configData,
        };

        console.log("mergedData", mergedData);

        setLeaveData(mergedData);

      } catch (error) {
        console.error("Failed to fetch leave data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeave();
  }, [tenantId, id]);

  const mapResponseToUI = (data) => {
    if (!data) {
      return {
        generalConfig: {},
        accrualRules: {},
        usageRules: {},
        restrictions: {},
        combinationRules: {},
        encashmentRules: {},
        applicabilityRules: {},
      };
    }

    return {
      id: data.id,
      generalConfig: data.general || {},
      accrualRules: data.accrual || {},
      usageRules: data.usage || {},
      restrictions: data.restrictions || {},
      combinationRules: data.combination || {},
      encashmentRules: data.encashment || {},
      applicabilityRules: data.applicability || {},
    };
  };

  const buildPayload = () => ({
    leaveTypeId: id,
    name: leaveData.name,

    general: leaveData.config?.generalConfig,
    accrual: leaveData.config?.accrualRules,
    usage: leaveData.config?.usageRules,
    restrictions: leaveData.config?.restrictions,
    combination: leaveData.config?.combinationRules,
    encashment: leaveData.config?.encashmentRules,
    applicability: leaveData.config?.applicabilityRules,
  });

  const handleSave = async () => {

    console.log("handleSave", leaveData);

    try {
      const payload = buildPayload();
      console.log("payload", payload);
      await saveLeavePolicy(tenantId, id, payload);

      alert("Saved successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const updateConfig = (section, field, value) => {
    setLeaveData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [section]: {
          ...prev.config?.[section],
          [field]: value,
        },
      },
    }));
  };

  const tabContent = {
    General: <GeneralTab leaveData={leaveData} updateConfig={updateConfig} />,
    "Accrual Rules": <AccrualRulesTab leaveData={leaveData} updateConfig={updateConfig} />,
    "Usage Rules": <UsageRulesTab leaveData={leaveData} updateConfig={updateConfig} />,
    Restrictions: <RestrictionsTab leaveData={leaveData} updateConfig={updateConfig} />,
    Combination: <CombinationTab leaveData={leaveData} updateConfig={updateConfig} />,
    Encashment: <EncashmentTab leaveData={leaveData} updateConfig={updateConfig} />,
    Applicability: <ApplicabilityTab leaveData={leaveData} updateConfig={updateConfig} />,
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-gray-400 mb-4">
        <span className="uppercase tracking-wide">LEAVE MANAGEMENT</span>
        <span className="mx-1">›</span>
        <span className="text-indigo-600 font-semibold uppercase tracking-wide">
          LEAVE POLICIES
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Leave Policy Configuration
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure rules independently for each leave type
          </p>
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors"
          onClick={handleSave}
        >
          Save all
        </button>
      </div>

      {/* Policy Cards */}
      {/* <div className="flex gap-3 mb-6 overflow-x-auto pb-1">
        {leavePolicies.map((policy, idx) => (
          <button
            key={policy.id}
            onClick={() => setActivePolicy(idx)}
            className={`min-w-[200px] flex-shrink-0 rounded-xl border p-4 text-left transition-all ${
              activePolicy === idx
                ? "border-indigo-400 bg-white shadow-md"
                : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
            }`}
          >
            <span className="block w-2.5 h-2.5 rounded-full bg-red-500 mb-2" />
            <p className="text-sm font-medium text-gray-800">{policy.name}</p>
            {policy.active && (
              <span className="mt-2 inline-block bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>
        ))}
      </div> */}

      {/* Config Panel */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-800">
              {leavePolicies[activePolicy].name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Toggle
              enabled={isActive}
              onToggle={() => setIsActive((p) => !p)}
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-1.5 px-5 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.label
                ? "border-indigo-600 text-indigo-600 bg-indigo-50/50"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
            >
              <span
                className={
                  activeTab === tab.label ? "text-indigo-500" : "text-gray-400"
                }
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center h-40 text-sm text-gray-400">
            Loading…
          </div>
        ) : (
          tabContent[activeTab]
        )}
      </div>
    </div>
  );
}
