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
  setCommentsUpdated: (updated: boolean) => any;
}

const CommentsListItem: React.FunctionComponent<Props> = ({
  commentId,
  content,
  authorId,
  authorName,
  setCommentsUpdated,
}) => {
  const { loginUserId } = useSelector((state: AppState) => state.user);
  const isAuthor = loginUserId === authorId;

  const onDelete = async () => {
    await deleteComment({ id: commentId });
    setCommentsUpdated(true);
  };

  const onEdit = async () => {
    const edittedComment = prompt('댓글 내용을 수정합니다.', content);
    if (edittedComment) {
      await updateComment({
        id: commentId,
        updatePayload: {
          content: edittedComment,
        },
      });
      setCommentsUpdated(true);
    }
  };

  return (
    <div id="comments-list-item">
      <div id="comment-item-header">
        <span id="author-name">{authorName}</span>
        <span id="content">{content}</span>
      </div>
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
