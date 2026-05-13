'use client';

import { Calendar, Clock, CheckCircle2, Info, Moon, Sun, Activity } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';

const leavePolicies = [
  { label: 'Global Standard (2024)', value: 'standard' },
  { label: 'Unlimited PTO (Growth)', value: 'startup' },
  { label: 'Contractor Protocol', value: 'contract' }
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
    <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 uppercase tracking-widest mb-6">
        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Calendar size={14} />
        </div>
        Surgical Scheduling
      </div>

      <div className="space-y-6">
        {/* Policy Selection Matrix */}
        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={14} className="text-indigo-600" />
            <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Leave Protocol</h3>
          </div>
          <div className="max-w-md space-y-2">
            <CustomDropdown
              label="Primary Governance Policy"
              options={leavePolicies}
              value={data.leavePolicy}
              onChange={(value) => updateData({ leavePolicy: value })}
              placeholder="Select Policy"
            />
            <p className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-1.5 ml-0.5">
              <Info size={10} className="text-indigo-400" />
              Governs accrual rates and regional holidays.
            </p>
          </div>
        </div>

        {/* Operational Week Config */}
        <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-indigo-600" />
            <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Active Cycle</h3>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-0.5">Operational Days Selection</p>
          <div className="flex flex-wrap gap-2">
            {workingDaysOptions.map((day) => {
              const isActive = (data.workingDays || []).includes(day.id);
              return (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`w-11 h-11 rounded-xl text-[11px] font-black uppercase transition-all
                    ${isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'bg-white border border-gray-100 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Entitlement Analytics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Sick Access', val: '12 Days', sub: 'Accrued Monthly', color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', icon: Sun },
            { label: 'Earned Access', val: '18 Days', sub: 'Carry-Forward', color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100', icon: Moon },
            { label: 'Casual Access', val: '08 Days', sub: 'Fixed Grant', color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100', icon: Activity },
          ].map((item) => (
            <div key={item.label} className={`${item.bg} p-4 rounded-xl border ${item.border} flex flex-col gap-1.5 group hover:scale-[1.02] transition-transform`}>
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-widest ${item.color}`}>{item.label}</span>
                <item.icon size={12} className={item.color} />
              </div>
              <p className={`text-xl font-black ${item.color.replace('600', '900')} tracking-tight`}>{item.val}</p>
              <p className={`text-[9px] font-bold uppercase tracking-tight opacity-60 ${item.color}`}>{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
