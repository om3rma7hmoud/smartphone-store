import axiosClient from "./axiosClient";

export const login = async (email: string, password: string) => {
  const res = await axiosClient.post("/auth/login", { email, password });

  return res.data.data.user;
};

export const signup = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}) => {
  const res = await axiosClient.post("/auth/signup", data);

  return res.data.data.user;
};

export const logout = async () => {
  await axiosClient.get("/auth/logout");
};

export const fetchMe = async () => {
  const res = await axiosClient.get("/auth/me");

  return res.data.data;
};

export const forgotPassword = async (email: string) => {
  await axiosClient.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token: string, password: string) => {
  await axiosClient.patch(`/auth/reset-password/${token}`, {
    password,
  });
};

export const changePassword = async (data: {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}) => {
  await axiosClient.patch("/auth/change-password", data);
};
