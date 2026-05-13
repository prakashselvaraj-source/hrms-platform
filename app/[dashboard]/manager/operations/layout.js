"use client";

import OperationNavbar from "@/components/layout/OperationNavbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTenant } from "@/hooks/useTenant";
import { getTenantDetails } from "@/services/organizationService";

export default function OperationLayout({ children }) {
  const router = useRouter();
  const tenant = useTenant();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenant) {
      checkSetup();
    }
  }, [tenant]);

  const checkSetup = async () => {
    try {
      const res = await getTenantDetails();
      if (!res.data.setupComplete) {
        router.push(`/${tenant}/manager/organization`);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to verify setup", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OperationNavbar />
      <main>{children}</main>
    </div>
  );
}