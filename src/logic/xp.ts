import type { Activity, NewActivity } from '../types/activity';
import type { Category } from '../types/category';
import type { Trophy } from '../types/trophy';

const levelRequirements: Record<number,number> = {
    1: 3600,
    2: 5000,
    3: 10000,
    4: 15000,
    5: 20000,
    6: 25000,
    7: 30000,
    8: 35000,
    9: 40000,
    10: 50000,
    11: 60000,
    12: 70000,
    13: 80000,
    14: 90000,
    15: 100000,
}

function getLevelMultiplier(level: number): number {
    return 1 + level * 0.01;
}

function getCategoryMultiplier(category: string, categories: Category[]): number {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.multiplier : 1;
}

function calculateActivityXP(activity: NewActivity, categories: Category[], level: number): number {
    const levelMultiplier = getLevelMultiplier(level);
    const categoryMultiplier = getCategoryMultiplier(activity.categoryId, categories);
    return activity.duration * levelMultiplier * categoryMultiplier;
}

function calculateTotalActivityXP(activities: Activity[]): number {
    return activities.reduce((total,activity) => total + activity.xpEarned, 0);
}

function calculateTotalTrophyXP(trophies: Trophy[]): number {
    return trophies.reduce((total,trophy) => total + trophy.xpReward,0);
}

function calculateTotalXP(activities: Activity[], trophies: Trophy[]): number {
    const activityXP = activities.reduce((total, activity) => total + activity.xpEarned, 0);
    const trophyXP = trophies.reduce((total,trophy) => total + trophy.xpReward, 0);
    return activityXP + trophyXP;
}

function xpForLevel(level: number): number {
    if (levelRequirements[level] !== undefined) {
        return levelRequirements[level];
    }
    const decade = Math.floor((level - 15) / 10);
    const levelsInDecade = (level - 15) % 10;

    const decadeStartXP = 100000 * (decade * (decade + 1) / 2 + 1); 
    const xpPerLevel = 10000 + 10000 * decade;

    return decadeStartXP + levelsInDecade * xpPerLevel;
}

function cumulativeXPForLevel(level: number): number {
    let totalXP = 0;
    for (let i = 1; i < level + 1; i++) {
        totalXP += xpForLevel(i);
    }
    return totalXP;
}

function calculateLevel(totalXP: number): number {
    let level = 0;
    while (totalXP >= cumulativeXPForLevel(level + 1)) {
        level++;
    }
    return level;
}

function xpProgress(totalXP: number): number {
    const currentLevel = calculateLevel(totalXP);
    return totalXP - cumulativeXPForLevel(currentLevel);
}

function xpProgressPercentage(totalXP: number): number {
    const currentLevel = calculateLevel(totalXP);
    const levelRequiredXP = xpForLevel(currentLevel + 1);
    return (totalXP - cumulativeXPForLevel(currentLevel)) / levelRequiredXP * 100;
}

export { calculateActivityXP, calculateTotalActivityXP, calculateTotalTrophyXP, calculateTotalXP, xpForLevel, calculateLevel, xpProgress, xpProgressPercentage };