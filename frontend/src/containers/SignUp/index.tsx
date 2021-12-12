/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Layout from '../../components/Layout';
import defaultImage from '../../assets/image/auth/signup-left.jpg';
import Divider from '../../components/Divider';
import Button from '../../components/Button';
import { SignUpDTO } from '../../backend/entity/user';
import googleIcon from '../../assets/image/auth/google.svg';
import kakaotalkIcon from '../../assets/image/auth/kakaotalk.svg';
import { AppState } from '../../store/store';
import { createUser } from '../../backend/api/api';
import './index.scss';

const SignUp = () => {
  const [signUpForm, setSignUpForm] = useState<SignUpDTO>({
    username: '',
    password: '',
  });
  const [checkPassword, setCheckPassword] = useState<string>();

  const { loginUserId } = useSelector((state: AppState) => state.user);
  const history = useHistory();

  useEffect(() => {
    if (loginUserId) history.push('/main');
  });

  const onClickSignUp = async () => {
    if (!signUpForm.username) alert('아이디를 입력해주세요.');
    else if (!signUpForm.password) alert('비밀번호를 입력해주세요.');
    else if (signUpForm.password !== checkPassword) {
      alert('비밀번호가 일치하지 않습니다.');
    } else {
      try {
        const newUser = (await createUser({ createPayload: signUpForm }))
          .entity;
        history.push(`/onboarding/${newUser.userId}`);
      } catch (e) {
        alert('중복된 아이디입니다. 다른 아이디를 입력해주세요.');
      }
    }
  };

  const onPressEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onClickSignUp();
  };

  const onClickKakaoSignUp = () => {};
  const onClickGoogleSignUp = () => {};

  return (
    <div className="signup-container">
      <Layout name="회원가입" imageUrl={defaultImage}>
        <label htmlFor="username">아이디</label>
        <input
          id="username"
          placeholder="아이디"
          onChange={(e) =>
            setSignUpForm({ ...signUpForm, username: e.target.value })
          }
          onKeyPress={(e) => onPressEnter(e)}
        />
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          placeholder="비밀번호"
          type="password"
          onChange={(e) =>
            setSignUpForm({ ...signUpForm, password: e.target.value })
          }
          onKeyPress={(e) => onPressEnter(e)}
        />
        <label htmlFor="password-verify">비밀번호 확인</label>
        <input
          id="password-verify"
          placeholder="비밀번호"
          type="password"
          onChange={(e) => setCheckPassword(e.target.value)}
          onKeyPress={(e) => onPressEnter(e)}
        />
        <Button id="local-signup-button" onClick={onClickSignUp}>
          계정 만들기
        </Button>
        <Divider text="or" />
        <Button
          className="social-signup-button"
          imageUrl={kakaotalkIcon}
          onClick={onClickKakaoSignUp}
        >
          카카오 계정으로 회원가입
        </Button>
        <Button
          className="social-signup-button"
          imageUrl={googleIcon}
          onClick={onClickGoogleSignUp}
        >
          구글 계정으로 회원가입
        </Button>
        <span className="signin-instruction">
          운동장의 회원이신가요?{' '}
          <span
            className="signin-button"
            onClick={() => history.push('/signin')}
          >
            로그인 하기
          </span>
        </span>
      </Layout>
    </div>
  );
};

export default SignUp;
