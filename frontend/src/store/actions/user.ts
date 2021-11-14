/* eslint-disable arrow-body-style */
import { useSelector } from 'react-redux';

import axios from 'axios';

import { push } from 'connected-react-router';
import * as actionTypes from './actionTypes';
import { UserEntity, UserSignInInputDTO } from '../../types/user';

import { AppState } from '../store';

/* LOGIN */
export const signin_ = (currentUser: UserEntity) => ({
  user: currentUser,
  type: actionTypes.SIGNIN,
});

export const signin = (user: UserSignInInputDTO) => {
  return async (dispatch: any) => {
    try {
      const response = await axios.post('/users/signin', user);
      // const response = axios.post('/users/signin', user).then((res) => {
      //   console.log(res);
      // });
      // console.log(response);
      // const currentUser: any = response;
      const currentUser: UserEntity = response.data;
      window.localStorage.setItem('userInfo', JSON.stringify(currentUser));
      dispatch(signin_(currentUser));
      dispatch(push('/main'));
    } catch (e: any) {
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

/* Get User Profile info */
export const getUserInfo_ = (userInfo: any) => ({
  type: actionTypes.GET_USER_INFO,
  userInfo,
});

export const getUserInfo = (id: any) => {
  return async (dispatch: any) => {
    try {
      const response = await axios.get(`/users/${id}`);
      console.log(response);
      const returnedUserInfo = response.data;
      dispatch(getUserInfo_(returnedUserInfo));
    } catch (e: any) {
      if (e?.response && e.response.status === 404) {
        alert('존재하지 않는 유저입니다');
      }
    }
  };
};

export type UserAction =
  | ReturnType<typeof signin_>
  | ReturnType<typeof signout_>
  | ReturnType<typeof getUserInfo_>;
