import * as actionTypes from '../actions/actionTypes';

export type UserState = {
  loginUserId: number | null;
  // userInfo: UserInfoEntity | null;
  notification: any | null; // TODO: NotificationEntity 만들어주세요
};

const InitialState: UserState = {
  loginUserId: null,
  // userInfo: {
  //   userId: 0,
  //   nickname: '',
  //   gu: '',
  //   dong: '',
  //   gender: '미선택',
  //   introduction: '',
  //   userExercise: [{ exerciseName: '', skillLevel: '상관 없음' }],
  //   participatingPost: [
  //     {
  //       hostName: '',
  //       postId: 0,
  //       exerciseName: '',
  //       title: '',
  //       meetAt: '',
  //       placeName: '',
  //       status: '',
  //     },
  //   ],
  //   hostingPost: [
  //     {
  //       hostName: '',
  //       postId: 0,
  //       exerciseName: '',
  //       title: '',
  //       meetAt: '',
  //       placeName: '',
  //       status: '',
  //     },
  //   ],
  // },
  notification: null,
};

function userReducer(state: UserState = InitialState, action: any): UserState {
  switch (action.type) {
    case actionTypes.AUTO_SIGNIN:
      return { ...state, loginUserId: action.userId };

    case actionTypes.SIGNIN:
      return { ...state, loginUserId: action.userId };

    case actionTypes.SIGNUP:
      return { ...state, loginUserId: action.userId };

    case actionTypes.SIGNOUT:
      return { loginUserId: null, notification: null };

    case actionTypes.GET_USER_NOTIFICATION:
      return { ...state, notification: action.notification };

    case actionTypes.READ_NOTIFICATION:
      return { ...state, notification: action.notification };

    case actionTypes.CREATE_NOTIFICATION:
      return state;

    default:
      return state;
  }
}

export default userReducer;
