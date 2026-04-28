import API from "@/utils/api";

export const getDepartments = (tenantId) => {
  return API.get("/departments", {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getDepartmentById = (tenantId, id) => {
  return API.get(`/departments/${id}`, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const createDepartment = (tenantId, payload) => {
  return API.post("/departments", payload, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const updateDepartment = (tenantId, id, payload) => {
  return API.put(`/departments/${id}`, payload, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const deleteDepartment = (tenantId, id) => {
  return API.delete(`/departments/${id}`, {
    headers: { "X-Tenant-Id": tenantId },
  });
};
