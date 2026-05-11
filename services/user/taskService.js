import API from "@/utils/api";

export const assignTask = async (tenantId, data) => {

    const res = await API.post(
        `/tasks/${tenantId}/assign`,
        data
    );

    return res.data;
};

export const getMyTasks = async (tenantId) => {

    const res = await API.get(
        `/tasks/${tenantId}/my-tasks`
    );

    return res.data;
};