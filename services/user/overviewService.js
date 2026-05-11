import API from "@/utils/api"


export const getDesignMember = async(tenantId) =>{
     const res = await API.get(`/overview/design-member`,{
        headers:{
            "X-Tenant-Id":tenantId,
            "Content-Type":"application/json"
        }
     })
     return res.data; 
} 

export const getReportingManager = async(tenantId) =>{
     const res = await API.get(`/overview/reporting-manager`,{
        headers:{
            "X-Tenant-Id":tenantId,
            "Content-Type":"application/json"
        }
     })
     return res.data;
}

export const getUserData = async(tenantId) =>{
    const res = await API.get(`/overview/get-profile`,{
        headers:{
            "X-Tenant-Id":tenantId,
            "Content-Type":"application/json"
        }
    })
    return res.data;
}

export const getAttendanceReport = async (tenantId) =>{
    const res = await API.get(`/overview/get-attendance`,{
        headers:{
            "X-Tenant-Id":tenantId,
            "Content-Type":"application/json"
        }
    })
    return res.data;
}

export const getLeaveRequestStatus = async(tenantId) =>{
    const res = await API.get(`/overview/get-leave-status`,{
        headers:{
            "X-Tenant-Id":tenantId,
            "Content-Type":"application/json"
        }
    })
    return res.data;
}