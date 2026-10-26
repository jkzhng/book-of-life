import { apiRequest } from "./client";

export interface Category {
  id: string;
  name: string;
  multiplier: number;
  color: string;
  active: boolean;
}

export interface CreateCategory {
  name: string;
  multiplier: number;
  color: string;
  active?: boolean;
}

export function getCategories(token: string): Promise<Category[]> {
  return apiRequest<Category[]>("/categories", {}, token);
}

export function createCategory(
  token: string,
  category: CreateCategory,
): Promise<Category> {
  return apiRequest<Category>(
    "/categories",
    {
      method: "POST",
      body: JSON.stringify(category),
    },
    token,
  );
}

export function updateCategory(
  token: string,
  categoryId: string,
  updates: Partial<CreateCategory>,
): Promise<Category> {
  return apiRequest<Category>(
    `/categories/${categoryId}`,
    {
      method: "PATCH",
      body: JSON.stringify(updates),
    },
    token,
  );
}

export function deleteCategory(
  token: string,
  categoryId: string,
): Promise<Category> {
  return updateCategory(token, categoryId, { active: false });
}