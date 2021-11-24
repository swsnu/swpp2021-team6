import * as actionTypes from '../actions/actionTypes';
import { UserProfileInfo } from '../../backend/entity/user';

export type UserState = {
  user: UserProfileInfo | null;
  userInfo: any | null;
};

const InitialState: UserState = {
  user: JSON.parse(window.localStorage.getItem('userInfo')!) || null,
  userInfo: null,
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

    default:
      return state;
  }
}

export default userReducer;
