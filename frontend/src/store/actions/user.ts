import axios from 'axios';
import { push } from 'connected-react-router';
import humps from 'humps';
import * as actionTypes from './actionTypes';
import { UserProfileInfo, UserSignInInputDTO } from '../../backend/entity/user';

/* LOGIN */
export const signin_ = (currentUser: UserProfileInfo) => ({
  type: actionTypes.SIGNIN,
  user: currentUser,
});

export const signin = (user: UserSignInInputDTO) => async (dispatch: any) => {
  try {
    const response = await axios.post('/users/signin', user);
    const currentUser = humps.camelizeKeys(
      response.data,
    ) as unknown as UserProfileInfo;
    window.localStorage.setItem('profileInfo', JSON.stringify(currentUser));
    dispatch(signin_(currentUser));
    dispatch(push('/main'));
  } catch (e: any) {
    if (e?.response && e.response.status === 404) {
      alert('존재하지 않는 아이디입니다.');
    } else if (e?.response && e.response.status === 401) {
      alert('잘못된 비밀번호입니다.');
    }
  }
};

/* LOGOUT */
export const signout_ = () => ({
  type: actionTypes.SIGNOUT,
});

export function signout() {
  return async (dispatch: any) => {
    alert('안녕히 가세요!');
    localStorage.clear();
    dispatch(signout_());
    await axios.get('/users/signout');
  };
}

/* Get User Profile info */
export const getUserInfo_ = (userInfo: any) => ({
  type: actionTypes.GET_USER_INFO,
  userInfo,
});

export const getUserInfo = (id: any) => async (dispatch: any) => {
  try {
    const response = await axios.get(`/users/${id}`);
    const returnedUserInfo = humps.camelizeKeys(response.data);
    dispatch(getUserInfo_(returnedUserInfo));
  } catch (e: any) {
    if (e?.response && e.response.status === 404) {
      alert('존재하지 않는 유저입니다');
    }
  }
};

export const getUserNotification_ = (userNotification: any) => ({
  type: actionTypes.GET_USER_NOTIFICATION,
  userNotification,
});

export const getUserNotification = (id: any) => async (dispatch: any) => {
  try {
    const response = await axios.get(`/users/${id}/notification`);
    const userNotification = humps.camelizeKeys(response.data);
    dispatch(getUserNotification_(userNotification));
  } catch (e: any) {
    if (e?.response && e.response.status === 404) {
      alert('존재하지 않는 유저입니다');
    }
  }
};

export const readNotification_ = (userNotification: any) => ({
  type: actionTypes.READ_NOTIFICATION,
  userNotification,
});

export const readNotification = (notiId: number) => async (dispatch: any) => {
  const response = await axios.patch(`/users/notification/${notiId}`);
  const userNotification = humps.camelizeKeys(response.data);
  dispatch(readNotification_(userNotification));
};

export const createNotification_ = () => ({
  type: actionTypes.CREATE_NOTIFICATION,
});

export function createNotification(
  userId: number,
  postId: number,
  notiType: string,
) {
  return async (dispatch: any) => {
    dispatch(createNotification_());
    await axios.post(`/users/${userId}/notification/${postId}/${notiType}`);
  };
}

export type UserAction =
  | ReturnType<typeof signin_>
  | ReturnType<typeof signout_>
  | ReturnType<typeof getUserInfo_>
  | ReturnType<typeof getUserNotification_>
  | ReturnType<typeof readNotification_>
  | ReturnType<typeof createNotification_>;
