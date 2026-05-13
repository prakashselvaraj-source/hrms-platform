'use client';

import { MapPin, Heart, Phone, Siren, ShieldAlert } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';

const countries = [
  { label: 'India', value: 'India' },
  { label: 'United States', value: 'United States' },
  { label: 'United Kingdom', value: 'United Kingdom' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Australia', value: 'Australia' }
];

const relationships = [
  { label: 'Spouse', value: 'Spouse' },
  { label: 'Parent', value: 'Parent' },
  { label: 'Sibling', value: 'Sibling' },
  { label: 'Friend', value: 'Friend' },
  { label: 'Other', value: 'Other' }
];

export default function Contact({ data, updateData }) {
  const handleCurrentChange = (e) => {
    updateData({
      current: { ...data.current, [e.target.name]: e.target.value }
    });
  };

  const handlePermanentChange = (e) => {
    updateData({
      permanent: { ...data.permanent, [e.target.name]: e.target.value }
    });
  };

  const handleEmergencyChange = (e) => {
    updateData({
      emergency: { ...data.emergency, [e.target.name]: e.target.value }
    });
  };

  const toggleSameAsCurrent = (checked) => {
    if (checked) {
      // Surgical population: Copy only relevant current fields to permanent
      updateData({
        sameAsCurrent: true,
        permanent: {
          street: data.current.street,
          city: data.current.city,
          state: data.current.state
        }
      });
    } else {
      updateData({ sameAsCurrent: checked });
    }
  };

  return (
    <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 uppercase tracking-widest mb-6">
        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Phone size={14} />
        </div>
        Connectivity & Logistics
      </div>

      <div className="space-y-6">
        {/* Current Address Hub */}
        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={14} className="text-indigo-600" />
            <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Current Address</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Street Address</label>
              <input
                type="text"
                name="street"
                value={data.current.street}
                onChange={handleCurrentChange}
                placeholder="Building, Street Name..."
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm transition-all"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={data.current.city}
                  onChange={handleCurrentChange}
                  className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Province / State</label>
                <input
                  type="text"
                  name="state"
                  value={data.current.state}
                  onChange={handleCurrentChange}
                  className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Postal Code</label>
                <input
                  type="text"
                  name="zip"
                  value={data.current.zip}
                  onChange={handleCurrentChange}
                  className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <CustomDropdown
                  label="Nation"
                  options={countries}
                  value={data.current.country}
                  onChange={(value) => updateData({ current: { ...data.current, country: value } })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Permanent Address Hub */}
        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-gray-400" />
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Permanent Address</h3>
            </div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-wider cursor-pointer select-none">
              <input
                type="checkbox"
                checked={data.sameAsCurrent}
                onChange={(e) => toggleSameAsCurrent(e.target.checked)}
                className="w-3.5 h-3.5 accent-indigo-600 rounded border-gray-300"
              />
              Same as Active
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Street Address</label>
              <input
                type="text"
                name="street"
                value={data.permanent.street}
                onChange={handlePermanentChange}
                placeholder="Building, Street Name..."
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm transition-all"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">City</label>
                <input
                  type="text"
                  name="city"
                  value={data.permanent.city}
                  onChange={handlePermanentChange}
                  className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Province / State</label>
                <input
                  type="text"
                  name="state"
                  value={data.permanent.state}
                  onChange={handlePermanentChange}
                  className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Hub */}
        <div className="bg-rose-50/30 border border-rose-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Siren size={14} className="text-rose-500" />
            <h3 className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Emergency Contact</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest ml-0.5">Primary Name</label>
              <input
                type="text"
                name="fullName"
                value={data.emergency.fullName}
                onChange={handleEmergencyChange}
                className="w-full bg-white border border-rose-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-rose-500 shadow-sm transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <CustomDropdown
                label="Nexus"
                options={relationships}
                value={data.emergency.relationship}
                onChange={(value) => updateData({ emergency: { ...data.emergency, relationship: value } })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-rose-400 uppercase tracking-widest ml-0.5">Direct Line</label>
              <input
                type="tel"
                name="mobile"
                maxLength={10}
                value={data.emergency.mobile}
                onChange={handleEmergencyChange}
                className="w-full bg-white border border-rose-100 rounded-xl px-4 py-2 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-rose-500 shadow-sm transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
