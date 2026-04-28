"use client";

import { useEffect, useState } from "react";
import { FileText, Eye } from "lucide-react";
import { getEmployeeById } from "@/services/employeeService";
import { useParams, useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";

// ─── Static Data ──────────────────────────────────────────────────────────────
const TAB_LIST = ["Basic Information", "Employment", "Contact", "Banking", "Certification", "Documents"];

// ─── Shared: FieldItem + FieldGrid ───────────────────────────────────────────
function FieldItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-[13px] text-[#374151] font-medium">{value ?? "—"}</p>
    </div>
  );
}

function FieldGrid({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
      {children}
    </div>
  );
}

// ─── Tab Content Sections ─────────────────────────────────────────────────────
function BasicInformation({ employee }) {
  return (
    <FieldGrid>
      <FieldItem label="Full Name" value={`${employee?.firstName} ${employee?.lastName}`} />
      <FieldItem label="Employee ID" value={employee?.id} />
      <FieldItem label="Gender" value={employee?.gender} />
      <FieldItem label="Email" value={employee?.workEmail} />
      <FieldItem label="Phone Number" value={employee?.mobileNumber} />
      <FieldItem label="Date of Birth" value={employee?.dateOfBirth} />
    </FieldGrid>
  );
}

function Employment({ employee }) {
  return (
    <FieldGrid>
      <FieldItem label="Designation" value={employee?.designation} />
      <FieldItem label="Department" value={employee?.department} />
      <FieldItem label="Date of Joining" value={employee?.dateOfJoining} />
      <FieldItem label="Employment Type" value={employee?.employmentType} />
      <FieldItem label="Reporting Manager" value={employee?.reportingManager} />
      <FieldItem label="Work Location" value={employee?.workLocation} />
    </FieldGrid>
  );
}

function Contact({ employee }) {
  return (
    <FieldGrid>
      <FieldItem label="Work Email" value={employee?.workEmail} />
      <FieldItem label="Phone Number" value={employee?.mobileNumber} />
      <FieldItem
        label="Current Address"
        value={`${employee?.currentStreet}, ${employee?.currentCity}, ${employee?.currentState} - ${employee?.currentZip}`}
      />
      <FieldItem
        label="Permanent Address"
        value={`${employee?.permanentStreet}, ${employee?.permanentCity}, ${employee?.permanentState}`}
      />
      <FieldItem label="Emergency Contact" value={employee?.emergencyContactName} />
      <FieldItem label="Emergency Phone" value={employee?.emergencyContactMobile} />
    </FieldGrid>
  );
}

function Banking({ employee }) {
  return (
    <FieldGrid>
      <FieldItem label="Bank Name" value={employee?.bankName} />
      <FieldItem label="Branch Name" value={employee?.branchName} />
      <FieldItem label="Account Number" value={employee?.accountNumber} />
      <FieldItem label="IFSC Code" value={employee?.ifscSwiftCode} />
      <FieldItem label="Account Holder Name" value={employee?.accountHolderName} />
      <FieldItem label="Disbursement Method" value={employee?.disbursementMethod} />
    </FieldGrid>
  );
}

function Certification({ certCards }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold text-[#191C1E] mb-4">Employee Certifications</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certCards.map((cert) => (
          <div key={cert.id} className="border border-[#E2E8F0] rounded-xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F5F3FF] flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#000000]">{cert.title}</p>
              <p className="text-[11px] text-[#000000] mb-3">{cert.subtitle}</p>
              <button
                id={`view-doc-${cert.id}`}
                onClick={() => cert.url && window.open(cert.url, "_blank")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-semibold transition-colors duration-150 ${cert.url
                  ? "text-[#FFFFFF] bg-[#4A45B6] hover:bg-[#3B35A7]"
                  : "text-[#A3A3A3] bg-[#414141] cursor-not-allowed opacity-70"
                  }`}
                disabled={!cert.url}
              >
                <Eye size={12} />
                {cert.url ? "View Document" : "No Document"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Documents({ documentCards }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold text-[#191C1E] mb-4">Documents</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {documentCards.map((doc) => (
          <div key={doc.id} className="shadow-lg rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-[#000000]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#000000] leading-tight">{doc.title}</p>
              {doc.verified && (
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-green-600 bg-green-50 border border-[#00CC2C]">
                  Verified
                </span>
              )}
            </div>
            <button
              id={`view-doc-${doc.id}`}
              aria-label={`View ${doc.title}`}
              onClick={() => window.open(doc.url, "_blank")}
              className="w-7 h-7 flex items-center justify-center rounded-full text-[#4A45B6] transition-colors flex-shrink-0"
            >
              <Eye size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const TAB_CONTENT_MAP = {
  "Basic Information": BasicInformation,
  Employment: Employment,
  Contact: Contact,
  Banking: Banking,
  Certification: Certification,
  Documents: Documents,
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeeDetailsPage() {
  const tenantId = useTenant();
  const [activeTab, setActiveTab] = useState("Basic Information");
  const TabComponent = TAB_CONTENT_MAP[activeTab] ?? BasicInformation;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employee, setEmployee] = useState([]);

  const { id } = useParams();



  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("fetchUserDetails", id);
        const res = await getEmployeeById(id, tenantId);
        console.log("fetchEmployeeById", res);
        setEmployee(res.data);
      } catch (error) {
        setError(error.message);
      }
      finally {
        setLoading(false);
      }
    }
    fetchUserDetails();
  }, [])


  const INFO_FIELDS = [
    { label: "EMPLOYEE ID", value: employee?.id },
    { label: "CONTACT ID", value: employee?.mobileNumber },
    { label: "JOINED", value: employee?.dateOfJoining },
    { label: "JOB TYPE", value: employee?.employmentType },
    { label: "MAIL ID", value: employee?.workEmail },
    { label: "DOB", value: employee?.dateOfBirth },
    { label: "DEPARTMENT", value: employee?.department },
  ];

  const certCards = [
    { id: "joining", title: "Joining Letter", subtitle: "Official Joining Letter Document", url: employee?.joiningLetterUrl },
    { id: "experience", title: "Experience Certificate", subtitle: "Official Experience Certificate Document", url: employee?.experienceCertificateUrl },
    ...(employee?.otherDocUrl || []).map((doc, idx) => ({
      id: `other-${idx}`,
      title: doc.fileName || `Additional Document ${idx + 1}`,
      subtitle: "Additional certification or document",
      url: doc.url || doc
    }))
  ];

  const documentCards = [
    { id: "identity", title: "Identity Proof", verified: !!employee?.identityProofUrl, url: employee?.identityProofUrl },
    { id: "education", title: "Education Certificate", verified: !!employee?.educationCertUrl, url: employee?.educationCertUrl },
    { id: "employment", title: "Employment Proof", verified: !!employee?.employmentProofUrl, url: employee?.employmentProofUrl },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F6] p-4 sm:p-6">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <h1 className="text-[16px] font-semibold text-[#000000]">Employee Details</h1>
          <button
            id="back-btn"
            onClick={() => window.history.back()}
            className="px-4 py-1.5 rounded-sm border border-[#959595] text-[13px] font-medium text-[#000000] bg-white transition-colors"
          >
            Back
          </button>
        </div>

        {/* ── Employee Card ── */}
        <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E2E8F0] p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Profile */}
            <div className="flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-2 sm:min-w-[140px]">
              <div className="w-[90px] h-[90px] rounded-xl border-2 border-[#7C3AED] overflow-hidden flex-shrink-0">
                <img src={employee?.photoUrl} alt="Employee profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[#191C1E] leading-tight">{employee.firstName}</p>
                <p className="text-[11px] text-[#6B7280] uppercase tracking-wide mt-0.5">{employee.department}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px bg-[#E2E8F0] self-stretch" />

            {/* Info Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 items-center">
              {INFO_FIELDS.map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-semibold text-[#000000] uppercase tracking-wide mb-0.5">{item.label}</p>
                  <p className="text-[13px] text-[#64748B] font-medium break-words">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs + Content ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          {/* Tab bar */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center border-b border-[#E2E8F0] min-w-max bg-[#E2DFFF] justify-around">
              {TAB_LIST.map((tab) => {
                const isActive = tab === activeTab;
                return (
                  <button
                    key={tab}
                    id={`tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-5 py-3 text-[13px] font-medium whitespace-nowrap transition-all duration-150 ${isActive
                      ? "text-[#7B04D3] font-semibold border-b-2 border-[#4F279B]"
                      : "text-[#8C8C8C]"
                      }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6 mb-6">
            <TabComponent employee={employee} certCards={certCards} documentCards={documentCards} />
          </div>
        </div>

      </div>
    </div>
  );
}
