import { apiRequest } from "./client";

export interface Activity {
  id: string;
  category_id: string;
  activity_date: string;
  duration: number;
  xp_earned: number;
}

export function getActivities(token: string): Promise<Activity[]> {
  return apiRequest<Activity[]>("/activities", {}, token);
}

export interface CreateActivity {
  category_id: string;
  activity_date: string;
  duration: number;
}

export function createActivity(
  token: string,
  activity: CreateActivity,
): Promise<Activity> {
  return apiRequest<Activity>(
    "/activities",
    {
      method: "POST",
      body: JSON.stringify(activity),
    },
    token,
  );
}

export function deleteActivity(
  token: string,
  activityId: string,
): Promise<void> {
  return apiRequest<void>(
    `/activities/${activityId}`,
    { method: "DELETE" },
    token,
  );
}
