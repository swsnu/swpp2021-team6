/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-restricted-globals */
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { getKakaoMapWithMarker } from '../../utils/getKakaoMap';
import Label from '../Label';
import {
  PostEntity,
  StatusType,
  ParticipantType,
  UpdateKeywordDTO,
} from '../../backend/entity/post';
import { changeDateFormat } from '../../utils/dateToString';
import './index.scss';
import gps from '../../assets/image/post-detail/gps.svg';
import userIcon from '../../assets/image/post-detail/user-icon.svg';
import StatusLabel from '../StatusLabel';
import deleteIcon from '../../assets/image/icon/exercise-delete-button.svg';
import {
  acceptApply,
  declineApply,
  updateKeywords,
} from '../../backend/api/api';

interface Props {
  post: PostEntity;
  isHost: boolean | undefined;
  isParticipant: boolean;
  applyStatus: StatusType | null;
  onDelete: () => Promise<void>;
  onParticipate: () => void;
  participants: ParticipantType[];
  setParticipants: Dispatch<SetStateAction<ParticipantType[]>>;
  setPost: Dispatch<SetStateAction<PostEntity | undefined>>;
}

const Detail: React.FC<Props> = ({
  post,
  isHost = false,
  isParticipant = false,
  applyStatus = null,
  onDelete,
  onParticipate,
  participants,
  setParticipants,
  setPost,
}) => {
  const history = useHistory();
  const postId: number = Number(useParams<{ id: string }>().id);
  const [toggleOpen, setToggleOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newKeywords, setNewKeywords] = useState<string[]>([]);

  useEffect(() => {
    setNewKeywords([...post.keywords]);
  }, [post]);

  useEffect(() => {
    const container = document.getElementById('map');
    getKakaoMapWithMarker(container, post.place.latitude, post.place.longitude);
  }, []);

  const acceptParticipant = async (participant: ParticipantType) => {
    const response = confirm(
      `'${participant.userName}'님의 참가 신청을 수락하시겠습니까?`,
    );
    if (response) {
      const status = await acceptApply(postId, participant.userId);
      if (status === 204) {
        alert('참가 신청을 수락했습니다.');
        const others = participants.filter(
          (v) => v.userId !== participant.userId,
        );
        setParticipants([...others, { ...participant, status: 'ACCEPTED' }]);
        setPost({
          ...post,
          memberCount: post.memberCount + 1,
          participants: [...others, { ...participant, status: 'ACCEPTED' }],
        });
      }
    }
  };

  const declineParticipant = async (participant: ParticipantType) => {
    const response = confirm(
      `'${participant.userName}'님의 참가 신청을 거절하시겠습니까?`,
    );
    if (response) {
      const status = await declineApply(postId, participant.userId);
      if (status === 204) {
        alert('참가 신청을 거절했습니다.');
        const others = participants.filter(
          (v) => v.userId !== participant.userId,
        );
        setParticipants([...others]);
      }
    }
  };

  const participantStatus = (participant: ParticipantType) => {
    if (participant.status === 'PENDING') {
      return (
        <button
          id="pending-button"
          onClick={() => acceptParticipant(participant)}
        >
          미승인
        </button>
      );
    }
    if (participant.status === 'ACCEPTED') {
      return <button id="accepted-span">승인</button>;
    }
    return null;
  };

  const meetAtText = changeDateFormat(post.meetAt);
  const button = isHost ? (
    <>
      <Button
        id="post-edit-button"
        onClick={() => history.push(`/post/${postId}/edit`)}
      >
        수정
      </Button>
      <Button id="post-delete-button" onClick={onDelete}>
        삭제
      </Button>
    </>
  ) : (
    <></>
  );

  const onClickToggleOpen = () => {
    if (participants.length === 0) alert('참가자가 없습니다.');
    else setToggleOpen(!toggleOpen);
  };

  const onClickEditMode = async () => {
    if (editMode) {
      try {
        const payload = {
          keyword1: newKeywords[0] || null,
          keyword2: newKeywords[1] || null,
          keyword3: newKeywords[2] || null,
        };
        console.log(payload);
        await updateKeywords({ postId, updatePayload: payload });
        setPost({ ...post, keywords: newKeywords });
      } catch {
        alert('키워드 업데이트 중 문제가 발생했습니다.');
      }
    }
    setEditMode(!editMode);
  };

  const button2 = isHost ? (
    <button id="participant-toggle-button" onClick={onClickToggleOpen}>
      <span>참여자 명단 확인</span>
    </button>
  ) : (
    <button
      id="participate-button"
      className={isParticipant ? 'disabled' : undefined}
      onClick={onParticipate}
      disabled={isParticipant}
    >
      <span>참여하기</span>
    </button>
  );

  const onChangeKeywords = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tmp = [...newKeywords];
    console.log(e);
    tmp[Number(e.target.name)] = e.target.value;
    setNewKeywords(tmp);
  };

  const keywordContainer = editMode ? (
    <>
      {newKeywords.map((keyword, idx) => (
        <input
          name={`${idx}`}
          onChange={(e) => onChangeKeywords(e)}
          key={idx}
          className="keyword"
          value={keyword}
          placeholder="태그 추가"
        />
      ))}
    </>
  ) : (
    <>
      {post.keywords[0] === '자동 태그 생성 중입니다...' ? (
        <span key={0} className="keyword">
          #자동 태그 생성 중입니다...
        </span>
      ) : (
        <>
          {post.keywords.map((keyword, idx) => (
            <span key={idx} className="keyword">
              #{keyword || '태그 추가'}
            </span>
          ))}
        </>
      )}
    </>
  );

  const editKeywordButton = isHost ? (
    <button id="edit-keyword-button" onClick={onClickEditMode}>
      {editMode ? '확인' : '수정'}
    </button>
  ) : (
    <></>
  );

  return (
    <>
      <div id="post-detail-component">
        <div id="header">
          <div>
            <img src={gps} alt="gps" />
            {`${post.place.gu} ${post.place.dong}`}
          </div>
          <div id="edit-delete">{button}</div>
        </div>
        <div id="body-1">
          <div id="left">
            <h1>{post.title}</h1>
            <p>{post.description}</p>
            <div>
              <Label font="white" color="rgba(36, 113, 0, 0.49)">
                {post.status}
              </Label>
              <Label font="white" color="rgba(36, 113, 0, 0.49)">
                현재 {post.memberCount}명
              </Label>
            </div>
            <div id="keyword-container">
              {keywordContainer}
              {editKeywordButton}
            </div>
          </div>

          <div id="right">
            <div id="header">
              <span>Information</span>
              <StatusLabel status={applyStatus} />
            </div>
            <div id="card">
              <p id="title">종목</p>
              <p id="title">기대 실력</p>
              <p id="content"> {post.exerciseName} </p>
              <p id="content">{post.expectedLevel}</p>
              <p id="title">모집 인원</p>
              <p id="title">날짜 및 시간</p>
              <p id="content">
                최소 {post.minCapacity}명 ~ 최대 {post.maxCapacity}명
              </p>
              <p id="content">{meetAtText}</p>
            </div>
            <div>{button2}</div>
            <div
              id="participants-container"
              className={toggleOpen ? undefined : 'invisible'}
            >
              {participants.map((participant) => (
                <div className="participant-content" key={participant.userId}>
                  <span
                    id="participant-nickname"
                    onClick={() =>
                      history.push(`/profile/${participant.userId}`)
                    }
                  >
                    {participant.userName}
                  </span>
                  <div className="participant-button-container">
                    {participantStatus(participant)}
                    <button
                      id="participant-delete-button"
                      onClick={() => declineParticipant(participant)}
                    >
                      <img src={deleteIcon} alt="delete" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div id="body-2">
          <div id="profile">
            <button onClick={() => history.push(`/profile/${post.hostId}`)}>
              <img src={userIcon} alt="userIcon" />
            </button>
          </div>
          <div id="user-openkakao">
            <div id="user">
              <div id="title">모임장</div>
              <div id="content">{post.hostName}</div>
            </div>
            <div id="openkakao">
              <div id="title">채팅</div>
              <div id="content">
                <span>오픈채팅방</span>
                <a href={post.kakaotalkLink} target="_blank" rel="noreferrer">
                  {post.kakaotalkLink}
                </a>
              </div>
            </div>
          </div>
          <div id="place-info">
            <div id="name">
              <p id="title">위치</p>
              <p id="content">{post.place.name}</p>
            </div>
            <div id="address">
              <p id="title">도로명 주소</p>
              <p id="content">{post.place.address || '-'}</p>
            </div>
            <div id="telephone">
              <p id="title">전화번호</p>
              <p id="content">{post.place.telephone || '-'}</p>
            </div>
          </div>
          <div
            id="map-container"
            className="map-container"
            style={{ display: 'flex', padding: '40px' }}
          >
            <div
              id="map"
              style={{ width: '300px', height: '300px', borderRadius: '20px' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Detail;
