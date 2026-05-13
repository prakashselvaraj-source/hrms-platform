import API from '@/utils/api';

const BASE = '/admin';

export const getAdminProfile = async (email) => {
    return await API.get(`${BASE}/profile`, {
        params: { email }
    });
};

export const updateAdminProfile = async (profileData) => {
    return await API.post(`${BASE}/profile`, profileData);
};
