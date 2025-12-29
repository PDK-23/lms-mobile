export type Category = {
  id: number | string;
  tag: string;
};

export type CategoryCreateInput = {
  tag: string;
};

export type CategoryUpdateInput = Partial<CategoryCreateInput>;
