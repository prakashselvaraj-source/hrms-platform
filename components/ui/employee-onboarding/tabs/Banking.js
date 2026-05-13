'use client';

import { Building2, CreditCard, Banknote, Landmark, ShieldCheck } from 'lucide-react';

export default function Banking({ data, updateData }) {
  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });

  return (
    <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 uppercase tracking-widest mb-6">
        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Landmark size={14} />
        </div>
        Financial Onboarding
      </div>

      <div className="space-y-6">
        {/* Bank Account Intelligence */}
        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={14} className="text-indigo-600" />
            <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Settlement Account</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Account Beneficiary</label>
              <input
                type="text"
                name="accountHolderName"
                value={data.accountHolderName}
                onChange={handleChange}
                placeholder="Full Name as per Bank Records"
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Banking Institution</label>
                <input
                  type="text"
                  name="bankName"
                  value={data.bankName}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Branch Location</label>
                <input
                  type="text"
                  name="branchName"
                  value={data.branchName}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Account Credentials</label>
                <input
                  type="password"
                  name="accountNumber"
                  value={data.accountNumber}
                  onChange={handleChange}
                  placeholder="•••• •••• ••••"
                  className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Routing / IFSC Code</label>
                <input
                  type="text"
                  name="ifscSwift"
                  value={data.ifscSwift}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Government Identity Hub */}
        <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={14} className="text-indigo-600" />
            <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Tax & Identity Forensics</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Universal ID (Aadhar)</label>
              <input
                type="text"
                name="aadharNumber"
                value={data.aadharNumber}
                onChange={handleChange}
                maxLength={12}
                placeholder="12 Digit Identity"
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Tax Token (PAN)</label>
              <input
                type="text"
                name="panNumber"
                value={data.panNumber}
                onChange={handleChange}
                maxLength={10}
                placeholder="10 Character Token"
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Disbursement Preferences */}
        <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Banknote size={14} className="text-emerald-600" />
              <div>
                <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Liquidity Strategy</h3>
                <p className="text-[10px] text-emerald-600/60 font-bold uppercase mt-0.5">Preferred Disbursement Channel</p>
              </div>
            </div>
            <div className="flex p-1 bg-white border border-emerald-100 rounded-xl shadow-sm">
              {['Direct Deposit', 'Cheque'].map((method) => (
                <button
                  key={method}
                  onClick={() => updateData({ disbursementMethod: method })}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all
                    ${data.disbursementMethod === method
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100'
                      : 'text-gray-400 hover:bg-emerald-50'
                    }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
