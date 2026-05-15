"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  ChevronDown, Menu, X, Plus, Calendar, History, 
  FileText, ChevronRight, LayoutGrid, ArrowLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTenant } from "@/hooks/useTenant";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const tenantId = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const tabs = [
    { 
      label: "Apply for Leave", 
      link: `/${tenantId}/leaveManagement`, 
      icon: FileText,
      active: pathname === `/${tenantId}/leaveManagement` 
    },
    { 
      label: "Upcoming Holidays", 
      link: `/${tenantId}/leaveManagement/upcomingHolidays`, 
      icon: Calendar,
      active: pathname.includes("upcomingHolidays") 
    },
    { 
      label: "Request Status", 
      link: `/${tenantId}/leaveManagement/leaverequeststatus`, 
      icon: History,
      active: pathname.includes("leaverequeststatus") 
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-indigo-600 transition-all border border-transparent hover:border-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-8 w-px bg-gray-100" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <LayoutGrid size={20} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-gray-900 uppercase tracking-widest leading-none mb-1">Leave Portal</h1>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-80">v2.4.0 • Enterprise</span>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden lg:flex items-center gap-1.5 bg-gray-50/80 p-1.5 rounded-[18px] border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.link}
              onClick={() => router.push(tab.link)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                tab.active 
                ? "bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200" 
                : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <tab.icon size={14} className={tab.active ? "text-indigo-600" : "text-gray-400"} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Side Actions / Mobile Trigger */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => router.push(`/${tenantId}/leaveManagement`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100/50"
            >
              <Plus size={14} />
              Fast Apply
            </button>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-3 rounded-xl bg-gray-50 text-gray-600 border border-gray-100 shadow-sm"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.link}
                  onClick={() => { router.push(tab.link); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                    tab.active ? "bg-indigo-50 text-indigo-600" : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon size={18} />
                    {tab.label}
                  </div>
                  <ChevronRight size={16} />
                </button>
              ))}
              <div className="pt-4 border-t border-gray-50">
                <button 
                  onClick={() => router.push(`/${tenantId}/leaveManagement`)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-100"
                >
                  Apply New Leave
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;