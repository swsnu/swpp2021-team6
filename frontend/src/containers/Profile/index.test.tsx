/* eslint-disable no-proto */
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import * as API from '../../backend/api/api';
import mockUserInfo from '../../mocks/userInfo.json';
import Profile from '.';
import mockStore, { history } from '../../store/store';

window.alert = jest.fn().mockImplementation();

const mockPush = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
  useParams: () => ({ id: '1' }),
}));

describe('Profile', () => {
  let profile: any;
  let spyHistoryPush: any;

  const useStateMock = jest.spyOn(React, 'useState');
  const setUserInfoMock = jest.fn();

  beforeEach(() => {
    profile = (
      <Provider store={mockStore}>
        <Profile history={history} />
      </Provider>
    );

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

  it('should reject fetchUserInfo', async () => {
    const axiosMock = jest.spyOn(API, 'readUserInfo').mockRejectedValue({});
    useStateMock.mockReturnValueOnce([mockUserInfo, setUserInfoMock]);
    const component = mount(profile);
  });
});
