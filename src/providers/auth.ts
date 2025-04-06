import {
  AuthProvider,
  AuthActionResponse,
  CheckResponse,
  OnErrorResponse,
} from "@refinedev/core";

const API_URL = import.meta.env.VITE_API_URL;

export const authProvider: AuthProvider = {
  login: async ({ email, password }): Promise<AuthActionResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.accessToken);
      return { success: true, redirectTo: "/" };
    } catch (error: any) {
      return {
        success: false,
        error: new Error(error?.message || "Login failed"),
      };
    }
  },

  check: async (): Promise<CheckResponse> => {
    const token = localStorage.getItem("access_token");
    return token
      ? { authenticated: true }
      : { authenticated: false, redirectTo: "/login" };
  },

  logout: async (): Promise<AuthActionResponse> => {
    localStorage.removeItem("access_token");
    return { success: true, redirectTo: "/login" };
  },

  onError: async (error): Promise<OnErrorResponse> => {
    console.error("Auth error:", error);
    return { error };
  },

  register: async ({ name, email, password }): Promise<AuthActionResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      return { success: true, redirectTo: "/login" };
    } catch (error: any) {
      return {
        success: false,
        error: new Error(error?.message || "Registration failed"),
      };
    }
  },

  forgotPassword: async ({ email }): Promise<AuthActionResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Forgot password failed");
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: new Error(error?.message || "Forgot password failed"),
      };
    }
  },

  updatePassword: async ({
    token,
    newPassword,
  }): Promise<AuthActionResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update password failed");
      }

      return { success: true, redirectTo: "/login" };
    } catch (error: any) {
      return {
        success: false,
        error: new Error(error?.message || "Update password failed"),
      };
    }
  },

  getPermissions: async () => {
    const token = localStorage.getItem("access_token");
    return token ? ["user"] : [];
  },

  getIdentity: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch user identity");

      const user = await response.json();
      return user;
    } catch {
      return null;
    }
  },
};

export default authProvider;
