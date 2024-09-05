export interface TopicData {
  iconId: string;
  topicId: number;
  users: number;
  votes: number;
}

export type TopicsResponse = {
  [key: string]: TopicData;
};
