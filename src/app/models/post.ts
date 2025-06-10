import { PostComment } from './comment';

export interface Post {
  id?: number;
  userId?: number;
  title: string;
  body: string;
  comments: PostComment[];
}
