/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { UpdatePostDTO, PostEntity } from '../../backend/entity/post';
import { AppState } from '../../store/store';
import { readPost, updatePost } from '../../backend/api/api';
import whiteExercise from '../../assets/image/icon/white-exercise.svg';
import whiteLevel from '../../assets/image/icon/white-level.svg';
import participateIcon from '../../assets/image/icon/participate.svg';
import { changeDateFormat } from '../../utils/dateToString';
import './index.scss';

const mockPost = {
  postId: 1,
  hostId: 1,
  hostName: 'gdori',
  exerciseName: '축구',
  expectedLevel: '상',
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
};

const PostEdit: React.FC = () => {
  const history = useHistory();
  const postId: number = Number(useParams<{ id: string }>().id);

  const [post, setPost] = useState<PostEntity>(mockPost);
  const [postUpdate, setPostUpdate] = useState<UpdatePostDTO>();

  const { loginUserId } = useSelector((state: AppState) => state.user);

  const fetchPostItem = async () => {
    const fetchedPost: PostEntity = (await readPost({ id: postId })).entity;
    setPost(fetchedPost);
  };

  useEffect(() => {
    fetchPostItem();
  }, []);

  useEffect(() => {
    if (loginUserId === null) history.push('/signin');
  }, [loginUserId]);

  useEffect(() => {
    if (post && loginUserId !== post.hostId) {
      alert('모임을 수정할 권한이 없습니다.');
      history.push('/main');
    }
    setPostUpdate({ title: post?.title, description: post?.description });
  }, [post]);

  const onClickCancelEdit = () => {
    if (
      post?.title !== postUpdate?.title ||
      post?.description !== postUpdate?.description
    ) {
      const cancelConfirm = confirm(
        '수정 사항이 있습니다. 정말 취소하시겠습니까?',
      );
      if (cancelConfirm) history.goBack();
    } else {
      history.goBack();
    }
  };

  const verifyForm = () => {
    if (postUpdate) {
      if (postUpdate.title === '') {
        alert('제목을 입력해주세요.');
        return false;
      }
      if (postUpdate.description === '') {
        alert('설명을 입력해주세요.');
        return false;
      }
    }
    return true;
  };

  const onClickSubmitEdit = () => {
    if (verifyForm()) {
      const payload: UpdatePostDTO = {};
      if (post && postUpdate) {
        if (post.title !== postUpdate.title) {
          payload.title = postUpdate.title;
        }
        if (post.description !== postUpdate.description) {
          payload.description = postUpdate.description;
        }
      }
      updatePost({ id: postId, updatePayload: payload }).then(() => {
        history.push(`/post/${postId}`);
      });
    }
  };

  if (post === undefined) return null;
  return (
    <div id="post-edit-container">
      <form id="post-edit-content">
        <div id="header">
          <h1>모임 정보 수정하기</h1>
          <span id="post-description">
            모임글의 제목과 설명을 수정할 수 있어요
          </span>
          <div id="select-container">
            <img src={whiteExercise} alt="exercise icon" />
            <span id="exercise-info">{post.exerciseName}</span>
            <img src={whiteLevel} alt="level icon" />
            <span id="level-info">{post.expectedLevel}</span>
          </div>
        </div>
        <div id="post-body">
          <div className="left">
            <div id="date" className="box">
              <span>날짜</span>
              <span id="date-content">{changeDateFormat(post.meetAt)}</span>
            </div>
            <div className="capacity box">
              <span>인원</span>
              <div className="capacity-content">
                <span className="capacity-label">최소</span>
                <span>{post.minCapacity}명</span>
              </div>
              <div className="capacity-content">
                <span className="capacity-label">최대</span>
                <span>{post.maxCapacity}명</span>
              </div>
            </div>
          </div>
          <div className="right">
            <div className="title shadow box">
              <span>제목</span>
              <input
                id="title-input"
                placeholder="제목을 입력해주세요"
                value={(postUpdate && postUpdate.title) || ''}
                onChange={(e) =>
                  setPostUpdate({ ...postUpdate, title: e.target.value })
                }
              />
            </div>
            <div className="introduction shadow box">
              <span>설명</span>
              <input
                id="introduction-input"
                placeholder="운동 모임에 대한 설명을 입력해주세요"
                value={(postUpdate && postUpdate.description) || ''}
                onChange={(e) =>
                  setPostUpdate({ ...postUpdate, description: e.target.value })
                }
              />
            </div>
            <div className="shadow box">
              <span>카카오톡 오픈채팅</span>
              <span id="kakaotalk-link-content">{post.kakaotalkLink}</span>
            </div>
          </div>
        </div>
        <div id="edit-button-container">
          <button
            id="edit-cancel-button"
            type="button"
            onClick={onClickCancelEdit}
          >
            취소하기
          </button>
          <button
            id="edit-submit-button"
            type="button"
            onClick={onClickSubmitEdit}
          >
            <img src={participateIcon} alt="participate" />
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostEdit;
