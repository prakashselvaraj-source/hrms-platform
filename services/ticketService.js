import API from "@/utils/api";

export const createTicket = (tenantId, payload) => {
  return API.post("/tickets", payload, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getTickets = (tenantId, params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page);
  if (params.size) query.set("size", params.size);
  if (params.status) query.set("status", params.status);
  const qs = query.toString();
  return API.get(`/tickets${qs ? `?${qs}` : ""}`, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getTicketById = (tenantId, id) => {
  return API.get(`/tickets/${id}`, {
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
