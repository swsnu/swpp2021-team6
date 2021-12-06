/* eslint-disable react/jsx-wrap-multilines */
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { History } from 'history';
import { useParams } from 'react-router';
import 'antd/dist/antd.css';
import { Tabs, Card, Descriptions, Badge } from 'antd';
import { AppState } from '../../store/store';
import { getUserInfo } from '../../store/actions/index';
// import userState.userInfo from '../../mocks/userState.userInfo.json';

const returnPostStatus = (status: string) => {
  switch (status) {
    case '참가 중':
      return <Badge status="processing" text="참가 중" />;
    case '승인 대기 중':
      return <Badge status="warning" text="승인 대기 중" />;
    case '거절 됨':
      return <Badge status="default" text="거절 됨" />;
    case '모집 중':
      return <Badge status="warning" text="모집 중" />;
    case '모집 완료':
      return <Badge status="processing" text="모집 완료" />;
    default:
      return <span>dd</span>;
  }
};

const MyAppointment = ({
  history,
  appointment: { postId, title, placeName, meetAt, status, ...rest },
}: any) => (
  <Card
    size="small"
    title={title}
    extra={
      <button onClick={() => history.push(`/post/${postId}`)}>자세히</button>
    }
    style={{ margin: 10, height: 160, width: 250 }}
  >
    <p>{meetAt}</p>
    <p>{placeName}</p>
    <div
      style={{
        paddingBottom: 10,
        marginBottom: 10,
        display: 'flex',
        justifyContent: 'right',
      }}
    >
      {returnPostStatus(status)}
    </div>
  </Card>
);

interface ProfileProps {
  history: History;
}

const Profile = ({ history }: ProfileProps) => {
  const dispatch = useDispatch();
  const userState = useSelector((state: AppState) => state.user);
  const { id }: any = useParams();
  const loginProfile = window.localStorage.getItem('profileInfo');
  let parsedloginProfile: any;
  if (loginProfile !== null) {
    parsedloginProfile = JSON.parse(loginProfile);
  }
  let isLoggedInUser = id === 'my';
  let profileUserId = isLoggedInUser ? parsedloginProfile.userId : id;

  useEffect(() => {
    isLoggedInUser = id === 'my';
    profileUserId = isLoggedInUser ? parsedloginProfile.userId : id;
    dispatch(getUserInfo(profileUserId));
  }, [profileUserId]);

  // const isLoggedInUser = true;

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
          {userState.userInfo?.nickname}
        </Descriptions.Item>
        <Descriptions.Item label="성별" span={1}>
          {userState.userInfo?.gender}
        </Descriptions.Item>
        <Descriptions.Item label="인증한 동네" span={2}>
          {userState.userInfo?.gu} {userState.userInfo?.dong}
        </Descriptions.Item>
        <Descriptions.Item label="소개" span={3}>
          {userState.userInfo?.introduction}
        </Descriptions.Item>
      </Descriptions>
      <br />
      <Descriptions title="좋아하는 운동" bordered>
        {userState.userInfo?.userExercise.map(
          (preferredExercise: any, idx: number) => (
            <Descriptions.Item
              key={idx}
              label={preferredExercise.exerciseName}
              span={3}
            >
              {preferredExercise.skillLevel}
            </Descriptions.Item>
          ),
        )}
      </Descriptions>
      {isLoggedInUser === true && (
        <div
          className="button-section"
          style={{ display: 'flex', justifyContent: 'right' }}
        >
          <button
            className="signout-button"
            onClick={() => history.push('/signout')}
            style={{
              marginTop: 10,
              marginRight: 5,
              paddingLeft: 3,
              paddingRight: 3,
            }}
          >
            로그아웃
          </button>

          <button
            className="edit-profile-button"
            onClick={() => history.push('/profile/edit')}
            style={{
              marginTop: 10,
              marginRight: 5,
              paddingLeft: 3,
              paddingRight: 3,
            }}
          >
            프로필 수정
          </button>
        </div>
      )}
      {isLoggedInUser === true && (
        <Tabs defaultActiveKey="1">
          <TabPane tab="참가 신청한 모임" key="1">
            <div>
              {userState.userInfo?.participatingPost.map((appointment: any) => (
                <MyAppointment
                  key={appointment.postId}
                  history={history}
                  appointment={appointment}
                />
              ))}
            </div>
          </TabPane>
          <TabPane tab="내가 만든 모임" key="2">
            <div>
              {userState.userInfo?.hostingPost.map((appointment: any) => (
                <MyAppointment
                  key={appointment.postId}
                  history={history}
                  appointment={appointment}
                />
              ))}
            </div>
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default Profile;
