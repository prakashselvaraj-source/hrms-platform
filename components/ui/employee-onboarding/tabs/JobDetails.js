'use client';

import { useState, useRef, useEffect } from 'react';
import { Info, MapPin, ChevronDown } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';

import { getAllRoles } from '@/services/roleService';
import { useTenant } from '@/hooks/useTenant';

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Intern'];
const departments = ['Product & Experience', 'Engineering', 'Human Resources', 'Finance'];
const managers = ['John Smith', 'Sarah Jenkins', 'Mike Johnson'];
const locations = ['Remote (Global)', 'On-site', 'Hybrid'];

export default function JobDetails({ data, updateData }) {
  const [roleOptions, setRoleOptions] = useState([]);
  const tenantId = useTenant();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        if (!tenantId) return;
        const response = await getAllRoles(tenantId);
        if (response.data && Array.isArray(response.data)) {
          setRoleOptions(response.data.map(r => ({ label: r.name, value: r.name })));
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, [tenantId]);
  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });

  return (
    <div className="bg-[#FFFFFF] p-8">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#000000] mb-5">
        <Info size={22} />
        Job Details
      </div>

      <div className="  rounded-xl p-5 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide mb-1.5">Designation</label>
            <input
              type="text"
              name="designation"
              value={data.designation}
              onChange={handleChange}
              placeholder="e.g. Senior Product Designer"
              className="w-full  rounded-md px-3 py-2.5 text-sm text-[#434655] bg-[#F2F4F6] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
            />
          </div>
          <div>
            <CustomDropdown
              label="Department"
              options={departments}
              value={data.department}
              onChange={(value) => updateData({ department: value })}
              placeholder="Select Department"
            />
          </div>
          <div>
            <CustomDropdown
              label="Add Role"
              options={roleOptions}
              value={data.role}
              onChange={(value) => updateData({ role: value })}
              placeholder="Select Role"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide mb-1.5">Date of Joining</label>
            <input
              type="date"
              name="dateOfJoining"
              value={data.dateOfJoining}
              onChange={handleChange}
              placeholder="mm/dd/yyyy"
              className="w-full  rounded-md px-3 py-2.5 text-sm text-[#434655] bg-[#F2F4F6] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
            />
          </div>
          <div>
            <CustomDropdown
              label="Reporting Manager"
              options={managers}
              value={data.reportingManager}
              onChange={(value) => updateData({ reportingManager: value })}
              placeholder="Select Manager"
            />
          </div>
        </div>
      </div>

      {/* Work Setup */}
      <div className="  rounded-sm p-5 border-l-4 border-[#712AE2]">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={22} className="text-[#4A45B6]" />
          <h3 className="text-sm font-semibold text-[#191C1E]">Work Setup</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <CustomDropdown
              label="Work Location"
              options={locations}
              value={data.workLocation}
              onChange={(value) => updateData({ workLocation: value })}
              placeholder="Select Location"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#434655] uppercase tracking-wide mb-1.5">Employment Type</label>
            <div className="flex flex-wrap gap-2  bg-[#F2F4F6] p-2">
              {employmentTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => updateData({ employmentType: type })}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${data.employmentType === type
                      ? 'bg-[#FFFFFF] text-[#4A45B6] rounded-md'
                      : ' '
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
