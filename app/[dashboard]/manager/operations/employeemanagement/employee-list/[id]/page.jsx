"use client";

import { useEffect, useState } from "react";
import { FileText, Eye } from "lucide-react";
import { getEmployeeById } from "@/services/employeeService";
import { useParams, useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import { getAdminSalaryStructure, updateAdminSalaryStructure, getAllPayslips } from "@/services/payrollService";

// ─── Static Data ──────────────────────────────────────────────────────────────
const TAB_LIST = ["Basic Information", "Employment", "Contact", "Banking", "Salary Structure", "Payroll History", "Certification", "Documents"];

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

// ─── Salary Structure Section ────────────────────────────────────────────────
function SalaryStructureTab({ employeeId, tenantId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, [employeeId, tenantId]);

  const fetchData = async () => {
    try {
      const res = await getAdminSalaryStructure(tenantId, employeeId);
      setData(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateAdminSalaryStructure(tenantId, employeeId, formData);
      setIsEditing(false);
      fetchData();
      alert("Salary structure updated successfully.");
    } catch (err) {
      alert("Failed to update salary structure.");
    }
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-4 bg-gray-100 rounded w-1/4"></div><div className="h-32 bg-gray-50 rounded"></div></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Salary Architecture</h3>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[11px] font-black uppercase rounded-lg hover:bg-indigo-100 transition-colors">Edit Structure</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleUpdate} className="px-4 py-1.5 bg-slate-900 text-white text-[11px] font-black uppercase rounded-lg hover:bg-black transition-colors">Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[11px] font-black uppercase rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Earnings */}
        <div className="space-y-5">
          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b border-indigo-50 pb-2">Earnings Components</h4>
          <EditableField label="Basic Salary" value={formData.basicSalary} name="basicSalary" isEditing={isEditing} onChange={setFormData} />
          <EditableField label="HRA" value={formData.hra} name="hra" isEditing={isEditing} onChange={setFormData} />
          <EditableField label="Travel Allowance" value={formData.travelAllowance} name="travelAllowance" isEditing={isEditing} onChange={setFormData} highlight />
          <EditableField label="Medical Allowance" value={formData.medicalAllowance} name="medicalAllowance" isEditing={isEditing} onChange={setFormData} />
          <EditableField label="Special Allowance" value={formData.specialAllowance} name="specialAllowance" isEditing={isEditing} onChange={setFormData} />
          <EditableField label="Performance Bonus" value={formData.performanceBonus} name="performanceBonus" isEditing={isEditing} onChange={setFormData} />
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs font-black text-slate-900 uppercase">Monthly Gross</span>
            <span className="text-sm font-black text-indigo-600">
              ₹{((Number(formData.basicSalary||0)+Number(formData.hra||0)+Number(formData.medicalAllowance||0)+Number(formData.travelAllowance||0)+Number(formData.specialAllowance||0)+Number(formData.performanceBonus||0))).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Deductions */}
        <div className="space-y-5">
          <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-rose-50 pb-2">Deductions & Compliance</h4>
          <EditableField label="PF Contribution" value={formData.pfContribution} name="pfContribution" isEditing={isEditing} onChange={setFormData} color="rose"
            note={!formData.pfContribution ? `Auto: ₹${(Number(formData.basicSalary||0)*0.12).toLocaleString("en-IN")}` : ""} />
          <EditableField label="ESI Contribution" value={formData.esiContribution} name="esiContribution" isEditing={isEditing} onChange={setFormData} color="rose" />
          <EditableField label="Professional Tax" value={formData.professionalTax} name="professionalTax" isEditing={isEditing} onChange={setFormData} color="rose" />
          <EditableField label="TDS (Income Tax)" value={formData.tds} name="tds" isEditing={isEditing} onChange={setFormData} color="rose" />
          <EditableField label="Loan Deduction" value={formData.loanDeduction} name="loanDeduction" isEditing={isEditing} onChange={setFormData} color="rose" />
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs font-black text-slate-900 uppercase">Total Deductions</span>
            <span className="text-sm font-black text-rose-500">
              ₹{((formData.pfContribution ? Number(formData.pfContribution) : Number(formData.basicSalary||0)*0.12)+Number(formData.esiContribution||0)+Number(formData.professionalTax||0)+Number(formData.tds||0)+Number(formData.loanDeduction||0)).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      {(() => {
        const gross = Number(formData.basicSalary||0)+Number(formData.hra||0)+Number(formData.medicalAllowance||0)+Number(formData.travelAllowance||0)+Number(formData.specialAllowance||0)+Number(formData.performanceBonus||0);
        const pf = formData.pfContribution ? Number(formData.pfContribution) : Number(formData.basicSalary||0)*0.12;
        const deductions = pf+Number(formData.esiContribution||0)+Number(formData.professionalTax||0)+Number(formData.tds||0)+Number(formData.loanDeduction||0);
        return (
          <div className="bg-slate-900 rounded-3xl p-8 text-white grid grid-cols-2 sm:grid-cols-4 gap-6 shadow-xl shadow-slate-200">
            <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Gross</p><p className="text-2xl font-black">₹{gross.toLocaleString("en-IN")}</p></div>
            <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Deductions</p><p className="text-2xl font-black text-rose-400">₹{deductions.toLocaleString("en-IN")}</p></div>
            <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Pay</p><p className="text-2xl font-black text-emerald-400">₹{(gross-deductions).toLocaleString("en-IN")}</p></div>
            <div><p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Annual CTC</p><p className="text-2xl font-black text-indigo-300">₹{(gross*12).toLocaleString("en-IN")}</p></div>
          </div>
        );
      })()}
    </div>
  );
}

function EditableField({ label, value, name, isEditing, onChange, color = "indigo", highlight, note }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
          {highlight && <span className="text-[9px] font-black bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">Per Employee</span>}
        </div>
        {isEditing ? (
          <input
            type="number"
            value={value ?? ""}
            onChange={(e) => onChange(prev => ({ ...prev, [name]: e.target.value }))}
            className={`w-32 bg-slate-50 border rounded-lg px-3 py-1.5 text-xs font-black text-slate-900 outline-none text-right transition-all ${color === "rose" ? "border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100" : "border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"}`}
          />
        ) : (
          <span className={`text-xs font-black ${color === "rose" ? "text-rose-600" : "text-slate-900"}`}>
            ₹{Number(value || 0).toLocaleString("en-IN")}
          </span>
        )}
      </div>
      {note && <p className="text-[10px] text-slate-400 font-medium mt-0.5 text-right">{note}</p>}
    </div>
  );
}


// ─── Payroll History Section ────────────────────────────────────────────────
function PayrollHistoryTab({ employeeId, tenantId }) {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getAllPayslips(tenantId, { employeeId });
        setPayslips(res.data.content || res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [employeeId, tenantId]);

  if (loading) return <div className="space-y-4"><div className="h-10 bg-gray-50 rounded"></div><div className="h-10 bg-gray-50 rounded"></div></div>;

  return (
    <div className="overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cycle Month</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gross</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deductions</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Pay</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Document</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {payslips.map((ps) => (
            <tr key={ps.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-5 text-[13px] font-black text-slate-900">{ps.month}</td>
              <td className="px-6 py-5 text-[12px] font-bold text-slate-600">₹{ps.grossEarnings?.toLocaleString()}</td>
              <td className="px-6 py-5 text-[12px] font-bold text-rose-500">₹{ps.totalDeductions?.toLocaleString()}</td>
              <td className="px-6 py-5 text-[13px] font-black text-slate-900">₹{ps.netSalary?.toLocaleString()}</td>
              <td className="px-6 py-5">
                 <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                   ps.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                 }`}>
                   {ps.status}
                 </span>
              </td>
              <td className="px-6 py-5 text-right">
                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Eye size={16} /></button>
              </td>
            </tr>
          ))}
          {payslips.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No payroll history found for this employee</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const TAB_CONTENT_MAP = {
  "Basic Information": BasicInformation,
  Employment: Employment,
  Contact: Contact,
  Banking: Banking,
  "Salary Structure": SalaryStructureTab,
  "Payroll History": PayrollHistoryTab,
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
            <TabComponent 
              employee={employee} 
              certCards={certCards} 
              documentCards={documentCards} 
              employeeId={id}
              tenantId={tenantId}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
