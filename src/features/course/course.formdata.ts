import type { CourseUpsertInput } from "./course.types";

export function toCourseFormData(input: CourseUpsertInput): FormData {
  const fd = new FormData();

  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    fd.append(key, String(value));
  };

  append("name", input.name);
  append("code", input.code);
  append("description", input.description ?? "");
  append("price", input.price);
  append("discount", input.discount);
  append("durationWeeks", input.durationWeeks);
  append("language", input.language);
  append("level", input.level);
  append("published", input.published);

  // Multipart file field name MUST be "image" (BE: MultipartFile image)
  if (input.image) {
    fd.append("image", input.image);
  }

  // BE expects List<Long> -> append multiple times with same key
  (input.prerequisites ?? []).forEach((id) =>
    fd.append("prerequisites", String(id))
  );
  (input.tags ?? []).forEach((id) => fd.append("tags", String(id)));

  return fd;
}
