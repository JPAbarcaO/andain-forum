export interface IPost {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author_email?: string;
  createdAt: Date;
  total: number;
}
