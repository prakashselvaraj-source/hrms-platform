"use client";

import { BadgeCheck, Hourglass, CircleX } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

const mockData = [
  {
    id: "1",
    employee: "Prakash Selvaraj CRTX-DE-0020",
    leaveType: "Sick Leave",
    date: "06-Feb-2026 - 06-Feb-2026",
    duration: "2 Day(s)",
    email: "prakash.selvaraj@craitrix.com",
    balance: 2,
    current: 1,
    after: 1,
    estimated: 3,
    status: "Approved",
    dateOfRequest:"05-Feb-2026"
  },
];

export default function LeaveDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const data = mockData.find((item) => item.id === id);

  if (!data) {
    return <div className="p-10">No Data Found</div>;
  }

  return (
    <div className="p-10 bg-[#FFFFFF] min-h-screen">
      <div className=" rounded-lg shadow border p-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-5 items-center">
            <h2 className="font-semibold text-lg">
                {data.id} - {data.employee}
            </h2>
            <div className="flex gap-2 items-center">
                {data.status}
                { data.status == "Pending" && ( <Hourglass size={18} color="#FFC302" />) }
                { data.status == "Approved" && ( <BadgeCheck size={18} color="#22BB33" />) }
                { data.status == "Rejected" && ( <CircleX  size={18} color="#FF0505" />) }
                
            </div>
            
          </div>
          
          <button
            onClick={() => router.back()}
            className="px-4 py-1 rounded-sm bg-[#8004DB] text-[#FFFFFF] cursor-pointer"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Left Section */}
          <div className="col-span-2 border rounded-md p-4">
            <h3 className="font-medium mb-4">Leave</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Employee ID</span>
                <span>{data.employee}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Leave type</span>
                <span>{data.leaveType}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{data.date}</span>
              </div>

              <div className="border  rounded-md mt-4">
                <div className="flex justify-between p-3 bg-gray-50 text-sm">
                  <span>Date</span>
                  <span>Duration</span>
                </div>
                <div className="flex justify-between p-3 text-sm">
                  <span>{data.date}</span>
                  <span>{data.duration}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 text-sm font-medium">
                  <span>Total</span>
                  <span>{data.duration}</span>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <span className="text-gray-500">Team Email ID</span>
                <span>{data.email}</span>
              </div>
              <div className="flex justify-between mt-4">
                <span className="text-gray-500">Date of request</span>
                <span>{data.dateOfRequest}</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-4">

            <div className="border rounded-md p-4 text-sm">
              <p className="font-medium mb-2">As on 06-Apr-2026</p>
              <div className="flex justify-between">
                <span>Available balance</span>
                <span className="text-green-600">{data.balance}</span>
              </div>
              <div className="flex justify-between">
                <span>Current booking</span>
                <span>{data.current}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span>Balance after current booking</span>
                <span>{data.after}</span>
              </div>
            </div>

            <div className="border rounded-md p-4 text-sm">
              <p className="font-medium mb-2">As on 31-Dec-2026</p>
              <div className="flex justify-between">
                <span>Estimated balance</span>
                <span>{data.estimated}</span>
              </div>
            </div>

            <button className="w-full border rounded-md py-2 text-blue-600">
              View Leave Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


