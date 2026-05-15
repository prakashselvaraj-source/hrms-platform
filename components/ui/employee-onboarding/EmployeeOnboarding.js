'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Briefcase, Building2, DollarSign, Calendar, FileText, ChevronRight, X, Save, ArrowRight, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';
import { createEmployee, getEmployeeById, updateEmployee } from '@/services/employeeService';
import PersonalInformation from './tabs/PersonalInformation';
import Contact from './tabs/Contact';
import JobDetails from './tabs/JobDetails';
import Banking from './tabs/Banking';
import Salary from './tabs/Salary';
import LeaveSetup from './tabs/LeaveSetup';
import Documents from './tabs/Documents';
import { useTenant } from '@/hooks/useTenant';
import useRole from '@/hooks/useRole';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'job', label: 'Job', icon: Briefcase },
  { id: 'banking', label: 'Banking', icon: Building2 },
  { id: 'salary', label: 'Salary', icon: DollarSign },
  { id: 'leave', label: 'Leave', icon: Calendar },
  { id: 'documents', label: 'Docs', icon: FileText },
];

export default function EmployeeOnboarding({ employeeId: propId }) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const tenant = useTenant();
  const role = useRole();
  const route = useRouter();
  const searchParams = useSearchParams();
  const employeeId = propId || searchParams.get('id');

  const rolePrefix = role === "SUPER_ADMIN" ? "manager" : "admin";

  const [formData, setFormData] = useState({
    personal: { firstName: '', lastName: '', dateOfBirth: '', gender: '', workEmail: '', mobileNumber: '', photo: null, photoUrl: '' },
    contact: {
      current: { street: '', city: '', state: '', zip: '', country: 'United States' },
      permanent: { street: '', city: '', state: '' },
      emergency: { fullName: '', relationship: 'Spouse', mobile: '' },
      sameAsCurrent: false
    },
    job: {
      designation: '',
      department: '',
      role: '',
      dateOfJoining: '',
      workLocation: '',
      employmentType: '',
    },
    banking: {
      accountHolderName: '',
      bankName: '',
      branchName: '',
      accountNumber: '',
      ifscSwift: '',
      aadharNumber: '',
      panNumber: '',
      disbursementMethod: 'Direct Deposit',
    },
    salary: {
      annualPackage: '',
      monthlyGross: '',
      basicSalary: '',
      performanceBonus: '',
      professionalTax: '',
      effectiveDate: '',
    },
    leave: {
      leavePolicy: '',
      workingDays: [],
    },
    documents: {},
  });

  useEffect(() => {
    setMounted(true);

    const initData = async () => {
      if (employeeId && tenant) {
        try {
          const res = await getEmployeeById(employeeId, tenant);
          const emp = res.data;

          setFormData({
            personal: {
              firstName: emp.firstName || '',
              lastName: emp.lastName || '',
              dateOfBirth: emp.dateOfBirth || '',
              gender: emp.gender || '',
              workEmail: emp.workEmail || '',
              mobileNumber: emp.mobileNumber || '',
              photo: null,
              photoUrl: emp.photoUrl || ''
            },
            contact: {
              current: {
                street: emp.currentStreet || '',
                city: emp.currentCity || '',
                state: emp.currentState || '',
                zip: emp.currentZip || '',
                country: emp.currentCountry || 'United States'
              },
              permanent: {
                street: emp.permanentStreet || '',
                city: emp.permanentCity || '',
                state: emp.permanentState || ''
              },
              emergency: {
                fullName: emp.emergencyContactName || '',
                relationship: emp.emergencyContactRelationship || 'Spouse',
                mobile: emp.emergencyContactMobile || ''
              },
              sameAsCurrent: false
            },
            job: {
              designation: emp.designation || '',
              department: emp.department || '',
              role: emp.role || '',
              dateOfJoining: emp.dateOfJoining || '',
              workLocation: emp.workLocation || '',
              employmentType: emp.employmentType || '',
            },
            banking: {
              accountHolderName: emp.accountHolderName || '',
              bankName: emp.bankName || '',
              branchName: emp.branchName || '',
              accountNumber: emp.accountNumber || '',
              ifscSwift: emp.ifscSwiftCode || '',
              aadharNumber: emp.aadharNumber || '',
              panNumber: emp.panNumber || '',
              disbursementMethod: emp.disbursementMethod || 'Direct Deposit',
            },
            salary: {
              annualPackage: emp.annualCtc?.toString() || '',
              monthlyGross: emp.monthlyGross?.toString() || '',
              basicSalary: emp.basicSalary?.toString() || '',
              performanceBonus: emp.performanceBonus?.toString() || '',
              professionalTax: emp.professionalTax?.toString() || '',
              effectiveDate: '',
            },
            leave: {
              leavePolicy: emp.leavePolicy || '',
              workingDays: emp.workingDays || [],
            },
            documents: {
              identity: emp.identityProofUrl ? { url: emp.identityProofUrl, name: 'Identity Proof' } : null,
              education: emp.educationCertUrl ? { url: emp.educationCertUrl, name: 'Education Cert' } : null,
              employment: emp.employmentProofUrl ? { url: emp.employmentProofUrl, name: 'Employment Proof' } : null,
              other: emp.otherDocUrls?.map(url => ({ url, name: 'Document' })) || []
            },
          });
        } catch (error) {
          toast.error("Failed to fetch employee details.");
        }
      } else {
        const savedData = localStorage.getItem('employeeOnboardingData');
        const savedTab = localStorage.getItem('employeeOnboardingActiveTab');
        if (savedData) {
          try {
            setFormData(JSON.parse(savedData));
          } catch (e) {
            console.error("Failed to parse saved onboarding data", e);
          }
        }
        if (savedTab) {
          setActiveTab(savedTab);
        }
      }
    };

    initData();
  }, [employeeId, tenant]);

  const transformEmployeePayload = (data) => ({
    firstName: data.personal.firstName,
    lastName: data.personal.lastName,
    dateOfBirth: data.personal.dateOfBirth,
    gender: data.personal.gender,
    workEmail: data.personal.workEmail,
    mobileNumber: data.personal.mobileNumber,
    photoUrl: data.personal.photoUrl,
    currentStreet: data.contact.current.street,
    currentCity: data.contact.current.city,
    currentState: data.contact.current.state,
    currentZip: data.contact.current.zip,
    currentCountry: data.contact.current.country,
    permanentStreet: data.contact.sameAsCurrent ? data.contact.current.street : data.contact.permanent.street,
    permanentCity: data.contact.sameAsCurrent ? data.contact.current.city : data.contact.permanent.city,
    permanentState: data.contact.sameAsCurrent ? data.contact.current.state : data.contact.permanent.state,
    emergencyContactName: data.contact.emergency.fullName,
    emergencyContactRelationship: data.contact.emergency.relationship,
    emergencyContactMobile: data.contact.emergency.mobile,
    dateOfJoining: data.job.dateOfJoining,
    workLocation: data.job.workLocation,
    employmentType: data.job.employmentType,
    designation: data.job.designation,
    department: data.job.department,
    role: data.job.role,
    accountHolderName: data.banking.accountHolderName,
    bankName: data.banking.bankName,
    branchName: data.banking.branchName,
    accountNumber: data.banking.accountNumber,
    ifscSwiftCode: data.banking.ifscSwift,
    aadharNumber: data.banking.aadharNumber,
    panNumber: data.banking.panNumber,
    disbursementMethod: data.banking.disbursementMethod,
    annualCtc: Number(data.salary.annualPackage),
    monthlyGross: Number(data.salary.monthlyGross),
    basicSalary: Number(data.salary.basicSalary),
    performanceBonus: Number(data.salary.performanceBonus),
    professionalTax: Number(data.salary.professionalTax),
    identityProofUrl: data.documents.identity?.url,
    educationCertUrl: data.documents.education?.url,
    employmentProofUrl: data.documents.employment?.url,
    otherDocUrls: data.documents.other?.map(f => f.url) || [],
    status: "PENDING"
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const updateSection = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const currentIndex = tabs.findIndex((t) => t.id === activeTab);

  const handleNext = async () => {
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1].id;
      if (!employeeId) {
        localStorage.setItem('employeeOnboardingData', JSON.stringify(formData));
        localStorage.setItem('employeeOnboardingActiveTab', nextTab);
      }
      setActiveTab(nextTab);
    } else {
      setIsSubmitting(true);
      try {
        const payload = transformEmployeePayload(formData);
        if (employeeId) {
          await updateEmployee(employeeId, payload, tenant);
          toast.success('Employee Profile Updated Successfully!');
        } else {
          await createEmployee(payload, tenant);
          localStorage.removeItem('employeeOnboardingData');
          localStorage.removeItem('employeeOnboardingActiveTab');
          toast.success('Onboarding Profile Completed!');
        }
        route.push(`/${tenant}/${rolePrefix}/operations/employeemanagement/employee-list`);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Submission failed.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDiscard = () => {
    if (confirm(employeeId ? 'Discard changes?' : 'Discard all progress?')) {
      if (!employeeId) {
        localStorage.removeItem('employeeOnboardingData');
        localStorage.removeItem('employeeOnboardingActiveTab');
      }
      route.push(`/${tenant}/${rolePrefix}/operations/employeemanagement/employee-list`);
    }
  };

  const checkTabValidity = (tabId) => {
    switch (tabId) {
      case 'personal': {
        const { photo, photoUrl, ...otherFields } = formData.personal;
        return Object.values(otherFields).every(v => typeof v === 'string' && v.trim() !== '') && (!!photo || !!photoUrl);
      }
      case 'contact': {
        const currentValid = Object.values(formData.contact.current).every(v => v.trim() !== '');
        const emergencyValid = Object.values(formData.contact.emergency).every(v => v.trim() !== '');
        const permanentValid = formData.contact.sameAsCurrent || Object.values(formData.contact.permanent).every(v => v.trim() !== '');
        return currentValid && emergencyValid && permanentValid;
      }
      case 'job': return Object.values(formData.job).every(v => v.trim() !== '');
      case 'banking': return Object.values(formData.banking).every(v => v.trim() !== '');
      case 'salary': return !!(formData.salary.basicSalary && formData.salary.performanceBonus && formData.salary.professionalTax);
      case 'leave': return !!(formData.leave.leavePolicy && formData.leave.workingDays?.length > 0);
      case 'documents': return !!(formData.documents.identity && formData.documents.education && formData.documents.employment);
      default: return true;
    }
  };

  const handleTabClick = (tabId) => {
    const targetIndex = tabs.findIndex(t => t.id === tabId);
    if (targetIndex <= currentIndex) {
      setActiveTab(tabId);
      return;
    }
    for (let i = 0; i < targetIndex; i++) {
      if (!checkTabValidity(tabs[i].id)) {
        toast(`Complete "${tabs[i].label}" first.`, { icon: '📝' });
        return;
      }
    }
    setActiveTab(tabId);
  };

  const renderTab = () => {
    const props = { data: formData[activeTab], updateData: (data) => updateSection(activeTab, data) };
    switch (activeTab) {
      case 'personal': return <PersonalInformation {...props} />;
      case 'contact': return <Contact data={formData.contact} updateData={(data) => updateSection('contact', data)} />;
      case 'job': return <JobDetails {...props} />;
      case 'banking': return <Banking {...props} />;
      case 'salary': return <Salary {...props} />;
      case 'leave': return <LeaveSetup {...props} />;
      case 'documents': return <Documents {...props} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">

        {/* Sleek Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
          <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => route.push(`/${tenant}/${rolePrefix}/operations/employeemanagement`)}>Operations</span>
          <ChevronRight size={12} />
          <span className="text-indigo-600">{employeeId ? 'Modification' : 'Enrollment'}</span>
        </div>

        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{employeeId ? 'Edit Staff Profile' : 'Staff Enrollment'}</h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {employeeId ? 'Surgically modify existing personnel data across the organization.' : 'Follow the phases below to initialize a new employee profile.'}
            </p>
          </div>
          <button
            onClick={() => route.push(`/${tenant}/${rolePrefix}/operations/employeemanagement/employee-list`)}
            className="text-[11px] font-bold text-gray-500 hover:text-indigo-600 uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm transition-all"
          >
            <LayoutDashboard size={14} /> Personnel List
          </button>
        </div>

        {/* Surgical Step Navigation */}
        <div className="bg-white border border-gray-200 rounded-2xl p-1.5 mb-8 flex gap-1 overflow-x-auto shadow-sm no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isCompleted = tabs.findIndex(t => t.id === tab.id) < currentIndex;
            const isValid = checkTabValidity(tab.id);

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap flex-1 justify-center
                  ${isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : isCompleted && isValid
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
              >
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center border ${isActive ? 'border-white/40' : 'border-current opacity-40'}`}>
                  {(isCompleted && isValid) ? '✓' : <Icon size={12} />}
                </div>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Focused Tab Content */}
        <div className="min-h-[400px]">
          {renderTab()}
        </div>

        {/* Surgical Fixed Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 py-3 z-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 flex items-center justify-between">
            <button
              onClick={handleDiscard}
              className="text-[11px] font-bold text-gray-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <X size={14} /> {employeeId ? 'Discard Changes' : 'Discard'}
            </button>

            <div className="flex items-center gap-3">
              {!employeeId && (
                <button className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-indigo-600 hover:bg-indigo-50 transition-all">
                  Save Progress
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!checkTabValidity(activeTab) || isSubmitting}
                className={`flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-[12px] font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95
                  ${(!checkTabValidity(activeTab) || isSubmitting) ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:bg-indigo-700'}`}
              >
                {isSubmitting ? 'Syncing...' : (currentIndex === tabs.length - 1 ? (employeeId ? 'Update Profile' : 'Finish Enrollment') : 'Continue')}
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
