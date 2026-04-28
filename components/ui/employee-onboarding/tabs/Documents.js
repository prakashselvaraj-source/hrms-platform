'use client';

import { uploadImage } from '@/services/uploadService';
import { Upload, FolderOpen, CreditCard, GraduationCap, Briefcase, Plus, File, Paperclip } from 'lucide-react';
import { useRef } from 'react';

const documentCards = [
  {
    id: 'identity',
    icon: CreditCard,
    title: 'Identity Proof',
    description: 'Passport, Driving License, or National ID',
    action: 'upload',
  },
  {
    id: 'education',
    icon: GraduationCap,
    title: 'Education Certificates',
    description: 'Degree certificates & final year transcripts',
    action: 'upload',
  },
  {
    id: 'employment',
    icon: Briefcase,
    title: 'Employment Proof',
    description: 'Relieving letters or experience certificates',
    action: 'upload',
  },
  {
    id: 'other',
    icon: Plus,
    title: 'Other Documents',
    description: 'Any additional certifications or licenses',
    action: 'browse',
  },
];

export default function Documents({ data: uploaded, updateData }) {
  const fileRefs = useRef({});

  // Normalise whatever the backend returns into a plain URL string
  const extractUrl = (data) => {
    if (typeof data === 'string') return data;
    if (data && typeof data === 'object') {
      // common shapes: { url }, { fileUrl }, { path }, { data }
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
            return {
              file,
              url: extractUrl(res.data),
              name: file.name,
            };
          })
        );

        updateData({
          ...uploaded,
          [id]: [...(uploaded[id] || []), ...uploadedFiles],
        });
      } else {
        // SINGLE FILE
        const file = files[0];
        const res = await uploadImage(file);

        updateData({
          ...uploaded,
          [id]: {
            file,
            url: extractUrl(res.data),
            name: file.name,
          },
        });
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('File upload failed');
    }
  };

  const handleDelete = (id, index) => {
    if (id === 'other') {
      const updatedFiles = uploaded[id].filter((_, i) => i !== index);
      updateData({
        ...uploaded,
        [id]: updatedFiles,
      });
    } else {
      const newState = { ...uploaded };
      delete newState[id];
      updateData(newState);
    }
  };

  return (
    <div className='bg-[#FFFFFF]'>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#000000] mb-5">
        <File size={20} />
        Contact Details
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {documentCards.map((card) => {
          const Icon = card.icon;
          const isUploaded =
            card.id === 'other'
              ? uploaded[card.id]?.length > 0
              : !!uploaded[card.id];
          return (
            <div
              key={card.id}
              className={`bg-[#F2F4F6] border-2 border-dashed border-[#C3C6D74D] rounded-xl p-6 flex flex-col items-center text-center transition-colors`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-[#E2DFFF]`} onClick={() => fileRefs.current[card.id]?.click()}>
                <Icon size={22} className="text-[#4A45B6]" />
              </div>
              <h3 className="text-sm font-semibold text-[#191C1E] mb-1">{card.title}</h3>
              <p className="text-xs text-[#434655] mb-4">{card.description}</p>
              <input
                type="file"
                multiple={card.id === 'other'}
                accept=".jpg,.jpeg,.png,.pdf"
                ref={(el) => (fileRefs.current[card.id] = el)}
                className="hidden"
                onChange={(e) => handleUpload(card.id, e.target.files)}
              />
              {card.action === 'upload' ? (
                <button
                  onClick={() => fileRefs.current[card.id]?.click()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white`}
                >
                  <Upload size={14} />
                  {isUploaded ? 'Uploaded' : 'Upload File'}
                </button>
              ) : (
                <button
                  onClick={() => fileRefs.current[card.id]?.click()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                    ${isUploaded
                      ? ' bg-violet-600 hover:bg-violet-700 text-white'
                      : 'bg-[#E0E3E5]'
                    }`}
                >
                  <Paperclip size={14} />
                  {isUploaded ? 'Uploaded' : 'Browse'}
                </button>
              )}
              {/* SINGLE FILE */}
              {card.id !== 'other' && isUploaded && (
                <button
                  onClick={() => window.open(uploaded[card.id].url, '_blank', 'noopener,noreferrer')}
                  className="mt-2 text-xs text-blue-600 underline"
                >
                  View File ({uploaded[card.id].name})
                </button>
              )}

              {/* MULTIPLE FILES */}
              {card.id === 'other' && uploaded[card.id]?.length > 0 && (
                <div className="mt-2 w-full text-xs text-left">
                  {uploaded[card.id].map((file, index) => (
                    <div key={index} className="flex justify-center items-center gap-2">
                      <span className="truncate">{file.name}</span>

                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(file.url, '_blank', 'noopener,noreferrer')}
                          className="text-blue-600"
                        >
                          View
                        </button>

                        <button
                          onClick={() => handleDelete(card.id, index)}
                          className="text-red-600 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}