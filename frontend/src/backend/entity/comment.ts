export interface CommentEntity {
  author_id: number;
  post_id: number;
  content: string;
  created_at: string;
}

export interface CreateCommentEntity {
  content: string;
}
