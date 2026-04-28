import { DollarSign, UserPlus, FileBarChart, Calendar } from 'lucide-react';

const actions = [
  { icon: DollarSign, label: 'PAY RUN' },
  { icon: UserPlus, label: 'ONBOARD' },
  { icon: FileBarChart, label: 'REPORT' },
  { icon: Calendar, label: 'CALENDAR' },
];

export default function QuickActions() {
  return (
    <div className="rounded-[12px] p-6 mb-4" style={{ background: 'linear-gradient(135deg, #4A45B6 0%, #3730A3 100%)' }}>
      <h3 className="text-white font-medium text-[16px] mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map(({ icon: Icon, label }) => (
          <button key={label}
            className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl py-4 px-2">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon size={18} className="text-white" />
            </div>
            <span className="text-white text-xs font-semibold tracking-wide">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}