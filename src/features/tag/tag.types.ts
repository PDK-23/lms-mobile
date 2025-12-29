export type Topic = {
  id: number | string;
  name: string;
};

export type Tag = {
  id: number | string;
  name: string;
  topicId: number | string;
  topicName: string;
  topic?: Topic;
};

export type TagCreateInput = {
  name: string;
  topicId: number | string;
};

export type TagUpdateInput = Partial<TagCreateInput>;
