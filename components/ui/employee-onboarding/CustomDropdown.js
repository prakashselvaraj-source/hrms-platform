'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-0.5">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm group"
      >
        <span className={!value ? 'text-gray-400 font-medium' : ''}>
          {displayValue || placeholder}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute z-[60] w-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden py-1.5 max-h-60 overflow-y-auto no-scrollbar"
          >
            {options.map((option, index) => {
              const optValue = typeof option === 'object' ? option.value : option;
              const optLabel = typeof option === 'object' ? option.label : option;
              const isSelected = value === optValue;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    onChange(optValue);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[12px] font-medium transition-colors
                    ${isSelected 
                      ? 'bg-indigo-600 text-white font-bold' 
                      : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'}
                  `}
                >
                  {optLabel}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
