/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { History } from 'history';
import { useParams } from 'react-router';
import 'antd/dist/antd.css';
import { Tabs, Card, Descriptions, Badge } from 'antd';
import { AppState } from '../../store/store';
import { getUserInfo } from '../../store/actions/index';
import getGuDong from '../../utils/getGuDong';
import { UpdateProfileEntity } from '../../backend/entity/user';
import './index.scss';
import { updateProfile } from '../../backend/api/api';
import pfExerciseIcon from '../../assets/icon/pfexercise.svg';
import greenDot from '../../assets/icon/green-circle.svg';
import exerciseIcon from '../../assets/icon/exercise.svg';
import levelIcon from '../../assets/icon/level.svg';
import xIcon from '../../assets/icon/x-icon.svg';

interface ProfileProps {
  history: History;
}

const ProfileEdit = ({ history }: ProfileProps) => {
  const dispatch = useDispatch();
  const userState = useSelector((state: AppState) => state.user);
  const loginProfile = window.localStorage.getItem('profileInfo');
  let parsedloginProfile: any;
  if (loginProfile !== null) {
    parsedloginProfile = JSON.parse(loginProfile);
  }
  const profileUserId = parsedloginProfile.userId;

  useEffect(() => {
    dispatch(getUserInfo(profileUserId));
  }, []);

  const initialProfileState: UpdateProfileEntity = {
    nickname: userState.userInfo?.nickname,
    gu: userState.userInfo?.gu,
    dong: userState.userInfo?.dong,
    introduction: userState.userInfo?.introduction,
    userExercise: userState.userInfo?.userExercise,
  };
  const [profile, setProfile] =
    useState<UpdateProfileEntity>(initialProfileState);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const verifyLocation = () => {
    if (!('geolocation' in navigator)) {
      alert('위치 정보를 사용할 수 없습니다. 다른 브라우저를 이용해주세요.');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords);
        getGuDong(position.coords.longitude, position.coords.latitude).then(
          (value) => {
            const { gu, dong } = value;
            console.log(gu, dong);
            const locationHolder = document.getElementById('location-holder');
            if (locationHolder) {
              locationHolder.setAttribute('value', gu.concat(' ', dong));
            }
          },
        );
      });
    }
  };

  const onClickAddExercise = () => {
    const newArray = profile.userExercise;
    newArray?.push({
      exerciseName: selectedExercise,
      skillLevel: selectedSkill,
    });
    setProfile({
      ...profile,
      userExercise: newArray,
    });
  };

  const onClickSubmit = async () => {
    await updateProfile({ id: profileUserId, updatePayload: profile });
    history.push('/profile/my');
  };

  return (
    <div>
      <div className="profile-container">
        <div className="location-container">
          <div className="location-and-button-container">
            <div className="input-name">위치정보</div>
            <button onClick={() => verifyLocation()}>재인증</button>
          </div>

          <div className="input-form">
            <input
              id="location-holder"
              disabled
              placeholder={userState.userInfo?.gu.concat(
                ' ',
                userState.userInfo?.dong,
              )}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  gu: e.target.value.split(' ')[0],
                  dong: e.target.value.split(' ')[1],
                })
              }
            />
          </div>
        </div>
        <div className="nickname-container">
          <div className="input-name">닉네임 변경</div>
          <div className="input-form">
            <input
              placeholder={userState.userInfo?.nickname}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  nickname: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="introduction-container">
          <div className="input-name">소개글 변경</div>
          <div className="input-form">
            <input
              placeholder={userState.userInfo?.introduction}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  introduction: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="user-exercise-container">
        <div className="exercise-add-container">
          <div className="exercise-add-container-left">
            <div>
              <img src={pfExerciseIcon} alt="pfexercise-icon" />
            </div>
            <div className="pf-title">좋아하는 운동</div>
            <button onClick={() => onClickAddExercise()}>추가</button>
          </div>
          <div className="exercise-add-container-right">
            <img src={exerciseIcon} alt="exercise-icon" />
            <select
              name="exerciseType"
              id="exerciseType"
              defaultValue="운동"
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              <option value="축구">축구</option>
              <option value="농구">농구</option>
              <option value="배드민턴">배드민턴</option>
              <option value="테니스">테니스</option>
              <option value="탁구">탁구</option>
              <option value="러닝">러닝</option>
              <option value="라이딩">라이딩</option>
            </select>
            <img src={levelIcon} alt="level-icon" />
            <select
              name="level"
              id="level"
              defaultValue="실력"
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="상">상</option>
              <option value="중">중</option>
              <option value="하">하</option>
            </select>
          </div>
        </div>
        <div
          className="preferred-exercise-container"
          id="preferred-exercise-container"
        >
          {profile.userExercise?.map((exerciseAndSkill: any) => (
            <div>
              <div>
                <img src={greenDot} alt="green-dot" />
                <span>
                  {exerciseAndSkill.exerciseName}ㆍ{exerciseAndSkill.skillLevel}
                </span>
              </div>
              <div>
                <img
                  src={xIcon}
                  alt="x-icon"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      userExercise: profile.userExercise?.filter(
                        (exercise) =>
                          exercise.exerciseName !==
                          exerciseAndSkill.exerciseName,
                      ),
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => onClickSubmit()}>변경사항 저장</button>
    </div>
  );
};

export default ProfileEdit;
