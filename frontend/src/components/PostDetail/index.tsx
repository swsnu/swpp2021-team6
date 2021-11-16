import React, { useEffect } from 'react';
import { Avatar, Card, Divider, Button, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { kakao } from '../../App';
import Label from '../Label';
import { PostEntity } from '../../types/post';
import changeDateFormat from '../../utils/dateToString';

const { Search } = Input;

interface Props {
  post: PostEntity;
  isHost: boolean | undefined;
}

const Detail: React.FC<Props> = ({ post, isHost = false }) => {
  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(post.place.latitude, post.place.longitude),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    const marker = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(
        post.place.latitude,
        post.place.longitude,
      ),
    });
  }, []);

  const meetAtText = changeDateFormat(post.meetAt);
  const button = isHost ? (
    <>
      <Button>수정하기</Button>
      <Button>삭제하기</Button>
    </>
  ) : (
    <Button>참가 신청하기</Button>
  );

  return (
    <div>
      <h1>Post Detail Page</h1>
      <Card>
        <Link to={`/profile/${post.hostId}`}>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>TODO: host name with host id</span>
        </Link>
      </Card>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      {/* post status에 맞게 color 수정 */}
      <Label color="pink">{post.status}</Label>
      <Label color="yellow">현재 {post.memberCount}명</Label>
      <Card>
        <p>종목 : {post.exerciseName}</p>
        <p>기대 실력 : {post.expectedLevel}</p>
        <p>
          모집 인원 : 최소 {post.minCapacity}명 ~ 최대 {post.maxCapacity}명
        </p>
        <p>날짜 및 시간 : {meetAtText}</p>
      </Card>
      <div className="map-container" style={{ display: 'flex' }}>
        <div id="map" style={{ width: '500px', height: '350px' }} />
        <div>
          <p>{post.place.name}</p>
          <p>{post.place.address}</p>
          <p>{post.place.telephone}</p>
        </div>
      </div>
      <div className="kakaotalk-link">
        <span>오픈채팅방 링크 : </span>
        <a href={post.kakaotalkLink} target="_blank" rel="noreferrer">
          {post.kakaotalkLink}
        </a>
      </div>
      {button}
      <Divider />
      <Search placeholder="댓글을 입력하세요" enterButton="작성" size="large" />
    </div>
  );
};

export default Detail;
