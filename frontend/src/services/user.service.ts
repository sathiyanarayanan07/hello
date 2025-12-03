import { fetchWithAuth } from "../lib/api";
import { User, CreateUserData } from "@/types/user";


export const userService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await fetchWithAuth("/users");
    return response.json();
  },

  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await fetchWithAuth("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create user");
    }

    return response.json();
  },

  updateUserRole: async (userId: string, role: string): Promise<User> => {
    const response = await fetchWithAuth(`/users/${userId}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update user role");
    }

    return response.json();
  },

  deleteUser: async (userId: string): Promise<void> => {
    const response = await fetchWithAuth(`/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete user");
    }
  },
};

export default userService;
