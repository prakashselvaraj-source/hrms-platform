"use client";

import { useState } from "react";
import { Landmark, UserCircle, Wallet, Edit3, CheckCircle, CreditCard, Radio } from "lucide-react";

export default function BankDetailsPage() {
  const [selected, setSelected] = useState("direct");

  return (
    <div className="min-h-screen  font-sans">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">

        {/* ── Page Title ── */}
        <div>
          <h1 className="text-xl  sm:text-3xl font-bold text-[#1E293B] tracking-tight">
            Personal Bank Details
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">
            Securely manage your salary disbursement accounts
          </p>
        </div>

        {/* ── Bank Card + Tax Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">


          {/* Bank Card */}
          <div className="bg-white rounded-2xl border-l-4 border-[#712AE2] p-5 sm:p-6 shadow-sm">
            {/* Bank header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#F0F4FF] flex items-center justify-center shrink-0">
                  <Landmark size={20} className="text-[#6366F1]" />
                </div>
                <div>
                  <p className="font-bold text-[#1E293B] text-base leading-tight">HDFC Bank</p>

                  <span className="text-[10px] font-bold tracking-widest uppercase bg-[#007B71]
                 text-white px-2.5 py-1 rounded-lg">

                    Primary
                  </span>
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle size={11} />
                    Verified
                  </span>
                </div>
              </div>
              <button className="text-[#6366F1] text-sm font-semibold hover:underline transition-all">
                Edit Details
              </button>
            </div>

            {/* Account info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">
                  Account Number
                </p>
                <p className="text-[#1E293B] font-semibold text-sm tracking-widest">
                  •••• •••• 4201
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">
                  IFSC Code
                </p>
                <p className="text-[#1E293B] font-semibold text-sm tracking-wider">
                  HDFC0001242
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1.5">
                Branch Name
              </p>
              <p className="text-[#1E293B] font-semibold text-sm">
                Mumbai Central, Main Street Area
              </p>
            </div>
          </div>

          {/* Linked Tax Information */}
          <div className="bg-white rounded-2xl  p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <UserCircle size={15} className="text-[#6366F1]" />
              <p className="text-[10px] font-bold tracking-widest uppercase text-[#191C1E]">
                Linked Tax Information
              </p>
            </div>

            {/* PAN */}
            <div className="mb-4">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                PAN Card Number
              </p>

              <div className="flex items-center justify-between bg-[#F2F4F6] border border-gray-100 rounded-xl px-4 py-3">
                <p className="text-[#1E293B] font-bold text-sm tracking-widest">ABCDE1234F</p>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-[#007B71]
                 text-white px-2.5 py-1 rounded-lg">

                  Linked
                </span>
              </div>
            </div>

            {/* TAX ID Status */}
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2">
                Tax ID Status
              </p>
              <div className="bg-[#F2F4F6] border border-gray-100 rounded-xl px-4 py-3">
                <p className="text-emerald-600 font-semibold text-sm flex items-center gap-1.5">
                  <CheckCircle size={14} />
                  Active &amp; Compliance Verified
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* ── Disbursement Preference ── */}
        <div className="bg-[#F2F4F6] rounded-2xl border border-gray-100 p-5 sm:p-6">
          <p className="text-[10px] font-bold tracking-widest uppercase  mb-4">
            Disbursement Preference
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

            {/* Direct Deposit Option */}
            <div
              onClick={() => setSelected("direct")}
              className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 ${selected === "direct"
                ? "border-[#6366F1] bg-[#F5F3FF]"
                : "border-gray-100 bg-white hover:border-indigo-200"
                }`}
            >
              {/* Radio indicator */}
              <div className="absolute top-3.5 right-3.5">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selected === "direct"
                    ? "border-[#6366F1]"
                    : "border-gray-300"
                    }`}
                >
                  {selected === "direct" && (
                    <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  )}
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center mb-3">
                <Wallet size={15} className="text-[#6366F1]" />
              </div>
              <p className="font-bold text-[#1E293B] text-sm">Direct Deposit</p>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                Salary credited directly to primary bank account.
              </p>
            </div>

            {/* Wallet Option (greyed out example) */}
            <div
              onClick={() => setSelected("wallet")}
              className={`relative rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 ${selected === "wallet"
                ? "border-[#6366F1] bg-[#F5F3FF]"
                : "border-gray-100 bg-white hover:border-indigo-200"
                }`}
            >
              <div className="absolute top-3.5 right-3.5">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selected === "wallet"
                    ? "border-[#6366F1]"
                    : "border-gray-300"
                    }`}
                >
                  {selected === "wallet" && (
                    <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                  )}
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center mb-3">
                <CreditCard size={15} className="text-[#6366F1]" />
              </div>
              <p className="font-bold text-[#1E293B] text-sm">Digital Wallet</p>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                Transfer salary to a linked digital wallet.
              </p>
            </div>

          </div>
        </div>

        {/* ── Save Button ── */}
        <div className="flex justify-end">
          <button className="px-6 py-2.5 bg-[#712AE2] text-white text-sm font-semibold rounded-xl hover:bg-[#4F46E5] transition-colors shadow-sm">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
