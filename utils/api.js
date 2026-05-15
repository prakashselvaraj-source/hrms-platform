import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// ✅ Request interceptor
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    // 1. Handle Authorization Token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Handle Tenant Identification (from URL Path)
    // URL pattern: http://localhost:3000/[tenant]/...
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/').filter(Boolean);
    
    // Usually the first part of the path is the tenant (e.g., /yellow/dashboard)
    if (pathParts.length > 0) {
      const tenantId = pathParts[0];
      // Skip common paths that aren't tenants (like login/register if they are top-level)
      if (!['login', 'register', 'verify-otp'].includes(tenantId)) {
        config.headers["X-Tenant-Id"] = tenantId;
      }
    }
  }
  return config;
});

// ✅ Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userEmail");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;