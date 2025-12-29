import { api } from "@/src/api/client";
import { unwrap } from "@/src/api/types";
import type {
  CourseDTO,
  CourseExportParams,
  CourseListParams,
  CourseUpsertInput,
  SpringPage,
} from "./course.types";
import { toCourseFormData } from "./course.formdata";

const BASE = "/courses";

function withCourseListDefaults(params?: CourseListParams) {
  return {
    pageNumber: 0,
    pageSize: 10,
    keyword: "",
    sortBy: "id",
    sortDir: "asc",
    ...(params ?? {}),
  };
}

export const CourseService = {
  listPaged(params?: CourseListParams) {
    return api
      .get(BASE, { params: withCourseListDefaults(params) })
      .then((r) => unwrap<SpringPage<CourseDTO>>(r.data));
  },

  listPublishedPaged(params?: CourseListParams) {
    return api
      .get(`${BASE}/published`, { params: withCourseListDefaults(params) })
      .then((r) => unwrap<SpringPage<CourseDTO>>(r.data));
  },

  getUtils() {
    return api.get(`${BASE}/utils`).then((r) => unwrap<CourseDTO[]>(r.data));
  },

  getById(id: number | string) {
    return api.get(`${BASE}/${id}`).then((r) => unwrap<CourseDTO>(r.data));
  },

  create(payload: CourseUpsertInput) {
    const fd = toCourseFormData(payload);
    return api
      .post(BASE, fd, { headers: { "Content-Type": "multipart/form-data" } })
      .then((r) => unwrap<CourseDTO>(r.data));
  },

  update(id: number | string, payload: CourseUpsertInput) {
    const fd = toCourseFormData(payload);
    return api
      .put(`${BASE}/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => unwrap<CourseDTO>(r.data));
  },

  remove(id: number | string) {
    return api.delete(`${BASE}/${id}`).then(() => undefined);
  },

  publish(id: number | string) {
    return api
      .put(`${BASE}/${id}/publish`)
      .then((r) => unwrap<CourseDTO>(r.data));
  },

  exportExcel(params?: CourseExportParams) {
    const p = {
      ...withCourseListDefaults(params),
      publishedOnly: false,
      exportAll: false,
      ...(params ?? {}),
    };

    return api
      .get(`${BASE}/export`, { params: p, responseType: "arraybuffer" })
      .then((r) => r.data as ArrayBuffer);
  },
};
