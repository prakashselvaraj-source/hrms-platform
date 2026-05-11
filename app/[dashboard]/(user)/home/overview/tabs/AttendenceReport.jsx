import { useTenant } from "@/hooks/useTenant";
import { getAttendanceReport } from "@/services/user/overviewService";
import React, { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock3,
    User2,
    TimerReset,
    BadgeCheck,
} from "lucide-react";

function AttendenceReport() {

    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    const tenantId = useTenant();

    useEffect(() => {

        const fetchAttendenceReport = async () => {
            try {
                const res = await getAttendanceReport(tenantId);
                setReportData(res);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendenceReport();

    }, [tenantId]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (time) => {
        if (!time) return "--";

        return new Date(time).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div
            className="rounded-3xl  overflow-hidden"
            style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-color)",
            }}
        >

            {/* HEADER */}

            <div
                className="flex items-center justify-between px-6 py-5 "
                style={{
                    borderColor: "var(--border-color)",
                }}
            >

                <div>
                    <h2
                        className="text-xl font-bold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Attendance Report
                    </h2>

                    <p
                        className="text-sm mt-1"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Employee daily attendance overview
                    </p>
                </div>

                <div
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{
                        background: "var(--sidebar-hover)",
                        color: "var(--text-primary)",
                    }}
                >
                    {reportData.length} Records
                </div>

            </div>

            {/* LOADING */}

            {loading ? (

                <div className="flex items-center justify-center min-h-[300px]">

                    <div className="flex flex-col items-center gap-3">

                        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

                        <p
                            className="text-sm font-medium"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Loading attendance report...
                        </p>

                    </div>

                </div>

            ) : reportData.length > 0 ? (

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead
                            className="sticky top-0 z-10"
                            style={{
                                background: "var(--sidebar-hover)",
                            }}
                        >
                            <tr>

                                <th className="text-left p-4 text-xs uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <User2 size={14} />
                                        Employee
                                    </div>
                                </th>

                                <th className="text-left p-4 text-xs uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <CalendarDays size={14} />
                                        Date
                                    </div>
                                </th>

                                <th className="text-left p-4 text-xs uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Clock3 size={14} />
                                        Check In
                                    </div>
                                </th>

                                <th className="text-left p-4 text-xs uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <Clock3 size={14} />
                                        Check Out
                                    </div>
                                </th>

                                <th className="text-left p-4 text-xs uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <TimerReset size={14} />
                                        Hours
                                    </div>
                                </th>

                                <th className="text-left p-4 text-xs uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <BadgeCheck size={14} />
                                        Status
                                    </div>
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {reportData.map((report, index) => (

                                <tr
                                    key={report.id}
                                    className="transition-all duration-200 hover:bg-black/5"
                                    style={{
                                        borderBottom:
                                            "1px solid var(--border-color)",
                                    }}
                                >

                                    {/* EMPLOYEE */}

                                    <td className="p-4">

                                        <div className="flex items-center gap-3">

                                            <div
                                                className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm"
                                                style={{
                                                    background:
                                                        "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                                    color: "#fff",
                                                }}
                                            >
                                                {report.employeeId?.charAt(0)}
                                            </div>

                                            <div>
                                                <h3
                                                    className="font-semibold text-sm"
                                                    style={{
                                                        color:
                                                            "var(--text-primary)",
                                                    }}
                                                >
                                                    {report.employeeId}
                                                </h3>

                                                <p
                                                    className="text-xs"
                                                    style={{
                                                        color:
                                                            "var(--text-muted)",
                                                    }}
                                                >
                                                    Employee ID
                                                </p>
                                            </div>

                                        </div>

                                    </td>

                                    {/* DATE */}

                                    <td
                                        className="p-4 text-sm font-medium"
                                        style={{
                                            color: "var(--text-primary)",
                                        }}
                                    >
                                        {formatDate(report.date)}
                                    </td>

                                    {/* CHECK IN */}

                                    <td
                                        className="p-4 text-sm"
                                        style={{
                                            color: "var(--text-primary)",
                                        }}
                                    >
                                        {formatTime(report.checkIn)}
                                    </td>

                                    {/* CHECK OUT */}

                                    <td
                                        className="p-4 text-sm"
                                        style={{
                                            color: "var(--text-primary)",
                                        }}
                                    >
                                        {formatTime(report.checkOut)}
                                    </td>

                                    {/* HOURS */}

                                    <td className="p-4">

                                        <div
                                            className="inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold"
                                            style={{
                                                background:
                                                    "var(--sidebar-hover)",
                                                color:
                                                    "var(--text-primary)",
                                            }}
                                        >
                                            {report.totalHours || "0h"}
                                        </div>

                                    </td>

                                    {/* STATUS */}

                                    <td className="p-4">

                                        <span
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide
                                                
                                                ${report.status === "Present"
                                                    ? "bg-green-100 text-green-700"
                                                    : report.status === "Late"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {report.status}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            ) : (

                <div className="flex items-center justify-center min-h-[300px]">

                    <div className="text-center">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
                            alt="empty"
                            className="w-24 h-24 mx-auto opacity-70"
                        />

                        <h2
                            className="text-xl font-bold mt-4"
                            style={{ color: "var(--text-primary)" }}
                        >
                            No Attendance Report Found
                        </h2>

                        <p
                            className="mt-2 text-sm"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Attendance reports will appear here once employees check in.
                        </p>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AttendenceReport;