'use client';

import { uploadImage } from '@/services/uploadService';
import { Camera, Info, User } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
];

export default function PersonalInformation({ data, updateData }) {
  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 uppercase tracking-widest mb-6">
        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <User size={14} />
        </div>
        Identity Details
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Compact Photo Upload */}
        <div className="flex-shrink-0">
          <div
            onClick={() => document.getElementById('photo-upload').click()}
            className="w-28 h-28 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-indigo-50 transition-all relative group overflow-hidden shadow-inner"
          >
            {(data?.photo || data?.photoUrl) ? (
              <img src={data.photo || data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Camera size={20} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <span className="text-[9px] text-gray-400 font-black tracking-widest uppercase">Photo</span>
              </div>
            )}
            <input
              id="photo-upload"
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (!['image/jpeg', 'image/png'].includes(file.type)) {
                  toast.error('Only JPG/PNG allowed');
                  return;
                }
                if (file.size > 2 * 1024 * 1024) {
                  toast.error('Max 2MB');
                  return;
                }
                try {
                  const previewUrl = URL.createObjectURL(file);
                  updateData({ photo: previewUrl, photoUrl: '' });
                  const res = await uploadImage(file);
                  updateData({ photo: '', photoUrl: res.data.url });
                } catch (err) {
                  toast.error("Upload failed");
                }
              }}
            />
          </div>
          <p className="text-[9px] text-gray-400 mt-2 text-center font-bold tracking-tight">
            JPG, PNG (MAX 2MB)
          </p>
        </div>

        {/* Surgical Form Fields */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">First Name</label>
            <input
              type="text"
              name="firstName"
              value={data.firstName}
              onChange={handleChange}
              placeholder="Jonathan"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={data.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={data.dateOfBirth}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <CustomDropdown
              label="Gender"
              options={genderOptions}
              value={data.gender}
              onChange={(value) => updateData({ gender: value })}
              placeholder="Select Gender"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Corporate Email</label>
            <input
              type="email"
              name="workEmail"
              value={data.workEmail}
              onChange={handleChange}
              placeholder="j.doe@company.com"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Contact Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={data.mobileNumber}
              onChange={handleChange}
              maxLength={10}
              placeholder="00000 00000"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Sleek Intelligence Notice */}
      <div className="mt-8 flex gap-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl px-6 py-4">
        <Info size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest mb-1">System Protocol</p>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            Finalizing this section triggers an automated invitation to the employee's work email once the profile synchronization is complete.
          </p>
        </div>
      </div>
    </div>
  );
}