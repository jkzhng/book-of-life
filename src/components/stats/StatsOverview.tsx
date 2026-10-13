import type { Activity } from "../../types/activity";
import type { Trophy } from "../../types/trophy";

import { calculateTotalTime } from "../../utils/stats";
import { calculateTotalActivityXP, calculateTotalTrophyXP, calculateTotalXP } from "../../logic/xp";
import { formatDuration } from "../../utils/time";

type StatsOverviewProps = {
    activities: Activity[];
    trophies: Trophy[];
};

function StatsOverview({ activities, trophies }: StatsOverviewProps){
    const totalTime = calculateTotalTime(activities);
    const ActivityXP = calculateTotalActivityXP(activities);
    const TrophyXP = calculateTotalTrophyXP(trophies);
    const totalXP = calculateTotalXP(activities, trophies);
    
    return (
        <section className="stats-overview">
            <div className="stat-card">
                <span className="stat-card-label">Total Time</span>
                <strong>{formatDuration(totalTime)}</strong>
            </div>

            <div className="stat-card">
                <span className="stat-card-label">Total XP</span>
                <strong>{Math.round(totalXP).toLocaleString()}</strong>
            </div>

            <div className="stat-card">
                <span className="stat-card-label">Activities</span>
                <strong>{activities.length}</strong>
            </div>

            <div className="stat-card">
                <span className="stat-card-label">Activity XP</span>
                <strong>{Math.round(ActivityXP).toLocaleString()}</strong>
            </div>

            <div className="stat-card">
                <span className="stat-card-label">Trophies</span>
                <strong>{trophies.length}</strong>
            </div>

            <div className="stat-card">
                <span className="stat-card-label">Trophy XP</span>
                <strong>{Math.round(TrophyXP).toLocaleString()}</strong>
            </div>
        </section>
    )
}

export default StatsOverview;