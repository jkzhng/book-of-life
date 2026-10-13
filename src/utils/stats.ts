import type { Activity } from "../types/activity";

function calculateTotalTime(activities: Activity[]): number {
    return activities.reduce((total,activity) => total + activity.duration,0)
}

function calculateTimeByCategory(activities: Activity[]): Record<string, number> {
    const timeByCategory: Record<string, number> = {};
    for (const activity of activities) {
        if (!timeByCategory[activity.categoryId]) {
            timeByCategory[activity.categoryId] = 0;
        }
        timeByCategory[activity.categoryId] += activity.duration;
    }
    return timeByCategory;
}

function calculateXPByCategory(activities: Activity[]): Record<string, number> {
    const timeByCategory: Record<string, number> = {};
    for (const activity of activities) {
        if (!timeByCategory[activity.categoryId]) {
            timeByCategory[activity.categoryId] = 0;
        }
        timeByCategory[activity.categoryId] += activity.xpEarned;
    }
    return timeByCategory;
}

export { calculateTotalTime, calculateTimeByCategory, calculateXPByCategory };