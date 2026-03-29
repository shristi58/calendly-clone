"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type { User } from "@/types";
import { toast } from "sonner";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;

  login: (email: string, password: string) => Promise<User | null>;
  register: (
    name: string,
    email: string,
    password: string,
    timezone?: string
  ) => Promise<User | null>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<User | null>;
  updateProfile: (data: {
    name?: string;
    timezone?: string;
    avatarUrl?: string | null;
    welcomeMessage?: string | null;
    language?: string;
    dateFormat?: string;
    timeFormat?: string;
    country?: string;
  }) => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  initialize: () => {
    // With cookies, we just try to fetch the user.
    // If cookies are valid, it succeeds. If not, user stays null.
    if (!get().isInitialized) {
      set({ isInitialized: true });
      get().fetchMe();
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      // Backend sets cookies and returns { user }
      const data = await api.post<{ user: User }>("/auth/login", {
        email,
        password,
      });
      set({ user: data.user });
      toast.success(`Welcome back, ${data.user.name}!`);
      return data.user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      toast.error(message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password, timezone) => {
    set({ isLoading: true });
    try {
      // Backend sets cookies and returns { user }
      const data = await api.post<{ user: User }>("/auth/register", {
        name,
        email,
        password,
        timezone,
      });
      set({ user: data.user });
      toast.success("Account created successfully!");
      return data.user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      // Server revokes session + clears cookies
      await api.post("/auth/logout");
    } catch {
      // Even if the request fails, clear local state
    }
    set({ user: null });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  fetchMe: async () => {
    try {
      const user = await api.get<User>("/auth/me");
      set({ user });
      return user;
    } catch {
      // Cookies invalid or expired — user is unauthenticated
      set({ user: null });
      return null;
    }
  },

  updateProfile: async (data) => {
    try {
      const user = await api.patch<User>("/auth/me", data);
      set({ user });
      toast.success("Profile updated");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      toast.error(message);
    }
  },
}));
