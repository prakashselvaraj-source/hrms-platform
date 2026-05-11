import API from "@/utils/api";

export const createHoliday = (data, tenantId) => {
  return API.post('/holidays', data, {
    headers: {
      "X-Tenant-Id": tenantId,
    }
  });
};

export const getAllHolidays = (tenantId) => {
  return API.get('/holidays', {
    headers: {
      "X-Tenant-Id": tenantId,
    }
  });
};

export const getUpcomingHolidays = (tenantId) => {
  return API.get('/holidays/upcoming', {
    headers: {
      "X-Tenant-Id": tenantId,
    }
  });
};

export const getHolidayById = (id, tenantId) => {
  return API.get(`/holidays/${id}`, {
    headers: {
      "X-Tenant-Id": tenantId,
    }
  });
};

export const updateHoliday = (id, data, tenantId) => {
  return API.put(`/holidays/${id}`, data, {
    headers: {
      "X-Tenant-Id": tenantId,
    }
  });
};

export const deleteHoliday = (id, tenantId) => {
  return API.delete(`/holidays/${id}`, {
    headers: {
      "X-Tenant-Id": tenantId,
    }
  });
};