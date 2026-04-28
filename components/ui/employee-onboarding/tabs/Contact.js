'use client';

import { MapPin, Heart, Phone, Siren, ShieldAlert } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';

const countries = ['United States', 'India', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'];
const relationships = ['Spouse', 'Parent', 'Sibling', 'Friend', 'Other'];

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
      updateData({
        sameAsCurrent: true,
        permanent: { ...data.current }
      });
    } else {
      updateData({ sameAsCurrent: checked });
    }
  };

  return (
    <div className='bg-[#FFFFFF] p-8'>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#000000] mb-5">
        <Phone size={16} /> Contact Details
      </div>

      {/* Current Address */}
      <div className="bg-white  rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-[#4A45B6] rounded-full" />
          <MapPin size={16} className="text-[#4A45B6]" />
          <h3 className="text-sm font-semibold text-[#4A45B6]">Current Address</h3>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Street Address</label>
            <input
              type="text"
              name="street"
              value={data.current.street}
              onChange={handleCurrentChange}
              className="w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">City</label>
              <input
                type="text"
                name="city"
                value={data.current.city}
                onChange={handleCurrentChange}
                className="w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">State / Province</label>
              <input
                type="text"
                name="state"
                value={data.current.state}
                onChange={handleCurrentChange}
                className="w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Zip Code</label>
              <input
                type="text"
                name="zip"
                value={data.current.zip}
                onChange={handleCurrentChange}
                className="w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
              />
            </div>
            <div>
              <CustomDropdown
                label="Country"
                options={countries}
                value={data.current.country}
                onChange={(value) => updateData({ current: { ...data.current, country: value } })}
                placeholder="Select Country"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Permanent Address */}
      <div className="bg-white  rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#4A45B6] rounded-full" />
            <MapPin size={16} className="text-[#4A45B6]" />
            <h3 className="text-sm font-semibold text-[#4A45B6]">Permanent Address</h3>
          </div>
          <label className="flex items-center gap-2 text-xs text-[#434655] cursor-pointer">
            <input
              type="checkbox"
              checked={data.sameAsCurrent}
              onChange={(e) => toggleSameAsCurrent(e.target.checked)}
              className="w-3.5 h-3.5 accent-violet-600"
            />
            Same as Current
          </label>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Street Address</label>
            <input
              type="text"
              name="street"
              value={data.sameAsCurrent ? data.current.street : data.permanent.street}
              onChange={handlePermanentChange}
              readOnly={data.sameAsCurrent}
              className={`w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712AE2] ${data.sameAsCurrent ? 'bg-gray-50' : ''}`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">City</label>
              <input
                type="text"
                name="city"
                value={data.sameAsCurrent ? data.current.city : data.permanent.city}
                onChange={handlePermanentChange}
                readOnly={data.sameAsCurrent}
                className={`w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712AE2] ${data.sameAsCurrent ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">State / Province</label>
              <input
                type="text"
                name="state"
                value={data.sameAsCurrent ? data.current.state : data.permanent.state}
                onChange={handlePermanentChange}
                readOnly={data.sameAsCurrent}
                className={`w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712AE2] ${data.sameAsCurrent ? 'bg-gray-50' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white  rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-[#4A45B6] rounded-full" />
          <ShieldAlert size={18} className="text-[#4A45B6]" />
          <h3 className="text-sm font-semibold text-[#4A45B6]"> Emergency Contact</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={data.emergency.fullName}
              onChange={handleEmergencyChange}
              className="w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
            />
          </div>
          <div>
            <CustomDropdown
              label="Relationship"
              options={relationships}
              value={data.emergency.relationship}
              onChange={(value) => updateData({ emergency: { ...data.emergency, relationship: value } })}
              placeholder="Select Relationship"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              maxLength={10}
              value={data.emergency.mobile}
              onChange={handleEmergencyChange}
              className="w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
