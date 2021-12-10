import reducer from './user';
import * as actionTypes from '../actions/actionTypes';
import {
  NotificationEntity,
  NotiType,
} from '../../backend/entity/notification';

const stubNotification: NotificationEntity[] = [
  {
    notiId: 1,
    notiType: NotiType.comment,
    postId: 1,
    postTitle: 'test post',
    isRead: false,
    createdAt: '1분 전',
  },
];

describe('userReducer', () => {
  it('should return default state', () => {
    const newState = reducer(undefined, {});
    expect(newState).toEqual({
      loginUserId: null,
      notification: null,
    });
  });

  it('should auto signin user', () => {
    const newState = reducer(undefined, {
      type: actionTypes.AUTO_SIGNIN,
      userId: 1,
    });
    expect(newState).toEqual({
      loginUserId: 1,
      notification: null,
    });
  });

  it('should signin user', () => {
    const newState = reducer(undefined, {
      type: actionTypes.SIGNIN,
      userId: 1,
    });
    expect(newState).toEqual({
      loginUserId: 1,
      notification: null,
    });
  });

  it('should signup user', () => {
    const newState = reducer(undefined, {
      type: actionTypes.ONBOARDING,
      userId: 1,
    });
    expect(newState).toEqual({
      loginUserId: 1,
      notification: null,
    });
  });

  it('should signout user', () => {
    const newState = reducer(
      { loginUserId: 1, notification: null },
      { type: actionTypes.SIGNOUT },
    );
    expect(newState).toEqual({
      loginUserId: null,
      notification: null,
    });
  });

  it('should get notification', () => {
    const newState = reducer(undefined, {
      type: actionTypes.GET_NOTIFICATION,
      notification: stubNotification,
    });
    expect(newState).toEqual({
      loginUserId: null,
      notification: stubNotification,
    });
  });

  it('should read notification', () => {
    const newState = reducer(undefined, {
      type: actionTypes.READ_NOTIFICATION,
      notification: stubNotification,
    });
    expect(newState).toEqual({
      loginUserId: null,
      notification: stubNotification,
    });
  });
});
