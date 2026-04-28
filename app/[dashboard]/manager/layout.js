"use client";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Navbar from "@/components/layout/navbar";
import { useState } from "react";
import "../../globals.css";

export default function ManagerLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />  
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar setIsOpen={setIsOpen} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}