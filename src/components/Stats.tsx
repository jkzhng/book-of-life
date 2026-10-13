import type { Activity } from "../types/activity";
import type { Category } from "../types/category";

import { calculateTimeByCategory } from "../utils/stats";
import { formatDuration } from "../utils/time";

type StatsProps = {
    activities: Activity[];
    categories: Category[];
};

function Stats({ activities, categories }: StatsProps) {
    const timeByCategory = calculateTimeByCategory(activities);

    return (
        <div className="stats">
            <div className="stats-list">
                {Object.entries(timeByCategory).map(([categoryId,duration]) => {
                    const category = categories.find((c) => c.id === categoryId);
                    return (
                        <div className="stat-row" key={categoryId}>
                            <span className="stat-category">{category ? category.name : 'Unknown Category'}</span>
                            <span className="stat-duration">{formatDuration(duration)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Stats;