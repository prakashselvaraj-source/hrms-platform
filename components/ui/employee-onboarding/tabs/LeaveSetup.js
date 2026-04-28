'use client';

import { Calendar, Clock, CheckCircle2, Info, Moon, Sun } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';

const leavePolicies = [
  { label: 'Global Standard Policy (2024)', value: 'standard' },
  { label: 'Start-up Growth Policy (Unlimited PTO)', value: 'startup' },
  { label: 'Fixed-Term Contractor Policy', value: 'contract' }
];

const workingDaysOptions = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
];

export default function LeaveSetup({ data, updateData }) {
  const toggleDay = (dayId) => {
    const currentDays = data.workingDays || [];
    const newDays = currentDays.includes(dayId)
      ? currentDays.filter(d => d !== dayId)
      : [...currentDays, dayId];
    updateData({ workingDays: newDays });
  };

  return (
    <div className="bg-[#FFFFFF] p-8">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#000000] mb-5">
        <Calendar size={20} />
        Leave & Attendance Setup
      </div>

      <div className="flex flex-col gap-8 mt-8">
        {/* Policy Selection */}
        <div className="bg-white rounded-xl border-l-4 border-[#712AE2] p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={18} className="text-[#4A45B6]" />
            <h3 className="text-sm font-semibold text-[#191C1E]">Leave Policy</h3>
          </div>
          <div className="max-w-md">
            <CustomDropdown
              label="Primary Leave Policy"
              options={leavePolicies}
              value={data.leavePolicy}
              onChange={(value) => updateData({ leavePolicy: value })}
              placeholder="Select a Policy"
            />
            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
              <Info size={10} />
              Policy defines accrual rates and holiday calendars based on region.
            </p>
          </div>
        </div>

        {/* Working Days */}
        <div className="bg-[#FAFAFA] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-[#4A45B6]" />
            <h3 className="text-sm font-semibold text-[#191C1E]">Work Week Configuration</h3>
          </div>
          <p className="text-xs text-[#737686] mb-4">Select the standard working days for this employee.</p>
          <div className="flex gap-3">
            {workingDaysOptions.map((day) => {
              const isActive = (data.workingDays || []).includes(day.id);
              return (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`w-12 h-12 rounded-lg text-xs font-bold transition-all border-2
                    ${isActive
                      ? 'bg-[#4A45B6] border-[#4A45B6] text-white'
                      : 'bg-white border-gray-200 text-gray-400 hover:border-[#4A45B6]'
                    }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Entitlements Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-700 uppercase">Sick Leave</span>
              <Sun size={14} className="text-blue-500" />
            </div>
            <p className="text-xl font-bold text-blue-900">12 Days</p>
            <p className="text-[10px] text-blue-600 mt-1">Accrued monthly</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-700 uppercase">Earned Leave</span>
              <Moon size={14} className="text-purple-500" />
            </div>
            <p className="text-xl font-bold text-purple-900">18 Days</p>
            <p className="text-[10px] text-purple-600 mt-1">Carry-forward allowed</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-orange-700 uppercase">Casual Leave</span>
              <Calendar size={14} className="text-orange-500" />
            </div>
            <p className="text-xl font-bold text-orange-900">08 Days</p>
            <p className="text-[10px] text-orange-600 mt-1">Fixed annual grant</p>
          </div>
        </div>
      </div>
    </div>
  );
}
