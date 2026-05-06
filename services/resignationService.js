import API from "@/utils/api";

export const createResignation = (data, tenantId) => {
    return API.post("/resignations", data, {
        headers: {
            "X-Tenant-Id": tenantId,
        },
    });
};

export const getAllResignations = (tenantId, page, size) => {
    return API.get(`/resignations?page=${page}&size=${size}`, {
        headers: {
            "X-Tenant-Id": tenantId,
        },
    });
};

export const getResignationByEmployee = (employeeId, tenantId) => {
    return API.get(`/resignations/employee/${employeeId}`, {
        headers: {
            "X-Tenant-Id": tenantId,
        },
    });
};

export const getResignationById = (id, tenantId) => {
    return API.get(`/resignations/${id}`, {
        headers: {
            "X-Tenant-Id": tenantId,
        },
    });
};

export const getMyResignations = (tenantId) => {
    return API.get(`/resignations/me`, {
        headers: {
            "X-Tenant-Id": tenantId,
        },
    });
};

export const updateResignationStatus = (id, status, tenantId) => {
    return API.patch(`/resignations/${id}/status`, { status }, {
        headers: {
            "X-Tenant-Id": tenantId,
        },
    });
};

export const deleteResignation = (id, tenantId) => {
    return API.delete(`/resignations/${id}`, {
        headers: {
            "X-Tenant-Id": tenantId,
        },
    });
};
