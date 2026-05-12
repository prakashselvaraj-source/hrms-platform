"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import {
  ArrowLeft,
  Send,
  Paperclip,
  AlertCircle,
  MessageSquare,
  Shield,
  Zap,
  Info,
  X,
  FileText,
  Loader2,
  Trash,
  Trash2,
  Trash2Icon
} from "lucide-react";
import Link from "next/link";
import CustomDropdown from "@/components/ui/employee-onboarding/CustomDropdown";
import { uploadImage } from "@/services/uploadService";
import { createTicket } from "@/services/ticketService";

export default function RaiseTicketPage() {
  const router = useRouter();
  const tenantId = useTenant();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    subject: "",
    category: "Technical",
    priority: "Medium",
    description: "",
    attachments: [],
  });

  const categories = [
    { name: "Technical", icon: <Zap size={14} />, desc: "Software, Hardware, VPN" },
    { name: "Payroll", icon: <Info size={14} />, desc: "Salary, Tax, Bonus" },
    { name: "HR", icon: <Shield size={14} />, desc: "Policy, Leave, Benefits" },
    { name: "Workspace", icon: <MessageSquare size={14} />, desc: "Desk, Access, Office" },
  ];

  const priorityOptions = [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
    { label: "Urgent", value: "Urgent" },
  ];

  const extractUrl = (data) => {
    if (typeof data === 'string') return data;
    if (data && typeof data === "object") {
      return data.url ?? data.fileUrl ?? data.path ?? data.data ?? "";
    }
    return "";
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const res = await uploadImage(file);
          const url = extractUrl(res.data);
          return {
            name: file.name,
            url: url,
            size: (file.size / 1024).toFixed(1) + " KB",
          };
        })
      );
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles],
      }));
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload some files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTicket(tenantId, formData);
      router.push(`/${tenantId}/support`);
    } catch (err) {
      console.error("Failed to submit ticket", err);
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-6 lg:p-10 font-sans">
      <div className="mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href={`/${tenantId}/support`}
            className="p-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#4A45B6] hover:border-[#4A45B6] transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1E293B]">Raise New Ticket</h1>
            <p className="text-sm text-gray-500">Submit a request to our support team</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Subject</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Software Access Request"
                      className="w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-[#434655] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <CustomDropdown
                      label="Priority"
                      options={priorityOptions}
                      value={formData.priority}
                      onChange={(val) => setFormData({ ...formData, priority: val })}
                      placeholder="Select Priority"
                    />
                  </div>


                </div>

                {/* Category Grid */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Category</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.name })}
                        className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${formData.category === cat.name
                          ? "bg-indigo-50 border-[#4A45B6] ring-1 ring-[#4A45B6]"
                          : "bg-white border-gray-100 hover:border-gray-300"
                          }`}
                      >
                        <div className={`mt-0.5 p-2 rounded-lg ${formData.category === cat.name ? "bg-[#4A45B6] text-white" : "bg-gray-50 text-gray-400"
                          }`}>
                          {cat.icon}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${formData.category === cat.name ? "text-[#4A45B6]" : "text-gray-700"}`}>
                            {cat.name}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium">{cat.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority & Upload Row */}
                <div >

                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Attachments</label>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-[#F2F4F6] border-2 border-dashed border-[#C3C6D74D] rounded-xl p-4 flex flex-col items-center text-center cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#E2DFFF] flex items-center justify-center mb-2">
                        {uploading ? (
                          <Loader2 size={18} className="animate-spin text-[#4A45B6]" />
                        ) : (
                          <Paperclip size={18} className="text-[#4A45B6]" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#191C1E]">
                        {uploading ? "Uploading..." : "Click to upload files"}
                      </p>
                      <p className="text-[10px] text-[#434655] mt-1">PDF, JPG, PNG (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                {/* Attachment List */}
                {formData.attachments.length > 0 && (
                  <div >
                    <div>
                    </div>
                    {formData.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 group w-fit"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-white rounded-lg text-[#4A45B6] shadow-sm">
                            <FileText size={16} />
                          </div>
                          <div className="min-w-0">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-gray-700 truncate hover:text-[#4A45B6] transition-colors block"
                            >
                              {file.name}
                            </a>
                            <p className="text-[10px] text-gray-400 font-medium">{file.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(idx)}
                          className="p-1.5 ml-4 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2Icon size={17} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">Detailed Description</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Please provide as much detail as possible..."
                    className="w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-[#434655] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#712AE2] resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Submit */}
                <button
                  disabled={loading || uploading || !formData.subject.trim() || !formData.description.trim() || !formData.category || !formData.priority}
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-[#4A45B6] hover:bg-[#3d389e] text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Ticket
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-6">
            <div className="bg-[#4A45B6] rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Shield size={18} />
                  </div>
                  <h3 className="font-bold">Pro-Tip</h3>
                </div>
                <p className="text-sm text-indigo-50 leading-relaxed">
                  Adding screenshots or error logs helps our technical team resolve your issues up to 40% faster.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <AlertCircle size={16} className="text-[#4A45B6]" />
                Typical Response Times
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Technical", time: "< 2 Hours" },
                  { label: "HR & Payroll", time: "< 24 Hours" },
                  { label: "General", time: "< 4 Hours" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-500 font-medium">{item.label}</span>
                    <span className="text-xs font-bold text-gray-800">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
