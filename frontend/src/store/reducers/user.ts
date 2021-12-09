import * as actionTypes from '../actions/actionTypes';
import { UserProfileInfo } from '../../backend/entity/user';

export type UserState = {
  user: UserProfileInfo | undefined | null;
  userInfo: any | null;
};

const InitialState: UserState = {
  user: undefined,
  userInfo: null,
};

function userReducer(state: UserState = InitialState, action: any): UserState {
  switch (action.type) {
    /* LOGIN */
    case actionTypes.AUTO_SIGNIN:
      return { ...state, user: action.user };

    case actionTypes.SIGNIN:
      return { ...state, user: action.user };

    case actionTypes.SIGNUP:
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
