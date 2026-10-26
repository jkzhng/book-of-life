import { getCategories } from "./categories";

export async function testCtategories(token: string) {
  const categories = await getCategories(token);
  console.log("Categories from backend:", categories);
}