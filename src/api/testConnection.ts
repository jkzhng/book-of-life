
import { apiRequest } from "./client";

export async function testAuthenticatedConnection(token: string) {
  const user = await apiRequest<{ id: string; email: string }>(
    "/users/me",
    {},
    token,
  );

  console.log("Authenticated as:", user.email);
}
