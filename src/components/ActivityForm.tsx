import { useState } from 'react';

import type { Category } from '../types/category';

type ActivityFormProps = {
    categories: Category[];
    onAddActivity: (activity: { categoryId: string; date: string; duration: number }) => void;
    onClose: () => void;
};

function ActivityForm({ categories, onAddActivity, onClose }: ActivityFormProps) {
    const [categoryId, setCategoryId] = useState('');
    const [date, setDate] = useState(getTodayDate());
    const [hour, setHour] = useState('');
    const [min, setMin] = useState('');
    const [sec, setSec] = useState('');

    const [error,setError] = useState('');

    function getTodayDate(): string {
        const today = new Date();
        return today.toLocaleDateString('en-CA'); // Format: YYYY-MM-DD
    }


    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const activityHours = parseInt(hour,10) || 0;
        const activityMins = parseInt(min,10) || 0;
        const activitySecs = parseInt(sec,10) || 0;

        const duration = 3600 * activityHours + 60 * activityMins + activitySecs

        if(duration <= 0){
            setError('Duration must be greater than 0');
            return;
        }

        const activity = {
            categoryId,
            date,
            duration,
        };

        // Here you would typically add the new activity to your state or send it to a backend API
        onAddActivity(activity);
        onClose();

    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="category">Category:</label>
            <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                <option value="">Select a category</option>
                {categories.map((cat) => {
                    if (cat.active) {
                        return (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        );
                    }
                    return null;
                })}
            </select>
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            <label htmlFor="duration">Duration:</label>
            <input type="number" id="hour" value={hour} onChange={(e) => setHour(e.target.value)} />
            <label htmlFor="hour">h </label>
            <input type="number" id="min" value={min} onChange={(e) => setMin(e.target.value)} />
            <label htmlFor="hour">m </label>
            <input type="number" id="sec" value={sec} onChange={(e) => setSec(e.target.value)} />
            <label htmlFor="hour">s</label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="button button-primary">Add Activity</button>
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
        </form>
    );
}

export default ActivityForm;