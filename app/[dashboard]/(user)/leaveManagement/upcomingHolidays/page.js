"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar1,
  List,
  LayoutGrid,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

const upcomingHolidays = [
  { date: "28-MAY-2026, THURSDAY", name: "BAKRID (RESTRICTED HOLIDAY)" },
  { date: "28-MAY-2026, THURSDAY", name: "BAKRID (RESTRICTED HOLIDAY)" },
  { date: "28-MAY-2026, THURSDAY", name: "BAKRID (RESTRICTED HOLIDAY)" },
  { date: "28-MAY-2026, THURSDAY", name: "BAKRID (RESTRICTED HOLIDAY)" },
  { date: "28-MAY-2026, THURSDAY", name: "BAKRID (RESTRICTED HOLIDAY)" },
];

const pastLeaves = [
  {
    date: "04-APR-2026, SATURDAY",
    type: "PERMISSION",
    duration: "01:00 HOUR",
    reason: "GO TO HOME",
  },
  {
    date: "28-MAY-2026, THURSDAY",
    type: "PERMISSION",
    duration: "01:00 HOUR",
    reason: "GO TO HOME",
  },
  {
    date: "04-APR-2026, SATURDAY",
    type: "PERMISSION",
    duration: "01:00 HOUR",
    reason: "GO TO HOME",
  },
];

function DateRangeNav({ label, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600">
      <button onClick={onPrev} className="text-gray-400 hover:text-gray-600">
        <ChevronLeft size={14} />
      </button>

      <Calendar1 size={14} className="text-gray-400" />
      <span className="truncate max-w-[160px] sm:max-w-none">{label}</span>

      <button onClick={onNext} className="text-gray-400 hover:text-gray-600">
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

function ViewToggle({ view, setView }) {
  return (
    <div className="flex gap-1">
      <button
        onClick={() => setView("list")}
        className={clsx(
          "flex items-center rounded-md border border-gray-200 p-1.5",
          view === "list" ? "bg-gray-100" : "bg-white hover:bg-gray-50",
        )}
      >
        <List size={14} className="text-gray-500" />
      </button>
      <button
        onClick={() => setView("grid")}
        className={clsx(
          "flex items-center rounded-md border border-gray-200 p-1.5",
          view === "grid" ? "bg-gray-100" : "bg-white hover:bg-gray-50",
        )}
      >
        <LayoutGrid size={14} className="text-gray-500" />
      </button>
    </div>
  );
}

import dynamic from "next/dynamic";
import { dateFnsLocalizer } from "react-big-calendar";
const Calendar = dynamic(
  () => import("react-big-calendar").then((mod) => mod.Calendar),
  { ssr: false },
);
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Header from "../components/header";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { locale: enUS }),
  getDay,
  locales,
});

export default function LeavePage() {
  const [view, setView] = useState("list");

  const publicHolidays = [
    { name: "Columbus Day", date: "Oct 12, 2026" },
    { name: "Halloween", date: "Oct 31, 2026" },
    { name: "Veterans Day", date: "Nov 11, 2026" },
  ];

  const [date, setDate] = useState(new Date());

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

  const formatRange = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return `${start.toDateString()} – ${end.toDateString()}`;
  };

  const router = useRouter();

  const today = new Date();

  const events = [
    {
      title: "Doctor Appointment",
      start: new Date(today.getFullYear(), today.getMonth() + 1, 5),
      end: new Date(today.getFullYear(), today.getMonth() + 1, 5),
      allDay: true,
    },
    {
      title: "Doctor Appointment",
      start: new Date(today.getFullYear(), today.getMonth(), 10),
      end: new Date(today.getFullYear(), today.getMonth(), 10),
      allDay: true,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Top Nav */}
      <Header />

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-3 sm:p-4">
        <>
          {/* Controls Row */}
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <DateRangeNav
              label={formatRange(date)}
              onPrev={handlePrev}
              onNext={handleNext}
            />
            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <ViewToggle view={view} setView={setView} />
              <button className="rounded-lg bg-purple-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-purple-700">
                Apply leave
              </button>
            </div>
          </div>

          {view === "list" && (
            <>
              {/* Upcoming Holidays Table */}
              <div className="mb-4 overflow-hidden border border-gray-200 bg-white">
                <div className="border-b border-gray-100 bg-[#E2DFFF] px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#000000]">
                  Upcoming Holidays
                </div>
                {upcomingHolidays.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1 border-b border-gray-100 px-4 py-4 last:border-none hover:bg-gray-50 even:bg-[#F8FAFC] sm:grid sm:grid-cols-[minmax(180px,300px)_1fr] sm:items-center sm:gap-0 sm:py-5"
                  >
                    <span className="text-xs font-semibold text-[#000000] sm:border-r sm:border-gray-400 sm:pr-4">
                      {item.date}
                    </span>
                    <span className="text-xs font-semibold text-[#000000] sm:px-4">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Second controls row for past leaves (kept as-is per instructions) */}
              <div className="mb-3 flex items-center justify-end gap-2">
                <DateRangeNav
                  label={formatRange(date)}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
                <ViewToggle />
              </div>

              {/* Past Leaves Table */}
              <div className="overflow-hidden border border-gray-200 bg-white">
                <div className="border-b border-gray-100 bg-[#E2DFFF] px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#000000]">
                  Past Leaves
                </div>
                {pastLeaves.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 border-b border-gray-100 px-4 py-4 last:border-none hover:bg-gray-50 even:bg-[#F8FAFC] sm:grid sm:grid-cols-[minmax(160px,300px)_minmax(140px,300px)_1fr] sm:items-center sm:gap-0 sm:py-0"
                  >
                    <span className="text-xs font-semibold text-[#000000] sm:border-r sm:border-gray-400 sm:px-4 sm:py-5">
                      {item.date}
                    </span>
                    <span className="sm:border-r sm:border-gray-400 sm:px-4 sm:py-5">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-50 text-[11px] font-medium text-purple-700">
                        <span className="flex-shrink-0 rounded-sm bg-purple-600" />
                        {item.type}
                        <span className="text-gray-400">•</span>
                        {item.duration}
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-[#000000] sm:px-4 sm:py-5">
                      {item.reason}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === "grid" && (
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              {/* Calendar */}
              <div className="min-w-0 flex-1 overflow-x-auto">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  defaultView="month"
                  defaultDate={new Date()}
                  date={date}
                  onNavigate={(newDate) => setDate(newDate)}
                  onSelectEvent={(event) => alert(event.title)}
                  style={{ height: 500 }}
                />
              </div>

              {/* Right Sidebar */}
              <div className="flex w-full flex-col gap-6 lg:w-80 lg:flex-shrink-0 lg:overflow-y-auto lg:p-3">
                {/* Quick Summary */}
                <div className="p-5 shadow-[0px_1px_2px_0px_#0000000D]">
                  <p className="mb-2 text-[14px] font-bold uppercase tracking-[0.7px] text-[#434655]">
                    Quick Summary
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="flex items-center gap-3 rounded-[12px] border border-gray-100 bg-[#F2F4F6] p-5 shadow-sm">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#F2F4F6]">
                        <Briefcase size={20} className="text-purple-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold leading-none text-gray-800">
                          2.5
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#434655]">
                          Days taken this month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-[12px] border border-gray-100 bg-[#F2F4F6] p-5 shadow-sm">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <Calendar1 size={20} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold leading-none text-gray-800">
                          1.0
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#434655]">
                          Sick leave usage
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Public Holidays */}
                <div className="p-5 shadow-[0px_1px_2px_0px_#0000000D]">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[14px] font-bold uppercase tracking-[0.7px] text-[#434655]">
                      Public Holidays
                    </p>
                    <button className="text-[10px] font-bold text-[#4A45B6] hover:underline">
                      VIEW ALL
                    </button>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {publicHolidays.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-4"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#94A3B8]" />
                          <div>
                            <p className="text-[12px] font-semibold text-[#191C1E]">
                              {h.name}
                            </p>
                            <p className="text-[10px] text-[#434655]">
                              {h.date}
                            </p>
                          </div>
                        </div>
                        <ArrowRight size={13} className="text-gray-300" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leave Legend */}
                <div>
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-gray-500">
                    Leave Legend
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-1">
                    {[
                      { color: "bg-purple-500", label: "Sick Leave" },
                      { color: "bg-teal-500", label: "Casual Leave" },
                      { color: "bg-green-500", label: "Public Holiday" },
                      { color: "bg-cyan-500", label: "Upcoming Trip" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 text-[12px] text-gray-600"
                      >
                        <span
                          className={clsx(
                            "h-3 w-3 flex-shrink-0 rounded-sm",
                            item.color,
                          )}
                        />
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
}
