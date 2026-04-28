import { Download } from 'lucide-react';

const employees = [
  {
    initials: 'MS', name: 'Michael Scott', dept: 'Regional Management',
    status: 'PRESENT', statusColor: 'text-green-600 bg-[#007B7133   ]',
    checkIn: '08:45 AM', mode: 'On-site', avatarBg: 'bg-blue-500'
  },
  {
    initials: 'PB', name: 'Pam Beesly', dept: 'Admin & Ops',
    status: 'PRESENT', statusColor: 'text-green-600 bg-green-50',
    checkIn: '09:02 AM', mode: 'Remote', avatarBg: 'bg-pink-500'
  },
  {
    initials: 'JH', name: 'Jim Halpert', dept: 'Sales Strategy',
    status: 'LATE', statusColor: 'text-red-600 bg-red-50',
    checkIn: '10:15 AM', mode: 'On-site', avatarBg: 'bg-orange-400'
  },
];

export default function AttendanceTable() {
  return (
    <div className="bg-white rounded-[12px] p-5 shadow-sm border border-[#E6E8EC] mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-[#191C1E] text-[20px]">Attendance Tracking</h3>
          <p className="text-xs text-[#6B7280]">Real-time occupancy and check-in logs</p>
        </div>
        <button className="flex border-1 border-[#C3C6D733] py-3 px-4 items-center gap-1.5 text-xs text-[#191C1E] hover:text-gray-800 transition-colors font-medium">
          <Download size={13} />
          Export to Excel
        </button>
      </div>
<div className='overflow-auto'>
    <table className="w-full">
        <thead>
          <tr className="border-b border-[#E6E8EC]">
            {['EMPLOYEE', 'DEPARTMENT', 'STATUS', 'CHECK-IN', 'WORK MODE'].map(col => (
              <th key={col} className="text-left text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider pb-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.name} className="border-b border-[#F5F6FA] last:border-0">
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${emp.avatarBg} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{emp.initials}</span>
                  </div>
                  <span className="text-sm font-medium text-[#1A1D1F]">{emp.name}</span>
                </div>
              </td>
              <td className="py-3 text-sm text-[#6B7280]">{emp.dept}</td>
              <td className="py-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${emp.statusColor}`}>
                  {emp.status}
                </span>
              </td>
              <td className="py-3 text-sm text-[#1A1D1F]">{emp.checkIn}</td>
              <td className="py-3 text-sm text-[#6B7280]">{emp.mode}</td>
            </tr>
          ))}
        </tbody>
      </table>
</div>
  
    </div>
  );
}