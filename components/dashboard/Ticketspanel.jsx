import { ChevronRight } from 'lucide-react';

const tickets = [
  {
    title: 'IT Equipment Request',
    sub: 'Dwight Schrute • High',
    priority: 'high'
  },
  {
    title: 'Salary Grievance',
    sub: 'Toby Flenderson • Medium',
    priority: 'medium'
  },
];

export default function TicketsPanel() {
  return (
    <div className="bg-[#E0E3E5] rounded-[12px] p-5  border border-[#E6E8EC]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[#1A1D1F] text-sm">Active Tickets</h3>
        <span className="bg-[#4A45B6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">12 New</span>
      </div>

      <div className="space-y-2 mb-3">
        {tickets.map((t) => (
          <button key={t.title}
            className="w-full flex items-center justify-between bg-[#FFFFFF80] hover:bg-gray-100 transition-colors px-3 py-3 rounded-[8px]">
            <div className="text-left">
              <p className="text-xs font-semibold text-[#191C1E]">{t.title}</p>
              <p className="text-xs text-[#6B7280]">{t.sub}</p>
            </div>
            <ChevronRight size={14} className="text-[#434655]" />
          </button>
        ))}
      </div>

      <button className="w-full text-center text-xs font-semibold text-[#4A45B6] hover:text-purple-800 py-1 transition-colors">
        VIEW ALL TICKETS
      </button>
    </div>
  );
}