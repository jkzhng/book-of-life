
import { apiRequest } from "./client";

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface RegisterResponse {
  id: number;
  email: string;
}

export async function login(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.set("username", email);
  formData.set("password", password);

  const result = await apiRequest<LoginResponse>(
    "/users/login",
    {
      method: "POST",
      body: formData,
    },
  );

  return result;
}

export async function register(email: string, password: string) {
  return apiRequest<RegisterResponse>("/users/register",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
    }),
  });
}