import { Megaphone, Plus } from 'lucide-react';

const announcements = [
  {
    tag: 'NEW POLICY',
    tagColor: 'text-purple-600',
    title: 'Hybrid Work Policy v2.1',
    desc: 'Starting Nov 1st, all departments transition to the new flexible framework.',
    border: 'border-l-purple-500',
  },
  {
    tag: 'EVENT',
    tagColor: 'text-purple-600',
    title: "Annual Founder's Day",
    desc: 'Join us for the town hall meeting and awards ceremony this Friday.',
    border: 'border-l-purple-500',
  },
];

export default function AnnouncementPanel() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#E6E8EC]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base"><Megaphone className='text-[#712AE2]' /></span>
          <h3 className="font-semibold text-[#191C1E] text-sm">Announcements</h3>
        </div>
        <button className="w-7 h-7 bg-purple-600 rounded-sm flex items-center justify-center hover:bg-purple-700 transition-colors">
          <Plus size={14} className="text-white" />
        </button>
      </div>
      <div className="space-y-3">
        {announcements.map((a, i) => (
          <div key={i} className={`border-l-4 border-[#4A45B6] bg-[#F2F4F6] pl-3 py-3 pr-2 rounded-[12px] flex flex-col gap-3`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider border-[#4A45B6] mb-0.5 leading-[19px]`}>{a.tag}</p>
            <p className="text-xs font-semibold text-[#1A1D1F] mb-0.5">{a.title}</p>
            <p className="text-xs text-[#6B7280] leading-relaxed">{a.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}