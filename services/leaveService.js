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

export const saveLeavePolicy = (tenantId, leaveId, payload) => {
  return API.post(`/leave-policies`,
    { ...payload, leaveTypeId: leaveId }, {
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

// Leave Request Management
export const getAllLeaveRequests = (tenantId, page = 0, size = 10) => {
  return API.get(`/leave-management/get-all-leave-requests`, {
    params: { page, size },
    headers: {
      "X-Tenant-Id": tenantId,
    },
  });
};

export const getLeaveRequestById = (tenantId, id) => {
  return API.get(`/leave-management/get-leave-request/${id}`, {
    headers: {
      "X-Tenant-Id": tenantId,
    },
  });
};

export const updateLeaveStatus = (tenantId, id, status) => {
  return API.put(`/leave-management/update-leave-status/${id}`, 
    { status }, 
    {
      headers: {
        "X-Tenant-Id": tenantId,
      },
    }
  );
};