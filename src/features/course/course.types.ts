export type SortDir = "asc" | "desc";

export type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index (0-based)
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements?: number;
  empty?: boolean;
};

export type CourseDTO = {
  id: number;
  name: string;
  code: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  discount: number | null;
  durationWeeks: number;
  language: string | null;
  level: string | null;
  published: boolean;
  datePublished: string | null; // LocalDateTime -> string
  creator: Record<string, unknown> | null;
  instructor: Record<string, unknown> | null;
  prerequisites: Array<Record<string, unknown>>; // BE: List<Map<String,Object>>
  tags: Array<Record<string, unknown>>; // BE: List<Map<String,Object>>
};

export type CourseListParams = {
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  sortBy?: string;
  sortDir?: SortDir;
};

export type CourseExportParams = CourseListParams & {
  publishedOnly?: boolean;
  exportAll?: boolean;
};

export type CourseUpsertInput = {
  name: string;
  code: string;
  description?: string;
  image?: any; // RN/Web FormData file-like
  price?: number;
  discount?: number;
  durationWeeks?: number;
  language?: string;
  level?: string;
  published?: boolean;
  prerequisites?: Array<number>;
  tags?: Array<number>;
};
