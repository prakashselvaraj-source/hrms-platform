"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPromotionById } from "@/services/promotion";
import { getEmployees } from "@/services/employeeService";
import { useTenant } from "@/hooks/useTenant";
import { ArrowRight, Calendar, DollarSign, FileCheck, FileText, ChevronDown, ChevronLeft, AlertCircle, ExternalLink, Pencil, Save, X, Upload } from "lucide-react";
import { updatePromotion } from "@/services/promotion";
import { uploadImage } from "@/services/uploadService";
import Image from "next/image";

const avatarColors = {
  JC: "bg-purple-100 text-purple-700",
  RF: "bg-blue-100 text-blue-700",
  CF: "bg-green-100 text-green-700",
  WJ: "bg-orange-100 text-orange-700",
  LA: "bg-pink-100 text-pink-700",
};
const defaultAvatarColor = "bg-gray-100 text-gray-700";

const statusStyles = {
  APPROVED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  REJECTED: "bg-red-100 text-red-700",
};

const fmt = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
};



export default function PromotionViewPage() {
  const params = useParams();
  const route = useRouter();
  const tenantId = useTenant();
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes("edit=true")) {
      setIsEditing(true);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!tenantId || !params.id) return;
      try {
        const [promoRes, empRes] = await Promise.all([
          getPromotionById(params.id, tenantId),
          getEmployees(tenantId)
        ]);

        const p = promoRes.data;
        const employees = empRes.data || [];
        const emp = employees.find(e => e.id === p.employeeId) || p.employee || {};

        const promoData = {
          id: p.id,
          employee: {
            name: emp.firstName ? `${emp.firstName} ${emp.lastName}` : `Employee ${p.employeeId}`,
            email: emp.email || "N/A",
            avatar: emp.firstName ? `${emp.firstName[0]}${emp.lastName?.[0] || ""}`.toUpperCase() : "U",
          },
          prevDesignation: p.previousDesignation || "-",
          newDesignation: p.newDesignation || "-",
          promotionDate: p.promotionDate || null,
          salaryAdj: p.salaryAdjustment ? p.salaryAdjustment.toString() : "-",
          salaryRaw: p.basicSalary ? `Rs.${p.basicSalary}` : "-",
          status: p.status || "APPROVED",
          reason: p.reason || "",
          document: p.promotionLetterUrl || p.promotionLetter ? { name: (p.promotionLetterUrl || p.promotionLetter).split('/').pop(), url: p.promotionLetterUrl || p.promotionLetter } : null,
        };

        setPromo(promoData);
        setForm({
          prevDesignation: promoData.prevDesignation,
          newDesignation: promoData.newDesignation === "-" ? "" : promoData.newDesignation,
          promotionDate: promoData.promotionDate || "",
          salaryAdj: promoData.salaryAdj === "-" ? "" : promoData.salaryAdj,
          salaryRaw: promoData.salaryRaw === "-" ? "" : promoData.salaryRaw.replace("Rs.", ""),
          status: promoData.status,
          reason: promoData.reason,
          document: promoData.document,
        });

      } catch (err) {
        console.error("Error fetching promotion details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tenantId, params.id]);

  const setF = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setF("document", file);
  };

  const handleSave = async () => {
    if (!tenantId) return;
    setIsSaving(true);
    try {
      let finalDocUrl = null;
      if (form.document && form.document instanceof File) {
        finalDocUrl = await uploadImage(form.document);
      } else if (form.document && form.document.url) {
        finalDocUrl = form.document.url;
      } else if (typeof form.document === 'string') {
        finalDocUrl = form.document;
      }

      const payload = {
        employeeId: promo.employeeId,
        previousDesignation: form.prevDesignation,
        newDesignation: form.newDesignation,
        promotionDate: form.promotionDate,
        basicSalary: form.salaryRaw ? parseFloat(form.salaryRaw.toString().replace(/[^0-9.-]+/g, "")) : null,
        salaryAdjustment: form.salaryAdj ? parseFloat(form.salaryAdj.toString().replace(/[^0-9.-]+/g, "")) : null,
        reason: form.reason,
        status: form.status,
        promotionLetterUrl: finalDocUrl
      };

      await updatePromotion(promo.id, payload, tenantId);

      // Update local promo state
      setPromo(prev => ({
        ...prev,
        prevDesignation: form.prevDesignation,
        newDesignation: form.newDesignation,
        promotionDate: form.promotionDate,
        salaryRaw: form.salaryRaw ? `Rs.${form.salaryRaw}` : "-",
        salaryAdj: form.salaryAdj || "-",
        reason: form.reason,
        status: form.status,
        document: form.document instanceof File ? { name: form.document.name, url: URL.createObjectURL(form.document) } : form.document
      }));

      setIsEditing(false);
      route.push(`/${params.dashboard}/admin/promotion/${params.id}`); // Clear query params
      alert("Promotion updated successfully!");
    } catch (error) {
      console.error("Failed to update promotion", error);
      alert("Failed to update promotion.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-10 flex flex-col items-center justify-center font-sans bg-[#F8F9FA]">
        <div className="w-10 h-10 border-4 border-[#4A45B6] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#464554] text-sm font-medium">Loading promotion details...</p>
      </div>
    );
  }

  if (!promo) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-10 flex flex-col items-center justify-center font-sans bg-[#F8F9FA]">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Promotion Not Found</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md text-center">
          The promotion record you are looking for does not exist or you do not have permission to view it.
        </p>
        <button onClick={() => route.push(`/${params.dashboard}/admin/promotion`)} className="px-6 py-2.5 bg-[#4A45B6] text-white rounded-md text-sm font-medium hover:bg-[#3835a0] transition-colors shadow-sm">
          Return to Promotions
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 sm:py-10 font-sans bg-[#F8F9FA]">
      <div className="max-w-[960px] mx-auto mb-6">
        <div className="flex justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#E1E0FF] text-[10px] font-semibold tracking-wide text-[#13144A] uppercase mb-4 shadow-sm">
            Promotion Record
          </span>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-sm text-white bg-[#4A45B6] px-4 py-2 rounded-md font-semibold mb-6 hover:bg-[#3835a0] transition-colors shadow-sm"
              >
                <Pencil size={14} /> Edit Promotion
              </button>
            )}
            <button
              onClick={() => route.push(`/${params.dashboard}/admin/promotion`)}
              className="flex items-center gap-1.5 text-sm text-[#4A45B6] bg-white border border-[#4A45B6] px-4 py-2 rounded-md font-semibold mb-6 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ChevronLeft size={16} /> Back to List
            </button>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#191C1E] leading-tight mb-2">
          Career Advancement Details
        </h1>
        <p className="text-[#464554] text-sm leading-relaxed max-w-[480px]">
          Reviewing the organizational shift and professional milestones for your team member.
        </p>
      </div>

      <div className="max-w-[960px] mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Card Header — Purple Gradient */}
        <div className="bg-gradient-to-r from-[#8B5CF6] to-[#4F279B] px-5 py-7 sm:px-8 sm:py-8 relative">
          <div className="relative z-10">
            <h2 className="text-white text-xl font-bold mb-1">
              Promotion Details
            </h2>
            <p className="text-[#C4B5FD] text-xs sm:text-sm">
              Snapshot of the team member&apos;s new role and adjustments.
            </p>
          </div>
          <div className="absolute right-6 sm:right-20 top-1/2 -translate-y-1/2 opacity-20 sm:opacity-100">
            <Image src="/images/icon.png" alt="star icon" width={50} height={80} className="brightness-40" />
          </div>
        </div>

        {/* Form Body */}
        <div className="px-5 py-6 space-y-8">
          {/* Employee Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex-shrink-0 flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm ${avatarColors[promo.employee.avatar] || defaultAvatarColor}`}>
              {promo.employee.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <span className="text-xl font-bold text-[#191C1E]">{promo.employee.name}</span>
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm ${statusStyles[promo.status]}`}>{promo.status}</span>
              </div>

            </div>
          </div>

          {/* Designation Change */}
          <div>
            <h3 className="text-xs font-bold text-[#4B5563] mb-4 uppercase tracking-wide">Designation Change</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex-1 rounded-xl px-5 py-3 bg-gradient-to-br from-red-50 to-white border border-red-100 shadow-sm">
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide mb-3">Previous Role</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <FileCheck size={18} className="text-red-500" />
                  </div>
                  {isEditing ? (
                    <input
                      value={form.prevDesignation}
                      onChange={(e) => setF("prevDesignation", e.target.value)}
                      className="w-full text-md font-bold text-gray-800 bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30 rounded-md"
                    />
                  ) : (
                    <span className="font-bold text-gray-800 text-md">{promo.prevDesignation}</span>
                  )}
                </div>
              </div>
              <div className="text-[#4A45B6] bg-[#E1E0FF] p-3 rounded-full self-center flex-shrink-0 shadow-sm ring-4 ring-white">
                <ArrowRight size={20} className="sm:block hidden" />
                <ChevronDown size={20} className="sm:hidden" />
              </div>
              <div className="flex-1 rounded-xl px-5 py-3 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-sm">
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wide mb-3">New Role</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <FileCheck size={18} className="text-[#4A45B6]" />
                  </div>
                  {isEditing ? (
                    <input
                      value={form.newDesignation}
                      onChange={(e) => setF("newDesignation", e.target.value)}
                      className="w-full text-md rounded-md font-bold text-[#4A45B6] bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30"
                    />
                  ) : (
                    <span className="font-bold text-[#4A45B6] text-md">{promo.newDesignation}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline and Salary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            <div className="bg-[#F8F9FA] rounded-xl px-5 py-3 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold text-[#4B5563] mb-5 uppercase tracking-wide">Timeline</h3>
              <div className="space-y-6">

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <div className="w-full">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-1">Promotion Date</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={form.promotionDate}
                        onChange={(e) => setF("promotionDate", e.target.value)}
                        className="w-full rounded-md text-sm text-gray-800 bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30"
                      />
                    ) : (
                      <p className="font-bold text-[#191C1E] text-base">{fmt(promo.promotionDate)}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 font-medium">Full transition to new department.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary */}
            <div className="bg-[#F8F9FA] rounded-xl px-5 py-3 border border-gray-100 shadow-sm">
              <h3 className="text-xs font-bold text-[#4B5563] mb-5 uppercase tracking-wide">Salary Adjustment</h3>
              <div className="h-[calc(100%-2.5rem)] flex flex-col justify-center">
                <div className="flex items-start gap-4 bg-white px-5 py-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <DollarSign size={24} className="text-emerald-600" />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-1">Gross Adjustment</p>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          value={form.salaryAdj}
                          onChange={(e) => setF("salaryAdj", e.target.value)}
                          placeholder="e.g. 20000"
                          className="w-full text-lg rounded-md font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-emerald-800 bg-emerald-50 inline-block px-2 py-0.5 rounded mt-2">
                          Increase: {promo.salaryAdj}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reason and Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-[#4B5563] mb-4 uppercase tracking-wide">Reason for Promotion</h3>
              <div className="flex-1 rounded-xl bg-white p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-[#4B5563]" />
                  </div>
                  {isEditing ? (
                    <textarea
                      value={form.reason}
                      onChange={(e) => setF("reason", e.target.value)}
                      rows={4}
                      className="w-full rounded-md text-sm text-gray-600 bg-white border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A45B6]/30 resize-none"
                    />
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed font-medium pt-1 italic">&quot;{promo.reason}&quot;</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-[#4B5563] mb-4 uppercase tracking-wide">Attached Document</h3>
              <div className="flex-1 rounded-xl p-6 border border-gray-100 bg-white shadow-sm flex flex-col justify-center">
                {isEditing ? (
                  <div className="w-full">
                    <input id="docUpload" type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileChange} />
                    <button
                      type="button"
                      onClick={() => document.getElementById('docUpload').click()}
                      className="w-full flex flex-col items-center justify-center gap-2 p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-100 hover:border-[#4A45B6]/30 transition-all cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <Upload size={20} className="text-[#4A45B6]" />
                      </div>
                      <p className="text-sm font-medium text-[#4A45B6]">
                        {form.document ? (form.document instanceof File ? form.document.name : (form.document.name || 'File Selected')) : 'Upload New Document'}
                      </p>
                      <p className="text-xs text-gray-400">PDF or Images up to 5MB</p>
                    </button>
                  </div>
                ) : (
                  <>
                    {promo.document ? (
                      <div className="w-full">
                        <div className="group flex items-center gap-3 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-white transition-all">
                          <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-500 shrink-0 border border-gray-50">
                            {promo.document.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                              <img src={promo.document.url} className="w-full h-full object-cover rounded-lg" alt="attachment" />
                            ) : (
                              <FileText size={18} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-gray-800 truncate">
                              {promo.document.name}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">
                              {promo.document.name.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? 'Image' : 'Document'}
                            </p>
                          </div>
                          <a
                            href={promo.document.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#F8F9FA] rounded-xl h-full min-h-[100px] w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 py-6">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <AlertCircle size={24} className="text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">No documentation attached</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status Editing */}
          {isEditing && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-xs font-bold text-[#4B5563] mb-4 uppercase tracking-wide">Status</h3>
              <div className="flex flex-wrap gap-3">
                {["APPROVED", "PENDING", "REJECTED"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setF("status", s)}
                    className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${form.status === s ? statusStyles[s] + " ring-2 ring-offset-2 ring-current scale-105" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="border-t border-gray-100 pt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setIsEditing(false); route.push(`/${params.dashboard}/admin/promotion/${params.id}`); }}
                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#4A45B6] text-white rounded-lg text-sm font-semibold hover:bg-[#3835a0] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={16} />
                )}
                Save Changes
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
