import { useState, useEffect } from "react";
import type { Trophy } from "../types/trophy";

type CreateTrophyProps = {
    onAddTrophy: (trophy: Trophy) => void;
    onClose: () => void;
};

function CreateTrophy({
    onAddTrophy,
    onClose,
}: CreateTrophyProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [xpReward, setXpReward] = useState(0);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!title.trim()) {
            return;
        }

        if (!description.trim()) {
            return;
        }

        if (!date) {
            return;
        }

        if (!Number.isFinite(xpReward) || xpReward < 0) {
            return;
        }

        const trophy: Trophy = {
            id: "",
            title: title.trim(),
            description: description.trim(),
            date,
            xpReward: xpReward,
            attachments: [],
        };

        onAddTrophy(trophy);
        onClose();
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(event) => event.stopPropagation()}>
                <h2>Create Trophy</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="trophy-title">
                            Title
                        </label>

                        <input
                            id="trophy-title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            placeholder="e.g. Finished my first project"
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="trophy-description">
                            Description
                        </label>

                        <textarea
                            id="trophy-description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            placeholder="What did you accomplish?"
                            rows={4}
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="trophy-date">
                            Date
                        </label>

                        <input
                            id="trophy-date"
                            type="date"
                            value={date}
                            onChange={(event) =>
                                setDate(event.target.value)
                            }
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="trophy-xp">
                            XP Reward
                        </label>

                        <input
                            id="trophy-xp"
                            type="number"
                            min="0"
                            step="1"
                            value={xpReward}
                            onChange={(event) =>
                                setXpReward(Number(event.target.value))
                            }
                            placeholder="500"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="button button-secondary"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="button button-primary"
                        >
                            Create Trophy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTrophy;