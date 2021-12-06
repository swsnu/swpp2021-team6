import React, { useEffect } from 'react';
import { Avatar, Card, Divider, Button, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { userInfo } from 'os';
import { getKakaoMapWithMarker } from '../../utils/getKakaoMap';
import Label from '../Label';
import { PostEntity } from '../../backend/entity/post';
import changeDateFormat from '../../utils/dateToString';
import './index.scss';
import gps from '../../assets/image/post-detail/gps.svg';

type PostItem = PostEntity & { hostName: string };

interface Props {
  post: PostItem;
  isHost: boolean | undefined;
  onDelete: () => Promise<void>;
}

const Detail: React.FC<Props> = ({ post, isHost = false, onDelete }) => {
  useEffect(() => {
    const container = document.getElementById('map');
    getKakaoMapWithMarker(container, post.place.latitude, post.place.longitude);
  }, []);

  const meetAtText = changeDateFormat(post.meetAt);
  const button = isHost ? (
    <>
      <Button>수정</Button>
      <Button onClick={onDelete}>삭제</Button>
    </>
  ) : (
    <></>
  );

  const button2 = isHost ? (
    <span>참여자 명단 확인</span>
  ) : (
    <span>참여하기</span>
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
            {/* post status에 맞게 color 수정 */}
            <Label color="rgba(36, 113, 0, 0.49)">{post.status}</Label>
            <Label color="rgba(36, 113, 0, 0.49)">
              현재 {post.memberCount}명
            </Label>
          </div>

          <div id="right">
            <div id="header"> Information </div>
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
            <div id="participation">
              <button>{button2}</button>
            </div>
          </div>
        </div>
        <div id="body-2">
          <div id="profile">
            <Link to={`/profile/${post.hostId}`}>
              <Avatar size="small" icon={<UserOutlined />} />
            </Link>
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
              <p id="content">{post.place.address}</p>
            </div>
            <div id="telephone">
              <p id="title">전화번호</p>
              <p id="content">{post.place.telephone}</p>
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
      <Divider />
    </>
  );
};

export default Detail;
