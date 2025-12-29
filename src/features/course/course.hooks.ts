import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CourseService } from "./course.service";
import type {
  CourseExportParams,
  CourseListParams,
  CourseUpsertInput,
} from "./course.types";

export const courseKeys = {
  all: ["courses"] as const,
  list: (params: CourseListParams) => ["courses", "list", params] as const,
  published: (params: CourseListParams) =>
    ["courses", "published", params] as const,
  detail: (id: string | number) => ["courses", "detail", id] as const,
  utils: () => ["courses", "utils"] as const,
};

export function useCourses(params: CourseListParams) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: () => CourseService.listPaged(params),
  });
}

export function usePublishedCourses(params: CourseListParams) {
  return useQuery({
    queryKey: courseKeys.published(params),
    queryFn: () => CourseService.listPublishedPaged(params),
  });
}

export function useCourse(id: string | number) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => CourseService.getById(id),
    enabled: !!id,
  });
}

export function useCourseUtils() {
  return useQuery({
    queryKey: courseKeys.utils(),
    queryFn: () => CourseService.getUtils(),
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CourseUpsertInput) => CourseService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.all }),
  });
}

export function useUpdateCourse(id: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CourseUpsertInput) =>
      CourseService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.all }),
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => CourseService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.all }),
  });
}

export function usePublishCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => CourseService.publish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: courseKeys.all }),
  });
}

export function useExportCourses() {
  return useMutation({
    mutationFn: (params: CourseExportParams) =>
      CourseService.exportExcel(params),
  });
}
