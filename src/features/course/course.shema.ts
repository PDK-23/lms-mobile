import { z } from "zod";

export const courseCreateSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên khóa học"),
  description: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
});

export type CourseCreateSchema = z.infer<typeof courseCreateSchema>;
