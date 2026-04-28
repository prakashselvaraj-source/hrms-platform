"use client";
import { useRouter,usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { MoreHorizontal } from "lucide-react";

function Header() {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const router = useRouter();
  const pathname = usePathname();
  

  const tabs = [
    { label: "Apply for Leave", link: "/leaveManagement" },
    { label: "Upcoming Holidays", link: "/leaveManagement/upcomingHolidays" },
    { label: "Leave Request status", link: "/leaveManagement/leaverequeststatus" },
  ];

  const [visibleCount, setVisibleCount] = useState(tabs.length);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame;

    const updateLayout = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const containerWidth = container.offsetWidth;

        let totalWidth = 0;
        let count = tabs.length;

        for (let i = 0; i < tabs.length; i++) {
          const el = itemRefs.current[i];
          if (!el) continue;

          totalWidth += el.offsetWidth;

          if (totalWidth > containerWidth - 80) {
            count = i;
            break;
          }
        }

        setVisibleCount(count);
      });
    };

    const observer = new ResizeObserver(updateLayout);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    updateLayout();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const visibleItems = tabs.slice(0, visibleCount);
  const hiddenItems = tabs.slice(visibleCount);

  return (
    <div>
      <div className="h-[60px] bg-[#5B39C9] flex items-center md:px-8">
        <div ref={containerRef} className="flex items-center gap-2 relative w-full justify-between md:justify-start">

          {/* Invisible measuring layer */}
          <div className="absolute opacity-0 pointer-events-none flex w-full overflow-hidden">
            {tabs.map((tab, i) => (
              <div
                key={i}
                ref={(el) => (itemRefs.current[i] = el)}
                className="px-3 py-2 whitespace-nowrap text-sm font-medium"
              >
                {tab.label}
              </div>
            ))}
          </div>

          {/* Visible Tabs */}
          {visibleItems.map((tab, i) => (
            <button
              key={i}
              onClick={() => {
                router.push(tab.link);
              }}
              className={clsx(
                "px-3 py-2 whitespace-nowrap text-sm font-medium transition-colors",
                pathname === tab.link
                  ? "text-white border-b-2 border-white"
                  : "text-white/50"
              )}
            >
              {tab.label}
            </button>
          ))}

          {/* More dropdown */}
          {hiddenItems.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="text-white px-3 py-2 text-sm"
              >
                <MoreHorizontal size={18} />
              </button>

              {open && (
                <div className="absolute top-full right-0 mt-2 bg-white shadow-md rounded w-48 z-10">
                  {hiddenItems.map((tab, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        router.push(tab.link);
                        setOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {tab.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Header;