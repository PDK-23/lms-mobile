import { api } from "@/src/api/client";
import { unwrap } from "@/src/api/types";
import type { Tag, TagCreateInput, TagUpdateInput } from "./tag.types";

const BASE = "/tags";

export const TagService = {
  async getById(id: number | string): Promise<Tag> {
    const res = await api.get(`${BASE}/${id}`);
    return unwrap<Tag>(res.data);
  },

  async create(payload: TagCreateInput): Promise<Tag> {
    const res = await api.post(BASE, payload);
    return unwrap<Tag>(res.data);
  },

  async update(id: number | string, payload: TagUpdateInput): Promise<Tag> {
    const res = await api.put(`${BASE}/${id}`, payload);
    return unwrap<Tag>(res.data);
  },

  async remove(id: number | string): Promise<void> {
    await api.delete(`${BASE}/${id}`);
  },

  async listAll(): Promise<Tag[]> {
    const res = await api.get(`${BASE}/all`);
    return unwrap<Tag[]>(res.data);
  },

  async listByTopic(topicId: number | string): Promise<Tag[]> {
    const res = await api.get(`${BASE}/topic/${topicId}`);
    return unwrap<Tag[]>(res.data);
  },

  async count(): Promise<number> {
    const res = await api.get(`${BASE}/count`);
    return unwrap<number>(res.data);
  },

  async exportFile(): Promise<Blob> {
    const res = await api.get(`${BASE}/export`, { responseType: "blob" });
    return res.data as Blob;
  },

  async exportArrayBuffer(): Promise<ArrayBuffer> {
    const res = await api.get(`${BASE}/export`, { responseType: "arraybuffer" });
    return res.data as ArrayBuffer;
  },

  async importFile(file: Blob | File): Promise<unknown> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post(`${BASE}/import`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrap<unknown>(res.data);
  },
};
