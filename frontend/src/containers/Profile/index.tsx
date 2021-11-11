/* eslint-disable react/jsx-wrap-multilines */
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Tabs, Card, Descriptions, Badge } from 'antd';
import { AppState } from '../../store/store';
import { getUserInfo } from '../../store/actions/index';
import userInfo from '../../mocks/userInfo.json';

const MyAppointment = ({
  appointment: { post_id, title, place_name, meet_at, status, ...rest },
}: any) => (
  <Card
    size="small"
    title={title}
    extra={
      <Link key={post_id} to={`/post/${post_id}`}>
        자세히
      </Link>
    }
    style={{ margin: 10, height: 160, width: 250 }}
  >
    <p>{meet_at}</p>
    <p>{place_name}</p>
    {status === '참가 중' ? (
      <div
        style={{
          paddingBottom: 10,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Badge status="processing" text="참가 중" />
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
        <Badge status="warning" text="승인 대기 중" />
      </div>
    )}
  </Card>
);

const HostingAppointment = ({
  appointment: { post_id, title, place_name, meet_at, status, ...rest },
}: any) => (
  <Card
    size="small"
    title={title}
    extra={
      <Link key={post_id} to={`/post/${post_id}`}>
        자세히
      </Link>
    }
    style={{ margin: 10, height: 160, width: 250 }}
  >
    <p>{meet_at}</p>
    <p>{place_name}</p>
    {status === '모집 중' ? (
      <div
        style={{
          paddingBottom: 10,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'right',
        }}
      >
        <Badge status="warning" text="모집 중" />
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
  // const userInfo = useSelector((state: AppState) => state.user.userInfo);
  const dispatch = useDispatch();
  const currentUser = useSelector((state: AppState) => state.user?.user);
  // const userInfo = currentUser;
  // const userId = match.params.id === null ? currentUser.id : match.params.id;

  // useEffect(() => {
  //   console.log(window.localStorage.getItem('userInfo'));
  //   dispatch(getUserInfo(currentUser.id));
  // }, []);

  // const isLoggedInUser = currentUser.id === userInfo.user_id;

  const isLoggedInUser = true;

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
          {userInfo.nickname}
        </Descriptions.Item>
        <Descriptions.Item label="성별" span={1}>
          {userInfo.gender}
        </Descriptions.Item>
        <Descriptions.Item label="인증한 동네" span={2}>
          {userInfo.gu} {userInfo.dong}
        </Descriptions.Item>
        <Descriptions.Item label="소개" span={3}>
          {userInfo.introduction}
        </Descriptions.Item>
      </Descriptions>
      <br />
      <Descriptions title="좋아하는 운동" bordered>
        {userInfo.user_exercise.map((preferredExercise: any) => (
          <Descriptions.Item label={preferredExercise.exercise_name} span={3}>
            {preferredExercise.skill_level}
          </Descriptions.Item>
        ))}
      </Descriptions>
      {isLoggedInUser === true && (
        <div
          className="button-section"
          style={{ display: 'flex', justifyContent: 'right' }}
        >
          <Link to="/signout">
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
              {userInfo.participating_post.map((appointment: any) => (
                <MyAppointment appointment={appointment} />
              ))}
            </div>
          </TabPane>
          <TabPane tab="내가 만든 모임" key="2">
            <div>
              {userInfo.hosting_post.map((appointment: any) => (
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
