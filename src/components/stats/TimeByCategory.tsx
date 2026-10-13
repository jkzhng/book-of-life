import type { Activity } from "../../types/activity";
import type { Category } from "../../types/category";
import { calculateTimeByCategory } from "../../utils/stats";
import { formatDuration } from "../../utils/time";

type TimeByCategoryProps = {
    activities: Activity[];
    categories: Category[];
};

function TimeByCategory({
    activities,
    categories,
}: TimeByCategoryProps) {
    const timeByCategory = calculateTimeByCategory(activities);

    const categoryData = Object.entries(timeByCategory)
        .map(([categoryId, duration]) => {
            const category = categories.find(
                (category) => category.id === categoryId
            );

            return {
                categoryId,
                name: category?.name ?? "Unknown Category",
                duration,
            };
        })
        .sort((a, b) => b.duration - a.duration);

    const maxDuration =
        categoryData.length > 0
            ? Math.max(...categoryData.map((category) => category.duration))
            : 0;

    return (
        <div className="category-chart">
            {categoryData.length === 0 ? (
                <p className="text-secondary">
                    No activity data yet.
                </p>
            ) : (
                categoryData.map((category) => {
                    const percentage =
                        maxDuration > 0
                            ? (category.duration / maxDuration) * 100
                            : 0;

                    return (
                        <div
                            key={category.categoryId}
                            className="category-chart-row"
                        >
                            <div className="category-chart-header">
                                <span className="category-chart-name">
                                    {category.name}
                                </span>

                                <span className="category-chart-duration">
                                    {formatDuration(category.duration)}
                                </span>
                            </div>

                            <div className="category-chart-track">
                                <div
                                    className="category-chart-bar"
                                    style={{
                                        width: `${percentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default TimeByCategory;