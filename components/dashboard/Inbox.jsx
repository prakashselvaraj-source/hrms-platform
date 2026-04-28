const messages = [
  {
    initials: 'AM', name: 'Alex Mercer', time: '10:45 AM', unread: true,
    preview: 'Urgent: Benefit package update for the upcoming open enrollment season...',
    bg: 'bg-purple-500'
  },
  {
    initials: 'DC', name: 'David Chen', time: 'Yesterday', unread: false,
    preview: 'The leave request for Q4 has been submitted for approval by the board...',
    bg: 'bg-orange-500'
  },
];

export default function Inbox() {
  return (
    <div className="bg-white rounded-[12px]  shadow-sm border border-[#E6E8EC]">
      <div className="flex items-center justify-between mb-4 bg-[#F2F4F680] py-4 px-5" >
        <div className="flex items-center gap-2 ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7L12 13 2 7" />
          </svg>
          <h3 className="font-semibold text-[#1A1D1F] text-sm">Integrated Priority Inbox</h3>
        </div>
        <button className="text-xs text-[#4A45B6] font-medium hover:text-purple-800 transition-colors">
          Go to Mailbox
        </button>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => (
          <div key={msg.name} className="flex items-start gap-3 px-5 py-3">
            <div className={`w-9 h-9 ${msg.bg} rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
              <span className="text-white text-xs font-bold">{msg.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-semibold text-[#1A1D1F]">{msg.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-[#6B7280]">{msg.time}</span>
                  {msg.unread && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
              </div>
              <p className="text-xs text-[#6B7280] truncate">{msg.preview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}