const deadlines = [
  {
    month: 'OCT', day: '28', title: 'Monthly Salary Approval',
    subtitle: '4 days remaining', color: 'text-[#BA1A1A] bg-[#FFDAD633]'
  },
  {
    month: 'NOV', day: '05', title: 'Tax Compliance Filing',
    subtitle: '11 days remaining', color: 'text-[#434655] bg-[#F2F4F6]'
  },
];

export default function PayrollDeadlines() {
  return (
    <div className="bg-white rounded-[12px] p-6 shadow-sm border border-[#E6E8EC] mt-4">
      <h3 className="font-bold text-[#191C1E] text-lg mb-3">Payroll Deadlines</h3>
      <div className="space-y-3">
        {deadlines.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`${d.color} rounded-lg px-2.5 py-2 text-center min-w-[46px]`}>
              <p className="text-[9px] font-bold uppercase">{d.month}</p>
              <p className="text-lg font-bold leading-tight">{d.day}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#191C1E]">{d.title}</p>
              <p className="text-xs text-[#434655]">{d.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}