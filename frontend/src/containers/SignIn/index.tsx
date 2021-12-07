/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router';
import { signin } from '../../store/actions/index';
import Layout from '../../components/Layout';
import defaultImage from '../../assets/image/auth/signin-left.jpg';
import './index.scss';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import googleIcon from '../../assets/image/auth/google.svg';
import kakaotalkIcon from '../../assets/image/auth/kakaotalk.svg';
import { AppState } from '../../store/store';

const SignIn = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch = useDispatch();
  const { user } = useSelector((state: AppState) => state.user);
  const history = useHistory();

  const onClickLogin = () => {
    if (!username) {
      alert('아이디를 입력해주세요.');
    } else if (!password) {
      alert('비밀번호를 입력해주세요.');
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
  const onClickGoogleSignIn = () => {};

  useEffect(() => {
    if (user) history.push('/main');
  });

  return (
    <div id="signin" className="signin-container">
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
        <Button id="local-signin-button" onClick={onClickLogin}>
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
