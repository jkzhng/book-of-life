import type { Activity } from '../types/activity';
import type { Category } from '../types/category';

import { formatDuration } from "../utils/time";

type ActivityCardProps = {
  activity: Activity;
  categories: Category[];
  onDeleteActivity: (id: string) => void;
};

function ActivityCard({ activity, categories, onDeleteActivity }: ActivityCardProps) {
  const category = categories.find((c) => c.id === activity.categoryId);
  return (
    <div className="activity-card">
      <div className="activity-info">
        <span className="activity-category">{category?.name || 'Unknown Category'}</span>
        <span className="activity-detail">{activity.date} Duration: {formatDuration(activity.duration)}</span>
      </div>

      <button className="button button-danger activity-delete" onClick={() => onDeleteActivity(activity.id)}>Delete</button>
    </div>
  );
}

export default ActivityCard;