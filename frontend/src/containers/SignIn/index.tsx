import { useState } from 'react';
import { History } from 'history';
import { useDispatch, useSelector } from 'react-redux';

import { Redirect } from 'react-router';
import { signin } from '../../store/actions/index';
import { AppState } from '../../store/store';

interface SignInProps {
  history: History;
}

const SignIn = ({ history }: SignInProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // dispatch 구현하고 만들어야 함
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

  // 로그인 user가 있을 경우 redirect to main
  const redirect = user ? <Redirect to="/main" /> : null;

  return (
    <div id="signin" className="intro-container">
      {redirect}
      <h1>Sign In</h1>
      <input
        id="username"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={onKeyPress}
      />
      <input
        id="password"
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={onKeyPress}
      />
      <div className="button-container">
        <button
          id="signup-button"
          type="button"
          onClick={() => history.push('/signup')}
        >
          Sign Up
        </button>
        <button id="local-signin-button" type="button" onClick={onClickLogin}>
          Sign In
        </button>
      </div>
      <span>or</span>
      <button id="social-signin-button">Sign In With Kakao</button>
    </div>
  );
};

export default SignIn;
