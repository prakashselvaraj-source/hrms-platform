import { Play } from 'lucide-react';

const birthdays = [
  { name: 'Sarah Mitchell', dept: 'Design Team • Today', img: 'https://i.pravatar.cc/40?img=5' },
  { name: 'James Wilson', dept: 'Product Dev • Oct 24', img: 'https://i.pravatar.cc/40?img=12' },
];

export default function Birthdays() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E6E8EC]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span>🎂</span>
          <h3 className="font-semibold text-[#1A1D1F] text-sm">Birthdays</h3>
        </div>
        <span className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">OCTOBER</span>
      </div>

      <div className="space-y-3">
        {birthdays.map((b) => (
          <div key={b.name} className="flex items-center gap-3">
            <img src={b.img} alt={b.name} className="w-9 h-9 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#1A1D1F]">{b.name}</p>
              <p className="text-xs text-[#6B7280]">{b.dept}</p>
            </div>
            <button className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors">
              <Play size={11} className="text-purple-600 ml-0.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}