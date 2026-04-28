'use client';
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": require("date-fns/locale/en-US") };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const priorityColors = {
  critical: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-600" },
  urgent: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  standard: { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-600" },
};

const eventStyleGetter = (event) => {
  const colors = {
    critical: { backgroundColor: "#fee2e2", color: "#b91c1c", border: "none" },
    urgent: { backgroundColor: "#ffedd5", color: "#c2410c", border: "none" },
    standard: { backgroundColor: "#e0e7ff", color: "#4338ca", border: "none" },
  };
  return { style: colors[event.priority] || colors.standard };
};

export default function AnnouncementCalendar({ announcements = [], onViewDetail }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrev = () => setCurrentDate((d) => subMonths(d, 1));
  const handleNext = () => setCurrentDate((d) => addMonths(d, 1));

  const monthLabel = format(currentDate, "MMMM yyyy");

  const events = announcements.map((a) => {
    return {
      id: a.id,
      title: a.title,
      start: new Date(a.startDate),
      end: new Date(a.endDate || a.startDate),
      priority: a.priority?.toLowerCase() || 'standard',
      category: a.category,
      raw: a
    };
  });

  const components = {
    event: ({ event }) => {
      const colors = {
        critical: "bg-red-100 text-red-700",
        urgent: "bg-orange-100 text-orange-700",
        standard: "bg-indigo-100 text-indigo-700",
      };
      return (
        <div 
          onClick={() => onViewDetail && onViewDetail(event.id)}
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded truncate cursor-pointer shadow-sm border border-black/5 ${colors[event.priority] || colors.standard}`}
        >
          {event.title}
        </div>
      );
    },
    dateHeader: ({ date, label, isOffRange }) => {
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      return (
        <div className="flex flex-col items-start px-2 pt-1.5">
          <span
            className={`text-xs font-bold ${isToday
              ? "bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center -ml-0.5"
              : isOffRange
                ? "text-gray-300"
                : "text-gray-700"
              }`}
          >
            {label}
          </span>
        </div>
      );
    },
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeAnnouncements = announcements
    .filter((a) => new Date(a.endDate || a.startDate) >= today)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5);

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
      {/* SIDEBAR */}
      <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">
            Announcement Overview
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Info size={16} />
                </div>
                <span className="text-sm font-semibold text-gray-700">Total Active</span>
              </div>
              <span className="text-lg font-bold text-indigo-600">{activeAnnouncements.length}</span>
            </div>
            
            <div className="space-y-2.5">
               <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-500 font-medium">Critical Priority</span>
                 <span className="font-bold text-red-600">{announcements.filter(a => a.priority?.toLowerCase() === 'critical').length}</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-500 font-medium">Urgent Priority</span>
                 <span className="font-bold text-orange-600">{announcements.filter(a => a.priority?.toLowerCase() === 'urgent').length}</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="text-gray-500 font-medium">Standard</span>
                 <span className="font-bold text-indigo-600">{announcements.filter(a => !a.priority || a.priority?.toLowerCase() === 'standard').length}</span>
               </div>
            </div>
          </div>
        </div>

        {/* List Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex-1">
          <h2 className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-4">
            Timeline
          </h2>
          <div className="space-y-4">
            {activeAnnouncements.length > 0 ? activeAnnouncements.map((a, i) => (
              <div 
                key={i} 
                onClick={() => onViewDetail && onViewDetail(a.id)}
                className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex flex-col items-center bg-gray-50 group-hover:bg-white rounded-lg px-2 py-1 min-w-[40px] text-center border border-gray-100 shadow-xs">
                  <span className="text-[8px] font-bold text-gray-400 uppercase leading-none mb-1">
                    {new Date(a.startDate).toLocaleString("en-US", { month: "short" })}
                  </span>
                  <span className="text-sm font-bold text-gray-800 leading-tight">{new Date(a.startDate).getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 truncate leading-tight">{a.title}</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{a.category}</p>
                </div>
              </div>
            )) : (
              <p className="text-xs text-gray-400 italic">No upcoming announcements.</p>
            )}
          </div>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-gray-50 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-gray-900">{monthLabel}</h1>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 border border-gray-100 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 border border-gray-100 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-600" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Critical</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Urgent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-600" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Standard</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[500px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
            view="month"
            onView={() => { }}
            views={["month"]}
            eventPropGetter={eventStyleGetter}
            components={components}
            toolbar={false}
            style={{ height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
