"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  List, LayoutGrid, Briefcase, ArrowRight, Star,
  Clock, CheckCircle2, History, Info
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "../components/header";
import { useTenant } from "@/hooks/useTenant";

// ─── Constants & Data ───────────────────────────────────────────────────────

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: enUS }),
  getDay,
  locales,
});

const Calendar = dynamic(
  () => import("react-big-calendar").then((mod) => mod.Calendar),
  { ssr: false }
);

const HOLIDAYS = [
  { date: "28-MAY-2026", name: "BAKRID", type: "Restricted", color: "bg-amber-50 text-amber-600 border-amber-100" },
  { date: "15-AUG-2026", name: "INDEPENDENCE DAY", type: "National", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { date: "02-OCT-2026", name: "GANDHI JAYANTHI", type: "National", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { date: "09-NOV-2026", name: "DIWALI", type: "Public", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { date: "25-DEC-2026", name: "CHRISTMAS", type: "Public", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
];

const PAST_LEAVES = [
  { date: "04-APR-2026", type: "Sick Leave", duration: "1 Day", reason: "Fever and cold" },
  { date: "20-MAY-2026", type: "Permission", duration: "1 Hour", reason: "Personal work" },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UpcomingHolidays() {
  const [view, setView] = useState("list");
  const [date, setDate] = useState(new Date());
  const router = useRouter();
  const tenantId = useTenant();

  const handlePrev = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  };

  const events = [
    { title: "Bakrid", start: new Date(2026, 4, 28), end: new Date(2026, 4, 28), allDay: true },
    { title: "Independence Day", start: new Date(2026, 7, 15), end: new Date(2026, 7, 15), allDay: true },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans">
      <Header />

      <main className="max-w-[1400px] mx-auto p-4 lg:p-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Calendar</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Holidays & <span className="text-indigo-600">Events</span></h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Stay updated with company holidays and your leave timeline.</p>
          </motion.div>

          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            <button 
              onClick={() => setView("list")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${view === "list" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-gray-400 hover:text-gray-600"}`}
            >
              <List size={14} />
              List
            </button>
            <button 
              onClick={() => setView("grid")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${view === "grid" ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "text-gray-400 hover:text-gray-600"}`}
            >
              <LayoutGrid size={14} />
              Grid
            </button>
          </div>
        </div>

        {view === "list" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Main List */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                      <Star size={16} />
                    </div>
                    <h3 className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Upcoming Holidays</h3>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">{new Date().getFullYear()} Schedule</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {HOLIDAYS.map((h, i) => (
                    <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50/30 transition-all">
                          <span className="text-[11px] font-bold text-indigo-400 leading-none mb-1">{h.date.split('-')[1]}</span>
                          <span className="text-lg font-bold text-gray-800 leading-tight">{h.date.split('-')[0]}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 mb-1">{h.name}</h4>
                          <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${h.color}`}>{h.type}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-gray-300 group-hover:text-indigo-400 transition-all">
                        <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">View Details</span>
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm overflow-hidden border-l-4 border-l-indigo-600">
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <History size={16} />
                    </div>
                    <h3 className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">My Past Absences</h3>
                  </div>
                </div>
                <div className="divide-y divide-gray-50">
                  {PAST_LEAVES.map((l, i) => (
                    <div key={i} className="px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800">{l.type}</h4>
                          <p className="text-[11px] font-medium text-gray-400 mt-0.5">{l.date} • {l.duration}</p>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-gray-400 italic max-w-[200px] truncate">"{l.reason}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-indigo-600 rounded-[24px] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Star size={100} />
                </div>
                <div className="flex items-center gap-3 mb-8">
                  <Star size={20} className="text-amber-400" />
                  <h3 className="text-sm font-bold uppercase tracking-widest">Next Holiday</h3>
                </div>
                <div className="space-y-6 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                    <h4 className="text-xl font-bold">Bakrid</h4>
                    <p className="text-xs font-medium text-indigo-100 mt-2 flex items-center gap-2 opacity-80">
                      <CalendarIcon size={12} />
                      28 May, 2026 (Thursday)
                    </p>
                  </div>
                  <button className="w-full py-3.5 bg-white text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg">
                    Add to My Calendar
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Info size={16} />
                  </div>
                  <h3 className="text-[12px] font-bold text-gray-800 uppercase tracking-widest">Holiday Policy</h3>
                </div>
                <p className="text-[12px] font-medium text-gray-500 leading-relaxed">
                  National holidays are fixed for all employees. Restricted holidays can be availed by applying through the Leave Request form at least 7 days in advance.
                </p>
              </div>

              <div className="bg-gray-50 border border-indigo-100 rounded-[24px] p-6 text-center">
                 <button 
                  onClick={() => router.push(`/${tenantId}/leaveManagement`)}
                  className="w-full py-4 bg-gray-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  Apply for Leave
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-1 bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm calendar-premium">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-800">{format(date, 'MMMM yyyy')}</h3>
                <div className="flex gap-3">
                  <button onClick={handlePrev} className="p-2.5 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"><ChevronLeft size={18} /></button>
                  <button onClick={handleNext} className="p-2.5 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100"><ChevronRight size={18} /></button>
                </div>
              </div>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                date={date}
                onNavigate={setDate}
                toolbar={false}
              />
              <style jsx global>{`
                .calendar-premium .rbc-calendar { font-family: inherit; border: none; }
                .calendar-premium .rbc-header { padding: 14px; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; border-bottom: 2px solid #f1f5f9; }
                .calendar-premium .rbc-month-view { border: none; }
                .calendar-premium .rbc-day-bg { transition: all 0.2s; border-left: 1px solid #f8fafc; }
                .calendar-premium .rbc-day-bg:hover { background: #f9fafb; }
                .calendar-premium .rbc-today { background: #f5f3ff !important; }
                .calendar-premium .rbc-off-range-bg { background: #fafafa; opacity: 0.3; }
                .calendar-premium .rbc-event { background: #4f46e5; border-radius: 10px; border: none; padding: 6px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2); }
                .calendar-premium .rbc-month-row { border-top: 1px solid #f1f5f9; }
              `}</style>
            </div>

            <div className="xl:w-80 space-y-6">
              <div className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm">
                <h3 className="text-[12px] font-bold text-gray-800 uppercase tracking-widest mb-6">Calendar Legend</h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-3.5 h-3.5 rounded-md bg-indigo-600 shadow-md shadow-indigo-100" />
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Public Holiday</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3.5 h-3.5 rounded-md bg-amber-400 shadow-md shadow-amber-100" />
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Restricted</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-3.5 h-3.5 rounded-md bg-violet-500 shadow-md shadow-violet-100" />
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Your Leave</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 border border-indigo-100 rounded-[24px] p-6">
                <p className="text-[11px] font-bold text-indigo-700 leading-relaxed text-center">
                  Holidays are subject to change per regional government announcements.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
