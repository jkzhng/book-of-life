import { apiRequest } from "./client";

export interface User {
  id: string;
  email: string;
}

export function getCurrentUser(token: string): Promise<User> {
  return apiRequest<User>("/users/me", {}, token);
}