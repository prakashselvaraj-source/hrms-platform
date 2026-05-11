import { useTenant } from "@/hooks/useTenant";
import React, { useEffect, useState } from "react";
import {
    CheckCircle2,
    XCircle,
    Clock3,
    CalendarDays,
} from "lucide-react";
import { getLeaveRequestStatus } from "@/services/user/overviewService";

function RequestStatus() {

    const [requestStatus, setRequestStatus] = useState([]);
    const [loading, setLoading] = useState(true);

    const tenantId = useTenant();

    useEffect(() => {

        const fetchLeaveRequestStatus = async () => {

            try {

                const res = await getLeaveRequestStatus(tenantId);

                console.log("res", res);

                setRequestStatus(res || []);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }
        };

        if (tenantId) {
            fetchLeaveRequestStatus();
        }

    }, [tenantId]);

    const getStatusStyle = (status) => {

        switch (status?.toLowerCase()) {

            case "approved":
                return {
                    icon: <CheckCircle2 size={15} />,
                    className:
                        "bg-green-100 text-green-700 border border-green-200",
                };

            case "rejected":
                return {
                    icon: <XCircle size={15} />,
                    className:
                        "bg-red-100 text-red-700 border border-red-200",
                };

            default:
                return {
                    icon: <Clock3 size={15} />,
                    className:
                        "bg-yellow-100 text-yellow-700 border border-yellow-200",
                };
        }
    };

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (

        <div
            className=" overflow-hidden shadow-sm"
            style={{
                background: "var(--card-bg)",
                borderColor: "var(--border-color)",
            }}
        >

            {/* HEADER */}

            <div
                className="px-6 py-5 border-b border-gray-300 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >

                <div>

                    <h2
                        className="text-2xl font-bold"
                        style={{
                            color: "var(--text-primary)",
                        }}
                    >
                        Leave Request Status
                    </h2>

                    <p
                        className="text-sm mt-1"
                        style={{
                            color: "var(--text-muted)",
                        }}
                    >
                        Track employee leave requests and approvals
                    </p>

                </div>

                <div
                    className="px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{
                        background: "var(--sidebar-hover)",
                        color: "var(--text-primary)",
                    }}
                >
                    {requestStatus.length} Requests
                </div>

            </div>

            {/* LOADING */}

            {loading ? (

                <div className="min-h-[300px] flex items-center justify-center">

                    <div className="flex flex-col items-center gap-4">

                        <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>

                        <p
                            className="text-sm font-medium"
                            style={{
                                color: "var(--text-muted)",
                            }}
                        >
                            Loading requests...
                        </p>

                    </div>

                </div>

            ) : requestStatus.length > 0 ? (

                <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

                        <thead>

                            <tr
                                className="border-b border-gray-300"

                            >

                                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Leave Type
                                </th>

                                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Start Date
                                </th>

                                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider">
                                    End Date
                                </th>

                                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Day Type
                                </th>

                                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Apply Option
                                </th>

                                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Reason
                                </th>

                                <th className="p-4 text-left text-xs font-bold uppercase tracking-wider">
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {requestStatus.map((request, index) => {

                                const statusStyle = getStatusStyle(request.status);

                                return (

                                    <tr
                                        key={request.id || index}
                                        className="border-b border-gray-300 hover:bg-black/5 transition-all duration-200"

                                    >

                                        {/* LEAVE TYPE */}

                                        <td className="p-4">

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg,#6366f1,#8b5cf6)",
                                                        color: "#fff",
                                                    }}
                                                >
                                                    <CalendarDays size={18} />
                                                </div>

                                                <div>

                                                    <p
                                                        className="font-semibold text-sm"
                                                        style={{
                                                            color:
                                                                "var(--text-primary)",
                                                        }}
                                                    >
                                                        {request.leaveType}
                                                    </p>

                                                    <p
                                                        className="text-xs mt-1"
                                                        style={{
                                                            color:
                                                                "var(--text-muted)",
                                                        }}
                                                    >
                                                        ID : {request.id}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>

                                        {/* START DATE */}

                                        <td
                                            className="p-4 text-sm"
                                            style={{
                                                color: "var(--text-primary)",
                                            }}
                                        >
                                            {formatDate(request.startDate)}
                                        </td>

                                        {/* END DATE */}

                                        <td
                                            className="p-4 text-sm"
                                            style={{
                                                color: "var(--text-primary)",
                                            }}
                                        >
                                            {formatDate(request.endDate)}
                                        </td>

                                        {/* DAY TYPE */}

                                        <td className="p-4">

                                            <span
                                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                                style={{
                                                    background:
                                                        "var(--sidebar-hover)",
                                                    color:
                                                        "var(--text-primary)",
                                                }}
                                            >
                                                {request.dayType}
                                            </span>

                                        </td>

                                        {/* APPLY OPTION */}

                                        <td
                                            className="p-4 text-sm"
                                            style={{
                                                color: "var(--text-muted)",
                                            }}
                                        >
                                            {request.applyWithOption}
                                        </td>

                                        {/* REASON */}

                                        <td
                                            className="p-4 text-sm max-w-[250px] truncate"
                                            style={{
                                                color: "var(--text-muted)",
                                            }}
                                        >
                                            {request.reason || "-"}
                                        </td>

                                        {/* STATUS */}

                                        <td className="p-4">

                                            <span
                                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold ${statusStyle.className}`}
                                            >
                                                {statusStyle.icon}

                                                {request.status}
                                            </span>

                                        </td>

                                    </tr>
                                );
                            })}

                        </tbody>

                    </table>

                </div>

            ) : (

                <div className="min-h-[300px] flex items-center justify-center">

                    <div className="text-center">

                        <img
                            src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
                            alt="empty"
                            className="w-24 h-24 mx-auto opacity-70"
                        />

                        <h2
                            className="text-2xl font-bold mt-5"
                            style={{
                                color: "var(--text-primary)",
                            }}
                        >
                            No Leave Requests Found
                        </h2>

                        <p
                            className="mt-2 text-sm"
                            style={{
                                color: "var(--text-muted)",
                            }}
                        >
                            Leave request updates will appear here.
                        </p>

                    </div>

                </div>

            )}

        </div>
    );
}

export default RequestStatus;