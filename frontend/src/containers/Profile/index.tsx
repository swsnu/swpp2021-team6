/* eslint-disable react/jsx-wrap-multilines */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Tabs, Card, Descriptions, Badge } from 'antd';
import mockProfile from '../../mocks/profile.json';
import mockAppointments from '../../mocks/appointments.json';

const MyAppointment = ({
  appointment: { id, title, place, meet_at, status, ...rest },
}: any) => (
  <Card
    size="small"
    title={title}
    extra={
      <Link key={id} to={`/post/${id}`}>
        자세히
      </Link>
    }
    style={{ margin: 10, height: 160, width: 250 }}
  >
    <p>{meet_at}</p>
    <p>{place}</p>
    {status === '참가중' ? (
      <div
        style={{
          paddingBottom: 10,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Badge status="processing" text="참가중" />
      </div>
    ) : (
      <div
        style={{
          paddingBottom: 10,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Badge status="warning" text="승인 대기중" />
      </div>
    )}
  </Card>
);

const HostingAppointment = ({
  appointment: { id, title, place, meet_at, status, ...rest },
}: any) => (
  <Card
    size="small"
    title={title}
    extra={
      <Link key={id} to={`/post/${id}`}>
        자세히
      </Link>
    }
    style={{ margin: 10, height: 160, width: 250 }}
  >
    <p>{meet_at}</p>
    <p>{place}</p>
    {status === '모집중' ? (
      <div
        style={{
          paddingBottom: 10,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Badge status="warning" text="모집중" />
      </div>
    ) : (
      <div
        style={{
          paddingBottom: 10,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Badge status="processing" text="모집 완료" />
      </div>
    )}
  </Card>
);

const Profile = () => {
  const [profile, setProfile] = useState(mockProfile);
  useEffect(() => {
    // dispatch
    // dispatch result -> setPosts
  }, []);

  const currentUser = {
    id: 1,
  };

  const isLoggedInUser = mockProfile.user_id === currentUser.id;

  const { TabPane } = Tabs;

  return (
    <div style={{ width: '50%', margin: 'auto' }}>
      <br />
      <br />
      <br />
      <Descriptions
        title={isLoggedInUser ? '내 프로필' : '프로필 정보'}
        bordered
      >
        <Descriptions.Item label="닉네임" span={3}>
          {mockProfile.nickname}
        </Descriptions.Item>
        <Descriptions.Item label="성별" span={1}>
          {mockProfile.gender}
        </Descriptions.Item>
        <Descriptions.Item label="인증한 동네" span={2}>
          {mockProfile.gu} {mockProfile.dong}
        </Descriptions.Item>
        <Descriptions.Item label="소개" span={3}>
          {mockProfile.introduction}
        </Descriptions.Item>
      </Descriptions>
      <br />
      <Descriptions title="좋아하는 운동" bordered>
        {mockProfile.user_exercise.map((preferredExercise) => (
          <Descriptions.Item label={preferredExercise.exercise} span={3}>
            {preferredExercise.skill_level}
          </Descriptions.Item>
        ))}
      </Descriptions>
      {isLoggedInUser === true && (
        <div
          className="button-section"
          style={{ display: 'flex', justifyContent: 'right' }}
        >
          <Link to="/signin">
            <button
              className="signout-button"
              style={{
                marginTop: 10,
                marginRight: 5,
                paddingLeft: 3,
                paddingRight: 3,
              }}
            >
              로그아웃
            </button>
          </Link>
          <Link to="/profile/edit">
            <button
              className="edit-profile-button"
              style={{
                marginTop: 10,
                marginRight: 5,
                paddingLeft: 3,
                paddingRight: 3,
              }}
            >
              프로필 수정
            </button>
          </Link>
        </div>
      )}
      {isLoggedInUser === true && (
        <Tabs defaultActiveKey="1">
          <TabPane tab="참가 신청한 모임" key="1">
            <div>
              {mockAppointments.participating_post.map((appointment: any) => (
                <MyAppointment appointment={appointment} />
              ))}
            </div>
          </TabPane>
          <TabPane tab="내가 만든 모임" key="2">
            <div>
              {mockAppointments.hosting_post.map((appointment: any) => (
                <HostingAppointment appointment={appointment} />
              ))}
            </div>
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default Profile;
