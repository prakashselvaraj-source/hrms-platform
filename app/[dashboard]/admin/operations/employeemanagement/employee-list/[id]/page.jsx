"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  Shield,
  FileText,
  Loader2,
  XCircle,
  ExternalLink,
  Award,
  Image,
} from "lucide-react";
import { getEmployeeById } from "@/services/employeeService";
import { useTenant } from "@/hooks/useTenant";

// ─── Shared Components ────────────────────────────────────────────────────────
function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-gray-400" />}
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-sm font-semibold text-gray-800">{value ?? "—"}</p>
    </div>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <Icon size={16} />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive = status === "Active";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-gray-100 text-gray-400 border-gray-200"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
      {status || "Unknown"}
    </span>
  );
}

function DocLink({ label, url }) {
  if (!url) return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-gray-300">
          <FileText size={14} />
        </div>
        <p className="text-xs font-semibold text-gray-400">{label}</p>
      </div>
      <span className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider">Not Uploaded</span>
    </div>
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 group transition-all"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600">
          <FileText size={14} />
        </div>
        <p className="text-xs font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">{label}</p>
      </div>
      <ExternalLink size={13} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
    </a>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const tenantId = useTenant();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tenantId || !id) return;
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await getEmployeeById(id, tenantId);
        setEmployee(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load employee profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [tenantId, id]);

  const formatDate = (val) => {
    if (!val) return "—";
    return new Date(val).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const fullAddress = employee
    ? [employee.currentStreet, employee.currentCity, employee.currentState, employee.currentZip, employee.currentCountry]
      .filter(Boolean)
      .join(", ")
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
          <p className="text-xs font-semibold uppercase tracking-widest">Loading Personal Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gray-50/60 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl border border-gray-100 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mx-auto mb-4">
            <XCircle size={24} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Profile Unreachable</h2>
          <p className="text-sm text-gray-500 mb-6">{error || "This personnel record could not be found."}</p>
          <button
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-black transition-all"
          >
            <ChevronLeft size={16} /> Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const initials = ((employee.firstName?.[0] || "") + (employee.lastName?.[0] || "")).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1200px] mx-auto py-8">

        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <nav className="flex items-center gap-1.5 text-xs font-medium uppercase text-gray-400">
              <span className="hover:text-indigo-600 cursor-pointer" onClick={() => router.push(`/${tenantId}/admin/operations/employeemanagement/employee-list`)}>
                Directory
              </span>
              <ChevronRight size={14} className="text-gray-300" />
              <span className="text-indigo-600">Personal Profile</span>
            </nav>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              {employee.firstName} {employee.lastName}
            </h1>
            <div className="flex items-center gap-3">
              <StatusBadge status={employee.status} />
              {employee.designation && (
                <span className="text-xs font-medium text-gray-400">
                  {employee.designation}
                  {employee.department && ` · ${employee.department}`}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-sm self-start md:self-auto"
          >
            <ChevronLeft size={16} /> Back
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LEFT — Main Info */}
          <div className="xl:col-span-2 space-y-6">

            {/* Identity Card */}
            <SectionCard title="Personal Information" icon={User}>
              <div className="flex items-start gap-5 mb-6">
                <div className="w-16 h-16 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-lg font-bold shadow-sm flex-shrink-0 overflow-hidden">
                  {employee.photoUrl ? (
                    <img src={employee.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-gray-800">{employee.firstName} {employee.lastName}</p>
                  <p className="text-sm text-gray-400 font-medium">{employee.workEmail}</p>
                  {employee.mobileNumber && (
                    <p className="text-sm text-gray-400 font-medium">{employee.mobileNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <InfoItem label="First Name" value={employee.firstName} />
                <InfoItem label="Last Name" value={employee.lastName} />
                <InfoItem label="Gender" value={employee.gender} />
                <InfoItem label="Date of Birth" value={formatDate(employee.dateOfBirth)} icon={Calendar} />
                <InfoItem label="Mobile" value={employee.mobileNumber} icon={Phone} />
                <InfoItem label="Work Email" value={employee.workEmail} icon={Mail} />
              </div>
            </SectionCard>

            {/* Contact & Address */}
            <SectionCard title="Address & Location" icon={MapPin}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <InfoItem label="Street" value={employee.currentStreet} />
                <InfoItem label="City" value={employee.currentCity} />
                <InfoItem label="State" value={employee.currentState} />
                <InfoItem label="ZIP Code" value={employee.currentZip} />
                <InfoItem label="Country" value={employee.currentCountry} />
                <div className="col-span-2 md:col-span-1">
                  <InfoItem label="Full Address" value={fullAddress} />
                </div>
              </div>
            </SectionCard>

            {/* Employment Details */}
            <SectionCard title="Employment Record" icon={Briefcase}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <InfoItem label="Department" value={employee.department} icon={Building2} />
                <InfoItem label="Designation" value={employee.designation} icon={Award} />
                <InfoItem label="Employee ID" value={employee.id ? `#${employee.id}` : null} icon={Shield} />
                <InfoItem label="Date of Joining" value={formatDate(employee.dateOfJoining)} icon={Calendar} />
                <InfoItem label="Status" value={employee.status} />
              </div>
            </SectionCard>
          </div>

          {/* RIGHT — Sidebar */}
          <aside className="space-y-6">

            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-50">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Shield size={16} />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">Tenure Summary</h3>
              </div>
              <div className="space-y-4">
                <InfoItem label="Full Name" value={`${employee.firstName} ${employee.lastName}`} icon={User} />
                <InfoItem label="Department" value={employee.department} icon={Building2} />
                <InfoItem label="Joined On" value={formatDate(employee.dateOfJoining)} icon={Calendar} />
                <div className="pt-2">
                  <StatusBadge status={employee.status} />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-50">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FileText size={16} />
                </div>
                <h3 className="text-sm font-semibold text-gray-800">Documents</h3>
              </div>
              <div className="space-y-2">
                <DocLink label="Identity Proof" url={employee.identityProofUrl} />
                <DocLink label="Education Certificate" url={employee.educationCertUrl} />
                <DocLink label="Employment Proof" url={employee.employmentProofUrl} />
                {employee.photoUrl && (
                  <DocLink label="Profile Photo" url={employee.photoUrl} />
                )}
                {employee.otherDocUrls?.map((url, i) => (
                  <DocLink key={i} label={`Other Document ${i + 1}`} url={url} />
                ))}
                {(!employee.otherDocUrls || employee.otherDocUrls.length === 0) && (
                  <p className="text-xs text-gray-300 font-medium text-center pt-1">No additional documents</p>
                )}
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}