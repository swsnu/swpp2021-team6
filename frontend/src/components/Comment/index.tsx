import React from 'react';
import { useSelector } from 'react-redux';
import { deleteComment, updateComment } from '../../backend/api/api';
import { AppState } from '../../store/store';
import './index.scss';

interface Props {
  commentId: number;
  content: string;
  authorId: number;
  authorName: string;
  postId: number;
  createdAt: string;
  setCommentsUpdated: (updated: boolean) => any;
}

const CommentsListItem: React.FunctionComponent<Props> = ({
  commentId,
  content,
  authorId,
  authorName,
  postId,
  createdAt,
  setCommentsUpdated,
}) => {
  const { loginUserId } = useSelector((state: AppState) => state.user);
  const isAuthor = loginUserId === authorId;

  const onDelete = async () => {
    await deleteComment({ id: commentId });
    setCommentsUpdated(true);
  };

  const onEdit = async () => {
    const edittedComment = prompt('Edit your comment.', content);
    if (edittedComment) {
      await updateComment({
        id: commentId,
        updatePayload: {
          comment_id: commentId,
          content: edittedComment,
          author_id: authorId,
          post_id: postId,
          created_at: createdAt,
        },
      });
      setCommentsUpdated(true);
    }
  };

  return (
    <div id="comments-list-item">
      <div id="author-name">{authorName}</div>
      <div id="content">{content}</div>
      {isAuthor && (
        <div id="for-author-button">
          <button id="edit-comment-button" onClick={onEdit}>
            수정
          </button>
          <button id="delete-comment-button" onClick={onDelete}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsListItem;
