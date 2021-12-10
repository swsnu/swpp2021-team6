/* eslint-disable no-proto */
import axios from 'axios';
import * as actionCreators from './user';
import { getMockStore } from '../../test-utils/mocks';
import { UserState } from '../reducers/user';
import {
  NotiType,
  NotificationEntity,
} from '../../backend/entity/notification';

window.alert = jest.fn().mockImplementation();
console.log = jest.fn().mockImplementation();
jest.spyOn(window.localStorage.__proto__, 'getItem');
jest.spyOn(window.localStorage.__proto__, 'clear');
window.localStorage.__proto__.getItem = jest.fn().mockReturnValue(1);

const stubUserProfileDTO = {
  latitude: 123,
  longitude: 456,
  gu: '',
  dong: '',
  gender: '',
  nickname: '',
  introduction: '',
  preferredExercise: [],
};

const stubNotification: NotificationEntity[] = [
  {
    notiId: 1,
    notiType: NotiType.comment,
    postId: 1,
    postTitle: '',
    isRead: false,
    createdAt: '7초 전',
  },
];

describe('User Actions', () => {
  const stubInitialState: UserState = {
    loginUserId: null,
    notification: null,
  };
  const mockStore = getMockStore(stubInitialState);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should 'autoSignin' last logged in user", () => {
    mockStore.dispatch<any>(actionCreators.autoSignin());
  });

  it("should 'signin' user properly", () => {
    const spyPost = jest.spyOn(axios, 'post').mockResolvedValue({
      status: 200,
      data: { user_id: 1 },
    });
    mockStore.dispatch<any>(
      actionCreators.signin({ username: 'username', password: 'password' }),
    );
    expect(spyPost).toBeCalledTimes(1);
  });

  it("should handle 404 error when 'signin' user", () => {
    const spyPost = jest.spyOn(axios, 'post').mockRejectedValue({
      response: {
        status: 404,
      },
    });
    mockStore.dispatch<any>(
      actionCreators.signin({ username: 'username', password: 'password' }),
    );
    expect(spyPost).toBeCalledTimes(1);
  });

  it("should handle 401 error when 'signin' user", () => {
    const spyPost = jest.spyOn(axios, 'post').mockRejectedValue({
      response: {
        status: 401,
      },
    });
    mockStore.dispatch<any>(
      actionCreators.signin({ username: 'username', password: 'password' }),
    );
    expect(spyPost).toBeCalledTimes(1);
  });

  it("should 'onboarding' user", () => {
    const spyPost = jest.spyOn(axios, 'post');
    mockStore.dispatch<any>(actionCreators.onboarding(stubUserProfileDTO, 1));
    expect(spyPost).toBeCalledTimes(1);
  });

  it("should handle error when 'onboarding' user", () => {
    const spyPost = jest.spyOn(axios, 'post').mockRejectedValue({
      response: {
        status: 400,
      },
    });
    mockStore.dispatch<any>(actionCreators.onboarding(stubUserProfileDTO, 1));
    expect(spyPost).toBeCalledTimes(1);
  });

  it("should 'signout' user", () => {
    const spyGet = jest.spyOn(axios, 'get');
    mockStore.dispatch<any>(actionCreators.signout());
    expect(spyGet).toBeCalledTimes(1);
  });

  it("should 'getNotification'", () => {
    const spyGet = jest.spyOn(axios, 'get').mockResolvedValue({
      status: 200,
      data: stubNotification,
    });
    mockStore.dispatch<any>(actionCreators.getNotification(1));
    expect(spyGet).toBeCalledTimes(1);
  });

  it("should handle 404 error when 'getNotification'", () => {
    const spyGet = jest.spyOn(axios, 'get').mockRejectedValue({
      response: {
        status: 404,
      },
    });
    mockStore.dispatch<any>(actionCreators.getNotification(1));
    expect(spyGet).toBeCalledTimes(1);
  });

  it("should 'readNotification'", () => {
    const spyGet = jest.spyOn(axios, 'get').mockResolvedValueOnce({
      status: 200,
      data: stubNotification,
    });
    mockStore.dispatch<any>(actionCreators.readNotification(1));
    expect(spyGet).toBeCalledTimes(1);
  });
});
