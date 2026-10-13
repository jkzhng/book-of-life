import { useState } from "react";

import type { Activity } from "../types/activity";
import type { Category } from "../types/category";

import ActivityCard from "../components/ActivityCard";

type ActivitiesProps = {
    activities: Activity[];
    categories: Category[];
    onDeleteActivity: (id: string) => void;
};

function Activities({
    activities,
    categories,
    onDeleteActivity,
}: ActivitiesProps) {

    const [search, setSearch] = useState("");
    const [selectedCategory,setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const filteredActivities = activities.filter((activity) => {
        const category = categories.find(
            (c) => c.id === activity.categoryId
        );

        const categoryName = category?.name || "Unknown Category";

        const matchesSearch = categoryName
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesCategory =
            selectedCategory === "all" ||
            activity.categoryId === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const sortedActivities = [...filteredActivities].sort((a, b) => {

        switch (sortBy) {

            case "oldest":
                return a.date.localeCompare(b.date);

            case "longest":
                return b.duration - a.duration;

            case "shortest":
                return a.duration - b.duration;

            case "newest":
            default:
                return b.date.localeCompare(a.date);
        }

    });

    return (
        <div className="page">

            <div className="page-header">
                <h2>Activities</h2>

                <p className="text-secondary">
                    Your complete activity history.
                </p>
            </div>

            <div className="activity-controls">

                <input
                    type="text"
                    placeholder="Search by category..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

                <select
                    value={selectedCategory}
                    onChange={(event) =>
                        setSelectedCategory(event.target.value)
                    }
                >
                    <option value="all">All Categories</option>

                    {categories
                        .filter((category) => category.active)
                        .map((category) => (
                            <option
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))}
                </select>

                <select
                    value={sortBy}
                    onChange={(event) =>
                        setSortBy(event.target.value)
                    }
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="longest">Longest Duration</option>
                    <option value="shortest">Shortest Duration</option>
                </select>

            </div>

            

            <div className="activity-list">

                {sortedActivities.length > 0 ? (

                    sortedActivities.map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            activity={activity}
                            categories={categories}
                            onDeleteActivity={onDeleteActivity}
                        />
                    ))

                ) : (

                    <p className="text-secondary">
                        No activities found.
                    </p>

                )}

            </div>

        </div>
    );
}

export default Activities;