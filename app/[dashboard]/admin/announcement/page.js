'use client'
import { useState, useRef, useEffect } from 'react'
import {
  List, Calendar, Plus, Eye, Pencil, BarChart2, Trash2,
  ChevronLeft, ChevronRight, SlidersHorizontal, X, Paperclip,
  Bold, Italic, List as ListIcon, Link, CalendarDays, Upload,
  ChevronDown
} from 'lucide-react'

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

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Annual Healthcare Enrollment 2024',
    tags: [{ label: 'HIGH PRIORITY', color: 'bg-purple-100 text-purple-700' }, { label: 'FEATURED', color: 'bg-blue-100 text-blue-700' }],
    category: 'Policy Updates',
    dateRange: 'Oct 12 - Oct 31',
    status: 'ACTIVE',
    audience: 'Company-wide',
    docs: true,
  },
  {
    id: 2,
    title: 'Quarterly All-Hands Meeting',
    tags: [{ label: 'EVENT', color: 'bg-gray-200 text-gray-600' }],
    category: 'Events',
    dateRange: 'Nov 05 - Nov 05',
    status: 'SCHEDULED',
    audience: '3 Departments',
    docs: true,
  },
  {
    id: 3,
    title: 'Q3 Office Renovation Update',
    tags: [{ label: 'NORMAL', color: 'bg-gray-200 text-gray-500' }],
    category: 'Company News',
    dateRange: 'Aug 20 - Sep 15',
    status: 'EXPIRED',
    audience: '1 Branches',
    docs: false,
  },
]

const STATUS_CONFIG = {
  ACTIVE: { dot: 'bg-emerald-500', text: 'text-emerald-600' },
  SCHEDULED: { dot: 'bg-gray-400', text: 'text-gray-500' },
  EXPIRED: { dot: 'bg-red-500', text: 'text-red-600' },
}

// ─── Create Announcement Modal ────────────────────────────────────────────────

function CreateAnnouncementModal({ isOpen, onClose }) {
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
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

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

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => file.size <= 10 * 1024 * 1024)
    setFiles(prev => [...prev, ...validFiles])
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto"
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

        <div className="px-4 sm:px-6 pb-6 py-4 space-y-5">
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
              <p className="text-sm font-semibold text-[#191C1E]">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400">PDF, DOCX, PNG or JPG (max. 10MB)</p>
            </div>

            {/* Selected Files List */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-100">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Paperclip size={14} className="text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-600 truncate">{file.name}</span>
                      <span className="text-[10px] text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Footer Buttons */}
        <div className="flex flex-col  bg-[#F2F4F6] md:flex-row items-end md:justify-end gap-4 p-8">
          <button
            onClick={onClose}
            className="px-5 py-2.5 w-full md:w-fit text-sm font-medium text-[#434655] rounded-md transition-colors"
          >
            Cancel
          </button>
          <button className="px-6 py-2.5 w-full md:w-fit bg-[#4A45B6] text-white text-sm font-semibold rounded-md shadow-sm transition-colors">
            Publish Announcement
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnnouncementsPage() {
  const [view, setView] = useState('list')
  const [modalOpen, setModalOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(true)
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Filter states
  const [category, setCategory] = useState('All Categories')
  const [department, setDepartment] = useState('All Departments')
  const [branch, setBranch] = useState('All Branches')
  const [status, setStatus] = useState('All Status')
  const [priority, setPriority] = useState('All Priority')

  const totalPages = 3

  const CATEGORY_OPTIONS = ['All Categories', 'Policy Updates', 'Events', 'Company News', 'HR']
  const DEPARTMENT_OPTIONS = ['All Departments', 'Engineering', 'Marketing', 'HR', 'Finance']
  const BRANCH_OPTIONS = ['All Branches', 'Main Office', 'Downtown', 'Remote']
  const STATUS_OPTIONS = ['All Status', 'ACTIVE', 'SCHEDULED', 'EXPIRED']
  const PRIORITY_OPTIONS = ['All Priority', 'HIGH PRIORITY', 'NORMAL', 'EVENT']

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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr className="bg-[#F2F4F6]">
                <th className="text-left px-5 py-4 text-[11px] font-bold text-[#434655] tracking-wider w-12 uppercase">#</th>
                <th className="text-left px-4 py-4 text-[11px] font-bold text-[#434655] tracking-wider uppercase">TITLE</th>
                <th className="text-left px-4 py-4 text-[11px] font-bold text-[#434655] tracking-wider uppercase">CATEGORY</th>
                <th className="text-left px-4 py-4 text-[11px] font-bold text-[#434655] tracking-wider uppercase">DATE RANGE</th>
                <th className="text-left px-4 py-4 text-[11px] font-bold text-[#434655] tracking-wider uppercase">AUDIENCE</th>
                <th className="text-left px-4 py-4 text-[11px] font-bold text-[#434655] tracking-wider uppercase">DOCS</th>
                <th className="text-left px-4 py-4 text-[11px] font-bold text-[#434655] tracking-wider uppercase">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {ANNOUNCEMENTS.map((ann, idx) => {
                const sc = STATUS_CONFIG[ann.status]
                return (
                  <tr key={ann.id} className=" hover:bg-gray-50/70 transition-colors">
                    {/* # */}
                    <td className="px-5 py-4 text-sm font-medium text-[#94A3B8]">
                      {String(idx + 1).padStart(2, '0')}
                    </td>

                    {/* Title */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-[#191C1E]">{ann.title}</span>
                        <div className="flex flex-wrap gap-1">
                          {ann.tags.map((tag, ti) => (
                            <span key={ti} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tag.color}`}>
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium text-[#434655] bg-[#ECEEF0] px-2.5 py-1.5 rounded-md whitespace-nowrap">
                        {ann.category}
                      </span>
                    </td>

                    {/* Date Range */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-[#191C1E] whitespace-nowrap font-medium">{ann.dateRange}</span>
                        <span className={`flex items-center gap-1 text-[11px] font-bold ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {ann.status}
                        </span>
                      </div>
                    </td>

                    {/* Audience */}
                    <td className="px-4 py-4 text-sm text-[#191C1E] whitespace-nowrap">{ann.audience}</td>

                    {/* Docs */}
                    <td className="px-4 py-4">
                      {ann.docs ? (
                        <Paperclip size={15} className="text-[#94A3B8]" />
                      ) : (
                        <span className="text-gray-300 text-base">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 text-[#94A3B8] rounded-md transition-colors">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 text-[#94A3B8] rounded-md transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button className="p-1.5 text-[#94A3B8] rounded-md transition-colors">
                          <BarChart2 size={14} />
                        </button>
                        <button className="p-1.5 text-[#94A3B8] rounded-md transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-xs text-[#434655]">Showing 1 to 3 of 12 announcements</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1.5 text-[#434655] bg-[#F2F4F6] rounded-sm transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {[1, 2, 3].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 text-xs font-semibold rounded-sm transition-colors ${currentPage === page
                  ? 'bg-[#4A45B6] text-white shadow-sm'
                  : 'text-[#434655] bg-[#F2F4F6]'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="p-1.5 text-[#434655] bg-[#F2F4F6] rounded-sm transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CreateAnnouncementModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
