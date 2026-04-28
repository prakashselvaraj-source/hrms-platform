import API from "@/utils/api"

export const createLeaveType = (tenantId, payload) => {
     return API.post("/leave-types",payload,{
        headers:{
            "X-Tenant-Id":tenantId,
        }
     })
}

export const getLeaveTypes = (tenantId) =>{
    return API.get("/leave-types",{
        headers:{
            "X-Tenant-Id":tenantId
        }
    });
}

export const getLeaveTypesById = (tenantId, id) => {
    return API.get(`/leave-types/${id}`,{
        headers:{
            "X-Tenant-Id":tenantId
        }
    });
};

export const getLeaveConfigByLeaveId = (tenantId, id) => {
  return API.get(`/leave-types/${id}/configuration`, {
    headers: {
      "X-Tenant-Id": tenantId,
    },
  });
};

export const createLeavePolicy = (tenantId, leaveId, payload) => {
  return API.post(`/leave-types/${leaveId}/configuration`, payload, {
    headers: {
      "X-Tenant-Id": tenantId,
    },
  });
};

export const updateLeavePolicy = (tenantId, configId, payload) => {
  return API.put(`/leave-types/configuration/${configId}`, payload, {
    headers: {
      "X-Tenant-Id": tenantId,
    },
  });
};