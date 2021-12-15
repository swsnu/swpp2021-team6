/* eslint-disable no-proto */
import React from 'react';
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import mockUserInfo from '../../mocks/userInfo.json';
import Profile from '.';
import { history } from '../../store/store';
import { UserInfoEntity } from '../../backend/entity/user';

const stubUserInfo: UserInfoEntity = {
  userId: 1,
  nickname: 'nickname',
  latitude: 123,
  longitude: 456,
  gu: 'gu',
  dong: 'dong',
  gender: '여성',
  introduction: '',
  preferredExercise: [{ exerciseName: '축구', skillLevel: '상' }],
  participatingPost: [],
  hostingPost: [],
};

window.alert = jest.fn().mockImplementation();
const useStateMock = jest.spyOn(React, 'useState');
const setUserInfoMock = jest.fn();
const setUpdateProfileStateMock = jest.fn();
const setSelectedExerciseMock = jest.fn();
const setGuDongMock = jest.fn();
const mockPush = jest.fn();

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
}));

const spyAlert = jest.spyOn(window, 'alert').mockImplementation();
const spyHistoryPush = jest
  .spyOn(history, 'push')
  .mockImplementation(jest.fn());

const mockStore = createStore(
  combineReducers({
    router: connectRouter(history),
    user: (state = { user: null }, action) => state,
  }),
  applyMiddleware(routerMiddleware(history)),
);

describe('Profile', () => {
  let profile: any;
  let spyHistoryPush: any;

  beforeEach(() => {
    profile = (
      <Provider store={mockStore}>
        <Profile history={history} />
      </Provider>
    );

    useSelectorMock.mockReturnValue({ loginUserId: 1 });
    spyHistoryPush = jest.spyOn(history, 'push');
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without error', () => {
    useStateMock.mockReturnValueOnce([mockUserInfo, setUserInfoMock]);
    const component = mount(profile);
    expect(component.find('.profile').length).toBe(1);
  });

  it('should push to profile edit', () => {
    useStateMock.mockReturnValueOnce([mockUserInfo, setUserInfoMock]);
    const component = mount(profile);
    const wrapper = component.find('.button-container');
    wrapper.find('.edit-profile-button').simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
  });

  it('should push to signout', () => {
    useStateMock.mockReturnValueOnce([mockUserInfo, setUserInfoMock]);
    const component = mount(profile);
    const wrapper = component.find('.button-container');
    wrapper.find('.signout-button').simulate('click');
    expect(spyHistoryPush).toBeCalledWith('/signout');
  });

  it('should push to a post', () => {
    useStateMock.mockReturnValueOnce([mockUserInfo, setUserInfoMock]);
    const component = mount(profile);
    const wrapper = component.find('.appointment-container');
    wrapper.at(0).simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
    wrapper.at(1).simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(2);
    wrapper.at(2).simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(3);
    wrapper.at(3).simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(4);
    wrapper.at(4).simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(5);
    wrapper.at(5).simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(6);
    wrapper.at(6).simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(7);
    wrapper.at(7).simulate('click');
  });

  it('should call fetchUserInfo', async () => {
    const axiosMock = jest.spyOn(axios, 'get').mockResolvedValueOnce({
      entity: mockUserInfo,
    });
    useStateMock.mockReturnValueOnce([mockUserInfo, setUserInfoMock]);
    await act(async () => {
      const component = mount(profile);
    });
  });
});
