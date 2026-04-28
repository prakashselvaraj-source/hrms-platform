'use client';

import { useEffect } from 'react';
import { DollarSign, TrendingUp, Wallet } from 'lucide-react';

export default function Salary({ data, updateData }) {
  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });

  // Auto-calculate CTC and Monthly Gross
  useEffect(() => {
    const basic = parseFloat(data.basicSalary) || 0;
    const bonus = parseFloat(data.performanceBonus) || 0;
    const tax = parseFloat(data.professionalTax) || 0;

    // Assuming Basic is Monthly and Bonus is Annual
    const annualCTC = (basic * 12) + bonus - tax;
    const monthlyGross = (annualCTC / 12).toFixed(2);

    if (data.annualPackage !== annualCTC.toString() || data.monthlyGross !== monthlyGross.toString()) {
      updateData({
        annualPackage: annualCTC.toString(),
        monthlyGross: monthlyGross.toString()
      });
    }
  }, [data.basicSalary, data.performanceBonus, data.professionalTax]);

  return (
    <div className='bg-[#FFFFFF] p-8'>
      <div className="text-sm font-semibold text-[#000000] mb-5 flex items-center gap-2">
        <Wallet size={20} />
        Salary Details</div>

      <div className="bg-white  rounded-xl p-5 flex flex-col gap-8">
        {/* Summary */}
        <div className="flex gap-24 mb-6 pb-5 border-l-4 border-[#712AE2] p-4 rounded-sm">
          <div>
            <p className="text-xs font-semibold text-[#712AE2] uppercase tracking-wide mb-1">Annual CTC</p>
            <p className="text-2xl font-bold text-[#191C1E]">Rs. {data.annualPackage || '0'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#737686]  uppercase tracking-wide mb-1">Monthly Gross</p>
            <p className="text-2xl font-bold text-[#191C1E]">Rs. {data.monthlyGross || '0'}</p>
          </div>
        </div>

        {/* Fixed Components */}
        <div className="mb-5 bg-[#FAFAFA] p-8">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign size={15} className="text-violet-600" />
            <h3 className="text-sm font-semibold text-[#191C1E]">Fixed Components</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Basic Salary</label>
              <input
                type="text"
                name="basicSalary"
                value={data.basicSalary}
                onChange={handleChange}
                placeholder="e.g. $5,200"
                className="w-full rounded-md px-3 py-3 text-sm text-gray-700 bg-[#F2F4F6] focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
              />
            </div>
          </div>
        </div>

        {/* Variable & Deductions */}
        <div className='bg-[#FAFAFA] p-8'>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={15} className="text-violet-600" />
            <h3 className="text-sm font-semibold text-[#191C1E]">Variable & Deductions</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center mt-4">
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Performance Bonus (Annual)</label>
              <div className="relative">
                <input
                  type="text"
                  name="performanceBonus"
                  value={data.performanceBonus}
                  onChange={handleChange}
                  placeholder="e.g. $12,000"
                  className="w-full rounded-md px-3 py-3 text-sm bg-[#F2F4F6] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712AE2] pr-24"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#007B71] text-[#FFFFFF] text-[10px] font-bold px-2 py-1 rounded-sm">VARIABLE</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Professional Tax</label>
              <input
                type="text"
                name="professionalTax"
                value={data.professionalTax}
                onChange={handleChange}
                className="w-full rounded-md px-3 py-3 text-sm bg-[#F2F4F6] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
