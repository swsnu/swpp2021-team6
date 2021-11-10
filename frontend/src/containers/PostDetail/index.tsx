import { Avatar, Card, Divider, Button, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mockPost from '../../mocks/post.json';
import changeDateFormat from '../../utils/dateToString';
import { kakao } from '../../App';
import Label from '../../components/Label';

const { Search } = Input;

/* TODO
mockPost interface 만들기
*/

const PostDetail = ({
  title,
  description,
  host_id,
  status,
  latitude,
  longitude,
  ...rest
}: any) => {
  const [name, setName] = useState('');
  const statusText = mockPost.status ? '모집 중' : '모집 완료';
  const meetAtText = changeDateFormat(mockPost.meet_at);
  const lat = mockPost.latitude;
  const lng = mockPost.longitude;

  const loginUserId = 1;

  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(lat, lng),
      level: 3,
    };
    const map = new kakao.maps.Map(container, options);

    const marker = new kakao.maps.Marker({
      map,
      position: new kakao.maps.LatLng(lat, lng),
    });
  }, []);

  let button;
  if (Number(mockPost.host_id) !== loginUserId) {
    button = <Button>참가 신청하기</Button>;
  } else if (!Number(mockPost.member_count)) {
    // 멤버가 없으면 수정 가능
    button = (
      <>
        <Button>수정하기</Button>
        <Button>삭제하기</Button>
      </>
    );
  } else {
    button = <Button disabled>수정하기</Button>;
  }

  return (
    <div>
      <h1>Post Detail Page</h1>
      <Card>
        <Link to={`/profile/${mockPost.host_id}`}>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>TODO: host name with host id</span>
        </Link>
      </Card>
      <h2>{mockPost.title}</h2>
      <p>{mockPost.description}</p>
      <Label color={mockPost.status ? 'green' : 'pink'}>{statusText}</Label>
      <Label color="yellow">현재 {mockPost.member_count}명</Label>
      <Card>
        <p>종목 : {mockPost.exercise_type}</p>
        <p>기대 실력 : {mockPost.expected_level}</p>
        <p>
          모집 인원 : 최소 {mockPost.min_capacity}명 ~ 최대{' '}
          {mockPost.max_capacity}명
        </p>
        <p>날짜 및 시간 : {meetAtText}</p>
      </Card>
      <div className="map-container" style={{ display: 'flex' }}>
        <div id="map" style={{ width: '500px', height: '350px' }} />
        <div>
          <p>{mockPost.place_name}</p>
          <p>{mockPost.address}</p>
          <p>{mockPost.phone_number}</p>
        </div>
      </div>
      <div className="kakaotalk-link">
        <span>카카오톡 참가 링크 : </span>
        <a href={mockPost.kakaotalk_link} target="_blank" rel="noreferrer">
          {mockPost.kakaotalk_link}
        </a>
      </div>
      {button}
      <Divider />
      <Search placeholder="댓글을 입력하세요" enterButton="작성" size="large" />
    </div>
  );
};

export default PostDetail;
