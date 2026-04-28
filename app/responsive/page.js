"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

export default function OverflowNavbar() {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);

  const items = [
    "Dashboard",
    "Profile",
    "Projects",
    "Reports",
    "Messages",
    "Settings",
    "Analytics",
    "Users",
  ];

  const [visibleCount, setVisibleCount] = useState(items.length);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame;

    const updateLayout = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const containerWidth = container.offsetWidth;
        console.log("Container width:", containerWidth);

        let totalWidth = 0;
        let count = items.length;

        for (let i = 0; i < items.length; i++) {
          const el = itemRefs.current[i];
          if (!el) continue;

          totalWidth += el.offsetWidth;

          console.log(
            `Item ${i} width: ${el.offsetWidth}, Total so far: ${totalWidth}`,
          );

          if (totalWidth > containerWidth - 150) {
            count = i;
            console.log(
              `Item ${i} causes overflow. Total: ${totalWidth}, Container: ${containerWidth}`,
            );
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

  const visibleItems = items.slice(0, visibleCount);
  const hiddenItems = items.slice(visibleCount);

  return (
    <div className="w-full border-b p-2">
      <div ref={containerRef} className="flex items-center gap-2 relative">
        {/* Invisible measuring layer (KEY FIX) */}
        <div className="absolute opacity-0 pointer-events-none flex">
          {items.map((item, i) => (
            <div
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              className="px-3 py-1 whitespace-nowrap"
            >
              {item}
            </div>
          ))}
        </div>

        {/* Visible Items */}
        {visibleItems.map((item, i) => (
          <div
            key={i}
            className="px-3 py-1 whitespace-nowrap rounded-md cursor-pointer hover:bg-gray-200"
          >
            {item}
          </div>
        ))}

        {/* More Button */}
        {hiddenItems.length > 0 && (
          <div className="relative ml-auto">
            <button
              onClick={() => setOpen(!open)}
              className="p-2 rounded-md hover:bg-gray-200"
            >
              <MoreHorizontal size={18} />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border rounded-md z-50">
                {hiddenItems.map((item, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
