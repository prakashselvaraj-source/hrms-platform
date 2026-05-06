export default function AttendanceTable({ data }) {
    const getStatusStyle = (status) => {
        const styles = {
            present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            absent: 'bg-rose-50 text-rose-700 border-rose-200',
            'half-day': 'bg-amber-50 text-amber-700 border-amber-200',
            late: 'bg-violet-50 text-violet-700 border-violet-200',
            completed: 'bg-slate-50 text-slate-600 border-slate-200',
        };
        return styles[status?.toLowerCase()] || 'bg-gray-50 text-gray-600 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            present: '✓',
            absent: '✕',
            'half-day': '◐',
            late: '!',
            completed: '✓',
        };
        return icons[status?.toLowerCase()] || '•';
    };

    return (
        <div className="w-full mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Attendance History</h3>
                <span className="text-sm text-slate-400">{data.length} records</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Check In
                            </th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Check Out
                            </th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Duration
                            </th>
                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item, index) => (
                            <tr
                                key={item.id || index}
                                className="hover:bg-slate-50/60 transition-colors duration-150 group"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-800">
                                            {item.date}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {item.dayName || 'Working Day'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.checkIn ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                            <span className="text-sm font-mono text-slate-700">
                                                {item.checkIn}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-300">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.checkOut ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-rose-400" />
                                            <span className="text-sm font-mono text-slate-700">
                                                {item.checkOut}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-300">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {item.totalHours ? (
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm font-semibold text-slate-700">
                                                {item.totalHours}h
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-sm text-slate-300">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(item.status)}`}>
                                        <span>{getStatusIcon(item.status)}</span>
                                        {item.status || 'Unknown'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {data.length === 0 && (
                <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className="text-slate-500 font-medium">No attendance records yet</p>
                    <p className="text-sm text-slate-400 mt-1">Check in to start tracking</p>
                </div>
            )}
        </div>
    );
}