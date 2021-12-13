export interface CommentEntity {
  commentId: number;
  authorName: string;
  authorId: number;
  postId: number;
  content: string;
  createdAt: string;
}

export interface CommentDTO {
  content: string;
}
