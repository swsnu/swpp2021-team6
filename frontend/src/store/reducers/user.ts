import * as actionTypes from '../actions/actionTypes';
import {
  UserEntity,
  UserProfileInfo,
  UserInfoEntity,
} from '../../backend/entity/user';
import { UserAction } from '../actions/user';
import { DefaultAction } from '../actions/index';

export type UserState = {
  user: UserProfileInfo | undefined | null;
  userInfo: UserInfoEntity | null;
  userNotification: any | null;
};

const InitialState: UserState = {
  user: undefined,
  userInfo: {
    userId: 0,
    nickname: '',
    gu: '',
    dong: '',
    gender: '미선택',
    introduction: '',
    userExercise: [{ exerciseName: '', skillLevel: '상관 없음' }],
    participatingPost: [
      {
        hostName: '',
        postId: 0,
        exerciseName: '',
        title: '',
        meetAt: '',
        placeName: '',
        status: '',
      },
    ],
    hostingPost: [
      {
        hostName: '',
        postId: 0,
        exerciseName: '',
        title: '',
        meetAt: '',
        placeName: '',
        status: '',
      },
    ],
  },
  userNotification: null,
};

function userReducer(state: UserState = InitialState, action: any): UserState {
  switch (action.type) {
    /* LOGIN */
    case actionTypes.AUTO_SIGNIN:
      return { ...state, user: action.user };

    case actionTypes.SIGNIN:
      return { ...state, user: action.user };

    /* LOGOUT */
    case actionTypes.SIGNOUT:
      return { ...state, user: null, userInfo: null, userNotification: null };

    case actionTypes.GET_USER_INFO:
      return { ...state, userInfo: action.userInfo };

    case actionTypes.GET_USER_NOTIFICATION:
      return { ...state, userNotification: action.userNotification };

    case actionTypes.READ_NOTIFICATION:
      return { ...state, userNotification: action.userNotification };

    case actionTypes.CREATE_NOTIFICATION:
      return state;

    default:
      return state;
  }
}

export default userReducer;
