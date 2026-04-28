"use client";
import { ThemeProvider } from "../../../lib/theme-provider";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Navbar from "@/components/layout/navbar";
import { useState } from "react";
import "../../globals.css";

export default function RootLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <ThemeProvider>
        <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Navbar setIsOpen={setIsOpen} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </ThemeProvider>
    </div>
  );
}