export default function OperationPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Operation Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link 
                    href={`/${useTenant()}/admin/operations/support`}
                    className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                >
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-[#4A45B6] mb-4 group-hover:bg-[#4A45B6] group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h3 className="font-bold text-gray-900">Ticket Management</h3>
                    <p className="text-sm text-gray-500 mt-2">Manage employee support requests and update ticket statuses.</p>
                </Link>
            </div>
        </div>
    );
}