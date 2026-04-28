"use client";
import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": require("date-fns/locale/en-US") };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const EVENTS = [
  {
    id: 1,
    title: "Gandhi Jayanti",
    start: new Date(2026, 3, 2),
    end: new Date(2026, 3, 2),
    type: "national",
  },
  {
    id: 2,
    title: "Columbus Day",
    start: new Date(2026, 3, 12),
    end: new Date(2026, 3, 12),
    type: "national",
  },
  {
    id: 3,
    title: "Founder's Day",
    start: new Date(2026, 3, 24),
    end: new Date(2026, 3, 24),
    type: "company",
  },
  {
    id: 4,
    title: "Halloween",
    start: new Date(2026, 3, 31),
    end: new Date(2026, 3, 31),
    type: "religious",
  },
];

const UPCOMING = [
  { month: "OCT", day: 12, title: "Columbus Day", category: "National Holiday" },
  { month: "OCT", day: 24, title: "Founder's Day", category: "Company Specific" },
  { month: "OCT", day: 31, title: "Halloween", category: "Religious/Cultural" },
];

const eventTypeColors = {
  national: { bg: "bg-indigo-100", text: "text-indigo-700", dot: "bg-indigo-600" },
  company: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  religious: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-600" },
};

const eventStyleGetter = (event) => {
  const colors = {
    national: { backgroundColor: "#e0e7ff", color: "#4338ca", border: "none" },
    company: { backgroundColor: "#ede9fe", color: "#7c3aed", border: "none" },
    religious: { backgroundColor: "#d1fae5", color: "#065f46", border: "none" },
  };
  return { style: colors[event.type] || {} };
};

function CustomDateCell({ value, children }) {
  const today = new Date(2026, 3, 16);
  const isToday =
    value.getDate() === today.getDate() &&
    value.getMonth() === today.getMonth() &&
    value.getFullYear() === today.getFullYear();

  return (
    <div className="relative">
      <div className="flex items-start">
        <span
          className={`text-sm leading-none mt-2 ml-2 ${isToday ? "text-indigo-500 font-semibold" : ""
            }`}
        >
          {isToday && (
            <span className="block text-[10px] text-indigo-400 font-medium mt-0.5">Today</span>
          )}
        </span>
      </div>
      {children}
    </div>
  );
}

export default function HolidayCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));

  const handlePrev = () => setCurrentDate((d) => subMonths(d, 1));
  const handleNext = () => setCurrentDate((d) => addMonths(d, 1));

  const monthLabel = format(currentDate, "MMMM yyyy");

  const components = {
    event: ({ event }) => {
      const colors = {
        national: "bg-indigo-100 text-indigo-700",
        company: "bg-purple-100 text-purple-700",
        religious: "bg-emerald-100 text-emerald-700",
      };
      return (
        <div className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${colors[event.type]}`}>
          {event.title}
        </div>
      );
    },
    dateHeader: ({ date, label, isOffRange }) => {
      const today = new Date(2026, 3, 16);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      return (
        <div className="flex flex-col items-start px-2.5 pt-2">
          <span
            className={`text-sm leading-none ${isToday
              ? "text-indigo-500 font-semibold"
              : isOffRange
                ? "text-gray-300"
                : "text-gray-800"
              }`}
          >
            {label}
          </span>
          {isToday && (
            <span className="text-[10px] text-indigo-400 font-medium mt-4 leading-none">Today</span>
          )}
        </div>
      );
    },
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 md:p-6 min-h-screen">
      {/* LEFT SIDEBAR */}
      <div className="w-full lg:w-72 lg:min-w-[272px] flex flex-col gap-4 shrink-0">
        {/* Holiday Statistics Card */}
        <div className="bg-white rounded-md shadow-sm border-l-4 border-[#712AE2] p-5">
          <h2 className="text-xs font-bold tracking-wide text-[#434655] uppercase mb-4">
            Holiday Statistics
          </h2>

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#6366f1" strokeWidth="1.5" />
                  <path d="M8 2v4M16 2v4M3 10h18" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M8 14h2M8 18h2M13 14h3M13 18h3" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-400 leading-none mb-1">Total Holidays</p>
                <p className="text-2xl font-bold text-gray-900 leading-none">14</p>
                <p className="text-sm font-semibold text-gray-700 leading-none mt-0.5">Days</p>
              </div>
            </div>
            <div className="bg-emerald-100 text-emerald-600 text-xs font-semibold px-2.5 py-1.5 rounded-xl">
              +2 Days
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-gray-600">National Holidays</span>
                <span className="text-sm font-semibold text-gray-800">8</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full">
                <div className="h-1.5 bg-indigo-600 rounded-full" style={{ width: "57%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-gray-600">Company Specific</span>
                <span className="text-sm font-semibold text-gray-800">4</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full">
                <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: "29%" }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-gray-600">Religious</span>
                <span className="text-sm font-semibold text-gray-800">2</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full">
                <div className="h-1.5 bg-emerald-500 rounded-full" style={{ width: "14%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold tracking-widest text-gray-700 uppercase">Upcoming</h2>
            <span className="text-xs font-medium text-indigo-500 cursor-pointer hover:text-indigo-700">
              View All
            </span>
          </div>

          <div className="space-y-4">
            {UPCOMING.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center bg-gray-50 rounded-xl px-2.5 py-1.5 min-w-[44px] text-center border border-gray-100">
                  <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase leading-none">
                    {item.month}
                  </span>
                  <span className="text-lg font-bold text-gray-800 leading-tight">{item.day}</span>
                </div>
                <div className="flex flex-col justify-center pt-0.5">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CALENDAR */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        {/* Custom Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{monthLabel}</h1>
            <div className="flex items-center gap-1 ml-1">
              <button
                onClick={handlePrev}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors border border-gray-100 sm:border-none"
              >
                <ChevronLeft size={18} className="text-gray-500" />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors border border-gray-100 sm:border-none"
              >
                <ChevronRight size={18} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="text-[10px] sm:text-xs text-gray-500">National</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-[10px] sm:text-xs text-gray-500">Company</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span className="text-[10px] sm:text-xs text-gray-500">Religious</span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden" style={{ minHeight: 0 }}>
          <div className="min-w-[1000px] min-[1200px]:min-w-0 h-full">
            <Calendar
              localizer={localizer}
              events={EVENTS}
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
              style={{ height: "100%", minHeight: 520 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}