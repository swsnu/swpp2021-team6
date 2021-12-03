export interface CommentEntity {
  comment_id: number;
  author_id: number;
  post_id: number;
  content: string;
  created_at: string;
}

export interface CreateCommentEntity {
  post_id: number;
  author_id: number;
  content: string;
}
