import API from "@/utils/api";

export const getPayrollOverview = (tenantId) => {
  return API.get("/payroll/overview", {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getPayslips = (tenantId, params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page);
  if (params.size) query.set("size", params.size);
  const qs = query.toString();
  return API.get(`/payroll/payslips${qs ? `?${qs}` : ""}`, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const downloadPayslip = (tenantId, payslipId) => {
  return API.get(`/payroll/payslips/${payslipId}/download`, {
    headers: { "X-Tenant-Id": tenantId },
    responseType: 'blob'
  });
};

export const getSalaryStructure = (tenantId) => {
  return API.get("/payroll/salary-structure", {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getBankDetails = (tenantId) => {
  return API.get("/payroll/bank-details", {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const updateBankDetails = (tenantId, data) => {
  return API.put("/payroll/bank-details", data, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const createPayslip = (tenantId, data) => {
  return API.post("/payroll/admin/payslips", data, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getAllPayslips = (tenantId, params = {}) => {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", params.page);
  if (params.size) query.set("size", params.size);
  if (params.employeeId) query.set("employeeId", params.employeeId);
  const qs = query.toString();
  return API.get(`/payroll/admin/payslips${qs ? `?${qs}` : ""}`, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const seedPayrollData = (tenantId) => {
  return API.post("/payroll/seed", {}, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const adminSeedPayrollData = (tenantId) => {
  return API.post("/payroll/admin/seed-all", {}, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getAdminPayrollOverview = (tenantId) => {
  return API.get("/payroll/admin/overview", {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const runPayrollCycle = (tenantId, data) => {
  return API.post("/payroll/admin/run-cycle", data, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getPayrollPolicy = (tenantId) => {
  return API.get("/payroll/admin/policy", {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const updatePayrollPolicy = (tenantId, data) => {
  return API.put("/payroll/admin/policy", data, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getAdminSalaryStructure = (tenantId, employeeId) => {
  return API.get(`/payroll/admin/salary-structure/${employeeId}`, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const updateAdminSalaryStructure = (tenantId, employeeId, data) => {
  return API.put(`/payroll/admin/salary-structure/${employeeId}`, data, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const getPayrollHistory = (tenantId, params = {}) => {
  const query = new URLSearchParams();
  if (params.page !== undefined) query.set("page", params.page);
  if (params.size) query.set("size", params.size);
  if (params.year) query.set("year", params.year);
  const qs = query.toString();
  return API.get(`/payroll/admin/history${qs ? `?${qs}` : ""}`, {
    headers: { "X-Tenant-Id": tenantId },
  });
};

export const finalizePayouts = (tenantId) => {
  return API.post("/payroll/admin/finalize-payouts", {}, {
    headers: { "X-Tenant-Id": tenantId },
  });
};
