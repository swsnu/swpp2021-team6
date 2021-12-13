/* eslint-disable object-shorthand */
import React, { useEffect } from 'react';
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { mockNavigatorGeolocation } from '../../test-utils/mockNavigatorGeolocation';
import userInfo from '../../mocks/userInfo.json';
import notification from '../../mocks/notification.json';
import Profile from '.';
import { history } from '../../store/store';

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
}));

// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useHistory: () => ({
//     push: mockPush,
//   }),
// }));

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
    user: (state = { user: null, notification: notification }, action) => state,
  }),
  applyMiddleware(routerMiddleware(history)),
);

describe('Notification', () => {
  const mockUserInfo = userInfo;

  let noti: any;
  let spyHistoryPush: any;
  // let getGuDong: any;
  beforeEach(() => {
    noti = (
      <Provider store={mockStore}>
        <Profile />
      </Provider>
    );

    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { user: userInfo } }),
    );
    spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without error', () => {
    useStateMock.mockReturnValueOnce([mockUserInfo, setUserInfoMock]);
    const component = mount(noti);
    expect(component.find('.profile').length).toBe(0);
  });

  // it('should push to profile edit', () => {
  //   useStateMock.mockReturnValueOnce([mockUserInfo, setUserInfoMock]);
  //   const component = mount(noti);
  //   const wrapper = component.find('.button-container');
  //   wrapper.find('.edit-profile-button').simulate('click');
  //   expect(spyHistoryPush).toBeCalledTimes(1);
  // });

  // it('should push to signout', () => {
  //   useStateMock.mockReturnValueOnce([mockUserInfo, setUserInfoMock]);
  //   const component = mount(profile);
  //   const wrapper = component.find('.button-container');
  //   wrapper.find('.signout-button').simulate('click');
  //   expect(spyHistoryPush).toBeCalledWith('/signout');
  // });

  // it('should push to a post', () => {
  //   useStateMock.mockReturnValueOnce([mockUserInfo, setUserInfoMock]);
  //   const component = mount(noti);
  //   const wrapper = component.find('.noti-item-container');
  //   wrapper.at(0).simulate('click');
  //   expect(spyHistoryPush).toBeCalledTimes(1);
  //   wrapper.at(1).simulate('click');
  //   expect(spyHistoryPush).toBeCalledTimes(2);
  //   wrapper.at(2).simulate('click');
  //   expect(spyHistoryPush).toBeCalledTimes(3);
  //   wrapper.at(3).simulate('click');
  //   expect(spyHistoryPush).toBeCalledTimes(4);
  //   wrapper.at(4).simulate('click');
  //   expect(spyHistoryPush).toBeCalledTimes(5);
  // });
});
