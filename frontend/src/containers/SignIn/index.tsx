/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import { History } from 'history';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router';
import { signin } from '../../store/actions/index';
import Layout from '../../components/Layout';
import defaultImage from '../../assets/image/auth/signin-left.jpg';
import './index.scss';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import googleIcon from '../../assets/image/auth/google.svg';
import kakaotalkIcon from '../../assets/image/auth/kakaotalk.svg';

interface SignInProps {
  history: History;
}

const SignIn = ({ history }: SignInProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch = useDispatch();

  const user = window.localStorage.getItem('profileInfo') || null;

  const onClickLogin = () => {
    if (!username) {
      alert('아이디를 입력해주세요');
    } else if (!password) {
      alert('비밀번호를 입력해주세요');
    } else {
      dispatch(signin({ username, password }));
    }
  };

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onClickLogin();
    }
  };

  const onClickKakaoSignIn = () => {};

  // 로그인 user가 있을 경우 redirect to main
  const redirect = user ? <Redirect to="/main" /> : null;

  return (
    <div id="signin" className="signin-container">
      {redirect}
      <Layout name="로그인" imageUrl={defaultImage}>
        <label htmlFor="username">이름</label>
        <input
          id="username"
          placeholder="이름"
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={onKeyPress}
        />
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          placeholder="비밀번호"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={onKeyPress}
        />
        <Button className="local-signin-button" onClick={onClickLogin}>
          로그인
        </Button>
        <Divider text="or" />
        <Button
          className="social-signin-button"
          imageUrl={kakaotalkIcon}
          onClick={onClickKakaoSignIn}
        >
          카카오 계정으로 로그인
        </Button>
        <Button
          className="social-signin-button"
          imageUrl={googleIcon}
          onClick={onClickKakaoSignIn}
        >
          구글 계정으로 로그인
        </Button>
        <span className="signup-instruction">
          운동장이 처음이신가요?{' '}
          <span
            className="signup-button"
            onClick={() => history.push('/signup')}
          >
            새 계정 만들기
          </span>
        </span>
      </Layout>
    </div>
  );
};

export default SignIn;
