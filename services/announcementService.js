import API from "@/utils/api";

export const createAnnouncement = (data, tenantId) => {
    return API.post('/announcements', data, {
        headers: {
            "X-Tenant-Id": tenantId,
        }
    });
};


export const getAllAnnouncements = (tenantId, page, size) => {
    return API.get(`/announcements?page=${page}&size=${size}&sort=createdAt,desc`, {
        headers: {
            "X-Tenant-Id": tenantId,
        }
    });
};


export const getAnnouncementById = (id, tenantId) => {
    return API.get(`/announcements/${id}`, {
        headers: {
            "X-Tenant-Id": tenantId,
        }
    });
};

// ✅ UPDATE ANNOUNCEMENT
export const updateAnnouncement = (id, data, tenantId) => {
    return API.put(`/announcements/${id}`, data, {
        headers: {
            "X-Tenant-Id": tenantId,
        }
    });
};

// ✅ DELETE ANNOUNCEMENT
export const deleteAnnouncement = (id, tenantId) => {
    return API.delete(`/announcements/${id}`, {
        headers: {
            "X-Tenant-Id": tenantId,
        }
    });
};