import { useState } from "react";
import type { Trophy } from "../types/trophy";
import CreateTrophy from "../components/CreateTrophy";

type TrophiesProps = {
    trophies: Trophy[];
    onAddTrophy: (trophy: Trophy) => void;
    onDeleteTrophy: (id: string) => void;
};

function Trophies({
    trophies,
    onAddTrophy,
    onDeleteTrophy,
}: TrophiesProps) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    return (
        <div className="page trophies-page">
            <div className="page-header">
                <div>
                    <h2>Trophy Case</h2>
                    <p className="text-secondary">
                        Celebrate your accomplishments.
                    </p>
                </div>

                <button
                    className="button button-primary"
                    onClick={() => setIsCreateOpen(true)}
                >
                    + Create Trophy
                </button>
            </div>

            {trophies.length === 0 ? (
                <div className="card trophy-empty">
                    <h3>Your trophy case is empty</h3>
                    <p className="text-secondary">
                        Create your first trophy to commemorate an
                        accomplishment.
                    </p>
                    <button
                        className="button button-primary"
                        onClick={() => setIsCreateOpen(true)}
                    >
                        Create Your First Trophy
                    </button>
                </div>
            ) : (
                <div className="trophy-grid">
                    {trophies.map((trophy) => (
                        <article className="card trophy-card" key={trophy.id}>
                            <h3>{trophy.title}</h3>
                            <p className="text-secondary">
                                {trophy.description}
                            </p>
                            <span>{trophy.date}</span>
                            <strong>{trophy.xpReward} XP</strong>

                            <button
                                className="button button-danger"
                                onClick={() => onDeleteTrophy(trophy.id)}
                            >
                                Delete
                            </button>
                        </article>
                    ))}
                </div>
            )}

            {isCreateOpen && (
                <CreateTrophy
                    onAddTrophy={onAddTrophy}
                    onClose={() => setIsCreateOpen(false)}
                />
            )}
        </div>
    );
}

export default Trophies;