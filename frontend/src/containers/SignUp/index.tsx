import { Button, Input, Radio, Select } from 'antd';
import { History } from 'history';
import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { SignUpInputDTO } from '../../backend/entity/user';
import './index.scss';
import getGuDong from '../../utils/getGuDong';
import { ExerciseAndSkill } from '../../backend/entity/exercise';

const { Option } = Select;

const initialFormState: SignUpInputDTO = {
  username: '',
  nickname: '',
  password: '',
  latitude: 0,
  longitude: 0,
  gu: '',
  dong: '',
  gender: '미선택',
  introduction: '',
  preferredExercise: [],
};

interface Props {
  history: History;
}

const SignUp = ({ history }: Props) => {
  const [form, setForm] = useState(initialFormState);
  const [preferredExercise, setPreferredExercise] = useState({
    exerciseName: '',
    skillLevel: '',
  });
  useEffect(() => {
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
      });
    }
  }, [form.latitude, form.longitude]);

  useEffect(() => {
    if (preferredExercise.exerciseName && preferredExercise.skillLevel) {
      setForm({ ...form, preferredExercise: [preferredExercise] });
    }
  }, [preferredExercise]);

  const onClickSubmit = () => {
    if (!form.latitude || !form.longitude || !form.gu || !form.dong) {
      alert('위치 정보를 불러오는 중입니다');
    } else if (!form.username) {
      alert('아이디를 입력해주세요');
    } else if (!form.password) {
      alert('비밀번호를 입력해주세요');
    } else if (form.gender === '미선택') {
      alert('성별을 선택해주세요');
    } else if (!form.nickname) {
      alert('닉네임을 입력해주세요');
    } else if (form.preferredExercise.length === 0) {
      alert('선호 운동을 입력해주세요');
    } else {
      console.log('제출 완료');
    }
  };

  const guDong =
    form.gu && form.dong ? (
      <span className="gu-dong">
        {form.gu} {form.dong}
      </span>
    ) : (
      <span className="gu-dong-loading">동네 정보 조회 중</span>
    );

  const newPreferredExercise = (
    <div>
      <select
        className="exercise"
        defaultValue="종목"
        onChange={(e) => {
          setPreferredExercise({
            ...preferredExercise,
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
        defaultValue="실력"
        onChange={(e) => {
          setPreferredExercise({
            ...preferredExercise,
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
  );

  return (
    <div className="signup">
      <img className="logo" src={logo} alt="woondongjang logo" />
      <form>
        {guDong}
        <input
          className="username-input"
          placeholder="아이디"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          className="password-input"
          placeholder="비밀번호"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          className="nickname-input"
          placeholder="닉네임"
          value={form.nickname}
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
        />
        <textarea
          className="introduction-input"
          placeholder="소개글"
          value={form.introduction}
          onChange={(e) => setForm({ ...form, introduction: e.target.value })}
        />
        <div className="radio-container">
          <input
            id="gender-male"
            type="radio"
            name="gender"
            value="남"
            checked={form.gender === '남성'}
            onChange={() => setForm({ ...form, gender: '남성' })}
          />
          <label htmlFor="gender-male">남</label>
          <input
            id="gender-female"
            type="radio"
            name="gender"
            value="여"
            checked={form.gender === '여성'}
            onChange={() => setForm({ ...form, gender: '여성' })}
          />
          <label htmlFor="gender-female">여</label>
        </div>
        <span>선호 운동</span>
        {/* <button type="link">추가하기</button> */}
        {newPreferredExercise}
        <button className="signup-submit-button" onClick={onClickSubmit}>
          완료
        </button>
      </form>
    </div>
  );
};

export default SignUp;
