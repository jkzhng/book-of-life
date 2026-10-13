import { useState } from 'react';

import AddCategory from './AddCategory';
import EditCategory from './EditCategory';

import type { Category } from '../types/category';

type CategoryManagerProps = {
    categories: Category[];
    onAddCategory: (category: Category) => void;
    onEditCategory: (category: Category) => void;
    onClose: () => void;
}

function CategoryManager({ categories, onAddCategory, onEditCategory, onClose }: CategoryManagerProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState<Category | null>(null);

    function handleDelete(category: Category) {
        const deletedCategory = {
            ...category,
            active: false,
        }

        onEditCategory(deletedCategory);
    }

    if (isAdding) {
        return (
            <AddCategory categories={categories} onAddCategory={onAddCategory} onBack={() => setIsAdding(false)} />
        );
    }
    if (isEditing) {
        return (
            <EditCategory category={isEditing} categories={categories} onEditCategory={onEditCategory} onBack={() => setIsEditing(null)} />
        );
    }
    return (
        <div className="category-manager">
            <h2 className="category-header">Category Manager</h2>
            <div className="category-list">
                {categories.map((category) => {
                    if (category.active) {
                        return (
                            <div key={category.id} className="category-item">
                                <span className="category-name">{category.name}</span>
                                <span className="category-multiplier">x{category.multiplier}</span>
                                <div className="category-actions">
                                    <button className="button button-secondary" onClick={() => setIsEditing(category)}>Edit</button>
                                    <button className="button button-danger" onClick={() => handleDelete(category)}>Delete</button>
                                </div>
                            </div>
                        );
                    }
                    return null;
                }
                )}
            </div>
            <button className="button button-primary" onClick={() => setIsAdding(true)}>Add Category</button>
            <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
        </div>
    )
}

export default CategoryManager;