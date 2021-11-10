/* eslint-disable arrow-body-style */
import axios from 'axios';
import { push } from 'connected-react-router';
import * as actionTypes from './actionTypes';
import { UserEntity, UserSignInInputDTO } from '../../types/user';

/* LOGIN */
export const signin_ = (currentUser: UserEntity) => ({
  user: currentUser,
  type: actionTypes.SIGNIN,
});

export const signin = (user: UserSignInInputDTO) => {
  return async (dispatch: any) => {
    try {
      const response = await axios.post('/users/signin', user);
      const currentUser: UserEntity = response.data;
      window.localStorage.setItem('userInfo', JSON.stringify(currentUser));
      dispatch(signin_(currentUser));
      dispatch(push('/main'));
    } catch (e) {
      if (e?.response && e.response.status === 404) {
        alert('존재하지 않는 아이디입니다');
      } else if (e?.response && e.response.status === 401) {
        alert('잘못된 비밀번호입니다');
      }
    }
  };
};

/* LOGOUT */
export const signout_ = () => ({
  type: actionTypes.SIGNOUT,
});

export function signout() {
  return async (dispatch: any) => {
    alert('안녕히 가세요!');
    localStorage.clear();
    sessionStorage.clear();
    dispatch(signout_());
    await axios.get('/users/signout');
  };
}

export type UserAction =
  | ReturnType<typeof signin_>
  | ReturnType<typeof signout_>;
