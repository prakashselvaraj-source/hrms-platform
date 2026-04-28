import API from "@/utils/api";

export const getEmployees = (tenantId) => {
  return API.get('/employees', {
    headers: {
      "X-Tenant-Id": tenantId
    }
  });
};

export const getEmployeeById = (id, tenantId) => {
  return API.get(`/employees/${id}`, {
    headers: {
      "X-Tenant-Id": tenantId
    }
  });
};

export const createEmployee = (data, tenantId) => {
  console.log("createEmployee", data, tenantId);
  return API.post('/employees', data, {
    headers: {
      "X-Tenant-Id": tenantId
    }
  });
};

export const updateEmployee = (id, data, tenantId) => {
  return API.put(`/employees/${id}`, data, {
    headers: {
      "X-Tenant-Id": tenantId
    }
  });
};

export const deleteEmployee = (id, tenantId) => {
  return API.delete(`/employees/${id}`, {
    headers: {
      "X-Tenant-Id": tenantId
    }
  });
};