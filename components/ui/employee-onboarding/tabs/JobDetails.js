'use client';

import { useState, useRef, useEffect } from 'react';
import { Info, MapPin, Briefcase, Building2, UserCheck } from 'lucide-react';
import CustomDropdown from '../CustomDropdown';

import { getAllRoles } from '@/services/roleService';
import { useTenant } from '@/hooks/useTenant';
import { getDepartments } from '@/services/departmentService';

const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Intern'];
const managers = ['John Smith', 'Sarah Jenkins', 'Mike Johnson'];
const locations = ['Remote (Global)', 'On-site', 'Hybrid'];

export default function JobDetails({ data, updateData }) {
  const [roleOptions, setRoleOptions] = useState([]);
  const [departments, setDepartments] = useState([]);
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

    const fetchDepartments = async () => {
      try {
        if (!tenantId) return;
        const response = await getDepartments(tenantId);
        const dept = response.data.map(d => ({ label: d.name, value: d.name }));
        setDepartments(dept);
      } catch (err) {
        console.log(err);
      }
    };
    fetchDepartments();
  }, [tenantId]);

  const handleChange = (e) => updateData({ [e.target.name]: e.target.value });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 uppercase tracking-widest mb-6">
        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Briefcase size={14} />
        </div>
        Professional Assignment
      </div>

      <div className="space-y-6">
        {/* Core Job Metrics */}
        <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Designation</label>
              <input
                type="text"
                name="designation"
                value={data.designation}
                onChange={handleChange}
                placeholder="Senior Architect"
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm"
              />
            </div>
            <CustomDropdown
              label="Department"
              options={departments}
              value={data.department}
              onChange={(value) => updateData({ department: value })}
              placeholder="Select Division"
            />
            <CustomDropdown
              label="Functional Role"
              options={roleOptions}
              value={data.role}
              onChange={(value) => updateData({ role: value })}
              placeholder="Select Role"
            />
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Joining Date</label>
              <input
                type="date"
                name="dateOfJoining"
                value={data.dateOfJoining}
                onChange={handleChange}
                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 shadow-sm"
              />
            </div>

          </div>
        </div>

        {/* Work Setup Hub */}
        <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={14} className="text-indigo-600" />
            <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Workspace Logistics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomDropdown
              label="Operational Hub"
              options={locations.map(l => ({ label: l, value: l }))}
              value={data.workLocation}
              onChange={(value) => updateData({ workLocation: value })}
              placeholder="Select Location"
            />
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-0.5">Engagement Modality</label>
              <div className="flex flex-wrap gap-1.5 p-1 bg-white border border-gray-100 rounded-xl shadow-inner">
                {employmentTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => updateData({ employmentType: type })}
                    className={`flex-1 min-w-[80px] py-2 rounded-lg text-[11px] font-bold uppercase tracking-tight transition-all
                      ${data.employmentType === type
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                        : 'text-gray-400 hover:bg-gray-50'
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
    </div>
  );
}
