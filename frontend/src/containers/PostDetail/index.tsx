import { Avatar, Card, Divider, Button, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import changeDateFormat from '../../utils/dateToString';
import { kakao } from '../../App';
import Label from '../../components/Label';
import { PostEntity } from '../../types/post';
import mockPost from '../../mocks/post.json';

const { Search } = Input;

/* TODO
mockPost interface 만들기
*/

const PostDetail = ({
  title,
  description,
  host_id,
  status,
  place,
  ...rest
}: any) => {
  const [post, setPost] = useState<PostEntity>(mockPost);
  const meetAtText = changeDateFormat(mockPost.meet_at);
  const lat = mockPost.place.latitude;
  const lng = mockPost.place.longitude;

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
  } else {
    button = (
      <>
        <Button>수정하기</Button>
        <Button>삭제하기</Button>
      </>
    );
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
      {/* post status에 맞게 color 수정 */}
      <Label color="pink">{mockPost.status}</Label>
      <Label color="yellow">현재 {mockPost.member_count}명</Label>
      <Card>
        <p>종목 : {mockPost.exercise_name}</p>
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
          <p>{mockPost.place.name}</p>
          <p>{mockPost.place.address}</p>
          <p>{mockPost.place.telephone}</p>
        </div>
      </div>
      <div className="kakaotalk-link">
        <span>오픈채팅방 링크 : </span>
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
