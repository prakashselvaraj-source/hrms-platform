import API from "@/utils/api";

export const checkIn = () => API.post("/attendance/check-in");

export const checkOut = () => API.post("/attendance/check-out");

export const getAttendance = (page = 0) => API.get(`/attendance?page=${page}`);

export const getStats = () =>
  API.get("/attendance/stats");

export const getMonthlyReport = (month, year) =>
  API.get(`/attendance/report?month=${month}&year=${year}`);