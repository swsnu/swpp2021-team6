/* eslint-disable no-restricted-globals */
/* eslint-disable object-shorthand */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../../components/Button';
import getGuDong from '../../utils/getGuDong';
import { UserInfoEntity, UpdateProfileDTO } from '../../backend/entity/user';
import { readUserInfo, updateProfile } from '../../backend/api/api';
import pfExerciseIcon from '../../assets/image/icon/pfexercise.svg';
import greenDot from '../../assets/image/icon/green-circle.svg';
import exerciseIcon from '../../assets/image/icon/exercise.svg';
import levelIcon from '../../assets/image/icon/level.svg';
import xIcon from '../../assets/image/icon/x-icon.svg';
import profileIcon from '../../assets/image/icon/profile-icon.svg';
import 'antd/dist/antd.css';
import './index.scss';

const initialUserInfoState: UserInfoEntity = {
  userId: 0,
  nickname: '',
  latitude: 0,
  longitude: 0,
  gu: '',
  dong: '',
  gender: '미선택',
  introduction: '',
  preferredExercise: [{ exerciseName: '', skillLevel: '' }],
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
};

const initialUpdateProfileState = {
  nickname: '',
  gu: '',
  dong: '',
  introduction: '',
  preferredExercise: [
    {
      exerciseName: '',
      skillLevel: '',
    },
  ],
};

const ProfileEdit = () => {
  const history = useHistory();
  const loginUserId = Number(window.localStorage.getItem('loginUser'));
  const [userInfo, setUserInfo] =
    useState<UserInfoEntity>(initialUserInfoState);
  const [profileUpdate, setProfileUpdate] = useState<UpdateProfileDTO>(
    initialUpdateProfileState,
  );
  const [selectedExercise, setSelectedExercise] = useState({
    exerciseName: '종목',
    skillLevel: '실력',
  });
  const [guDong, setGuDong] = useState({
    loading: true,
    text: '동네 정보 조회 중',
  });

  const fetchUserInfo = async () => {
    const fetchedUserInfo = (await readUserInfo({ id: loginUserId })).entity;
    setUserInfo(fetchedUserInfo);
    setProfileUpdate({
      nickname: fetchedUserInfo.nickname,
      gu: fetchedUserInfo.gu,
      dong: fetchedUserInfo.dong,
      introduction: fetchedUserInfo.introduction,
      preferredExercise: fetchedUserInfo.preferredExercise,
    });
    setGuDong({
      loading: false,
      text: `${fetchedUserInfo.gu} ${fetchedUserInfo.dong}`,
    });
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const verifyLocation = () => {
    const response = confirm(
      '현재 위치를 기반으로 프로필 정보를 재설정합니다.\n재인증하시겠습니까?',
    );

    if (response) {
      if (!('geolocation' in navigator)) {
        alert('위치 정보를 사용할 수 없습니다. 다른 브라우저를 이용해주세요.');
      } else {
        setGuDong({ loading: true, text: '동네 정보 조회 중' });
        navigator.geolocation.getCurrentPosition((position) => {
          getGuDong(position.coords.longitude, position.coords.latitude).then(
            (value) => {
              const { gu, dong } = value;
              setProfileUpdate({
                ...profileUpdate,
                gu,
                dong,
              });
              setGuDong({ loading: false, text: `${gu} ${dong}` });
            },
          );
        });
      }
    }
  };

  const onClickAddExercise = () => {
    if (
      selectedExercise.exerciseName !== '종목' &&
      selectedExercise.skillLevel !== '실력'
    ) {
      const updatedPreferredExercise = userInfo.preferredExercise;
      setProfileUpdate({
        ...profileUpdate,
        preferredExercise: [...updatedPreferredExercise, selectedExercise],
      });
      setSelectedExercise({ exerciseName: '종목', skillLevel: '실력' });
    } else {
      alert('운동 종목과 실력을 선택해주세요.');
    }
  };

  const onClickSubmit = async () => {
    // TODO: PATCH method이므로 value가 있는 key값만 object로 만들어줘서 API 호출해야 합니다
    await updateProfile({ id: loginUserId, updatePayload: profileUpdate });
    history.push(`/profile/${loginUserId}`);
  };

  return (
    <div className="profile-edit">
      <div className="profile-container">
        <img src={profileIcon} alt="profile-icon" />
        <div className="location-container">
          <div className="location-and-button-container">
            <div className="input-name">위치정보</div>
            <div className="verify-location-button" onClick={verifyLocation}>
              <span>재인증</span>
            </div>
          </div>
          <div className="input-form">
            <input
              id="location-holder"
              className={guDong.loading ? 'loading' : undefined}
              disabled
              placeholder={guDong.text}
            />
          </div>
        </div>
        <div className="nickname-container">
          <div className="input-name">닉네임 변경</div>
          <div className="input-form">
            <input
              className="nickname-input"
              placeholder={userInfo.nickname}
              value={profileUpdate.nickname}
              onChange={(e) =>
                setProfileUpdate({
                  ...profileUpdate,
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
              className="introduction-input"
              placeholder={userInfo.introduction || ''}
              value={profileUpdate.introduction || ''}
              onChange={(e) =>
                setProfileUpdate({
                  ...profileUpdate,
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
            <div className="add-button" onClick={onClickAddExercise}>
              <span>추가</span>
            </div>
          </div>
          <div className="exercise-add-container-right">
            <img src={exerciseIcon} alt="exercise-icon" />
            <select
              className="selector"
              name="exerciseType"
              id="exerciseType"
              value={selectedExercise.exerciseName}
              onChange={(e) =>
                setSelectedExercise({
                  ...selectedExercise,
                  exerciseName: e.target.value,
                })
              }
            >
              <option value="종목" hidden>
                종목
              </option>
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
              className="selector"
              name="level"
              id="level"
              value={selectedExercise.skillLevel}
              onChange={(e) =>
                setSelectedExercise({
                  ...selectedExercise,
                  skillLevel: e.target.value,
                })
              }
            >
              <option value="실력" hidden>
                실력
              </option>
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
          {profileUpdate.preferredExercise?.map(
            (exerciseAndSkill: any, idx: number) => (
              <div key={idx} className="pfexercise-box">
                <div>
                  <img className="green-dot" src={greenDot} alt="green-dot" />
                  <span>
                    {exerciseAndSkill.exerciseName}ㆍ
                    {exerciseAndSkill.skillLevel}
                  </span>
                </div>
                <div>
                  <img
                    className="x-icon"
                    src={xIcon}
                    alt="x-icon"
                    onClick={() =>
                      setProfileUpdate({
                        ...profileUpdate,
                        preferredExercise:
                          profileUpdate.preferredExercise?.filter(
                            (exercise) =>
                              exercise.exerciseName !==
                              exerciseAndSkill.exerciseName,
                          ),
                      })
                    }
                  />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
      <Button
        className="save-button"
        id="submit-button"
        onClick={onClickSubmit}
      >
        변경사항 저장
      </Button>
    </div>
  );
};

export default ProfileEdit;
