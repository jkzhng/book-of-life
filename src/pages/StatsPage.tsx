import type { Activity } from "../types/activity";
import type { Category } from "../types/category";
import type { Trophy } from "../types/trophy";

import StatsOverview from "../components/stats/StatsOverview";
import TimeByCategory from "../components/stats/TimeByCategory";
import XPByCategory from "../components/stats/XPByCategory";
import ActivityTrend from "../components/stats/ActivityTrend";

type StatsPageProps = {
    activities: Activity[];
    categories: Category[];
    trophies: Trophy[];
};

function StatsPage({
    activities,
    categories,
    trophies,
}: StatsPageProps) {

    return (
        <div className="page stats-page">

            <div className="page-header">
                <h2>Stats</h2>
                <p className="text-secondary">
                    Explore your activity history.
                </p>
            </div>

            <StatsOverview activities={activities} trophies={trophies}></StatsOverview>

            <section className="stats-grid">
                <div className="stats-panel">
                    <h3>Time by Category</h3>
                    <TimeByCategory activities={activities} categories={categories}></TimeByCategory>
                </div>

                <div className="stats-panel">
                    <h3>XP by Category</h3>
                    <XPByCategory activities={activities} categories={categories}></XPByCategory>
                </div>
            </section>

            <section className="stats-panel">
                <h3>Activity Over Time</h3>
                <ActivityTrend activities={activities} categories={categories}></ActivityTrend>
            </section>


        </div>
    );
}

export default StatsPage;