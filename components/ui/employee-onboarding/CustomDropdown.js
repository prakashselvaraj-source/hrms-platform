'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomDropdown({ label, options, value, onChange, placeholder = 'Select Option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value || opt === value);
  const displayValue = typeof selectedOption === 'object' ? selectedOption.label : selectedOption;

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-xs font-semibold text-[#737686] uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#F2F4F6] rounded-md px-3 py-2.5 text-sm text-[#434655] flex items-center justify-between hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#712AE2]"
      >
        <span className={!value ? 'text-gray-400' : ''}>
          {displayValue || placeholder}
        </span>
        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
          {options.map((option, index) => {
            const optValue = typeof option === 'object' ? option.value : option;
            const optLabel = typeof option === 'object' ? option.label : option;

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onChange(optValue);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm
                  ${value === optValue ? 'bg-[#4A45B6] font-semibold text-white' : 'text-gray-600'}
                `}
              >
                {optLabel}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
