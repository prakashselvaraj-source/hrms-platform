import API from "@/utils/api";

export const getUserDashboard = async (tenantId) =>{
    return API.get(`/dashboard/user`, {
        headers: {
            "X-Tenant-Id": tenantId
        }
    });
}