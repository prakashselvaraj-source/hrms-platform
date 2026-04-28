'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Briefcase, Building2, DollarSign, Calendar, FileText, ChevronRight, X, Save, ArrowRight } from 'lucide-react';
import { createEmployee } from '@/services/employeeService';
import PersonalInformation from './tabs/PersonalInformation';
import Contact from './tabs/Contact';
import JobDetails from './tabs/JobDetails';
import Banking from './tabs/Banking';
import Salary from './tabs/Salary';
import LeaveSetup from './tabs/LeaveSetup';
import Documents from './tabs/Documents';
import { useTenant } from '@/hooks/useTenant';

const tabs = [
  { id: 'personal', label: 'Personal Information', icon: User },
  { id: 'contact', label: 'Contact', icon: Phone },
  { id: 'job', label: 'Job Details', icon: Briefcase },
  { id: 'banking', label: 'Banking', icon: Building2 },
  { id: 'salary', label: 'Salary', icon: DollarSign },
  { id: 'leave', label: 'Leave Setup', icon: Calendar },
  { id: 'documents', label: 'Documents', icon: FileText },
];

export default function EmployeeOnboarding() {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const tenant = useTenant();

  const [formData, setFormData] = useState({
    personal: { firstName: '', lastName: '', dateOfBirth: '', gender: '', workEmail: '', mobileNumber: '', department: '', designation: '', photo: null },
    contact: {
      current: { street: '', city: '', state: '', zip: '', country: 'United States' },
      permanent: { street: '', city: '', state: '', zip: '', country: '' },
      emergency: { fullName: '', relationship: 'Spouse', mobile: '' },
      sameAsCurrent: false
    },
    job: {
      designation: '',
      department: '',
      role: '',
      dateOfJoining: '',
      reportingManager: '',
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

  // Load from localStorage ONLY after mounting on client
  useEffect(() => {
    setMounted(true);
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
  }, []);

  const transformEmployeePayload = (data) => ({
  // ================= PERSONAL =================
  firstName: data.personal.firstName,
  lastName: data.personal.lastName,
  dateOfBirth: data.personal.dateOfBirth,
  gender: data.personal.gender,
  workEmail: data.personal.workEmail,
  mobileNumber: data.personal.mobileNumber,
  photoUrl: data.personal.photoUrl,

  // ================= CURRENT ADDRESS =================
  currentStreet: data.contact.current.street,
  currentCity: data.contact.current.city,
  currentState: data.contact.current.state,
  currentZip: data.contact.current.zip,
  currentCountry: data.contact.current.country,

  // ================= PERMANENT ADDRESS =================
  permanentStreet: data.contact.sameAsCurrent
    ? data.contact.current.street
    : data.contact.permanent.street,

  permanentCity: data.contact.sameAsCurrent
    ? data.contact.current.city
    : data.contact.permanent.city,

  permanentState: data.contact.sameAsCurrent
    ? data.contact.current.state
    : data.contact.permanent.state,

  // ================= EMERGENCY =================
  emergencyContactName: data.contact.emergency.fullName,
  emergencyContactRelationship: data.contact.emergency.relationship,
  emergencyContactMobile: data.contact.emergency.mobile,

  // ================= JOB =================
  dateOfJoining: data.job.dateOfJoining,
  reportingManager: data.job.reportingManager,
  workLocation: data.job.workLocation,
  employmentType: data.job.employmentType,
  designation: data.job.designation,
  department: data.job.department,
  role: data.job.role,

  // ================= BANKING =================
  accountHolderName: data.banking.accountHolderName,
  bankName: data.banking.bankName,
  branchName: data.banking.branchName,
  accountNumber: data.banking.accountNumber,
  ifscSwiftCode: data.banking.ifscSwift,
  aadharNumber: data.banking.aadharNumber,
  panNumber: data.banking.panNumber,
  disbursementMethod: data.banking.disbursementMethod,

  // ================= SALARY =================
  annualCtc: Number(data.salary.annualPackage),
  monthlyGross: Number(data.salary.monthlyGross),
  basicSalary: Number(data.salary.basicSalary),
  performanceBonus: Number(data.salary.performanceBonus),
  professionalTax: Number(data.salary.professionalTax),

  // ================= DOCUMENTS =================
  identityProofUrl: data.documents.identity?.url,
  educationCertUrl: data.documents.education?.url,
  employmentProofUrl: data.documents.employment?.url,
otherDocUrls: data.documents.other?.map(f => f.url) || [],
  // ================= STATUS =================
  status:"DRAFT"
});


  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#4A45B6] font-semibold animate-pulse">Loading Onboarding...</div>
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
      // Save data and next tab
      localStorage.setItem('employeeOnboardingData', JSON.stringify(formData));
      localStorage.setItem('employeeOnboardingActiveTab', nextTab);
      setActiveTab(nextTab);
    } else {
      setIsSubmitting(true);
      try {
        const payload = transformEmployeePayload(formData);
        const response = await createEmployee(payload, tenant);
        console.log('Submitting Employee Data to API:', formData);

        alert('Employee Onboarding Profile Created Successfully!');
        localStorage.removeItem('employeeOnboardingData');
        localStorage.removeItem('employeeOnboardingActiveTab');
        // window.location.href = '/employeemanagement'; 
      } catch (error) {
        console.error('Submission Error:', error);
        alert(error.response?.data?.message || 'Failed to submit onboarding data. Please check your connection.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDiscard = () => {
    if (confirm('Are you sure you want to discard all changes? This will clear the form.')) {
      localStorage.removeItem('employeeOnboardingData');
      localStorage.removeItem('employeeOnboardingActiveTab');
      window.location.reload();
    }
  };

  const checkTabValidity = (tabId) => {
    switch (tabId) {
      case 'personal': {
        const { photo,photoUrl, ...otherFields } = formData.personal;
        const textFieldsValid = Object.values(otherFields).every(value => typeof value === 'string' && value.trim() !== '');
        return textFieldsValid && (!!photo || !!photoUrl);
      }
      case 'contact': {
        const currentValid = Object.values(formData.contact.current).every(v => v.trim() !== '');
        const emergencyValid = Object.values(formData.contact.emergency).every(v => v.trim() !== '');
        const permanentValid = formData.contact.sameAsCurrent ||
          Object.values(formData.contact.permanent).every(v => v.trim() !== '');
        return currentValid && emergencyValid && permanentValid;
      }
      case 'job':
        return Object.values(formData.job).every(value => value.trim() !== '');
      case 'banking':
        return Object.values(formData.banking).every(value => value.trim() !== '');
      case 'salary':
        return !!(formData.salary.basicSalary && formData.salary.performanceBonus && formData.salary.professionalTax);
      case 'leave':
        return !!(formData.leave.leavePolicy && formData.leave.workingDays?.length > 0);
      case 'documents':
        return !!(formData.documents.identity && formData.documents.education && formData.documents.employment);
      default:
        return true;
    }
  };

  const isTabValid = () => checkTabValidity(activeTab);

  const handleTabClick = (tabId) => {
    const targetIndex = tabs.findIndex(t => t.id === tabId);

    // 1. Allow moving backwards freely
    if (targetIndex <= currentIndex) {
      localStorage.setItem('employeeOnboardingActiveTab', tabId);
      setActiveTab(tabId);
      return;
    }

    // 2. To move forward, ALL tabs before the target must be valid
    for (let i = 0; i < targetIndex; i++) {
      if (!checkTabValidity(tabs[i].id)) {
        alert(`Please complete the "${tabs[i].label}" section before proceeding.`);
        return;
      }
    }

    // If all checks pass, save and move
    localStorage.setItem('employeeOnboardingData', JSON.stringify(formData));
    localStorage.setItem('employeeOnboardingActiveTab', tabId);
    setActiveTab(tabId);
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'personal': return <PersonalInformation data={formData.personal} updateData={(data) => updateSection('personal', data)} />;
      case 'contact': return <Contact data={formData.contact} updateData={(data) => updateSection('contact', data)} />;
      case 'job': return <JobDetails data={formData.job} updateData={(data) => updateSection('job', data)} />;
      case 'banking': return <Banking data={formData.banking} updateData={(data) => updateSection('banking', data)} />;
      case 'salary': return <Salary data={formData.salary} updateData={(data) => updateSection('salary', data)} />;
      case 'leave': return <LeaveSetup data={formData.leave} updateData={(data) => updateSection('leave', data)} />;
      case 'documents': return <Documents data={formData.documents} updateData={(data) => updateSection('documents', data)} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 uppercase tracking-wide font-medium">
          <span className='text-[#737686] -tracking-tight font-semibold'>Employee Management</span>
          <ChevronRight size={14} />
          <span className="text-[#4A45B6] font-semibold">Add New Employee</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl text-[#191C1E] font-bold">Employee Onboarding</h1>
          <button
            type="button"
            className="border border-[#959595] text-gray-700 text-sm px-4 py-2 rounded-md bg-[#FFFFFF]"
          >
            Back to list
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isPast = tabs.findIndex(t => t.id === tab.id) < currentIndex;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${isActive
                      ? 'border-[#4F279B] text-[#7B04D3] mb-1'
                      : isPast
                        ? 'border-transparent text-gray-500 hover:text-gray-700'
                        : !isTabValid() && tabs.findIndex(t => t.id === tab.id) > currentIndex
                          ? 'border-transparent text-gray-300 cursor-not-allowed'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-6">
          {renderTab()}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-2 py-8 bg-[#F2F4F6]">
          <button
            type="button"
            onClick={handleDiscard}
            className="flex items-center gap-2 text-sm text-[#737686] hover:text-gray-700 transition-colors font-bold"
          >
            <X size={16} />
            Discard Changes
          </button>
          <div className="flex items-center gap-3">
            <button type="button" className="text-[#3B35A7] text-sm px-5 py-2.5 rounded-md bg-[#E2DFFF] transition-colors font-bold flex items-center gap-2">

              Save Draft
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isTabValid() || isSubmitting}
              className={`bg-[#4A45B6] text-[#FFFFFF] text-sm px-5 py-2.5 rounded-md transition-colors font-bold flex items-center gap-2 
                ${!isTabValid() || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3B35A7]'}`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin text-white">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  {currentIndex === tabs.length - 1 ? 'Finish Onboarding' : 'Save & Continue'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
