/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-wrap-multilines */
import { useState, useEffect } from 'react';
import { History } from 'history';
import { useParams } from 'react-router';
import dividerIcon from '../../assets/image/icon/button-divider.svg';
import pfExerciseIcon from '../../assets/image/icon/pfexercise.svg';
import greenDot from '../../assets/image/icon/green-circle.svg';
import badge from '../../assets/image/icon/badge.svg';
import locationIcon from '../../assets/image/icon/location-icon.svg';
import changeMyPostDateFormat from '../../utils/myPostDateFormat';
import './index.scss';
import * as thumbnails from '../../utils/thumbnails';
import { UserInfoEntity } from '../../backend/entity/user';
import { readUserInfo } from '../../backend/api/api';
// import userInfo from '../../mocks/userInfo.json';
import { ApplyStatus } from '../../backend/entity/post';

interface ProfileProps {
  history: History;
}

const Profile = ({ history }: ProfileProps) => {
  const { id }: any = useParams();
  const loginProfile = window.localStorage.getItem('loginUser');
  let parsedloginProfile: any;
  if (loginProfile !== null) {
    parsedloginProfile = JSON.parse(loginProfile);
  }
  const isLoggedInUser = id === 'my';
  let profileUserId = isLoggedInUser ? parsedloginProfile.userId : id;
  profileUserId = isLoggedInUser ? parsedloginProfile.userId : id;

  const [userInfo, setUserInfo] = useState<UserInfoEntity>({
    userId: 0,
    nickname: '',
    latitude: 0,
    longitude: 0,
    gu: '',
    dong: '',
    gender: '미선택',
    introduction: '',
    preferredExercise: [{ exerciseName: '', skillLevel: '상관 없음' }],
    participatingPost: [
      {
        hostName: '',
        postId: 0,
        exerciseName: '',
        title: '',
        meetAt: '',
        placeName: '',
        status: '',
      },
    ],
    hostingPost: [
      {
        hostName: '',
        postId: 0,
        exerciseName: '',
        title: '',
        meetAt: '',
        placeName: '',
        status: '',
      },
    ],
  });

  const fetchUserInfo = async () => {
    const fetchedUserInfo: UserInfoEntity = (
      await readUserInfo({ id: profileUserId })
    ).entity;
    setUserInfo(fetchedUserInfo);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // TODO: PostStatusType 만들기
  const returnPostStatus = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="status-badge complete">{ApplyStatus.ACCEPTED}</span>
        );
      case 'PENDING':
        return (
          <span className="status-badge pending">{ApplyStatus.PENDING}</span>
        );
      case 'DECLINED':
        return (
          <span className="status-badge denied">{ApplyStatus.DECLINED}</span>
        );
      case 'RECRUITING':
        return <span className="status-badge pending">모집 중</span>;
      case 'RECRUITED':
        return <span className="status-badge complete">모집 완료</span>;
      default:
        return null;
    }
  };

  const MyAppointment = ({ appointment }: any) => {
    const getThumbnail = () => {
      const idx = appointment.postId % 4;
      let imgArray = thumbnails.soccer;

      switch (appointment.exerciseName) {
        case '축구':
          imgArray = thumbnails.soccer;
          break;
        case '농구':
          imgArray = thumbnails.basketball;
          break;
        case '배드민턴':
          imgArray = thumbnails.soccer;
          break;
        case '테니스':
          imgArray = thumbnails.soccer;
          break;
        case '탁구':
          imgArray = thumbnails.tabletennis;
          break;
        case '러닝':
          imgArray = thumbnails.running;
          break;
        case '라이딩':
          imgArray = thumbnails.riding;
          break;
        default:
          console.log('Profile: 운동 타입이 잘못 설정된 데이터가 있습니다.');
          break;
      }
      return imgArray[idx];
    };

    return (
      <div
        className="appointment-container"
        onClick={() => history.push(`/post/${appointment.postId}`)}
      >
        <div
          className="appointment-card"
          style={{
            backgroundImage: `url(${getThumbnail()})`,
          }}
        >
          <div className="card-top-section">
            {returnPostStatus(appointment.status)}
          </div>
          <div className="card-bottom-section">
            <img src={locationIcon} alt="location-icon" />
            <div>
              <span className="place-name">{appointment.placeName}</span>
              <span className="meet-at">
                {changeMyPostDateFormat(appointment.meetAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="appointment-info">
          <div className="title-container">
            {appointment.title.slice(0, 15).concat('...')}
          </div>
          <div className="host-name-container">{appointment.hostName}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="body" style={{ width: '70%', margin: 'auto' }}>
      {isLoggedInUser === true ? (
        <div className="button-div">
          <div className="button-container">
            <span
              className="signout-button"
              onClick={() => history.push('/signout')}
            >
              로그아웃
            </span>
            <div>
              <img src={dividerIcon} alt="button-divider" />
            </div>
            <span
              className="edit-profile-button"
              onClick={() => history.push('/profile/edit')}
            >
              프로필 수정
            </span>
          </div>
        </div>
      ) : (
        <div>
          <div>&nbsp;</div>
          <div>&nbsp;</div>
        </div>
      )}

      <div className="profile-div">
        <img
          src="https://images.unsplash.com/photo-1586299485759-f62264d6b63f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
          alt="profile-icon"
        />
        <div className="profile-content-container">
          <div className="location-gender-container">
            <div className="location-container">
              <img src={badge} alt="badge-icon" />
              <span>인증한 동네 :</span>
              <span>{userInfo?.gu.concat(' ', userInfo.dong)}</span>
            </div>
            <div className="gender-container">
              <span style={{ color: '#646464' }}>성별</span>
              <span>{userInfo?.gender}</span>
            </div>
          </div>
          <div className="nickname-introduction-container">
            <div className="nickname-container">
              <span>{userInfo?.nickname}</span>
            </div>
            <div className="introduction-container">
              <span>{userInfo?.introduction}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pfexercise-header">
        <img src={pfExerciseIcon} alt="pfexercise-icon" />
        <span>좋아하는 운동</span>
      </div>
      <div className="pfexercise-div">
        {userInfo?.preferredExercise.map((exercise, idx) => (
          <div key={idx} className="pfexercise-box">
            <img src={greenDot} alt="green-dot" />
            {exercise.exerciseName}ㆍ실력 {exercise.skillLevel}
          </div>
        ))}
      </div>
      <br />
      <br />
      {isLoggedInUser === true && (
        <div className="mypost-section">
          <div className="mypost-header">참가 신청한 모임</div>
          <div className="my-post-div">
            {userInfo?.participatingPost &&
              userInfo?.participatingPost.map((post) => (
                <MyAppointment key={post.postId} appointment={post} />
              ))}
            {userInfo?.participatingPost !== null &&
              userInfo?.participatingPost.length === 0 && (
                <div>
                  <div>&nbsp;</div>
                  <div
                    className="no-participating-post"
                    style={{ textAlign: 'center' }}
                  >
                    참가 신청한 모임이 없습니다.
                  </div>
                  <div>&nbsp;</div>
                </div>
              )}
          </div>
          <div className="mypost-header">내가 만든 모임</div>
          <div className="my-post-div">
            {userInfo.hostingPost &&
              userInfo.hostingPost.map((post) => (
                <MyAppointment key={post.postId} appointment={post} />
              ))}
            {userInfo?.hostingPost !== null &&
              userInfo?.hostingPost.length === 0 && (
                <div>
                  <div>&nbsp;</div>
                  <div
                    className="no-hosting-post"
                    style={{ textAlign: 'center' }}
                  >
                    내가 만든 모임이 없습니다.
                  </div>
                  <div>&nbsp;</div>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
