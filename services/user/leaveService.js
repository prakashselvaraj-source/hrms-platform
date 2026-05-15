import API from "@/utils/api";


export const getAllLeaveTypesWithUserIdAndYear = async (tenantId, year) => {
    const res = await API(`/leave-management/get-all-leave-types/${year}`,{
        headers:{
            "Content-Type":"application/json",
            "X-Tenant-Id":tenantId
        }
    });
    return res.data;
}; 
    
export const submitLeaveRequest = async(tenantId, token, payload) => {
    // Log FormData entries to verify content
    const formDataEntries = {};
    payload.forEach((value, key) => {
        formDataEntries[key] = value instanceof File ? `File: ${value.name}` : value;
    });
    console.log("🚀 ~ submitLeaveRequest Payload:", formDataEntries);

    const res = await API.post("/leave-management/submit-leave-request", payload, {
        headers:{
            "Authorization":`Bearer ${token}`,
            "X-Tenant-Id":tenantId
            // "Content-Type" is omitted to let the browser set it with the correct boundary
        }
    });
    
    return res.data;
};

export const getAllLeaveTypes = async (tenantId) => {
    const res = await API.get(`/leave-types`,{
        headers:{
            "Content-Type":"application/json",
            "X-Tenant-Id":tenantId
        }
    });
    return res.data;
};  

export const getAllLeavePolicy = async (tenantId) => {
    const res = await API.get(`/leave-policies`,{
        headers:{
            "Content-Type":"application/json",
            "X-Tenant-Id":tenantId
        }
    });
    
    return res.data;
};  

export const getAllLeaveRequests = async (tenantId, token, page = 0, size = 10) => {

    console.log("getAllLeaveRequests",tenantId, token);
     
    const res = await API.get(`/leave-management/get-all-leave-requests`,{
        params:{
            page,
            size
        },
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`,
            "X-Tenant-Id":tenantId
        }
    });
    return res.data;
};  


export const getMyLeaveRequests = async (tenantId, token, page = 0, size = 10) => {
    const res = await API.get(`/leave-management/employee-leave-requests`,{
        params:{
            page,
            size
        },
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`,
            "X-Tenant-Id":tenantId
        }
    });
    return res.data;
};  


export const getLeaveRequestById = async (tenantId, token, id) => {
    const res = await API.get(`/leave-management/get-leave-request/${id}`,{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`,
            "X-Tenant-Id":tenantId
        }
    });
    return res.data;
};

export const updateLeaveStatus = async (tenantId, token, id, status) => {
    const res = await API.put(`/leave-management/update-leave-status/${id}`,{status},{
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`,
            "X-Tenant-Id":tenantId
        }
    });
    return res.data;
};  
