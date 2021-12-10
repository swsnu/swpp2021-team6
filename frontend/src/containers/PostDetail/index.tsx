import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import humps from 'humps';
import {
  PostEntity,
  StatusType,
  ApplyStatus,
  ParticipantType,
} from '../../backend/entity/post';
import PostDetail from '../../components/PostDetail';
import { AppState } from '../../store/store';
import './index.scss';
import {
  createApply,
  createComment,
  deletePost,
  queryComments,
  readPost,
  readUserInfo,
} from '../../backend/api/api';
import CommentsListItem from '../../components/Comment';
import {
  CommentEntity,
  CreateCommentEntity,
} from '../../backend/entity/comment';
import background from '../../assets/image/post-detail/background.svg';
import pencil from '../../assets/image/post-detail/comment.svg';

type CommentItem = CommentEntity & { authorName: string };

const PostDetailContainer: React.FC = () => {
  const history = useHistory();
  const postId: number = Number(useParams<{ id: string }>().id);
  const [postItem, setPost] = useState<PostEntity>();
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [commentItems, setCommentItems] = React.useState<CommentItem[]>([]);
  const [newComment, setNewComment] = React.useState<string>('');
  const [commentsUpdated, setCommentsUpdated] = React.useState<boolean>(false);
  const [isParticipant, setIsParticipant] = useState<boolean>(false);
  const [applyStatus, setApplyStatus] = useState<StatusType | null>(null);
  const { loginUserId } = useSelector((state: AppState) => state.user);

  const onCommentConfirm = async (comment: string | null) => {
    if (loginUserId && comment) {
      const payload = {
        authorId: loginUserId,
        content: comment,
        postId,
      };
      await createComment({
        createPayload: humps.decamelizeKeys(payload) as CreateCommentEntity,
        postId,
      });
      setCommentsUpdated(true);
      setNewComment('');
    }
  };

  const onPostDelete = async () => {
    await deletePost({ id: postId });
    history.push('/main');
  };

  const fetchPostItem = async () => {
    const post: PostEntity = (await readPost({ id: postId })).entity;
    setPost({ ...post });
  };

  const fetchComments = async () => {
    const comments: CommentEntity[] = (
      await queryComments({ postId })
    ).items.filter((c) => c.post_id === postId);
    const commentsList: CommentItem[] = (
      await Promise.all(comments.map((c) => readUserInfo({ id: c.author_id })))
    ).map((u, i) => ({
      ...comments[i],
      authorName: u.entity.nickname,
    }));
    setCommentItems(commentsList);
  };

  const onClickParticipate = async () => {
    await createApply(postId).then((status) => {
      if (status === 204) {
        alert('참가 신청이 완료되었습니다.');
        setIsParticipant(true);
        setApplyStatus(ApplyStatus.PENDING);
      } else {
        alert('참가 신청 중 문제가 발생했습니다.');
      }
    });
  };

  // Redirect to sign-in page if not signed in
  useEffect(() => {
    if (loginUserId === null) history.push('/signin');
  }, [loginUserId]);

  useEffect(() => {
    fetchPostItem();
    fetchComments();
  }, []);

  useEffect(() => {
    if (commentsUpdated) {
      fetchComments();
      setCommentsUpdated(false);
    }
  }, [commentsUpdated]);

  useEffect(() => {
    if (postItem && loginUserId) {
      setParticipants(
        postItem.participants.filter(
          (participant) => participant.status !== 'DECLINED',
        ),
      );
    }
  }, [postItem]);

  useEffect(() => {
    if (loginUserId) {
      const found = participants.find(
        (participant) => participant.userId === loginUserId,
      );
      if (found) {
        setIsParticipant(true);
        if (found.status === 'PENDING') setApplyStatus(ApplyStatus.PENDING);
        if (found.status === 'ACCEPTED') setApplyStatus(ApplyStatus.ACCEPTED);
        if (found.status === 'DECLINED') setApplyStatus(ApplyStatus.DECLINED);
      }
    }
  }, [participants]);

  // Render Component
  if (postItem === undefined) return null;
  return (
    <>
      <div
        id="background"
        style={{
          backgroundImage: `url(${background})`,
          backgroundPosition: '0 150px',
          backgroundSize: '100vw',
        }}
      >
        <div id="post-detail-page">
          <PostDetail
            post={postItem}
            isHost={loginUserId === postItem.hostId}
            isParticipant={isParticipant}
            applyStatus={applyStatus}
            onDelete={onPostDelete}
            onParticipate={onClickParticipate}
            participants={participants}
            setParticipants={setParticipants}
            setPost={setPost}
          />
          <div id="post-detail-comment">
            <div id="comment-header">
              <p>코멘트 남기기</p>
              <img src={pencil} alt="pencil" />
            </div>
            <div id="comment-create">
              <input
                id="new-comment-content-input"
                placeholder="댓글을 입력하세요"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                id="confirm-create-comment-button"
                onClick={() => onCommentConfirm(newComment)}
                disabled={!newComment}
              >
                입력
              </button>
            </div>
            {commentItems.map((c, i) => (
              <CommentsListItem
                commentId={c.comment_id}
                content={c.content}
                authorId={c.author_id}
                authorName={c.authorName}
                postId={c.post_id}
                createdAt={c.created_at}
                setCommentsUpdated={setCommentsUpdated}
                key={i}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetailContainer;
