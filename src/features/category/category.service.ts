import { api } from "@/src/api/client";
import { unwrap } from "@/src/api/types";
import type {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
} from "./category.types";

const normalizeCategoryList = (payload: unknown): Category[] => {
  if (Array.isArray(payload)) return payload as Category[];
  if (
    payload &&
    typeof payload === "object" &&
    "items" in payload &&
    Array.isArray((payload as { items?: unknown }).items)
  ) {
    return (payload as { items: Category[] }).items;
  }
  return [];
};

const BASE = "/categories";

export const CategoryService = {
  // GET /api/categories
  async list(): Promise<Category[]> {
    const res = await api.get(BASE);
    const data = unwrap<unknown>(res.data);
    return normalizeCategoryList(data);
  },

  // GET /api/categories/all
  // (thường dùng cho dropdown/filter; tùy backend có phân biệt list vs all)
  async listAll(): Promise<Category[]> {
    const res = await api.get(`${BASE}/all`);
    const data = unwrap<unknown>(res.data);
    return normalizeCategoryList(data);
  },

  // POST /api/categories
  async create(payload: CategoryCreateInput): Promise<Category> {
    const res = await api.post(BASE, payload);
    return unwrap<Category>(res.data);
  },

  // PUT /api/categories/{id}
  async update(
    id: string | number,
    payload: CategoryUpdateInput
  ): Promise<Category> {
    const res = await api.put(`${BASE}/${id}`, payload);
    return unwrap<Category>(res.data);
  },

  // DELETE /api/categories/{id}
  async remove(id: string | number): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },
};
