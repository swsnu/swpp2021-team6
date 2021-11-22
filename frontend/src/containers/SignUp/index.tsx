import { Button, Input, Radio, Select } from 'antd';
import { History } from 'history';
import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { SignUpInputDTO } from '../../types/user';
import './index.scss';
import getGuDong from '../../utils/getGuDong';
import { ExerciseAndSkill } from '../../types/exercise';

const { Option } = Select;

const initialFormState: SignUpInputDTO = {
  username: '',
  nickname: '',
  password: '',
  latitude: 0,
  longitude: 0,
  gu: '',
  dong: '',
  gender: 'UNKNOWN',
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

  // Radio Group option for GENDER
  const options = [
    { label: '남', value: '남' },
    { label: '여', value: '여' },
  ];
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
    } else if (form.gender === 'UNKNOWN') {
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
      <Select
        className="exercise"
        defaultValue="종목"
        onChange={(e) => {
          setPreferredExercise({ ...preferredExercise, exerciseName: e });
        }}
      >
        <Option value="종목" hidden>
          종목
        </Option>
        <Option value="축구">축구</Option>
        <Option value="농구">농구</Option>
        <Option value="배드민턴">배드민턴</Option>
        <Option value="테니스">테니스</Option>
        <Option value="탁구">탁구</Option>
        <Option value="러닝">러닝</Option>
        <Option value="라이딩">라이딩</Option>
      </Select>
      <Select
        defaultValue="실력"
        onChange={(e) => {
          setPreferredExercise({ ...preferredExercise, skillLevel: e });
        }}
      >
        <Option value="실력" hidden>
          실력
        </Option>
        <Option value="상">상</Option>
        <Option value="중">중</Option>
        <Option value="하">하</Option>
      </Select>
    </div>
  );

  return (
    <div className="signup">
      <img className="logo" src={logo} alt="woondongjang logo" />
      <form>
        {guDong}
        <Input
          placeholder="아이디"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <Input.Password
          placeholder="비밀번호"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Input
          placeholder="닉네임"
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
        />
        <Input.TextArea allowClear placeholder="소개글" />
        <Radio.Group
          className="gender-radio"
          options={options}
          defaultValue="UNKNOWN"
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        />
        <span>선호 운동</span>
        {/* <Button type="link">추가하기</Button> */}
        {newPreferredExercise}
        <Button type="primary" onClick={onClickSubmit}>
          완료
        </Button>
      </form>
    </div>
  );
};

export default SignUp;
