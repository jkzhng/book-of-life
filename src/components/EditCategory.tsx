import { useState } from 'react';

import type { Category } from '../types/category';

type EditCategoryProps = {
    category: Category;
    categories: Category[];
    onEditCategory: (category: Category) => void;
    onBack: () => void;
}

function EditCategory({ category, categories, onEditCategory, onBack }: EditCategoryProps) {
    const [name, setName] = useState(category.name);
    const [multiplier, setMultiplier] = useState(category.multiplier.toString());
    const [color, setColor] = useState(category.color);

    const [error,setError] = useState('');

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
            otherCategory =>
                otherCategory.id !== category.id &&
                otherCategory.active &&
                otherCategory.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (duplicate) {
            setError('A category with this name already exists.');
            return;
        }

        const updatedCategory = {
            ...category,
            name,
            multiplier: parseFloat(multiplier),
            color,
        };

        onEditCategory(updatedCategory);

        setName('');
        setMultiplier('');
        onBack();
    }

    return (
        <div className="add-category">
            <h2>Edit Category</h2>
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
                <button type="submit">Save</button>
                <button type="button" onClick={onBack}>Back</button>
            </form>
        </div>
    );

}

export default EditCategory;