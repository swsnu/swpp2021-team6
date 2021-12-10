import axios from 'axios';
import { push } from 'connected-react-router';
import humps from 'humps';
import * as actionTypes from './actionTypes';
import {
  UserProfileDTO,
  SignInDTO,
  UserIdEntity,
} from '../../backend/entity/user';
import { createUserProfile } from '../../backend/api/api';
import { NotificationEntity } from '../../backend/entity/notification';

/* SIGNIN */
export const autoSignin_ = (lastLoggedInUser: number) => ({
  type: actionTypes.AUTO_SIGNIN,
  userId: lastLoggedInUser,
});

export const autoSignin = () => async (dispatch: any) => {
  const lastLoggedInUserString = localStorage.getItem('loginUser');
  const lastLoggedInUser: number | null = Number(lastLoggedInUserString);
  dispatch(autoSignin_(lastLoggedInUser));
};

export const signin_ = (loginUserId: number) => ({
  type: actionTypes.SIGNIN,
  userId: loginUserId,
});

export const signin = (user: SignInDTO) => async (dispatch: any) => {
  try {
    const response = await axios.post('/users/signin', user);
    const loginUser = humps.camelizeKeys(
      response.data,
    ) as unknown as UserIdEntity;

    window.localStorage.setItem('loginUser', loginUser.userId.toString());

    dispatch(signin_(loginUser.userId));
    dispatch(push('/main'));
  } catch (e: any) {
    if (e?.response && e.response.status === 404) {
      alert('존재하지 않는 아이디입니다.');
    } else if (e?.response && e.response.status === 401) {
      alert('잘못된 비밀번호입니다.');
    }
  }
};

/* ONBOARDING */
export const onboarding_ = (loginUserId: number) => ({
  type: actionTypes.ONBOARDING,
  userId: loginUserId,
});

export const onboarding =
  (userProfile: UserProfileDTO, userId: number) => async (dispatch: any) => {
    try {
      await createUserProfile({ createPayload: userProfile, userId });

      window.localStorage.setItem('loginUser', JSON.stringify(userId));

      dispatch(onboarding_(userId));
      dispatch(push('/main'));
    } catch (e: any) {
      console.log('error', e);
    }
  };

/* SIGNOUT */
export const signout_ = () => ({
  type: actionTypes.SIGNOUT,
});

export const signout = () => async (dispatch: any) => {
  alert('안녕히 가세요!');
  localStorage.clear();
  dispatch(signout_());
  await axios.get('/users/signout');
};

/* NOTIFICATION */
// TODO: api.ts에 함수 만들어서 사용하기
export const getNotification_ = (notification: NotificationEntity[]) => ({
  type: actionTypes.GET_NOTIFICATION,
  notification,
});

export const getNotification = (id: any) => async (dispatch: any) => {
  try {
    const response = await axios.get(`/users/${id}/notification`);
    const notification = humps.camelizeKeys(
      response.data,
    ) as unknown as NotificationEntity[];
    dispatch(getNotification_(notification));
  } catch (e: any) {
    if (e?.response && e.response.status === 404) {
      alert('존재하지 않는 유저입니다');
    }
  }
};

export const readNotification_ = (notification: NotificationEntity[]) => ({
  type: actionTypes.READ_NOTIFICATION,
  notification,
});

export const readNotification = (notiId: number) => async (dispatch: any) => {
  const response = await axios.get(`/users/notification/${notiId}`);
  const notification = humps.camelizeKeys(
    response.data,
  ) as unknown as NotificationEntity[];
  dispatch(readNotification_(notification));
};

export type UserAction =
  | ReturnType<typeof signin_>
  | ReturnType<typeof signout_>
  | ReturnType<typeof getNotification_>
  | ReturnType<typeof readNotification_>;
