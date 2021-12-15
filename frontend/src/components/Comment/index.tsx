/* eslint-disable jsx-a11y/no-autofocus */
import React, { useState } from 'react';
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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [edittedComment, setEdittedComment] = useState<string>(content);
  const { loginUserId } = useSelector((state: AppState) => state.user);
  const isAuthor = loginUserId === authorId;

  const onDelete = async () => {
    await deleteComment({ id: commentId });
    setCommentsUpdated(true);
  };

  const onEditDone = async () => {
    await updateComment({
      id: commentId,
      updatePayload: {
        content: edittedComment,
      },
    });
    setCommentsUpdated(true);
    setIsEditing(false);
  };

  return (
    <div id="comments-list-item">
      <div id="comment-item-header">
        <span id="author-name">{authorName}</span>
        {!isEditing && <span id="content">{content}</span>}
        {isEditing && (
          <input
            id="content-edit-input"
            value={edittedComment}
            onChange={(e) => setEdittedComment(e.target.value)}
            autoFocus
          />
        )}
      </div>
      {isEditing && (
        <button id="edit-done-button" onClick={onEditDone}>
          확인
        </button>
      )}
      {isAuthor && !isEditing && (
        <div id="for-author-button">
          <button id="edit-comment-button" onClick={() => setIsEditing(true)}>
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
