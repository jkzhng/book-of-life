import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { Activity } from "../../types/activity";
import type { Category } from "../../types/category";

type ActivityTrendProps = {
    activities: Activity[];
    categories: Category[];
};

function ActivityTrend({
    activities,
    categories,
}: ActivityTrendProps) {
    const activeCategories = categories.filter(
        (category) => category.active
    );

    const today = new Date();

    const chartData = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);

        date.setDate(today.getDate() - (6 - index));

        const dateString = date.toISOString().split("T")[0];

        const dayActivities = activities.filter(
            (activity) => activity.date === dateString
        );

        const dayData: Record<string, string | number> = {
            date: dateString,
        };

        activeCategories.forEach((category) => {
            const duration = dayActivities
                .filter(
                    (activity) =>
                        activity.categoryId === category.id
                )
                .reduce(
                    (total, activity) =>
                        total + activity.duration,
                    0
                );

            // Convert seconds to hours for the chart.
            dayData[category.id] = duration / 3600;
        });

        return dayData;
    });

    return (
        <div className="activity-trend">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="date"
                        tickFormatter={(date) => {
                            const [, month, day] =
                                date.split("-");

                            return `${month}/${day}`;
                        }}
                    />

                    <YAxis
                        label={{
                            value: "Hours",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />

                    <Tooltip
                        formatter={(value) =>
                            `${Number(value).toFixed(1)} hours`
                        }
                    />

                    <Legend />

                    {activeCategories.map((category) => (
                        <Bar
                            key={category.id}
                            dataKey={category.id}
                            name={category.name}
                            stackId="time"
                            fill={category.color}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ActivityTrend;