import { calculateLevel, xpProgress, xpForLevel, xpProgressPercentage } from "../logic/xp";

type LevelDisplayProps = {
    totalXP: number;
};

function LevelDisplay({ totalXP }: LevelDisplayProps) {
    const level = calculateLevel(totalXP);
    const progress = xpProgress(totalXP);
    const nextLevelXP = xpForLevel(level + 1);
    const percentage = xpProgressPercentage(totalXP);

    return (
        <section className="level-display">
            <div className="level-header">
                <div>
                    <h2>Level {level}</h2>
                </div>
            </div>

            <div className="level-xp">
                {progress} / {nextLevelXP} XP
            </div>

            <div className="xp-bar">
                <div className="xp-bar-fill" style={{ width: `${percentage}%` }}></div>
            </div>
        </section>
    )
}

export default LevelDisplay;