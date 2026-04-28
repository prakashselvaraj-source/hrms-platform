import { Download, MoreVertical, Users } from 'lucide-react';

function CircularProgress({ value }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#E6E8EC" strokeWidth="8" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#006058" strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" />
      </svg>
      <span className="absolute text-xl font-bold text-[#1A1D1F]">{value}%</span>
    </div>
  );
}

function SmallEmployeeCard() {
  return (
    <div className="bg-white rounded-[8px] p-4 shadow-[0px_1px_3px_0px_#0000000D] border border-[#E6E8EC] flex flex-col items-start gap-2">
      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
        <Users size={16} className="text-purple-600" />
      </div>
      <div>
        <p className="text-[16px] font-medium text-[#6B7280]">Total Employees</p>
        <p className="text-lg font-bold text-[#111827]">10</p>
      </div>
    </div>
  );
}

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {/* Payroll Summary */}
      <div className="bg-white rounded-[12px] p-5 shadow-sm border-l-4 border-[#712AE2]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold text-[#434655] tracking-[1.4] uppercase">Payroll Summary</p>
            <p className="text-[10px] text-[#94A3B8] mt-0.5 uppercase">Next Pay Date: Oct 31, 2023</p>
          </div>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#635FD0" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-3xl font-bold text-[#191C1E]">Rs.482,950</p>
          <span className="text-xs text-[#006058] font-medium px-1.5 py-0.5 rounded">↑2.4%</span>
        </div>
        <div className="space-y-3">
          <div className='flex flex-col gap-3'>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#64748B] font-medium">Gross Salaries</span>
              <span className="font-semibold text-[#191C1E]">Rs.412,000</span>
            </div>
            <div className="h-1.5 bg-[#ECEEF0] rounded-full">
              <div className="h-1.5 bg-[#4A45B6] rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[#64748B] font-medium">Taxes & Benefits</span>
              <span className="font-semibold text-[#191C1E]">Rs.70,950</span>
            </div>
            <div className="h-1.5 bg-[#ECEEF0] rounded-full">
              <div className="h-1.5 bg-[#4A45B6]  rounded-full" style={{ width: '40%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance */}
      <div className="bg-white rounded-[12px] p-5 shadow-sm border border-[#E6E8EC]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-[#434655] tracking-[1.4px] uppercase">Attendance</p>
            <p className="text-[10px] text-[#94A3B8] mt-0.5 uppercase">Today's Snapshot</p>
          </div>
          <button className="text-gray-400">
            <MoreVertical size={16} />
          </button>
        </div>
        <div className="flex items-center gap-6">
          <CircularProgress value={92} />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-[#006058]" />
              <span className="text-[#475569] font-semibold">Present (412)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-[#BA1A1A]" />
              <span className="text-[#475569] font-semibold">Absent (18)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-[#712AE2]" />
              <span className="text-[#475569] font-semibold">On Leave (24)</span>
            </div>
          </div>
        </div>
        <button className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-[#3B35A7] font-semibold bg-[#E2DFFF] hover:bg-purple-100 py-3 rounded-[12px] transition-colors">
          <Download size={16} />
          Export to Excel
        </button>
      </div>

      {/* 4 Small Employee Cards */}
      <div className="grid grid-cols-2 gap-3">
        <SmallEmployeeCard />
        <SmallEmployeeCard />
        <SmallEmployeeCard />
        <SmallEmployeeCard />
      </div>
    </div>
  );
}