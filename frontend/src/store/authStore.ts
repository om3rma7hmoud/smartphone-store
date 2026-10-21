import { create } from "zustand";
import type { User } from "../types";
import * as authApi from "../api/auth.api";
import { toast } from "react-toastify";
import { updateMyProfile } from "../api/users.api";
import type { UpdateProfilePayload } from "../api/users.api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirm: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    token: string,
    password: string,
    passwordConfirm: string,
  ) => Promise<void>;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
  changePassword: (data: {
    currentPassword: string;
    password: string;
    passwordConfirm: string;
  }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const user = await authApi.login(email, password);
    set({ user, isAuthenticated: true });
    toast.success("Successfully login!");
  },

  signup: async (data) => {
    const user = await authApi.signup(data);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
    toast.success("You have successfully logged out.");
  },

  fetchMe: async () => {
    try {
      const user = await authApi.fetchMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    await authApi.forgotPassword(email);
  },

  resetPassword: async (token, password) => {
    await authApi.resetPassword(token, password);
  },
  updateProfile: async (data) => {
    const user = await updateMyProfile(data);
    set({ user });
    toast.success("Profile updated successfully");
  },
  changePassword: async (data) => {
    await authApi.changePassword(data);
    toast.success("Password changed successfully.");
  },
}));
