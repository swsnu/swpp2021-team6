import React, { useEffect } from 'react';
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { mockNavigatorGeolocation } from '../../test-utils/mockNavigatorGeolocation';
import userInfo from '../../mocks/userInfo.json';
import { UserInfoEntity } from '../../backend/entity/user';
import ProfileEdit from '.';

window.alert = jest.fn().mockImplementation();
const useStateMock = jest.spyOn(React, 'useState');
const setUserInfoMock = jest.fn();
const setUpdateProfileStateMock = jest.fn();
const setSelectedExerciseMock = jest.fn();
const setGuDongMock = jest.fn();
const mockPush = jest.fn();

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');

// jest.mock('react-router', () => ({
//   ...jest.requireActual('react-router'),
//   useHistory: () => ({ push: mockPush }),
//   useParams: () => ({ id: '1' }),
// }));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
}));

jest.mock('React', () => ({
  ...jest.requireActual('React'),
  useEffect: jest.fn(),
}));

const history = createMemoryHistory({
  initialEntries: ['/'],
});

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

describe('Profile edit', () => {
  const mockUserInfo: UserInfoEntity = {
    userId: 0,
    nickname: '',
    latitude: 0,
    longitude: 0,
    gu: '',
    dong: '',
    gender: '미선택',
    introduction: '',
    preferredExercise: [{ exerciseName: '', skillLevel: '' }],
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
  };

  const mockUpdateProfileState = {
    nickname: '',
    gu: '',
    dong: '',
    introduction: '',
    preferredExercise: [
      {
        exerciseName: '',
        skillLevel: '',
      },
    ],
  };

  let profileEdit: any;
  let getGuDong: any;
  beforeEach(() => {
    profileEdit = (
      <Provider store={mockStore}>
        <ProfileEdit />
      </Provider>
    );

    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { user: userInfo } }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without error', () => {
    useStateMock
      .mockReturnValueOnce([mockUserInfo, setUserInfoMock])
      .mockReturnValueOnce([mockUpdateProfileState, setUpdateProfileStateMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(profileEdit);
    expect(component.find('.profile-edit').length).toBe(1);
  });

  it('should load user info on mount', () => {
    useStateMock
      .mockReturnValueOnce([mockUserInfo, setUserInfoMock])
      .mockReturnValueOnce([mockUpdateProfileState, setUpdateProfileStateMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(profileEdit);
    expect(setUserInfoMock).toBeCalledTimes(0);
  });

  it('should change state on changing input', () => {
    useStateMock
      .mockReturnValueOnce([mockUserInfo, setUserInfoMock])
      .mockReturnValueOnce([mockUpdateProfileState, setUpdateProfileStateMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(profileEdit);
    component
      .find('.nickname-input')
      .simulate('change', { target: { value: 'test nickname' } });
    expect(setUpdateProfileStateMock).toBeCalledTimes(1);

    component
      .find('.introduction-input')
      .simulate('change', { target: { value: 'test introduction' } });
    expect(setUpdateProfileStateMock).toBeCalledTimes(2);
  });

  it('should add preferred exercise with correct selection', () => {
    useStateMock
      .mockReturnValueOnce([mockUserInfo, setUserInfoMock])
      .mockReturnValueOnce([mockUpdateProfileState, setUpdateProfileStateMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(profileEdit);

    component
      .find('#exerciseType')
      .simulate('change', { target: { value: '축구' } });
    component.find('#level').simulate('change', { target: { value: '상' } });
    component.find('.add-button').simulate('click');
    expect(setSelectedExerciseMock).toBeCalledTimes(2);
    expect(setUpdateProfileStateMock).toBeCalledTimes(0);
  });

  it('should not add preferred exercise with incorrect selection', () => {
    useStateMock
      .mockReturnValueOnce([mockUserInfo, setUserInfoMock])
      .mockReturnValueOnce([mockUpdateProfileState, setUpdateProfileStateMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(profileEdit);

    component.find('.add-button').simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should set preferred exercise', () => {
    useStateMock
      .mockReturnValueOnce([mockUserInfo, setUserInfoMock])
      .mockReturnValueOnce([mockUpdateProfileState, setUpdateProfileStateMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(profileEdit);

    component
      .find('#exerciseType')
      .simulate('change', { target: { value: '축구' } });
    component.find('#level').simulate('change', { target: { value: '상' } });
    expect(setSelectedExerciseMock).toBeCalledTimes(2);
  });

  it('should remove a preferred exercise on clicking x button', () => {
    useStateMock
      .mockReturnValueOnce([mockUserInfo, setUserInfoMock])
      .mockReturnValueOnce([mockUpdateProfileState, setUpdateProfileStateMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(profileEdit);

    component.find('.x-icon').simulate('click');

    expect(setUpdateProfileStateMock).toBeCalledTimes(1);
  });

  it('should move to profile page on clicking submit button', () => {
    useStateMock
      .mockReturnValueOnce([mockUserInfo, setUserInfoMock])
      .mockReturnValueOnce([mockUpdateProfileState, setUpdateProfileStateMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(profileEdit);
    component.find('#submit-button').at(0).simulate('click');
    expect(mockPush).toBeCalledTimes(0);
  });

  it('should verify location', () => {
    useStateMock
      .mockReturnValueOnce([mockUserInfo, setUserInfoMock])
      .mockReturnValueOnce([mockUpdateProfileState, setUpdateProfileStateMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(profileEdit);
    component.find('.verify-location-button').at(0).simulate('click');
    window.confirm = jest.fn().mockImplementation(() => true);
    const spyconfirm = jest.spyOn(window, 'confirm').mockImplementation();
    expect(spyconfirm).toBeCalledTimes(0);
    expect(setGuDongMock).toBeCalledTimes(0);
    expect(setUpdateProfileStateMock).toBeCalledTimes(0);
    // const spyFn = jest.spyOn(ProfileEdit, 'verifyLocation');
  });
});
