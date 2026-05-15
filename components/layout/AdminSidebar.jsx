"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  User,
  CalendarDays,
  Briefcase,
  BarChart2,
  MessageSquare,
  Settings,
  LogOut,
  BarChart,
  FileText,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  Command,
  Sparkles,
  Lock,
  Building2,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useTenant } from "@/hooks/useTenant";
import { useEffect, useState } from "react";
import { getTenantDetails } from "@/services/organizationService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const tenant = useTenant();
  const [role, setRole] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [setupComplete, setSetupComplete] = useState(true);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyName, setCompanyName] = useState("WorkSphere");

  useEffect(() => {
    setMounted(true);
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);

    if (tenant) {
      checkSetupStatus();
    }
  }, [tenant]);

  const checkSetupStatus = async () => {
    try {
      const res = await getTenantDetails();
      setSetupComplete(res.data.setupComplete);
      setCompanyLogo(res.data.logoUrl);
      setCompanyName(res.data.companyName || "WorkSphere");
    } catch (error) {
      console.error("Failed to check setup status", error);
    }
  };

  // Synchronized Role Mapping: SUPER_ADMIN -> manager, ADMIN -> admin
  const managerPrefix = role === 'ADMIN' ? 'manager' : 'admin';

  const getNavItems = () => {
    const sharedItems = [
      { label: "Payroll", href: `/${tenant}/payroll`, icon: Briefcase },
      { label: "Attendance", href: `/${tenant}/attendance`, icon: BarChart2 },
      { label: "Tasks", href: `/${tenant}/tasks/MyTasks`, icon: CheckSquare },
    ];

    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      return [
        { label: "Dashboard", href: `/${tenant}/${managerPrefix}/dashboard`, icon: LayoutGrid },
        { label: "Leave", href: `/${tenant}/${managerPrefix}/Leave-management`, icon: CalendarDays },
        {
          label: "Operations",
          href: setupComplete ? `/${tenant}/${managerPrefix}/operations` : "#",
          icon: Command,
          locked: !setupComplete
        },
        { label: "Settings", href: `/${tenant}/${managerPrefix}/settings`, icon: Settings },
      ];
    }

    // Regular Employee
    return [
      { label: "Dashboard", href: `/${tenant}/home/overview`, icon: LayoutGrid },
      { label: "My Leave", href: `/${tenant}/leaveManagement`, icon: CalendarDays },
      ...sharedItems,
      { label: "Profile", href: `/${tenant}/profile`, icon: User },
    ];
  };

  const navItems = getNavItems();

  if (!mounted) return null;

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 280 : 88 }}
      className="sidebar-root"
    >
      <style>{`
        .sidebar-root {
          height: 100vh;
          background: #09090b;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          z-index: 50;
          color: #fff;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-header {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          overflow: hidden;
          white-space: nowrap;
        }

        .logo-container {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);
        }

        .company-name {
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 18px;
          background: linear-gradient(to right, #fff, #a1a1aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-section {
          flex: 1;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          color: #71717a;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #fff;
        }

        .nav-item.active {
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
        }

        .nav-item.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .nav-item.locked:hover {
          background: transparent;
          color: #71717a;
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 15%;
          height: 70%;
          width: 3px;
          background: #818cf8;
          border-radius: 0 4px 4px 0;
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          min-width: 20px;
        }

        .nav-label {
          font-size: 14px;
          font-weight: 500;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .user-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
          cursor: pointer;
          transition: background 0.2s;
        }

        .user-pill:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #27272a;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a1a1aa;
          font-weight: 600;
          font-size: 12px;
        }

        .toggle-btn {
          position: absolute;
          right: -12px;
          top: 32px;
          width: 24px;
          height: 24px;
          background: #18181b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #a1a1aa;
          z-index: 100;
        }

        .toggle-btn:hover {
          background: #27272a;
          color: #fff;
        }

        .locked-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          background: rgba(239, 68, 68, 0.1);
          border-radius: 6px;
          color: #ef4444;
        }
      `}</style>

      <div className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </div>

      <div className="sidebar-header">
        <div className="logo-container">
          {companyLogo ? (
            <img src={companyLogo} alt="Logo" className="nav-icon" style={{ borderRadius: '6px' }} />
          ) : (
            <Sparkles size={22} color="white" />
          )}
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="company-name"
            >
              {companyName}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="nav-section">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.includes(item.href);

          const handleLockedClick = (e) => {
            if (item.locked) {
              e.preventDefault();
              toast.error(`${item.label} is locked. Please complete your company setup first.`, {
                icon: '🔒',
                style: {
                  borderRadius: '12px',
                  background: '#18181b',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)'
                },
              });
            }
          };

          return (
            <Link
              key={item.label}
              href={item.locked ? "#" : item.href}
              onClick={handleLockedClick}
              className={`nav-item ${isActive ? 'active' : ''} ${item.locked ? 'locked' : ''}`}
            >
              <div className="relative flex items-center">
                <Icon className="nav-icon" />
                {!isOpen && item.locked && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#09090b]" />
                )}
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}
                  >
                    <span className="nav-label">{item.label}</span>
                    {item.locked && (
                      <span className="locked-badge">
                        <Lock size={12} strokeWidth={3} />
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="avatar">
            {role ? role.charAt(0) : 'U'}
          </div>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="user-info"
            >
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{role || 'User'}</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>Workspace Active</div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
