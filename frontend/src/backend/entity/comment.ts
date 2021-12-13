export interface CommentEntity {
  commentId: number;
  authorId: number;
  postId: number;
  content: string;
  createdAt: string;
}

export interface CommentDTO {
  content: string;
}
