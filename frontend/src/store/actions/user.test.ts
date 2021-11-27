import axios from 'axios';
import { createStore } from 'redux';
import * as actionTypes from './actionTypes';
import * as actionCreators from './user';
import { getMockStore } from '../../test-utils/mocks';
import { UserState } from '../reducers/user';
import { UserSignInInputDTO } from '../../backend/entity/user';

const stubUser: UserSignInInputDTO = {
  username: 'test user',
  password: 'test password',
};

const stuUserInfo = {
  usreId: 1,
  nickname: 'test user',
  gu: '관악구',
  dong: '신림동',
  gender: '여성',
  introduction: '',
  userExercise: [{ exerciseName: '축구', skillLevel: '상' }],
  participatingPost: [],
  hostingPost: [],
};

const stubInitialState: UserState = {
  user: null,
  userInfo: null,
};

const mockStore = getMockStore(stubInitialState);

describe('User Actions', () => {
  beforeEach(() => {
    window.alert = jest.fn().mockImplementation();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("'signin' should sign in user", () => {
    const spy = jest.spyOn(axios, 'post').mockResolvedValue({
      status: 201,
      data: stubUser,
    });

    mockStore.dispatch<any>(actionCreators.signin(stubUser)).then(() => {
      expect(spy).toBeCalledTimes(1);
    });
  });

  it("'signin' should not sign in user with wrong username", () => {
    const spy = jest.spyOn(axios, 'post').mockRejectedValue({
      response: {
        status: 404,
      },
    });

    mockStore.dispatch<any>(actionCreators.signin(stubUser));
    expect(spy).toBeCalledTimes(1);
  });

  it("'signin' should not sign in user with wrong password", () => {
    const spy = jest.spyOn(axios, 'post').mockRejectedValue({
      response: {
        status: 401,
      },
    });

    mockStore.dispatch<any>(actionCreators.signin(stubUser));
    expect(spy).toBeCalledTimes(1);
  });

  it("'signout' should sign out user", () => {
    const spy = jest.spyOn(axios, 'get').mockImplementation();
    mockStore.dispatch<any>(actionCreators.signout()).then(() => {
      expect(spy).toBeCalledTimes(1);
    });
  });

  it("'getUserInfo' should get user info", () => {
    const spy = jest.spyOn(axios, 'get').mockResolvedValue({
      status: 200,
      data: stuUserInfo,
    });
    mockStore.dispatch<any>(actionCreators.getUserInfo(1)).then(() => {
      expect(spy).toBeCalledTimes(1);
    });
  });

  it("'getUserInfo' should not get user info", () => {
    const spy = jest.spyOn(axios, 'get').mockRejectedValue({
      response: {
        status: 404,
      },
    });
    mockStore.dispatch<any>(actionCreators.getUserInfo(1));
    expect(spy).toBeCalledTimes(1);
  });
});
