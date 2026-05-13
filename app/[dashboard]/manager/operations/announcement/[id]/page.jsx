'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from "framer-motion"
import {
  ChevronLeft, Calendar, User, Tag, AlertCircle,
  FileText, Clock, Download, ExternalLink, Paperclip
} from 'lucide-react'
import { getAnnouncementById } from "@/services/announcementService"
import { useTenant } from "@/hooks/useTenant"

export default function AnnouncementDetailPage() {
  const { id, dashboard } = useParams()
  const router = useRouter()
  const tenantId = useTenant()
  const [announcement, setAnnouncement] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id || !tenantId) return;
      try {
        setLoading(true);
        const res = await getAnnouncementById(id, tenantId);
        setAnnouncement(res.data);
      } catch (err) {
        console.error("Failed to fetch announcement detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, tenantId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Announcement Not Found</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 text-indigo-600 font-semibold hover:underline flex items-center gap-2 justify-center"
          >
            <ChevronLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#F8FAFC]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Breadcrumbs / Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-gray-500 hover:text-[#4A45B6] transition-colors mb-4 group text-sm font-medium"
        >
          <ChevronLeft size={16} />
          Back to Announcements
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="p-6 md:p-8 border-b border-gray-50 bg-gradient-to-br from-white to-[#F9FAFB]">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(announcement.priority)}`}>
                {announcement.priority || 'Standard'}
              </span>
              <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-gray-100">
                {announcement.category}
              </span>
            </div>

            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 leading-snug">
              {announcement.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Duration</p>
                  <p className="text-md font-semibold text-gray-700 truncate">
                    {announcement.startDate === announcement.endDate
                      ? formatDate(announcement.startDate)
                      : `${formatDate(announcement.startDate)} - ${formatDate(announcement.endDate)}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <User size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Audience</p>
                  <p className="text-md font-semibold text-gray-700 truncate">
                    {Array.isArray(announcement.audience) ? announcement.audience.join(', ') : announcement.audience || 'Company-wide'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Published</p>
                  <p className="text-md font-semibold text-gray-700 truncate">{formatDate(announcement.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8 grid grid-cols-2 gap-4">
            <div className="mb-8">
              <h3 className="text-sm   font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText size={16} className="text-indigo-500" />
                Message
              </h3>
              <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm p-4 border border-gray-100 rounded-md">
                {announcement.message}
              </div>
            </div>

            {/* Attachments */}
            {announcement.attachments && announcement.attachments.length > 0 && (
              <div className="border-t border-gray-50">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Paperclip size={16} className="text-indigo-500" />
                  Attachments ({announcement.attachments.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {announcement.attachments.map((url, index) => {
                    const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
                    return (
                      <div key={index} className="group flex items-center gap-3 bg-gray-50/50 p-2.5 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-white transition-all">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-xs flex items-center justify-center text-indigo-500 shrink-0 border border-gray-50">
                          {isImage ? <img src={url} className="w-full h-full object-cover rounded-lg" alt="attachment" /> : <FileText size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-gray-800 truncate">
                            File {index + 1}
                          </p>
                          <p className="text-xs text-gray-400 font-bold uppercase">
                            {isImage ? 'Image' : 'Document'}
                          </p>
                        </div>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          {/* <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex justify-end">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-md font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-xs"
            >
              Print
            </button>
          </div> */}
        </div>
      </motion.div>
    </div>
  )
}
