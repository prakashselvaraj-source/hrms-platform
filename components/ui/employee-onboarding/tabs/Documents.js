'use client';

import { uploadImage } from '@/services/uploadService';
import { Upload, FolderOpen, CreditCard, GraduationCap, Briefcase, Plus, File, Paperclip, X, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const documentCards = [
  { id: 'identity', icon: CreditCard, title: 'Identity Verification', description: 'Passport, License, or National ID', action: 'upload' },
  { id: 'education', icon: GraduationCap, title: 'Academic Credentials', description: 'Degrees & Final Year Transcripts', action: 'upload' },
  { id: 'employment', icon: Briefcase, title: 'Employment History', description: 'Relieving or Experience Letters', action: 'upload' },
  { id: 'other', icon: Plus, title: 'Supplemental Docs', description: 'Additional Certs or Licenses', action: 'browse' },
];

export default function Documents({ data: uploaded, updateData }) {
  const fileRefs = useRef({});

  const extractUrl = (data) => {
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') {
      return data.url ?? data.fileUrl ?? data.path ?? data.data ?? '';
    }
    return '';
  };

  const handleUpload = async (id, files) => {
    if (!files || files.length === 0) return;
    try {
      if (id === 'other') {
        const uploadedFiles = await Promise.all(
          Array.from(files).map(async (file) => {
            const res = await uploadImage(file);
            return { file, url: extractUrl(res.data), name: file.name };
          })
        );
        updateData({ ...uploaded, [id]: [...(uploaded[id] || []), ...uploadedFiles] });
      } else {
        const file = files[0];
        const res = await uploadImage(file);
        updateData({ ...uploaded, [id]: { file, url: extractUrl(res.data), name: file.name } });
      }
      toast.success('File synchronized.');
    } catch (err) {
      toast.error('Sync failed.');
    }
  };

  const handleDelete = (id, index) => {
    if (id === 'other') {
      const updatedFiles = uploaded[id].filter((_, i) => i !== index);
      updateData({ ...uploaded, [id]: updatedFiles });
    } else {
      const newState = { ...uploaded };
      delete newState[id];
      updateData(newState);
    }
  };

  return (
    <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
      <div className="flex items-center gap-2 text-[12px] font-bold text-gray-900 uppercase tracking-widest mb-8">
        <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
          <FileText size={14} />
        </div>
        Document Repositories
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentCards.map((card) => {
          const Icon = card.icon;
          const currentFile = card.id === 'other' ? null : uploaded[card.id];
          const hasFiles = card.id === 'other' ? uploaded[card.id]?.length > 0 : !!currentFile;

          return (
            <div key={card.id} className="group relative bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl p-5 transition-all hover:bg-white hover:border-indigo-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-gray-900 leading-tight">{card.title}</h3>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{card.description}</p>
                  </div>
                </div>
                {hasFiles && <CheckCircle2 size={16} className="text-emerald-500" />}
              </div>

              <input
                type="file"
                multiple={card.id === 'other'}
                accept=".jpg,.jpeg,.png,.pdf"
                ref={(el) => (fileRefs.current[card.id] = el)}
                className="hidden"
                onChange={(e) => handleUpload(card.id, e.target.files)}
              />

              <div className="flex flex-col gap-3">
                {/* Status-based Button */}
                <button
                  onClick={() => fileRefs.current[card.id]?.click()}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all
                    ${hasFiles 
                      ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' 
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
                    }`}
                >
                  {card.action === 'upload' ? <Upload size={14} /> : <Paperclip size={14} />}
                  {hasFiles ? (card.id === 'other' ? 'Add More' : 'Replace File') : (card.id === 'other' ? 'Browse Files' : 'Upload File')}
                </button>

                {/* File Previews */}
                <div className="space-y-1.5">
                  {card.id !== 'other' && currentFile && (
                    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-2 pr-3">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <File size={12} className="text-indigo-400 flex-shrink-0" />
                        <span className="text-[11px] font-bold text-gray-600 truncate">{currentFile.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => window.open(currentFile.url, '_blank')} className="text-indigo-600 hover:text-indigo-700 p-1 rounded-md hover:bg-indigo-50">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleDelete(card.id)} className="text-rose-500 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {card.id === 'other' && uploaded[card.id]?.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg p-2 pr-3">
                      <div className="flex items-center gap-2 max-w-[70%]">
                        <File size={12} className="text-indigo-400 flex-shrink-0" />
                        <span className="text-[11px] font-bold text-gray-600 truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => window.open(file.url, '_blank')} className="text-indigo-600 hover:text-indigo-700 p-1 rounded-md hover:bg-indigo-50">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleDelete(card.id, index)} className="text-rose-500 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}