import { apiRequest } from "./client";

export interface Stats {
  total_activity_xp: number;
  total_trophy_xp: number;
  total_xp: number;
  level: number;
  xp_into_level: number;
  xp_for_next_level: number;
  progress_percentage: number;
}

export function getStats(token: string): Promise<Stats> {
  return apiRequest<Stats>("/stats", {}, token);
}
