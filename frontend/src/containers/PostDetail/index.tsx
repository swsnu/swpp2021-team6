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

const PostDetail = ({ title, description, host_id, status, ...rest }: any) => {
  const [name, setName] = useState('');
  const statusText = mockPost.status ? '모집 중' : '모집 완료';
  const meetAtText = changeDateFormat(mockPost.meet_at);

  return (
    <div>
      <h1>Post Detail Page</h1>
      <Card>
        <Link to={`/profile/${mockPost.host_id}`}>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>TODO: host name with host id</span>
        </Link>
      </Card>
      <Card>{statusText}</Card>
      <h2>{mockPost.title}</h2>
      <p>{mockPost.description}</p>
      <Card>
        <p>종목 : {mockPost.exercise}</p>
        <p>기대 실력 : {mockPost.expected_level}</p>
        <p>
          모집 인원 : 최소 {mockPost.min_capacity}명 ~ 최대{' '}
          {mockPost.max_capacity}명
        </p>
        <p>날짜 및 시간 : {meetAtText}</p>
      </Card>
    </div>
  );
};

export default PostDetail;
