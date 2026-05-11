'use client';

import { uploadImage } from '@/services/uploadService';
import { Camera, Info, User } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' }
];

const departments = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product & Experience', value: 'product' },
  { label: 'Human Resources', value: 'hr' },
  { label: 'Finance', value: 'finance' },
  { label: 'Marketing', value: 'marketing' }
];

export default function PersonalInformation({ data, updateData }) {
  const handleChange = (e) => {
    console.log("handleChange", e);
    updateData({ [e.target.name]: e.target.value });
  };
  console.log(data.photo);
  console.log(data.photoUrl);
  return (
    <div className='bg-[#FFFFFF] p-8'>
      <div className="flex items-center gap-2 text-sm font-semibold mb-5">
        <span className="w-4 h-4 rounded-full  flex items-center justify-center text-xs"><User /></span>
        Personal Info
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Photo Upload */}
        <div className="flex-shrink-0">
          <div
            onClick={() => document.getElementById('photo-upload').click()}
            className="w-36 h-36 border-2 border-dashed border-[#C3C6D780] rounded-xl flex flex-col items-center justify-center bg-[#F2F4F6] cursor-pointer hover:bg-gray-100 transition-colors relative group overflow-hidden"
          >
            {(data?.photo || data?.photoUrl) ? (
              <img
                src={data.photo || data.photoUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <Camera size={24} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-400 font-medium">UPLOAD PHOTO</span>
              </>
            )}

            <input
              id="photo-upload"
              type="file"
              className="hidden"

              accept=".jpg,.jpeg,.png"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                // ✅ validation
                if (!['image/jpeg', 'image/png'].includes(file.type)) {
                  alert('Only JPG and PNG files are allowed.');
                  return;
                }

                if (file.size > 2 * 1024 * 1024) {
                  alert('Max file size is 2MB');
                  return;
                }

                try {
                  // ✅ 1. Show preview immediately
                  const previewUrl = URL.createObjectURL(file);
                  updateData({
                    photo: previewUrl,
                    photoUrl: ''   // clear old server image
                  });

                  // ✅ 2. Upload in background
                  const res = await uploadImage(file);

                  console.log("response from server", res.data.url);

                  // ✅ 3. Replace preview with server image
                  updateData({
                    photo: '',                  // remove preview
                    photoUrl: res.data.url          // final upload result object
                  });




                } catch (err) {
                  console.error("Upload failed", err);
                  alert("Image upload failed");
                }
              }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            ACCEPTED: JPG, PNG.<br />MAX SIZE: 2MB.
          </p>
        </div>

        {/* Form Fields */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">First Name</label>
            <input
              type="text"
              name="firstName"
              value={data.firstName}
              onChange={handleChange}
              placeholder="e.g. Jonathan"
              className="w-full  bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-[#6B7280] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={data.lastName}
              onChange={handleChange}
              placeholder="e.g. Doe"
              className="w-full  bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-[#6B7280] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={data.dateOfBirth}
              onChange={handleChange}
              placeholder="mm/dd/yyyy"
              className="w-full  bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-[#6B7280] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2] focus:border-transparent"
            />
          </div>
          <div>
            <CustomDropdown
              label="Gender"
              options={genderOptions}
              value={data.gender}
              onChange={(value) => updateData({ gender: value })}
              placeholder="Select Gender"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Work Email</label>
            <input
              type="email"
              name="workEmail"
              value={data.workEmail}
              onChange={handleChange}
              placeholder="j.doe@atelier.com"
              className="w-full  bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-[#6B7280] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={data.mobileNumber}
              onChange={handleChange}
              maxLength={10}
              placeholder="+1 (555) 000-0000"
              className="w-full  bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-[#6B7280] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Onboarding Checklist Notice */}
      <div className="mt-6 flex gap-3 bg-[#4A45B60D] border-l-4 border-[#712AE2] rounded-sm px-8 py-6">
        <Info size={18} className="text-[#4A45B6] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-[#4A45B6] mb-0.5">Onboarding Checklist</p>
          <p className="text-xs text-[#434655CC] leading-relaxed">
            Completing the personal info section automatically triggers the invitation email to the employee&apos;s work email once the profile is saved as active.
          </p>
        </div>
      </div>
    </div>
  );
}