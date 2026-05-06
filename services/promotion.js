import API from "@/utils/api";

export const createPromotion = (data, tenantId) => {
    return API.post('/promotions', data, {
        headers: {
            "X-Tenant-Id": tenantId,
        }
    });
};


export const getAllPromotions = (tenantId) => {
    return API.get('/promotions', {
        headers: {
            "X-Tenant-Id": tenantId,
        }
    });
};


export const getPromotionById = (id, tenantId) => {
    return API.get(`/promotions/${id}`, {
        headers: {
            "X-Tenant-Id": tenantId,
        }
    });
};


export const updatePromotion = (id, data, tenantId) => {
    return API.put(`/promotions/${id}`, data, {
        headers: {
            "X-Tenant-Id": tenantId,
        }
    });
};


export const deletePromotion = (id, tenantId) => {
    return API.delete(`/promotions/${id}`, {
        headers: {
            "X-Tenant-Id": tenantId,
        }
    });
};