import { NotificationEntity } from '../../backend/entity/notification';
import * as actionTypes from '../actions/actionTypes';

export type UserState = {
  loginUserId: number | null;
  notification: NotificationEntity[] | null;
};

const InitialState: UserState = {
  loginUserId: null,
  notification: null,
};

function userReducer(state: UserState = InitialState, action: any): UserState {
  switch (action.type) {
    case actionTypes.AUTO_SIGNIN:
      return { ...state, loginUserId: action.userId };

    case actionTypes.SIGNIN:
      return { ...state, loginUserId: action.userId };

    case actionTypes.ONBOARDING:
      return { ...state, loginUserId: action.userId };

    case actionTypes.SIGNOUT:
      return { loginUserId: null, notification: null };

    case actionTypes.GET_NOTIFICATION:
      return { ...state, notification: action.notification };

    case actionTypes.READ_NOTIFICATION:
      return { ...state, notification: action.notification };

    default:
      return state;
  }
}

export default userReducer;
