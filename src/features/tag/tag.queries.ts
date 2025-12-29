import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TagService } from "./tag.service";
import type { TagCreateInput, TagUpdateInput } from "./tag.types";

export const tagKeys = {
  all: ["tags"] as const,
  allList: () => ["tags", "all"] as const,
  detail: (id: number | string) => ["tags", "detail", id] as const,
  byTopic: (topicId: number | string) => ["tags", "topic", topicId] as const,
  count: () => ["tags", "count"] as const,
};

export function useTag(id: number | string) {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => TagService.getById(id),
    enabled: !!id,
  });
}

export function useAllTags() {
  return useQuery({
    queryKey: tagKeys.allList(),
    queryFn: () => TagService.listAll(),
  });
}

export function useTagsByTopic(topicId: number | string) {
  return useQuery({
    queryKey: tagKeys.byTopic(topicId),
    queryFn: () => TagService.listByTopic(topicId),
    enabled: !!topicId,
  });
}

export function useTagCount() {
  return useQuery({
    queryKey: tagKeys.count(),
    queryFn: () => TagService.count(),
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TagCreateInput) => TagService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagKeys.all }),
  });
}

export function useUpdateTag(id: number | string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TagUpdateInput) => TagService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagKeys.all }),
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => TagService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagKeys.all }),
  });
}

export function useImportTags() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: Blob | File) => TagService.importFile(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: tagKeys.all }),
  });
}
