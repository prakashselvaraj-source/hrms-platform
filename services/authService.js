import API from "@/utils/api";

export const registerCompany = (data) => {
  return API.post("/auth/register-company", data);
};

export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const tenantsData = () => {
    return API.get("/user/tenants");
}

export const checkCompanyExists = (companyName) => {
    return API.get("/tenants/check",{
      params:{name:companyName}
    });
}

export const checkEmailExists = (email) => {
  console.log("checkEmailExists from authService",email)
  return API.get("/auth/check-email",{
    params:{email:email}
  })
}

export const forgotPassword = (email) => {
  return API.post("/auth/forgot-password", { email });
};

export const resetPassword = (data) =>{
  return API.post("/auth/reset-password",data);
}
