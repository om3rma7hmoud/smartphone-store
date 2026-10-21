import axiosClient from "./axiosClient";

export interface UpdateProfilePayload {
  name?: string;
  phone?: string | null;
}

export async function updateMyProfile(data: UpdateProfilePayload) {
  const res = await axiosClient.patch("/users/me", data);
  return res.data.data.user;
}
