import { Avatar, Card, Divider, Button, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { History } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import changeDateFormat from '../../utils/dateToString';
import { kakao } from '../../App';
import Label from '../../components/Label';
import { PostEntity } from '../../types/post';
import mockPost from '../../mocks/post.json';
import * as actionCreators from '../../store/actions';
import { AppState } from '../../store/store';

const { Search } = Input;

/* TODO
post interface 만들기
*/

interface Props {
  history: History;
}

const PostDetail = ({ history }: Props) => {
  const storedPost = useSelector((state: AppState) => state.post.post);
  console.log(storedPost);
  const post = mockPost;
  // const post = storedPost;
  const meetAtText = changeDateFormat(post.meetAt);
  // const lat = post.place.latitude;
  // const lng = post.place.longitude;

  const pathId = history.location.pathname.match(/\d/);
  const postId = pathId ? Number(pathId[0]) : 1;

  // const storedPost = useSelector((state: AppState) => state.post?.post);
  const dispatch = useDispatch();

  console.log(storedPost);

  const loginUserId = 1;

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

  let button;
  if (Number(post.host_id) !== loginUserId) {
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
        <Link to={`/profile/${post.host_id}`}>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>TODO: host name with host id</span>
        </Link>
      </Card>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      {/* post status에 맞게 color 수정 */}
      <Label color="pink">{post.status}</Label>
      <Label color="yellow">현재 {post.member_count}명</Label>
      <Card>
        <p>종목 : {post.exercise_name}</p>
        <p>기대 실력 : {post.expected_level}</p>
        <p>
          모집 인원 : 최소 {post.min_capacity}명 ~ 최대 {post.max_capacity}명
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
        <a href={post.kakaotalk_link} target="_blank" rel="noreferrer">
          {post.kakaotalk_link}
        </a>
      </div>
      {button}
      <Divider />
      <Search placeholder="댓글을 입력하세요" enterButton="작성" size="large" />
    </div>
  );
};

export default PostDetail;
