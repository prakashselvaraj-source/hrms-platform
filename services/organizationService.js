import API from "@/utils/api";

export const getTenantDetails = () => {
  return API.get("/tenants/by-code");
};

export const updateSetupStatus = (complete) => {
  return API.post("/tenants/setup-complete", null, {
    params: { complete }
  });
};

export const createLocation = (data) => {
  return API.post("/api/locations", data);
};

export const getLocations = () => {
  return API.get("/api/locations");
};

export const createShift = (data) => {
  return API.post("/api/shifts", data);
};

export const getShifts = () => {
  return API.get("/api/shifts");
};

export const completeFullSetup = (data) => {
  return API.post("/tenants/full-setup", data);
};

export const getFullDetails = () => {
  return API.get("/tenants/full-details");
};
