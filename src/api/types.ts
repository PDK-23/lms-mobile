export type ApiResponse<T> = {
  status?: number | string;
  message?: string;
  data: T;
};

export function unwrap<T>(payload: any): T {
  // ApiResponse<T>
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiResponse<T>).data;
  }
  // direct return
  return payload as T;
}
