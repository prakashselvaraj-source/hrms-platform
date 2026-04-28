'use client';

import { Building2, CreditCard, Banknote, Landmark } from 'lucide-react';

export default function Banking({ data, updateData }) {
  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });

  return (
    <div className='p-8 bg-[#FFFFFF] flex flex-col gap-8'>
      <div className="text-sm font-semibold text-[#000000] mb-5 flex items-center gap-2">
        <Landmark size={20} />
        Bank Details
        </div>

      {/* Bank Account Information */}
      <div className="bg-white  rounded-sm p-5 mb-4 border-l-4 border-[#712AE2]">
        <div className="flex items-center gap-2 mb-4">
          
          <Building2 size={16} className="text-[#4A45B6]" />
          <h3 className="text-sm font-semibold text-[#191C1E]">Bank Account Information</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Account Holder Name</label>
            <input
              type="text"
              name="accountHolderName"
              value={data.accountHolderName}
              onChange={handleChange}
              className="w-full  rounded-md px-3 py-2.5 text-sm text-[#6B7280] bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={data.bankName}
                onChange={handleChange}
                placeholder="e.g. Global Trust Bank"
                className="w-full  rounded-md px-3 py-2.5 text-sm text-[#6B7280] bg-[#F2F4F6] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Branch Name</label>
              <input
                type="text"
                name="branchName"
                value={data.branchName}
                onChange={handleChange}
                placeholder="e.g. Downtown Manhattan"
                className="w-full  rounded-md px-3 py-2.5 text-sm text-[#6B7280] bg-[#F2F4F6] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Account Number</label>
              <input
                type="password"
                name="accountNumber"
                value={data.accountNumber}
                onChange={handleChange}
                placeholder="•••• •••• •••• 1234"
                className="w-full  rounded-md px-3 py-2.5 text-sm text-[#6B7280] bg-[#F2F4F6] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">IFSC / SWIFT Code</label>
              <input
                type="text"
                name="ifscSwift"
                value={data.ifscSwift}
                onChange={handleChange}
                className="w-full  rounded-md px-3 py-2.5 text-sm text-[#6B7280] bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Government ID / Tax Information */}
      <div className="bg-white  rounded-sm border-l-4 border-[#712AE2] p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          
          <CreditCard size={16} className="text-[#4A45B6]" />
          <h3 className="text-sm font-semibold text-[#191C1E]">Government ID / Tax Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Aadhar Number (12 Digits)</label>
            <input
              type="text"
              name="aadharNumber"
              value={data.aadharNumber}
              onChange={handleChange}
              className="w-full  rounded-md px-3 py-2.5 text-sm text-[#6B7280] bg-[#F2F4F6]  focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
            />
            <p className="text-[10px] text-gray-400 mt-1">Enter without spaces or hyphens.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">PAN Number (10 Alphanumeric)</label>
            <input
              type="text"
              name="panNumber"
              value={data.panNumber}
              onChange={handleChange}
              className="w-full  rounded-md px-3 py-2.5 text-sm text-[#6B7280] bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
            />
            <p className="text-[10px] text-gray-400 mt-1">Permanent Account Number as per Govt. Records.</p>
          </div>
        </div>
      </div>

      {/* Payment Preferences */}
      <div className="bg-white  rounded-sm p-5 border-l-4 border-[#712AE2]">
        <div className="flex items-center gap-2 mb-4">
          
          <Banknote size={16} className="text-[#4A45B6]" />
          <h3 className="text-sm font-semibold text-[#191C1E]">Payment Preferences</h3>
        </div>
        <div className="flex items-center gap-8 bg-[#F2F4F6] px-4 py-4 w-fit rounded-md">
          <div>
            <p className="text-sm font-medium text-[#191C1E]">Salary Disbursement Method</p>
            <p className="text-xs text-[#434655] mt-0.5">Choose how you wish to receive your monthly salary.</p>
          </div>
          <div className="flex gap-2 bg-[#FFFFFF] p-2 rounded-sm">
            {['Direct Deposit', 'Cheque'].map((method) => (
              <button
                key={method}
                onClick={() => updateData({ disbursementMethod: method })}
                className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors
                  ${data.disbursementMethod === method
                    ? 'bg-[#4A45B6] text-[#FFFFFF]'
                    : 'text-[#737686]'
                  }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
