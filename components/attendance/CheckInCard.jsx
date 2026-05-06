export default function CheckInCard({
    today,
    timer,
    loading,
    onCheckIn,
    onCheckOut,
}) {
    const isCheckedIn = today?.checkIn && !today?.checkOut;
    const isCheckedOut = today?.checkOut;

    const statusConfig = {
        completed: {
            label: 'Day Completed',
            emoji: '🏁',
            color: 'text-slate-600',
            bg: 'bg-slate-50',
            ring: 'border-slate-300',
            subtext: `Checked out at ${today?.checkOut || ''}`
        },
        working: {
            label: 'Currently Working',
            emoji: '🔥',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            ring: 'border-emerald-400',
            subtext: 'Keep it up!'
        },
        idle: {
            label: 'Ready to Start',
            emoji: '☕',
            color: 'text-slate-500',
            bg: 'bg-slate-50',
            ring: 'border-slate-300',
            subtext: 'Tap Check In to begin'
        }
    };

    const status = isCheckedOut ? 'completed' : isCheckedIn ? 'working' : 'idle';
    const config = statusConfig[status];

    return (
        <div className="bg-white shadow-lg rounded-3xl p-8 max-w-md mx-auto">
            {/* Status Ring */}
            <div className="flex justify-center mb-6">
                <div className={`relative w-32 h-32 rounded-full ${config.bg} border-4 ${config.ring} flex items-center justify-center transition-all duration-500`}>
                    <span className="text-5xl">{config.emoji}</span>
                    {isCheckedIn && (
                        <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
                    )}
                </div>
            </div>

            {/* Status Text */}
            <div className="text-center space-y-1 mb-8">
                <h2 className={`text-2xl font-bold ${config.color}`}>
                    {config.label}
                </h2>
                <p className="text-sm text-slate-400">
                    {config.subtext}
                </p>
            </div>

            {/* Timer */}
            {isCheckedIn && (
                <div className="bg-slate-900 rounded-2xl p-6 mb-8 text-center">
                    <div className="text-slate-400 text-xs uppercase tracking-widest mb-2">
                        Session Duration
                    </div>
                    <div className="text-4xl font-mono font-bold text-emerald-400 tracking-wider">
                        {timer}
                    </div>
                </div>
            )}

            {/* Completed Summary */}
            {isCheckedOut && today && (
                <div className="bg-slate-50 rounded-2xl p-5 mb-8 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Check In</span>
                        <span className="font-semibold text-slate-700">{today.checkIn}</span>
                    </div>
                    <div className="w-full h-px bg-slate-200" />
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Check Out</span>
                        <span className="font-semibold text-slate-700">{today.checkOut}</span>
                    </div>
                    <div className="w-full h-px bg-slate-200" />
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Total Hours</span>
                        <span className="font-semibold text-emerald-600">{today.totalHours || timer}</span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
                {!isCheckedOut && (
                    <button
                        disabled={isCheckedIn || loading}
                        onClick={onCheckIn}
                        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2
                            ${isCheckedIn
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-200 active:scale-[0.98]'
                            }`}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                Check In
                            </>
                        )}
                    </button>
                )}

                {isCheckedIn && (
                    <button
                        disabled={loading}
                        onClick={onCheckOut}
                        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2
                            ${loading
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-200 active:scale-[0.98]'
                            }`}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Check Out
                            </>
                        )}
                    </button>
                )}

                {isCheckedOut && (
                    <div className="text-center py-4 text-slate-400 text-sm">
                        See you tomorrow! 👋
                    </div>
                )}
            </div>
        </div>
    );
}