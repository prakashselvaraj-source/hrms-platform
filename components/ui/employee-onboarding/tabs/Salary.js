'use client';

import { useEffect } from 'react';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Salary({ data, updateData }) {
  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });

  useEffect(() => {
    const basic = parseFloat(data.basicSalary) || 0;
    const bonus = parseFloat(data.performanceBonus) || 0;
    const tax = parseFloat(data.professionalTax) || 0;

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
    <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 uppercase tracking-widest mb-6">
        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Wallet size={14} />
        </div>
        Surgical Remuneration
      </div>

      <div className="space-y-6">
        {/* Dynamic Financial Summary */}
        <div className="bg-indigo-600 rounded-xl p-6 shadow-lg shadow-indigo-100 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-1">Projected Annual CTC</p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-black text-white tracking-tighter">Rs. {data.annualPackage || '0'}</span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 text-white rounded-md text-[9px] font-black mb-1">
                <ArrowUpRight size={10} />
                Calculated
              </div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
          <div className="flex-1">
            <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-1">Monthly Gross (Est.)</p>
            <span className="text-2xl font-black text-white tracking-tighter">Rs. {data.monthlyGross || '0'}</span>
          </div>
        </div>

        {/* Calculation Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator size={14} className="text-indigo-600" />
              <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Fixed Parameters</h3>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Basic Liquidity (Monthly)</label>
              <div className="relative">
                <input
                  type="number"
                  name="basicSalary"
                  value={data.basicSalary}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300">INR</span>
              </div>
            </div>
          </div>

          <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-rose-500" />
              <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Variable & Deductions</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest ml-0.5">Performance Incentive (Annual)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="performanceBonus"
                    value={data.performanceBonus}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full bg-white border border-rose-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-rose-500 shadow-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-rose-500 text-white text-[8px] font-black rounded-lg uppercase tracking-tighter">Variable</div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest ml-0.5">Professional Tax Token</label>
                <input
                  type="number"
                  name="professionalTax"
                  value={data.professionalTax}
                  onChange={handleChange}
                  className="w-full bg-white border border-rose-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-rose-500 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
