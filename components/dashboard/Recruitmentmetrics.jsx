const roles = [
  { name: 'Senior Engineering Lead', stages: '4/5 Stages', percent: 80, color: 'bg-[#4A45B6]' },
  { name: 'Product Designer', stages: '2/5 Stages', percent: 40, color: 'bg-[#712AE2]' },
  { name: 'HR Specialist', stages: 'Complete', percent: 100, color: 'bg-[#006058]', complete: true },
];

export default function RecruitmentMetrics() {
  return (
    <div className="bg-white rounded-[12px] p-6 shadow-sm border border-[#E6E8EC] mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[#191C1E] text-[20px]">Recruitment & Talent Metrics</h3>
          <p className="text-sm text-[#434655]">Quarterly performance and hiring velocity</p>
        </div>
        <button className="bg-[#4A45B6] text-white text-xs px-3 py-1.5 rounded-sm font-medium hover:bg-purple-700 transition-colors">
          All Departments
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-[#64748B] uppercase tracking-wider">Recruitment Progress</p>
        <p className="text-xs font-semibold text-[#4A45B6]">85% Capacity</p>
      </div>

      <div className="space-y-5">
        {roles.map((role) => (
          <div key={role.name} >
            <div className="flex justify-between mb-1.5">
              <span className="text-sm font-bold text-[#191C1E]">{role.name}</span>
              <span className={`text-sm font-semibold ${role.complete ? 'text-green-500' : 'text-[#64748B]'}`}>
                {role.stages}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className={`h-2 ${role.color} rounded-full transition-all`} style={{ width: `${role.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}