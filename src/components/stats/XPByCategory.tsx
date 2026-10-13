import type { Activity } from "../../types/activity";
import type { Category } from "../../types/category";
import { calculateXPByCategory } from "../../utils/stats";

type XPByCategoryProps = {
    activities: Activity[];
    categories: Category[];
};

function XPByCategory({
    activities,
    categories,
}: XPByCategoryProps) {
    const XPByCategory = calculateXPByCategory(activities);

    const categoryData = Object.entries(XPByCategory)
        .map(([categoryId, xp]) => {
            const category = categories.find(
                (category) => category.id === categoryId
            );

            return {
                categoryId,
                name: category?.name ?? "Unknown Category",
                xp,
            };
        })
        .sort((a, b) => b.xp - a.xp);

    const maxXP =
        categoryData.length > 0
            ? Math.max(...categoryData.map((category) => category.xp))
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
                        maxXP > 0
                            ? (category.xp / maxXP) * 100
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
                                    {category.xp}
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

export default XPByCategory;