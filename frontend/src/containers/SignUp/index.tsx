/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';
import { History } from 'history';
import Layout from '../../components/Layout';
import defaultImage from '../../assets/image/auth/signup-left.jpg';
import Divider from '../../components/Divider';
import Button from '../../components/Button';
import './index.scss';
import googleIcon from '../../assets/image/auth/google.svg';
import kakaotalkIcon from '../../assets/image/auth/kakaotalk.svg';

interface Props {
  history: History;
}

const SignUp = ({ history }: Props) => {
  // const [] = useState();
  const user = window.localStorage.getItem('profileInfo') || null;

  useEffect(() => {
    if (user) history.push('/main');
  });

  const onClickSignUp = () => {};
  const onClickKakaoSignUp = () => {};
  const onClickGoogleSignUp = () => {};

  return (
    <div className="signup-container">
      <Layout name="회원가입" imageUrl={defaultImage}>
        <label htmlFor="username">이름</label>
        <input id="username" placeholder="이름" />
        <label htmlFor="password">비밀번호</label>
        <input id="password" placeholder="비밀번호" />
        <label htmlFor="password-verify">비밀번호 확인</label>
        <input id="password-verify" placeholder="비밀번호" />
        <Button className="local-signup-button" onClick={onClickSignUp}>
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
        <span className="signup-instruction">
          운동장의 회원이신가요?{' '}
          <span
            className="signup-button"
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
