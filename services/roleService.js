import API from "@/utils/api";


export const createRole = (data, tenantId) => {
  return API.post('/roles', data, {
    headers: {
      "X-Tenant-Id": tenantId,
    }
  });
};


export const getAllRoles = (tenantId) => {
  return API.get('/roles', {
    headers: {
      "X-Tenant-Id": tenantId,
    }
  });
};


export const getRoleById = (id, tenantId) => {
  return API.get(`/roles/${id}`, {
    headers: {
      "X-Tenant-Id": tenantId,
    }
  });
};


export const updateRole = (id, data, tenantId) => {
  return API.put(`/roles/${id}`, data, {
    headers: {
      "X-Tenant-Id": tenantId,
    }
  });
};


export const deleteRole = (id, tenantId) => {
  return API.delete(`/roles/${id}`, {
    headers: {
      "X-Tenant-Id": tenantId,
    }
  });
};