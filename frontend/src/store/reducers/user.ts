import * as actionTypes from '../actions/actionTypes';
import {
  UserEntity,
  UserProfileInfo,
  UserInfoEntity,
} from '../../backend/entity/user';
import { UserAction } from '../actions/user';
import { DefaultAction } from '../actions/index';

export type UserState = {
  user: UserProfileInfo | null;
  userInfo: UserInfoEntity | null;
  notification: null;
};

const InitialState: UserState = {
  user: JSON.parse(window.localStorage.getItem('userInfo')!) || null,
  userInfo: null,
  notification: null,
};

function userReducer(state: UserState = InitialState, action: any): UserState {
  switch (action.type) {
    /* LOGIN */
    case actionTypes.SIGNIN:
      return { ...state, user: action.user };

    /* LOGOUT */
    case actionTypes.SIGNOUT:
      return { ...state, user: null };

    case actionTypes.GET_USER_INFO:
      return { ...state, userInfo: action.userInfo };

    case actionTypes.GET_USER_NOTIFICATION:
      return { ...state, notification: action.notification };

    default:
      return state;
  }
}

export default userReducer;
