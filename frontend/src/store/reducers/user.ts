import * as actionTypes from '../actions/actionTypes';
import { UserEntity } from '../../types/user';
import { UserAction } from '../actions/user';
import { DefaultAction } from '../actions/index';

export type InitialState = {
  user: any | null;
  userInfo: any | null;
};

const UserState: InitialState = {
  user: JSON.parse(window.localStorage.getItem('userInfo')!),
  userInfo: null,
};

function userReducer(
  state: InitialState = UserState,
  action: any,
): InitialState {
  switch (action.type) {
    /* LOGIN */
    case actionTypes.SIGNIN:
      return { ...state, user: action.user };

    /* LOGOUT */
    case actionTypes.SIGNOUT:
      return { ...state, user: null };

    case actionTypes.GET_USER_INFO:
      return { ...state, userInfo: action.userInfo };

    default:
      return state;
  }
}

export default userReducer;
