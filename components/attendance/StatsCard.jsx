export default function StatsCard({ stats }) {
    if (!stats) return null;

    const cards = [
        {
            label: 'Present',
            value: stats.present,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            ),
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700',
            iconBg: 'bg-emerald-100',
            iconText: 'text-emerald-600'
        },
        {
            label: 'Absent',
            value: stats.absent,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ),
            bg: 'bg-rose-50',
            border: 'border-rose-200',
            text: 'text-rose-700',
            iconBg: 'bg-rose-100',
            iconText: 'text-rose-600'
        },
        {
            label: 'Half Day',
            value: stats.halfDay,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-700',
            iconBg: 'bg-amber-100',
            iconText: 'text-amber-600'
        },
        {
            label: 'Late',
            value: stats.late,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: 'bg-violet-50',
            border: 'border-violet-200',
            text: 'text-violet-700',
            iconBg: 'bg-violet-100',
            iconText: 'text-violet-600'
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className={`${card.bg} ${card.border} border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className={`${card.iconBg} ${card.iconText} p-2 rounded-xl`}>
                            {card.icon}
                        </span>
                        <span className={`${card.text} text-xs font-semibold uppercase tracking-wider opacity-70`}>
                            {card.label}
                        </span>
                    </div>
                    <div className={`${card.text} text-3xl font-bold`}>
                        {card.value ?? 0}
                    </div>
                </div>
            ))}
        </div>
    );
}