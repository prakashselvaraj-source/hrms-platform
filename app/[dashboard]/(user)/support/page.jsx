"use client";

import { useState, Fragment } from "react";
import Link from "next/link";


const tickets = [
  {
    id: "#TK-8821",
    title: "Software Access Request",
    description: "Access to Adobe Creative Suite needed...",
    priority: "MED",
    status: "Open",
  },
  {
    id: "#TK-8790",
    title: "Payroll Discrepancy",
    description: "Overtime hours for July not reflected...",
    priority: "HIGH",
    status: "Open",
  },
  {
    id: "#TK-8655",
    title: "Network Connectivity",
    description: "VPN dropping intermittently on MacOS...",
    priority: "LOW",
    status: "Resolved",
  },
];

const priorityConfig = {
  HIGH: "bg-red-100 text-red-700 border border-red-200",
  MED: "bg-amber-100 text-amber-700 border border-amber-200",
  LOW: "bg-sky-100 text-sky-700 border border-sky-200",
};

const statusConfig = {
  Open: { dot: "bg-blue-500", text: "text-blue-600" },
  Resolved: { dot: "bg-emerald-500", text: "text-emerald-600" },
};

export default function SupportTickets() {
  const [dismissed, setDismissed] = useState(false);
  const [chatOpen, setChatOpen] = useState(null);

  return (
    <div className="min-h-screen font-sans p-4 sm:p-6 lg:p-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-[#1E293B] tracking-tight">
            Support Tickets
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-md">
            Manage your technical queries, HR requests, and workspace issues in
            one conversational hub.
          </p>
        </div>
        <Link href="/createTicket">
          <button
            className="inline-flex items-center gap-2 bg-[#4A45B6] hover:bg-[#4A45B6] active:scale-95
    text-white text-sm font-semibold px-5 py-2.5 rounded-sm shadow-md transition-all duration-150"
          >
            <span className="text-lg leading-none">+</span> Raise Ticket
          </button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-sm border border-gray-100 shadow-sm  bg-[#F2F4F6] p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Open Tickets
          </p>
          <p className="text-4xl font-extrabold text-[#4A45B6]">02</p>
        </div>
        <div className="rounded-sm border  bg-[#F2F4F6] shadow-sm border-gray-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Resolved (MTD)
          </p>
          <p className="text-4xl font-extrabold text-emerald-500">14</p>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto mb-6">
        <table className="w-full min-w-[800px]  text-left border-collapse">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {["Ticket ID", "Issue Description", "Priority", "Status", "Action"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>

          {/* Rows */}
          <tbody className="divide-y divide-gray-50">
            {tickets.map((ticket) => {
              const sc = statusConfig[ticket.status];
              const pc = priorityConfig[ticket.priority];
              return (
                <Fragment key={ticket.id}>
                  <tr className="hover:bg-indigo-50/30 transition-colors duration-100">
                    {/* Ticket ID */}
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm font-bold text-[#4A45B6]">
                        {ticket.id}
                      </p>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 align-top">
                      <p className="text-sm font-semibold text-gray-800">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {ticket.description}
                      </p>
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4 align-top">
                      <span
                        className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-md ${pc}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 align-top">
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold w-max ${sc.text}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${sc.dot} flex-shrink-0`}
                        />
                        {ticket.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 align-top">
                      {ticket.status === "Resolved" ? (
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setChatOpen(chatOpen === ticket.id ? null : ticket.id)
                          }
                          className="text-xs font-semibold text-[#4A45B6] hover:text-indigo-800 hover:underline transition-colors"
                        >
                          View chat
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Inline Chat Expand (mobile-friendly) */}
                  {chatOpen === ticket.id && (
                    <tr>
                      <td colSpan={5} className="px-0 py-0 pb-4 bg-indigo-50/20">
                        <div className="mx-6 mt-2 bg-indigo-50 rounded-xl p-4 text-sm text-gray-700 border border-indigo-100">
                          <p className="font-semibold text-indigo-700 mb-1">
                            Chat thread — {ticket.id}
                          </p>
                          <p className="text-gray-500 text-xs">
                            No messages yet. A support agent will respond soon.
                          </p>
                          <button
                            onClick={() => setChatOpen(null)}
                            className="mt-3 text-xs text-indigo-500 hover:underline"
                          >
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Support Assistant Banner */}
      {!dismissed && (
        <div className="bg-white rounded-2xl
        border-l-4 border-l-[#712AE2] p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-[#4A45B6]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 mb-0.5">
              Support Assistant
            </p>
            <p className="text-sm text-gray-500 w-full sm:w-[700px]">
              Hi Marcus! It looks like your most recent ticket{" "}
              <span className="text-[#4A45B6] font-semibold">#TK-8821</span> is
              being reviewed by Sarah from IT. Would you like to add an
              attachment?
            </p>
            <div className="flex gap-2 mt-3">
              <button
                className="text-xs font-semibold text-[#4A45B6]  px-4 py-1.5 rounded-sm border 
                border-gray-200 hover:border-gray-300 transition-colors">
                Add Screenshot
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-4 py-1.5 rounded-sm border border-gray-200 hover:border-gray-300 transition-colors">

                No, thanks
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
