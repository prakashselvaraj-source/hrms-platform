'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion";
import {
  List, Calendar, Plus, Eye, Pencil, BarChart2, Trash2,
  ChevronLeft, ChevronRight, SlidersHorizontal, X, Paperclip,
  Bold, Italic, List as ListIcon, Link, CalendarDays, Upload,
  ChevronDown, FileText
} from 'lucide-react'
import { uploadImage } from '@/services/uploadService';
import { createAnnouncement, getAllAnnouncements, updateAnnouncement, deleteAnnouncement } from "@/services/announcementService";
import { useTenant } from "@/hooks/useTenant";
import AnnouncementCalendar from "@/components/announcements/AnnouncementCalendar";
// ─── Shared Components ──────────────────────────────────────────────────────

function SelectDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={ref} className="flex-1 min-w-[140px] relative">
      <p className="block text-sm font-semibold text-[#191C1E] mb-1.5">
        {label}
      </p>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between bg-[#FAFAFA] text-sm text-[#191C1E] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
      >
        <span className="truncate text-[#434655]">{value}</span>
        <span className={`text-gray-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
          <ChevronDown size={14} />
        </span>
      </button>

      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white bg-[#FAFAFA] rounded-md shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${opt === value
                ? "bg-indigo-50 text-indigo-700 font-semibold"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────

// const ANNOUNCEMENTS = [
//   {
//     id: 1,
//     title: 'Annual Healthcare Enrollment 2024',
//     tags: [{ label: 'HIGH PRIORITY', color: 'bg-purple-100 text-purple-700' }, { label: 'FEATURED', color: 'bg-blue-100 text-blue-700' }],
//     category: 'Policy Updates',
//     dateRange: 'Oct 12 - Oct 31',
//     status: 'ACTIVE',
//     audience: 'Company-wide',
//     docs: true,
//   },
//   {
//     id: 2,
//     title: 'Quarterly All-Hands Meeting',
//     tags: [{ label: 'EVENT', color: 'bg-gray-200 text-gray-600' }],
//     category: 'Events',
//     dateRange: 'Nov 05 - Nov 05',
//     status: 'SCHEDULED',
//     audience: '3 Departments',
//     docs: true,
//   },
//   {
//     id: 3,
//     title: 'Q3 Office Renovation Update',
//     tags: [{ label: 'NORMAL', color: 'bg-gray-200 text-gray-500' }],
//     category: 'Company News',
//     dateRange: 'Aug 20 - Sep 15',
//     status: 'EXPIRED',
//     audience: '1 Branches',
//     docs: false,
//   },
// ]

const STATUS_CONFIG = {
  ACTIVE: { dot: 'bg-emerald-500', text: 'text-emerald-600' },
  SCHEDULED: { dot: 'bg-gray-400', text: 'text-gray-500' },
  EXPIRED: { dot: 'bg-red-500', text: 'text-red-600' },
}

// ─── Create Announcement Modal ────────────────────────────────────────────────

function CreateAnnouncementModal({ isOpen, onClose, onRefresh }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Company News')
  const [priority, setPriority] = useState('Standard')
  const [audiences, setAudiences] = useState(['Engineering', 'Marketing'])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [message, setMessage] = useState('')
  const [newDep, setNewDep] = useState('')
  const [addingDep, setAddingDep] = useState(false)
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const tenantId = useTenant()

  const handleSubmit = async () => {
    if (!title || !message || !tenantId) {
      alert("Please fill in the title and message.");
      return;
    }
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      alert("End date cannot be earlier than start date.");
      return;
    }

    const payload = {
      title,
      category,
      priority,
      audience: audiences,
      startDate,
      endDate,
      message: message,
      attachments: files.map(f => f.url)
    };

    try {
      await createAnnouncement(payload, tenantId);
      alert("Announcement published successfully!");
      onClose();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to publish announcement. Please try again.");
    }
  };
  // Normalise whatever the backend returns into a plain URL string
  const extractUrl = (data) => {
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') {
      return data.url ?? data.fileUrl ?? data.path ?? data.data ?? '';
    }
    return '';
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  const removeAudience = (a) => setAudiences(audiences.filter(x => x !== a))
  const addAudience = () => {
    if (newDep.trim() && !audiences.includes(newDep.trim())) {
      setAudiences([...audiences, newDep.trim()])
    }
    setNewDep('')
    setAddingDep(false)
  }

  const handleFiles = async (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => file.size <= 10 * 1024 * 1024)
    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedFiles = await Promise.all(
        validFiles.map(async (file) => {
          const res = await uploadImage(file);
          return {
            file,
            url: extractUrl(res.data),
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB"
          };
        })
      );
      setFiles(prev => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload some files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }



  const onDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 pb-4 bg-[#F2F4F6]">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Announcement</h2>
            <p className="text-sm text-gray-400 mt-0.5">Broadcast important information across the organization.</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-[#191C1E] rounded-md hover:bg-gray-100 transition-colors mt-0.5">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-6 py-4 space-y-5 overflow-y-auto flex-1">
          {/* Announcement Title */}
          <div>
            <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Announcement Title</label>
            <input
              type="text"
              placeholder="e.g., Quarterly Town Hall Meeting"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#FAFAFA] rounded-md px-3.5 py-2.5 text-sm text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-300"
            />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <SelectDropdown
                label="Category"
                options={['Company News', 'Policy Updates', 'Events', 'HR']}
                value={category}
                onChange={setCategory}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Priority Level</label>
              <div className="flex bg-[#FAFAFA] rounded-md overflow-hidden p-1">
                {['Standard', 'Urgent', 'Critical'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 text-xs font-semibold py-2.5 transition-colors ${priority === p
                      ? 'bg-[#FFFFFF] text-[#4A45B6] border border-[#4A45B6] rounded-md'
                      : 'text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audience Target */}
          <div>
            <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Audience Target</label>
            <div className="flex flex-wrap gap-2 items-center">
              {audiences.map(a => (
                <span key={a} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1.5 rounded-md">
                  {a}
                  <button onClick={() => removeAudience(a)} className="text-indigo-400 hover:text-indigo-700 ml-0.5">
                    <X size={11} />
                  </button>
                </span>
              ))}
              {addingDep ? (
                <input
                  autoFocus
                  value={newDep}
                  onChange={e => setNewDep(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addAudience(); if (e.key === 'Escape') setAddingDep(false) }}
                  onBlur={addAudience}
                  placeholder="Department..."
                  className="border border-dashed border-indigo-300 rounded-md px-2 py-1 text-xs text-indigo-700 focus:outline-none w-24"
                />
              ) : (
                <button
                  onClick={() => setAddingDep(true)}
                  className="flex items-center gap-1 border border-dashed border-gray-300 text-[#4A45B6] text-xs font-medium px-2.5 py-1.5 rounded-md hover:border-indigo-300 hover:text-indigo-500 transition-colors"
                >
                  <Plus size={11} /> Add Dep
                </button>
              )}
            </div>
          </div>

          {/* Start + End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Start Date</label>
              <div className="relative">

                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-[#FAFAFA] rounded-md pl-2 pr-3 py-2.5 text-sm text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">End Date</label>
              <div className="relative">

                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-[#FAFAFA] rounded-md pl-2 pr-3 py-2.5 text-sm text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Message Content</label>
            <div className=" rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
              {/* Toolbar */}
              <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-[#FAFAFA]">
                {[Bold, Italic, ListIcon, Link].map((Icon, i) => (
                  <button key={i} className="p-1 text-gray-400 hover:text-[#191C1E] hover:bg-gray-200 rounded transition-colors">
                    <Icon size={14} />
                  </button>
                ))}
              </div>
              <textarea
                rows={4}
                placeholder="Enter your announcement details here..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm text-[#191C1E] placeholder-gray-300 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Attachments</label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div
              onDragEnter={onDrag}
              onDragOver={onDrag}
              onDragLeave={onDrag}
              onDrop={onDrop}
              onClick={() => fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-[#C3C6D7] bg-[#F2F4F6]'
                }`}
            >
              <div className="w-10 h-10 bg-[#4A45B61A] text-[#4A45B6] rounded-xl flex items-center justify-center transition-colors">
                <Upload size={18} />
              </div>
              <p className="text-sm font-semibold text-[#191C1E]">
                {isUploading ? "Uploading files..." : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-400">PDF, DOCX, PNG or JPG (max. 10MB)</p>
              {isUploading && (
                <div className="w-full max-w-[200px] bg-gray-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#4A45B6] h-full animate-progress" style={{ width: '100%' }}></div>
                </div>
              )}
            </div>

            {/* Selected Files List */}
            {files != null && (
              <div className="mt-4 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-500 rounded-md">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1E293B] truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] texgt-gray-400 uppercase font-bold">{file.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col bg-[#F2F4F6] md:flex-row items-center md:justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 w-full md:w-fit text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors"
          >
            Cancel
          </button>
          <button className="px-6 py-2.5 w-full md:w-fit bg-[#4A45B6] text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-500/20 hover:bg-[#3B35A7] transition-all" onClick={handleSubmit}>
            Publish Announcement
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Edit Announcement Modal ──────────────────────────────────────────────────

function EditAnnouncementModal({ isOpen, onClose, onRefresh, announcement }) {
  const [title, setTitle] = useState(announcement?.title || '')
  const [category, setCategory] = useState(announcement?.category || 'Company News')
  const [priority, setPriority] = useState(announcement?.priority || 'Standard')
  const [audiences, setAudiences] = useState(
    Array.isArray(announcement?.audience) ? announcement.audience : []
  )
  const [startDate, setStartDate] = useState(announcement?.startDate || '')
  const [endDate, setEndDate] = useState(announcement?.endDate || '')
  const [message, setMessage] = useState(announcement?.message || '')
  const [newDep, setNewDep] = useState('')
  const [addingDep, setAddingDep] = useState(false)
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const tenantId = useTenant()

  // Normalise whatever the backend returns into a plain URL string
  const extractUrl = (data) => {
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') {
      return data.url ?? data.fileUrl ?? data.path ?? data.data ?? '';
    }
    return '';
  };

  // Re-seed whenever the announcement prop changes (different row opened)
  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title || '');
      setCategory(announcement.category || 'Company News');
      setPriority(announcement.priority || 'Standard');
      setAudiences(Array.isArray(announcement.audience) ? announcement.audience : []);
      setStartDate(announcement.startDate || '');
      setEndDate(announcement.endDate || '');
      setMessage(announcement.message || '');
      // Initialize files from attachments
      if (Array.isArray(announcement.attachments)) {
        setFiles(announcement.attachments.map(url => ({
          url,
          name: url.split('/').pop(),
          size: 'N/A'
        })));
      } else {
        setFiles([]);
      }
    }
  }, [announcement]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const removeAudience = (a) => setAudiences(audiences.filter(x => x !== a));
  const addAudience = () => {
    if (newDep.trim() && !audiences.includes(newDep.trim())) {
      setAudiences([...audiences, newDep.trim()]);
    }
    setNewDep(''); setAddingDep(false);
  };

  const handleFiles = async (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => file.size <= 10 * 1024 * 1024)
    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedFiles = await Promise.all(
        validFiles.map(async (file) => {
          const res = await uploadImage(file);
          return {
            file,
            url: extractUrl(res.data),
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + " MB"
          };
        })
      );
      setFiles(prev => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload some files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  const onDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!title || !message) { alert('Please fill in title and message.'); return; }
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      alert('End date cannot be before start date.'); return;
    }
    const payload = {
      title,
      category,
      priority,
      audience: audiences,
      startDate,
      endDate,
      message,
      attachments: files.map(f => f.url)
    };
    try {
      await updateAnnouncement(announcement.id, payload, tenantId);
      alert('Announcement updated successfully!');
      onClose();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update announcement. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 pb-4 bg-[#F2F4F6]">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Announcement</h2>
            <p className="text-sm text-gray-400 mt-0.5">Update the announcement details below.</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-[#191C1E] rounded-md hover:bg-gray-100 transition-colors mt-0.5">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 sm:px-6 pb-6 py-4 space-y-5 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Announcement Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#FAFAFA] rounded-md px-3.5 py-2.5 text-sm text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-300" />
          </div>

          {/* Category + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectDropdown label="Category" options={['Company News', 'Policy Updates', 'Events', 'HR']} value={category} onChange={setCategory} />
            <div>
              <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Priority Level</label>
              <div className="flex bg-[#FAFAFA] rounded-md overflow-hidden p-1">
                {['Standard', 'Urgent', 'Critical'].map(p => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`flex-1 text-xs font-semibold py-2.5 transition-colors ${priority === p ? 'bg-[#FFFFFF] text-[#4A45B6] border border-[#4A45B6] rounded-md' : 'text-gray-500 hover:bg-gray-50'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Audience Target</label>
            <div className="flex flex-wrap gap-2 items-center">
              {audiences.map(a => (
                <span key={a} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1.5 rounded-md">
                  {a}
                  <button onClick={() => removeAudience(a)} className="text-indigo-400 hover:text-indigo-700 ml-0.5"><X size={11} /></button>
                </span>
              ))}
              {addingDep ? (
                <input autoFocus value={newDep} onChange={e => setNewDep(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addAudience(); if (e.key === 'Escape') setAddingDep(false); }}
                  onBlur={addAudience} placeholder="Department..."
                  className="border border-dashed border-indigo-300 rounded-md px-2 py-1 text-xs text-indigo-700 focus:outline-none w-24" />
              ) : (
                <button onClick={() => setAddingDep(true)}
                  className="flex items-center gap-1 border border-dashed border-gray-300 text-[#4A45B6] text-xs font-medium px-2.5 py-1.5 rounded-md hover:border-indigo-300 transition-colors">
                  <Plus size={11} /> Add Dep
                </button>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Start Date</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                className="w-full bg-[#FAFAFA] rounded-md pl-2 pr-3 py-2.5 text-sm text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">End Date</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                className="w-full bg-[#FAFAFA] rounded-md pl-2 pr-3 py-2.5 text-sm text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Message Content</label>
            <div className="rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-400">
              <div className="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-[#FAFAFA]">
                {[Bold, Italic, ListIcon, Link].map((Icon, i) => (
                  <button key={i} className="p-1 text-gray-400 hover:text-[#191C1E] hover:bg-gray-200 rounded transition-colors"><Icon size={14} /></button>
                ))}
              </div>
              <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm text-[#191C1E] placeholder-gray-300 focus:outline-none resize-none" />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-semibold text-[#191C1E] mb-1.5">Attachments</label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div
              onDragEnter={onDrag}
              onDragOver={onDrag}
              onDragLeave={onDrag}
              onDrop={onDrop}
              onClick={() => fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-[#C3C6D7] bg-[#F2F4F6]'
                }`}
            >
              <div className="w-10 h-10 bg-[#4A45B61A] text-[#4A45B6] rounded-xl flex items-center justify-center transition-colors">
                <Upload size={18} />
              </div>
              <p className="text-sm font-semibold text-[#191C1E]">
                {isUploading ? "Uploading files..." : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-gray-400">PDF, DOCX, PNG or JPG (max. 10MB)</p>
              {isUploading && (
                <div className="w-full max-w-[200px] bg-gray-200 h-1 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#4A45B6] h-full animate-progress" style={{ width: '100%' }}></div>
                </div>
              )}
            </div>

            {/* Selected Files List */}
            {files != null && (
              <div className="mt-4 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-500 rounded-md">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1E293B] truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">{file.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(i);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col bg-[#F2F4F6] md:flex-row items-center md:justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="px-5 py-2.5 w-full md:w-fit text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-6 py-2.5 w-full md:w-fit bg-[#4A45B6] text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-500/20 hover:bg-[#3B35A7] transition-all">
            Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Announcement</h3>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete <span className="font-semibold text-gray-900">"{title}"</span>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-lg shadow-red-500/20 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnnouncementsPage() {
  const [view, setView] = useState('list')
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingAnnouncement, setDeletingAnnouncement] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const tenantId = useTenant()
  const router = useRouter()
  const params = useParams()

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // ── Pagination state (must be declared before fetchAnnouncements) ──
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ── Filter states ──
  const [category, setCategory] = useState('All Categories')
  const [department, setDepartment] = useState('All Departments')
  const [branch, setBranch] = useState('All Branches')
  const [status, setStatus] = useState('All Status')
  const [priority, setPriority] = useState('All Priority')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  // ── Derived pagination values ──
  // currentPage is 0-based: page 0, 10 rows → "Showing 1–10 of N"
  const from = totalEntries === 0 ? 0 : currentPage * rowsPerPage + 1;
  const to = Math.min((currentPage + 1) * rowsPerPage, totalEntries);
  const pages = Array.from({ length: totalPages }, (_, i) => i).filter(
    (p) => p >= Math.max(0, currentPage - 1) && p <= Math.min(totalPages - 1, currentPage + 1)
  );
  const PER_PAGE_OPTIONS = [10, 20, 50];

  const CATEGORY_OPTIONS = ['All Categories', 'Policy Updates', 'Events', 'Company News', 'HR']
  const DEPARTMENT_OPTIONS = ['All Departments', 'Engineering', 'Marketing', 'HR', 'Finance']
  const BRANCH_OPTIONS = ['All Branches', 'Main Office', 'Downtown', 'Remote']
  const STATUS_OPTIONS = ['All Status', 'ACTIVE', 'SCHEDULED', 'EXPIRED']
  const PRIORITY_OPTIONS = ['All Priority', 'HIGH PRIORITY', 'NORMAL', 'EVENT']

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await getAllAnnouncements(tenantId, currentPage, rowsPerPage);
      console.log(res);
      // Support paginated response { announcements, currentPage, totalPages, totalElements }
      if (res.data?.announcements) {
        setAnnouncements(res.data.announcements);
        setTotalEntries(res.data.totalElements ?? 0);
        setTotalPages(res.data.totalPages ?? 0);
      } else {
        setAnnouncements(res.data || []);
        setTotalEntries((res.data || []).length);
        setTotalPages(Math.ceil((res.data || []).length / rowsPerPage));
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) fetchAnnouncements();
  }, [tenantId, currentPage, rowsPerPage]);

  const handleDelete = async () => {
    if (!deletingAnnouncement || !tenantId) return;
    try {
      await deleteAnnouncement(deletingAnnouncement.id, tenantId);
      alert('Announcement deleted successfully!');
      setDeleteModalOpen(false);
      setDeletingAnnouncement(null);
      fetchAnnouncements();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete announcement.');
    }
  };



  return (
    <div className="min-h-screen p-6 md:p-10 bg-[#F8FAFC]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#191C1E]">Announcements</h1>
          <p className="text-sm text-[#434655] mt-1">Manage and monitor internal communications across<br />the organization.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap flex-shrink-0">
          {/* View Toggle */}
          <div className="flex items-center bg-[#ECEEF0] p-1 rounded-md">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-[#434655]' : 'text-[#434655]'
                }`}
            >
              <List size={14} /> List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'calendar' ? 'bg-white shadow-sm text-[#434655]' : 'text-[#434655]'
                }`}
            >
              <Calendar size={14} /> Calendar View
            </button>
          </div>
          {/* Add Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-[#4A45B6] text-white px-5 py-2.5 rounded-sm text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus size={18} /> Add Announcement
          </button>
        </div>
      </div>

      {/* Hide/Show Filters Toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowFilters(f => !f)}
          className="flex items-center gap-2 bg-[#F2F4F6] text-[#434655] text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          <SlidersHorizontal size={14} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-xs p-6 mb-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            <SelectDropdown label="CATEGORY" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
            <SelectDropdown label="DEPARTMENT" options={DEPARTMENT_OPTIONS} value={department} onChange={setDepartment} />
            <SelectDropdown label="BRANCH" options={BRANCH_OPTIONS} value={branch} onChange={setBranch} />
            <SelectDropdown label="STATUS" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
            <SelectDropdown label="PRIORITY" options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} />
            <div>
              <label className="block text-[10px] font-bold text-[#434655] tracking-wider mb-1.5">DATE FROM</label>
              <div className="relative">

                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full bg-[#FAFAFA] rounded-md pl-3 pr-9 py-2 text-sm text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-[#434655] tracking-wider mb-1.5">DATE TO</label>
              <div className="relative">
                <input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full bg-[#FAFAFA] rounded-md pl-3 pr-9 py-2 text-sm text-[#191C1E] focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                id="featured"
                checked={featuredOnly}
                onChange={e => setFeaturedOnly(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
              <label htmlFor="featured" className="text-sm text-gray-600 cursor-pointer font-medium">Featured Only</label>
            </div>
            <div className="lg:col-span-4 flex items-center justify-end gap-3">
              <button className="bg-[#00897B] hover:bg-[#00796B] text-white text-sm font-semibold px-6 py-2 rounded-md shadow-sm transition-colors">
                Apply Filters
              </button>
              <button onClick={() => { setCategory('All Categories'); setDepartment('All Departments'); setBranch('All Branches'); setStatus('All Status'); setPriority('All Priority'); setDateFrom(''); setDateTo(''); setFeaturedOnly(false); }} className="text-sm text-[#434655] font-medium px-2 py-2 transition-colors">
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="p-20 text-center text-gray-400">Loading announcements...</div>
      ) : view === 'calendar' ? (
        <AnnouncementCalendar
          announcements={announcements}
          onViewDetail={(id) => router.push(`/${params.dashboard}/admin/announcement/${id}`)}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Title', 'Created', 'Duration', 'Priority', 'Audience', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {announcements.map((item) => {
                const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.ACTIVE
                const rangeText = item.startDate && item.endDate
                  ? (item.startDate === item.endDate
                    ? formatDate(item.startDate)
                    : `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`)
                  : item.startDate ? `From ${formatDate(item.startDate)}` : 'N/A';

                const audienceText = Array.isArray(item.audience)
                  ? item.audience.join(', ')
                  : item.audience || 'N/A';

                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{item.category}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{formatDate(item.createdAt)}</td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{rangeText}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-tight">
                        {item.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-500">{audienceText}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/${params.dashboard}/admin/announcement/${item.id}`)}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => { setEditingAnnouncement(item); setEditModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => { setDeletingAnnouncement(item); setDeleteModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {announcements.length === 0 && (
                <tr key="empty-state">
                  <td colSpan="7" className="p-20 text-center text-gray-400 italic font-medium">
                    No announcements found for this tenant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-3.5 border-t border-gray-100">
        <div className="flex items-center gap-3 text-[12px] text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#434655]">Per Page:</span>
            <select
              id="per-page-select-announcements"
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(0); }}
              className="rounded-md px-2 py-0.5 text-[12px] text-[#4A45B6] bg-white focus:outline-none focus:border-[#7C3AED]"
            >
              {PER_PAGE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <span className="text-[#434655]">Showing {from} to {to} of {totalEntries} entries</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            id="prev-page-btn-announcements"
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#434655] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          {pages.map((page) => (
            <button
              key={page}
              id={`page-btn-announcement-${page}`}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 flex items-center justify-center rounded-md text-[12px] font-medium transition-colors ${currentPage === page
                ? 'bg-[#4A45B6] text-white'
                : 'border border-[#E2E8F0] text-[#6B7280]'
                }`}
            >
              {page + 1}
            </button>
          ))}
          <button
            id="next-page-btn-announcements"
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E2E8F0] text-[#434655] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <CreateAnnouncementModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onRefresh={fetchAnnouncements} />
        )}
        {editModalOpen && editingAnnouncement && (
          <EditAnnouncementModal
            isOpen={editModalOpen}
            onClose={() => { setEditModalOpen(false); setEditingAnnouncement(null); }}
            onRefresh={fetchAnnouncements}
            announcement={editingAnnouncement}
          />
        )}
        {deleteModalOpen && deletingAnnouncement && (
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => { setDeleteModalOpen(false); setDeletingAnnouncement(null); }}
            onConfirm={handleDelete}
            title={deletingAnnouncement.title}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
