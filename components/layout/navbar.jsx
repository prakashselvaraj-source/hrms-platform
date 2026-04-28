"use client";

import { Bell, HelpCircle, Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Navbar({
  user = {
    name: "Shivani Singh",
    employeeId: "EMP-1024",
    avatarUrl: null,
  },
  setIsOpen
})
{
  return (
    <header className=" flex h-15 w-full items-center justify-between md:justify-end border-b border-gray-200 bg-[#F8FAFC] px-6 ">
      <div className="justify-start flex items-center gap-5 md:hidden cursor-pointer">
         <button onClick={() => setIsOpen(true)}>
             <Menu size={20} className="text-gray-400 transition-colors hover:text-gray-600 " />
         </button>
      </div>
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button
          className="relative text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.8} />
        </button>

        {/* Help */}
        <button
          className="text-gray-400 transition-colors hover:text-gray-600"
          aria-label="Help">
          <HelpCircle size={20} strokeWidth={1.8} />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200" />

        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold leading-tight text-[#191C1E]">
              {user.name}
            </p>
            <p className="text-xs leading-tight text-gray-400">
              {user.employeeId}
            </p>
          </div>

          {/* Avatar */}
          <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-blue-100 text-sm font-medium text-blue-700">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}