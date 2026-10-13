import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";

import LevelDisplay from "../components/LevelDisplay";
import ActivityCard from "../components/ActivityCard";
import Stats from "../components/Stats";
import ActivityForm from "../components/ActivityForm";
import CategoryManager from "../components/CategoryManager";

import type { Activity, NewActivity } from "../types/activity";
import type { Category } from "../types/category";

type DashboardProps = {
    activities: Activity[];
    categories: Category[];
    totalXP: number;

    isActivityFormOpen: boolean;
    isCategoryManagerOpen: boolean;

    onAddActivity: (activity: NewActivity) => void;
    onDeleteActivity: (id: string) => void;

    onAddCategory: (category: Category) => void;
    onEditCategory: (category: Category) => void;

    onOpenActivityForm: () => void;
    onCloseActivityForm: () => void;

    onOpenCategoryManager: () => void;
    onCloseCategoryManager: () => void;
};

function Dashboard({
    activities,
    categories,
    totalXP,
    isActivityFormOpen,
    isCategoryManagerOpen,
    onAddActivity,
    onDeleteActivity,
    onAddCategory,
    onEditCategory,
    onOpenActivityForm,
    onCloseActivityForm,
    onOpenCategoryManager,
    onCloseCategoryManager,
}: DashboardProps) {
    const navigate = useNavigate();

    return (
        <div className="dashboard">

            {/* LEVEL */}

            <section className="level-section">
                <LevelDisplay totalXP={totalXP} />
            </section>

            {/* ACTIONS */}

            <section className="actions-section">

                <button
                    className="button button-primary"
                    onClick={onOpenActivityForm}
                >
                    Add Time
                </button>

                <button
                    className="button button-secondary"
                    onClick={onOpenCategoryManager}
                >
                    Category Manager
                </button>

                <button
                    className="button button-secondary"
                    onClick={() => navigate("/trophies")}
                >
                    To Trophy Case
                </button>

            </section>


            {/* ACTIVITY MODAL */}

            {isActivityFormOpen && (
                <div
                    className="modal-overlay"
                    onClick={onCloseActivityForm}
                >
                    <div
                        className="modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <ActivityForm
                            categories={categories}
                            onAddActivity={onAddActivity}
                            onClose={onCloseActivityForm}
                        />
                    </div>
                </div>
            )}


            {/* CATEGORY MANAGER MODAL */}

            {isCategoryManagerOpen && (
                <div
                    className="modal-overlay"
                    onClick={onCloseCategoryManager}
                >
                    <div
                        className="modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <CategoryManager
                            categories={categories}
                            onAddCategory={onAddCategory}
                            onEditCategory={onEditCategory}
                            onClose={onCloseCategoryManager}
                        />
                    </div>
                </div>
            )}

            {/* RECENT ACTIVITIES */}

            <section className="activities-section">

                <div className="section-header">
                    <h2>Recent Activities</h2>

                    <Link to="/activities" className="section-link">View All →</Link>
                </div>

                {activities.length > 0 ? (
                    <div className="activity-list">

                        {activities.slice(0, 3).map((activity) => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                categories={categories}
                                onDeleteActivity={onDeleteActivity}
                            />
                        ))}

                    </div>
                ) : (
                    <p className="text-secondary">
                        No activities yet.
                    </p>
                )}

            </section>


            {/* STATS */}

            <section className="stats-section">
                <div className="section-header">
                    <h2>Stats</h2>

                    <Link to="/stats" className="section-link">View Stats →</Link>
                </div>

                <Stats
                    activities={activities}
                    categories={categories}
                />

            </section>


            

        </div>
    );
}

export default Dashboard;