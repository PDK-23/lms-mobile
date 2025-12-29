import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CategoryService } from "./category.service";
import type { CategoryCreateInput, CategoryUpdateInput } from "./category.types";

export const categoryKeys = {
  all: ["categories"] as const,
  list: () => ["categories", "list"] as const,
  allList: () => ["categories", "all"] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => CategoryService.list(),
  });
}

export function useAllCategories() {
  return useQuery({
    queryKey: categoryKeys.allList(),
    queryFn: () => CategoryService.listAll(),
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryCreateInput) => CategoryService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  });
}

export function useUpdateCategory(id: number | string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CategoryUpdateInput) => CategoryService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => CategoryService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  });
}
