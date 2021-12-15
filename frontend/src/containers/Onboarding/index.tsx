import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import getGuDong from '../../utils/getGuDong';
import { AppState } from '../../store/store';
import { UserProfileDTO } from '../../backend/entity/user';
import Divider from '../../components/Divider';
import './index.scss';
import dots from '../../assets/image/auth/green-dots.svg';
import smallDots from '../../assets/image/auth/green-small-dots.svg';
import lineCircle from '../../assets/image/auth/green-line-circle.svg';
import greenCircle from '../../assets/image/icon/green-circle.svg';
import deleteIcon from '../../assets/image/icon/exercise-delete-button.svg';
import { onboarding } from '../../store/actions/user';

const initialFormState: UserProfileDTO = {
  latitude: 0,
  longitude: 0,
  gu: '',
  dong: '',
  gender: '미선택',
  nickname: '',
  introduction: '',
  preferredExercise: [],
};

const Onboarding = () => {
  const history = useHistory();
  const [form, setForm] = useState(initialFormState);
  const userId: number = Number(useParams<{ id: string }>().id);
  const [selectedExercise, setSelectedExercise] = useState({
    exerciseName: '종목',
    skillLevel: '실력',
  });
  const [guDong, setGuDong] = useState({
    loading: true,
    text: '동네 정보 조회 중',
  });

  const { loginUserId } = useSelector((state: AppState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginUserId) {
      history.push('/main');
    }

    if (!('geolocation' in navigator)) {
      alert('위치 정보를 사용할 수 없습니다. 다른 브라우저를 이용해주세요.');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setForm({
          ...form,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (form.latitude && form.longitude) {
      getGuDong(form.longitude, form.latitude).then((value) => {
        setForm({ ...form, gu: value.gu, dong: value.dong });
        setGuDong({ loading: false, text: `${value.gu} ${value.dong}` });
      });
    }
  }, [form.latitude, form.longitude]);

  const checkDuplicate = ({ exerciseName }: { exerciseName: string }) => {
    let isDuplicate = false;
    form.preferredExercise.some((exercise) => {
      if (exercise.exerciseName === exerciseName) isDuplicate = true;
      return exercise.exerciseName === exerciseName;
    });
    return isDuplicate;
  };

  useEffect(() => {
    if (
      selectedExercise.exerciseName !== '종목' &&
      selectedExercise.skillLevel !== '실력'
    ) {
      if (checkDuplicate(selectedExercise)) {
        alert('이미 선택된 종목입니다.');
      } else {
        setForm({
          ...form,
          preferredExercise: [...form.preferredExercise, selectedExercise],
        });
      }
      setSelectedExercise({ exerciseName: '종목', skillLevel: '실력' });
    }
  }, [selectedExercise]);

  const onClickDeletePreferredExercise = (idx: number) => {
    const copiedFilterArray = [...form.preferredExercise];
    copiedFilterArray.splice(idx, 1);
    setForm({ ...form, preferredExercise: copiedFilterArray });
  };

  const onClickSubmit = () => {
    if (!form.latitude || !form.longitude || !form.gu || !form.dong) {
      alert('위치 정보를 불러오는 중입니다');
    } else if (form.gender === '미선택') {
      alert('성별을 선택해주세요');
    } else if (!form.nickname) {
      alert('닉네임을 입력해주세요');
    } else if (form.preferredExercise.length === 0) {
      alert('선호 운동을 입력해주세요');
    } else {
      dispatch(onboarding(form, userId));
    }
  };

  const guDongSpan = guDong.loading ? (
    <span className="gu-dong loading">{guDong.text}</span>
  ) : (
    <span className="gu-dong">{guDong.text}</span>
  );

  return (
    <div className="onboarding">
      <img
        id="small-dots"
        className="bg-deco"
        src={smallDots}
        alt="background"
      />
      <img id="big-dots" className="bg-deco" src={dots} alt="background" />
      <img
        id="line-circle"
        className="bg-deco"
        src={lineCircle}
        alt="background"
      />
      <div className="onboarding-content">
        <h3>정보 입력</h3>
        <span>여러분의 운동 정보를 입력해주세요</span>
        <Divider />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClickSubmit();
          }}
        >
          <div className="left">
            <label>위치 정보</label>
            <span className={`gu-dong ${guDong.loading ? 'loading' : null}`}>
              {guDong.text}
            </span>
            <label htmlFor="gender-dropdown">성별</label>
            <select
              id="gender-dropdown"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="미선택" hidden>
                성별을 선택하세요
              </option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </select>
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              className="nickname-input"
              placeholder="닉네임을 입력해주세요"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            />
            <label htmlFor="introduction">소개</label>
            <input
              id="introduction"
              className="introduction-input"
              placeholder="자신을 소개하는 문장을 입력해주세요"
              onChange={(e) =>
                setForm({ ...form, introduction: e.target.value })
              }
            />
          </div>
          <div className="right">
            <div className="preferred-exercise-container">
              <label>선호 운동</label>
              <div className="select-container">
                <select
                  className="exercise"
                  value={selectedExercise.exerciseName}
                  onChange={(e) => {
                    setSelectedExercise({
                      ...selectedExercise,
                      exerciseName: e.target.value,
                    });
                  }}
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
                <select
                  className="skill-level"
                  value={selectedExercise.skillLevel}
                  onChange={(e) => {
                    setSelectedExercise({
                      ...selectedExercise,
                      skillLevel: e.target.value,
                    });
                  }}
                >
                  <option value="실력" hidden>
                    실력
                  </option>
                  <option value="상">상</option>
                  <option value="중">중</option>
                  <option value="하">하</option>
                </select>
              </div>
              <div className="exercise-array-container">
                {form.preferredExercise.map((exercise, idx) => (
                  <div key={idx} className="exercise-in-array">
                    <div>
                      <img src={greenCircle} alt="green circle" />
                      <span>
                        {exercise.exerciseName} · 실력 {exercise.skillLevel}
                      </span>
                    </div>
                    <button onClick={() => onClickDeletePreferredExercise(idx)}>
                      <img src={deleteIcon} alt="delete" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <input
              className="onboarding-submit-button"
              type="submit"
              value="완료"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
