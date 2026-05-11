import API from "@/utils/api";

export const createTicket = (tenantId, payload) => {
  return API.post("/tickets", payload, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getAllTickets = (tenantId, page = 0, size = 10) => {
  return API.get(`/tickets?page=${page}&size=${size}`, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getTickets = getAllTickets; // Alias for compatibility

export const getTicketById = (id, tenantId) => {
  return API.get(`/tickets/${id}`, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const updateTicketStatus = (id, status, tenantId) => {
  return API.patch(`/tickets/${id}/status?status=${status}`, {}, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const assignTicket = (id, assignedTo, tenantId) => {
  return API.put(`/tickets/assign/${id}`, { assignedTo }, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const takeTicket = (id, tenantId) => {
  return API.put(`/tickets/take/${id}`, {}, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const resolveTicket = (id, note, tenantId) => {
  return API.put(`/tickets/resolve/${id}`, { note }, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const uploadTicketAttachment = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getTicketStats = (tenantId) => {
  return API.get("/tickets/stats", {
    headers: { "X-Tenant-Id": tenantId },
  });
};
