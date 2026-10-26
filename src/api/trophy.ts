import { apiRequest } from "./client";

export interface Trophy {
  id: string;
  title: string;
  description: string;
  trophy_date: string;
  xp_reward: number;
}

export interface CreateTrophy {
  title: string;
  description: string;
  trophy_date: string;
  xp_reward: number;
}

export function getTrophies(token: string): Promise<Trophy[]> {
  return apiRequest<Trophy[]>("/trophies", {}, token);
}

export function createTrophy(
  token: string,
  trophy: CreateTrophy,
): Promise<Trophy> {
  return apiRequest<Trophy>(
    "/trophies",
    {
      method: "POST",
      body: JSON.stringify(trophy),
    },
    token,
  );
}

export function deleteTrophy(
  token: string,
  trophyId: string,
): Promise<void> {
  return apiRequest<void>(
    `/trophies/${trophyId}`,
    { method: "DELETE" },
    token,
  );
}
