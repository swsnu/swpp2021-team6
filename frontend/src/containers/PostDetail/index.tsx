/* eslint-disable no-confusing-arrow */
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
  createKeywords,
  deletePost,
  queryComments,
  readPost,
} from '../../backend/api/api';
import CommentsListItem from '../../components/Comment';
import { CommentEntity, CommentDTO } from '../../backend/entity/comment';
import background from '../../assets/image/post-detail/background.svg';
import pencil from '../../assets/image/post-detail/comment.svg';

const PostDetailContainer: React.FC = () => {
  const history = useHistory();
  const postId: number = Number(useParams<{ id: string }>().id);
  const [postItem, setPost] = useState<PostEntity | undefined>({
    postId: 1,
    hostId: 1,
    hostName: 'gdori',
    exerciseName: '배드민턴',
    expectedLevel: '상관 없음',
    title: '용산구에서 같이 축구하실 분~',
    description: '가볍게 축구하실 분 구해요',
    meetAt: '2021-11-11 19:00',
    minCapacity: 5,
    maxCapacity: 10,
    memberCount: 3,
    place: {
      name: '용산공업고등학교',
      latitude: 37.524298,
      longitude: 126.967529,
      gu: '용산구',
      dong: '용산동',
      address: '서울특별시 용산구 한강로3가',
      telephone: '02-2648-1264',
    },
    participants: [],
    kakaotalkLink: 'https://open.kakao.com/o/stl6nIeb',
    status: '모집 중',
    keywords: ['뒤풀이', 'MBTI E', '이번 주말'],
  });
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [commentItems, setCommentItems] = useState<CommentEntity[]>([
    {
      commentId: 1,
      authorName: 'gdori',
      authorId: 1,
      postId: 1,
      content: 'comment',
      createdAt: '7초 전',
    },
    {
      commentId: 1,
      authorName: 'gdori',
      authorId: 1,
      postId: 1,
      content: 'comment',
      createdAt: '7초 전',
    },
  ]);
  const [newComment, setNewComment] = useState<string>('');
  const [commentsUpdated, setCommentsUpdated] = useState<boolean>(false);
  const [keywordsUpdated, setKeywordsUpdated] = useState<boolean>(false);
  const [isParticipant, setIsParticipant] = useState<boolean>(false);
  const [applyStatus, setApplyStatus] = useState<StatusType | null>(null);

  const loginUserId = Number(localStorage.getItem('loginUser'));

  const onCommentConfirm = async (comment: string | null) => {
    if (loginUserId && comment) {
      const payload: CommentDTO = {
        content: comment,
      };
      await createComment({
        createPayload: payload,
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
    setPost(post);
  };

  const fetchComments = async () => {
    const comments: CommentEntity[] = (await queryComments({ postId })).items;
    setCommentItems(comments);
  };

  const onClickParticipate = async () => {
    try {
      await createApply(postId);

      alert('참가 신청이 완료되었습니다.');
      setIsParticipant(true);
      setApplyStatus(ApplyStatus.PENDING);
    } catch {
      alert('참가 신청 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (postItem?.keywords[0] === '자동 태그 생성 중입니다...') {
      createKeywords(postId).then((res) =>
        setPost((prev) => (prev ? { ...prev, ...res } : undefined)),
      );
      setKeywordsUpdated(true);
    }
  }, [postItem?.keywords]);

  useEffect(() => {
    if (keywordsUpdated) {
      fetchPostItem();
      setKeywordsUpdated(false);
    }
  }, [keywordsUpdated]);

  // Redirect to sign-in page if not signed in
  useEffect(() => {
    if (!loginUserId) history.push('/signin');
  }, [loginUserId]);

  useEffect(() => {
    fetchPostItem();
    fetchComments();
  }, [postId]);

  useEffect(() => {
    if (commentsUpdated) {
      fetchComments();
      setCommentsUpdated(false);
    }
  }, [commentsUpdated]);

  useEffect(() => {
    if (postItem && loginUserId) {
      // 참가 신청자 목록을 보여줌
      setParticipants(
        postItem.participants.filter(
          (participant) => participant.status !== 'DECLINED',
        ),
      );
      const found = postItem.participants.find((c) => c.userId === loginUserId);
      if (found) {
        setIsParticipant(true);
        if (found.status === 'PENDING') setApplyStatus(ApplyStatus.PENDING);
        if (found.status === 'ACCEPTED') setApplyStatus(ApplyStatus.ACCEPTED);
        if (found.status === 'DECLINED') setApplyStatus(ApplyStatus.DECLINED);
      }
    }
  }, [postItem]);

  // Render Component
  if (postItem === undefined) return null;
  return (
    <div
      className="background"
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
          {commentItems !== undefined &&
            commentItems.map((c: any, i: any) => (
              <CommentsListItem
                commentId={c.commentId}
                content={c.content}
                authorId={c.authorId}
                authorName={c.authorName}
                setCommentsUpdated={setCommentsUpdated}
                key={i}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetailContainer;
