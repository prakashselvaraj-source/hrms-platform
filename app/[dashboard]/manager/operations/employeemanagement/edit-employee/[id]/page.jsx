"use client";

import { useState, useEffect, use } from "react";
import { 
  User, Mail, Phone, Briefcase, Building2, MapPin, 
  Calendar, CreditCard, Shield, FileText, ChevronLeft, 
  Save, Edit3, X, Camera, MoreHorizontal, Globe,
  Fingerprint, Award, Banknote, Clock, History
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useTenant } from "@/hooks/useTenant";
import useRole from "@/hooks/useRole";
import { getEmployeeById, updateEmployee } from "@/services/employeeService";
import { motion, AnimatePresence } from "framer-motion";

export default function EditEmployeePage({ params }) {
  const { id } = use(params);
  const tenant = useTenant();
  const role = useRole();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id && tenant) fetchEmployee();
  }, [id, tenant]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const res = await getEmployeeById(id, tenant);
      setEmployee(res.data);
    } catch (error) {
      toast.error("Failed to load employee profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateEmployee(id, employee, tenant);
      toast.success("Profile synchronized successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to sync updates to server");
    } finally {
      setSaving(false);
    }
  };

  const rolePrefix = role === "SUPER_ADMIN" ? "manager" : "admin";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500 animate-pulse uppercase tracking-widest">Hydrating Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* ── Top Navigation Bar ── */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">Personnel Profile</h1>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tight mt-1">ID: {employee?.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-500 text-sm font-bold hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdate}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {saving ? "Synchronizing..." : <><Save size={16} /> Save Changes</>}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Sidebar: Summary Card ── */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="h-24 bg-gradient-to-r from-indigo-600 to-violet-600 relative">
               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-white p-1 border-4 border-white shadow-xl overflow-hidden">
                      {employee?.photoUrl ? (
                        <img src={employee.photoUrl} className="w-full h-full object-cover rounded-2xl" alt="Profile" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                           <User size={40} />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-1 right-1 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-indigo-600 hover:scale-105 transition-transform">
                        <Camera size={14} />
                      </button>
                    )}
                  </div>
               </div>
            </div>
            
            <div className="pt-16 pb-8 px-6 text-center">
              <h2 className="text-xl font-bold text-slate-900">{employee?.firstName} {employee?.lastName}</h2>
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mt-1">{employee?.designation || "Unspecified Role"}</p>
              
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  employee?.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-200"
                }`}>
                  {employee?.status}
                </span>
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold uppercase tracking-wider">
                   {employee?.department}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 p-6 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Work Email</p>
                    <p className="text-sm font-semibold text-slate-700 truncate">{employee?.workEmail}</p>
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                    <p className="text-sm font-semibold text-slate-700 truncate">{employee?.mobileNumber || "N/A"}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
             <Shield className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
             <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-4">Quick Stats</h4>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase">Performance</p>
                   <p className="text-lg font-bold">92%</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-white/40 uppercase">Tenure</p>
                   <p className="text-lg font-bold">1.4 yrs</p>
                </div>
             </div>
          </div>
        </aside>

        {/* ── Main Content: Detail Sections ── */}
        <main className="lg:col-span-8">
           {/* Tab Switcher */}
           <div className="flex items-center gap-1 bg-white p-1.5 border border-slate-200 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
              {["overview", "work", "financial", "documents"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap
                    ${activeTab === tab ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {tab}
                </button>
              ))}
           </div>

           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               transition={{ duration: 0.2 }}
               className="space-y-6"
             >
                {activeTab === "overview" && (
                  <>
                    {/* Basic Info Section */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                       <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <User size={20} />
                             </div>
                             <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <DetailField label="First Name" value={employee?.firstName} isEditing={isEditing} onChange={(v) => setEmployee({...employee, firstName: v})} />
                          <DetailField label="Last Name" value={employee?.lastName} isEditing={isEditing} onChange={(v) => setEmployee({...employee, lastName: v})} />
                          <DetailField label="Date of Birth" value={employee?.dateOfBirth} type="date" isEditing={isEditing} onChange={(v) => setEmployee({...employee, dateOfBirth: v})} />
                          <DetailField label="Gender" value={employee?.gender} isEditing={isEditing} type="select" options={["Male", "Female", "Other"]} onChange={(v) => setEmployee({...employee, gender: v})} />
                          <DetailField label="Nationality" value={employee?.nationality || "Indian"} isEditing={isEditing} onChange={(v) => setEmployee({...employee, nationality: v})} />
                          <DetailField label="Marital Status" value={employee?.maritalStatus || "Single"} isEditing={isEditing} type="select" options={["Single", "Married", "Divorced"]} onChange={(v) => setEmployee({...employee, maritalStatus: v})} />
                       </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                       <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                             <MapPin size={20} />
                          </div>
                          <h3 className="text-base font-bold text-slate-900">Contact & Address</h3>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <DetailField label="Work Phone" value={employee?.mobileNumber} isEditing={isEditing} onChange={(v) => setEmployee({...employee, mobileNumber: v})} />
                          <DetailField label="Personal Email" value={employee?.personalEmail || "private@mail.com"} isEditing={isEditing} onChange={(v) => setEmployee({...employee, personalEmail: v})} />
                          <div className="md:col-span-2">
                            <DetailField label="Current Address" value={employee?.currentStreet} isEditing={isEditing} onChange={(v) => setEmployee({...employee, currentStreet: v})} />
                          </div>
                          <DetailField label="City" value={employee?.currentCity} isEditing={isEditing} onChange={(v) => setEmployee({...employee, currentCity: v})} />
                          <DetailField label="State" value={employee?.currentState} isEditing={isEditing} onChange={(v) => setEmployee({...employee, currentState: v})} />
                       </div>
                    </div>
                  </>
                )}

                {activeTab === "work" && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                     <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                           <Briefcase size={20} />
                        </div>
                        <h3 className="text-base font-bold text-slate-900">Employment Details</h3>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailField label="Employee ID" value={employee?.id} readOnly />
                        <DetailField label="Department" value={employee?.department} isEditing={isEditing} onChange={(v) => setEmployee({...employee, department: v})} />
                        <DetailField label="Designation" value={employee?.designation} isEditing={isEditing} onChange={(v) => setEmployee({...employee, designation: v})} />
                        <DetailField label="Date of Joining" value={employee?.dateOfJoining} type="date" isEditing={isEditing} onChange={(v) => setEmployee({...employee, dateOfJoining: v})} />

                        <DetailField label="Work Location" value={employee?.workLocation} isEditing={isEditing} onChange={(v) => setEmployee({...employee, workLocation: v})} />
                        <DetailField label="Employment Type" value={employee?.employmentType} isEditing={isEditing} type="select" options={["Full-time", "Part-time", "Contract", "Intern"]} onChange={(v) => setEmployee({...employee, employmentType: v})} />
                        <DetailField label="Status" value={employee?.status} isEditing={isEditing} type="select" options={["Active", "Inactive", "On Leave", "Terminated"]} onChange={(v) => setEmployee({...employee, status: v})} />
                     </div>
                  </div>
                )}

                {activeTab === "financial" && (
                   <>
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                       <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                             <Banknote size={20} />
                          </div>
                          <h3 className="text-base font-bold text-slate-900">Compensation (CTC)</h3>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <DetailField label="Annual CTC" value={employee?.annualCtc} isEditing={isEditing} prefix="$" onChange={(v) => setEmployee({...employee, annualCtc: v})} />
                          <DetailField label="Monthly Gross" value={employee?.monthlyGross} isEditing={isEditing} prefix="$" onChange={(v) => setEmployee({...employee, monthlyGross: v})} />
                          <DetailField label="Basic Salary" value={employee?.basicSalary} isEditing={isEditing} prefix="$" onChange={(v) => setEmployee({...employee, basicSalary: v})} />
                          <DetailField label="Performance Bonus" value={employee?.performanceBonus} isEditing={isEditing} prefix="$" onChange={(v) => setEmployee({...employee, performanceBonus: v})} />
                       </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                       <div className="flex items-center gap-3 mb-8">
                          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                             <CreditCard size={20} />
                          </div>
                          <h3 className="text-base font-bold text-slate-900">Banking Details</h3>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                          <DetailField label="Bank Name" value={employee?.bankName} isEditing={isEditing} onChange={(v) => setEmployee({...employee, bankName: v})} />
                          <DetailField label="Account Holder" value={employee?.accountHolderName} isEditing={isEditing} onChange={(v) => setEmployee({...employee, accountHolderName: v})} />
                          <DetailField label="Account Number" value={employee?.accountNumber} isEditing={isEditing} type="password" onChange={(v) => setEmployee({...employee, accountNumber: v})} />
                          <DetailField label="IFSC / Swift" value={employee?.ifscSwiftCode} isEditing={isEditing} onChange={(v) => setEmployee({...employee, ifscSwiftCode: v})} />
                       </div>
                    </div>
                   </>
                )}

                {activeTab === "documents" && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                              <FileText size={20} />
                           </div>
                           <h3 className="text-base font-bold text-slate-900">Verification Documents</h3>
                        </div>
                        {isEditing && (
                           <button className="text-xs font-bold text-indigo-600 hover:underline">+ Upload New</button>
                        )}
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DocCard label="Identity Proof" url={employee?.identityProofUrl} icon={Fingerprint} />
                        <DocCard label="Education Certificates" url={employee?.educationCertUrl} icon={Award} />
                        <DocCard label="Previous Employment" url={employee?.employmentProofUrl} icon={Building2} />
                        {employee?.otherDocUrls?.map((url, i) => (
                           <DocCard key={i} label={`Other Document ${i+1}`} url={url} icon={FileText} />
                        ))}
                     </div>
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function DetailField({ label, value, isEditing, onChange, type = "text", options = [], prefix = "", readOnly = false, id }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{label}</label>
      <div className="min-h-[44px]">
        {!isEditing || readOnly ? (
          <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 h-full flex items-center">
            {prefix}{type === "password" ? "••••••••" : value || <span className="text-slate-300 italic font-normal">Not provided</span>}
          </div>
        ) : (
          <>
            {type === "select" ? (
              <select 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all appearance-none"
              >
                <option value="">Select {label}</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input 
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DocCard({ label, url, icon: Icon }) {
  if (!url) return (
    <div className="p-4 border border-slate-100 bg-slate-50 rounded-2xl flex items-center gap-3 opacity-50 grayscale">
       <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300">
          <Icon size={18} />
       </div>
       <div>
          <p className="text-[11px] font-bold text-slate-400 leading-tight uppercase">{label}</p>
          <p className="text-[10px] text-slate-300 mt-0.5 italic">Not Uploaded</p>
       </div>
    </div>
  );

  return (
    <div className="p-4 border border-slate-100 bg-white rounded-2xl flex items-center justify-between group hover:border-indigo-200 transition-all shadow-sm hover:shadow-md">
       <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
             <Icon size={18} />
          </div>
          <div className="overflow-hidden">
             <p className="text-[11px] font-bold text-slate-500 leading-tight uppercase truncate">{label}</p>
             <p className="text-[10px] text-indigo-600 font-semibold mt-0.5 cursor-pointer hover:underline">View Document</p>
          </div>
       </div>
       <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-slate-500 transition-colors">
          <MoreHorizontal size={14} />
       </button>
    </div>
  );
}
