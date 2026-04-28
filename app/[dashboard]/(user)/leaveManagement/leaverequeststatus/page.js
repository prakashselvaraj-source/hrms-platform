"use client";

import { Eye, Filter ,Hourglass,CircleX,BadgeCheck} from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/header";

export default function LeaveManagement() {
  const router = useRouter();
  const [requestType,setRequestType] = useState();
  const [showModal,setShowModal] = useState(false);
  const [period,setPeriod] = useState();
  const [fromDate,setFromDate] = useState();
  const [toDate,setToDate] = useState();
  const [leaveType,setLeaveType] = useState();
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDetails, setShowDetails] = useState(false);




  const data = [
    {
      status: "rejected",
      employee: "CRTX-DE-0010 - Shiva",
      leaveType: "Permission",
      type: "Paid",
      period: "04-Apr-2026 - 04-Apr-2026",
      taken: "0 Hour(s)",
      requestDate: "04-Apr-2026",
      id: "1"
    },
    {
      status: "pending",
      employee: "CRTX-DE-0010 - Shiva",
      leaveType: "Permission",
      type: "Paid",
      period: "04-Apr-2026 - 04-Apr-2026",
      taken: "1 Hour(s)",
      requestDate: "04-Apr-2026",
      id: "2"
    },
    {
      status: "approved",
      employee: "CRTX-DE-0010 - Shiva",
      leaveType: "Casual Leave",
      type: "Paid",
      period: "06-Feb-2026 - 06-Feb-2026",
      taken: "1 Day(s)",
      requestDate: "05-Feb-2026",
      id: "3"
    },
    {
      status: "approved",
      employee: "CRTX-DE-0010 - Shiva",
      leaveType: "Casual Leave",
      type: "Paid",
      period: "06-Feb-2026 - 06-Feb-2026",
      taken: "1 Day(s)",
      requestDate: "05-Feb-2026",
      id: "4"
    },
  ];

  const StatusIcon = ({ type }) => {

    if (type === "approved")
      return <BadgeCheck size={18} color="#22BB33" /> ;

    if (type === "pending")
      return <Hourglass size={18} color="#FFC302" /> ;

    if (type === "rejected")
      return <CircleX  size={18} color="#FF0505" /> ;

    return ;
  };

  return (
    <div className=" bg-[#F8FAFC] h-full flex flex-col gap-6 md:gap-8">

       {/* Top Nav */}
      <Header/>

      <div className=" border border-gray-200 rounded-md relative">

        {/* Top Controls */}
        <div className="flex justify-end items-center gap-3 p-4">

          <select className="rounded-md px-3 py-2 text-sm text-[#000000] border border-[#E2E8F0] focus:outline-none" value={requestType} onChange={(e)=>{setRequestType(e.target.value)}}>
            <option value="All requests">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
            <option value="Approved">Approved</option>
          </select>

          <button className="bg-[#8004DB] text-white px-4 py-2 rounded-md text-sm font-medium shadow-[0px_1px_2px_0px_#0000000D] "  >
            Add Request
          </button>

          <button className="border border-[#E2E8F0] rounded-md p-2 cursor-pointer w-fit" onClick={()=>{setShowModal(true)}}>
            <Filter size={16} color="#64748B"/>
          </button>
        </div>

        {showModal && (
            <>
            
            <div className="fixed inset-0 bg-black/40"></div>
              <div className="absolute right-2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-16 mr-2 z-50 bg-white w-[90%] sm:w-[380px] rounded-md shadow-[7px_10px_27px_11px_#0000001A] p-6 border border-gray-100">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[16px] font-medium text-[#000000]">Filter</h2>
              <button className="cursor-pointer text-[#000000]" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            {/* Period */}
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">period</label>
              <select className="w-full border border-[#BDBDBD4D] rounded-sm px-3 py-2 text-sm focus:outline-none" value={period} onChange={(e)=>{setPeriod(e.target.value)}}>
                <option value='Last month'>Last Month</option>
                <option value='Last Week'>Last Week</option>
                <option value='Last six month'>Last six Month</option>
              </select>
            </div>

            {/* From To */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">From</label>
                <input type="date" value={fromDate} onChange={(e)=>{setFromDate(e.target.value)}} className="w-full border border-[#BDBDBD4D] rounded-sm px-3 py-2 text-sm focus:outline-none"  />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-600 mb-1">To</label>
                <input type="date" value={toDate}  min={fromDate} onChange={(e)=>{setToDate(e.target.value)}} className="w-full border border-[#BDBDBD4D] rounded-sm px-3 py-2 text-sm focus:outline-none"  />
              </div>
            </div>

            {/* Leave Type */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">Leave Type</label>
              <select className="w-full border border-[#BDBDBD4D] rounded-sm px-3 py-2 text-sm focus:outline-none" value={leaveType} onChange={(e)=>{setLeaveType(e.target.value)}}>
                <option>All</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="comp">Comp Off</option>
                <option value="optional">Optional Holiday</option>
                <option value="permission">Permission</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button className="bg-[#8004DB] text-[#FFFFFF] px-6 py-2 rounded-sm text-sm">
                Apply
              </button>
              <button className="border border-[#000000] text-[#000000] px-6 py-2 rounded-sm text-sm">
                Reset
              </button>
            </div>

          </div>
            </>
        
        )}

        {showDetails && selectedRow && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            
            <div className="bg-white w-[420px] rounded-md shadow-lg p-6">

              {/* Header */}
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-[16px] font-medium">Leave Details</h2>
                <button
                  className="text-lg"
                  onClick={() => setShowDetails(false)}
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="capitalize font-medium">
                    {selectedRow.status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Employee</span>
                  <span>{selectedRow.employee}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Leave Type</span>
                  <span>{selectedRow.leaveType}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span>{selectedRow.type}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Leave Period</span>
                  <span>{selectedRow.period}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Taken</span>
                  <span>{selectedRow.taken}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Request Date</span>
                  <span>{selectedRow.requestDate}</span>
                </div>

              </div>

            </div>
          </div>
          )}

        {/* Table */}
        <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-sm text-gray-700">

          <thead className="bg-[#F8FAFC] text-[#475569] text-xs uppercase">
            <tr className="border-b">
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Employee Name</th>
              <th className="p-3 text-left">Leave Type</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Leave Period</th>
              <th className="p-3 text-left">Days/Hours Taken</th>
              <th className="p-3 text-left">Date Of Request</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">

                <td className="p-3 flex gap-2">
                  <Eye size={16} className="text-[#8004DB] cursor-pointer" onClick={() => router.push(`/leaveManagement/leaverequeststatus/${item.id}`)}  />
                  <StatusIcon type={item.status} />
                </td>

                <td className="p-3">{item.employee}</td>

                <td className="p-3">{item.leaveType}</td>

                <td className="p-3">{item.type}</td>

                <td className="p-3">{item.period}</td>

                <td className="p-3">{item.taken}</td>

                <td className="p-3">{item.requestDate}</td>

              </tr>
            ))}
          </tbody>

        </table>
        </div>
      </div>
    </div>
  );
}