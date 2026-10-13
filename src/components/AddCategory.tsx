import { useState } from 'react';

import type { Category } from '../types/category';

type AddCategoryProps = {
    categories: Category[];
    onAddCategory: (category: Category) => void;
    onBack: () => void;
}

function AddCategory({ categories, onAddCategory, onBack }: AddCategoryProps) {
    const [name, setName] = useState('');
    const [multiplier, setMultiplier] = useState('');
    const [color, setColor] = useState("#8b5cf6")

    const [error, setError] = useState('');

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedName = name.trim();
        const parsedMultiplier = parseFloat(multiplier);

        if (!trimmedName) {
            setError('Category name is required.');
            return;
        }

        if (!Number.isFinite(parsedMultiplier) || parsedMultiplier <= 0) {
            setError('Multiplier must be a number greater than 0');
            return;
        }

        const duplicate = categories.some(
            category =>
                category.active &&
                category.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (duplicate) {
            setError('A category with this name already exists.');
            return;
        }

        const category = {
            id: crypto.randomUUID(),
            name,
            multiplier: parseFloat(multiplier),
            active: true,
            color,
        };

        onAddCategory(category);

        setName('');
        setMultiplier('');
        onBack();
    }

    return (
        <div className="add-category">
            <h2>Add Category</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => {setName(e.target.value); setError('');}} />
                </label>
                <label>
                    Multiplier:
                    <input type="number" value={multiplier} onChange={(e) => {setMultiplier(e.target.value); setError('');}} />
                </label>
                <label htmlFor="category-color">
                    Color:
                    <input
                        id="category-color"
                        type="color"
                        value={color}
                        onChange={(event) => setColor(event.target.value)}
                    />
                </label>
                {error && <p className="form-error">{error}</p>}
                <button type="submit" className="button button-primary">Save</button>
                <button type="button" className="button button-secondary" onClick={onBack}>Back</button>
            </form>
        </div>
    );

}

export default AddCategory;