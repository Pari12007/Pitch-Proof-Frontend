import api from "./api";

export const signup = (userData) => {
  return api.post("/auth/signup", userData);
};

export const login = (userData) => {
  return api.post("/auth/login", userData);
};

export const verify = () => {
  return api.get("/auth/verify");
};

export const deleteAccount = () => {
  return api.delete("/auth/delete-account");
};

export const editProfile = (userData) => {
  return api.put("/auth/edit-profile", userData);
};

export const forgotPassword = (email) => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = (token, password) => {
  return api.post("/auth/reset-password", { token, password });
}

export const markDashboardVisited = () => {
  return api.patch("/auth/dashboard-visited");
};