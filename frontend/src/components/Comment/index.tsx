import React from 'react';
import { useSelector } from 'react-redux';
import { deleteComment, updateComment } from '../../backend/api/api';
import { AppState } from '../../store/store';

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
  const { user } = useSelector((state: AppState) => state.user);
  const isAuthor = user?.userId === authorId;

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
      <div>--------------------------</div>
      <div>{authorName}</div>
      <div>{content}</div>
      {isAuthor && (
        <div>
          <button id="edit-comment-button" onClick={onEdit}>
            Edit Comment
          </button>
          <button id="delete-comment-button" onClick={onDelete}>
            Delete Comment
          </button>
        </div>
      )}
      <div>--------------------------</div>
    </div>
  );
};

export default CommentsListItem;
