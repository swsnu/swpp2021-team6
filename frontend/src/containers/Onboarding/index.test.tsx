/* eslint-disable no-proto */
import React from 'react';
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import Onboarding from '.';
import { mockNavigatorGeolocation } from '../../test-utils/mockNavigatorGeolocation';
import { ProfileDTO } from '../../backend/entity/user';
import userInfo from '../../mocks/userInfo.json';

window.alert = jest.fn().mockImplementation();
const useStateMock = jest.spyOn(React, 'useState');
const setFormMock = jest.fn();
const setSelectedExerciseMock = jest.fn();
const setGuDongMock = jest.fn();
const mockPush = jest.fn();
const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
}));

const history = createMemoryHistory({ initialEntries: ['/hello'] });
const mockStore = createStore(
  combineReducers({
    router: connectRouter(history),
    user: (state = { user: null }, action) => state,
  }),
  applyMiddleware(routerMiddleware(history)),
);

describe('Onboarding', () => {
  const mockForm: ProfileDTO = {
    latitude: 37.12345,
    longitude: 127.12345,
    gu: '',
    dong: '',
    gender: '미선택',
    nickname: '',
    introduction: '',
    preferredExercise: [{ exerciseName: '축구', skillLevel: '상' }],
  };

  let onboarding: any;
  let getGuDong: any;
  beforeEach(() => {
    onboarding = <Onboarding history={history} />;

    useStateMock
      .mockReturnValueOnce([mockForm, setFormMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);

    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { user: userInfo } }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
    const component = mount(onboarding);
    expect(component.find('.onboarding').length).toBe(1);
  });

  it('should change gender select', () => {
    const component = mount(onboarding);
    component
      .find('#gender-dropdown')
      .simulate('change', { target: { value: '남성' } });
    expect(setFormMock).toBeCalledTimes(1);
  });

  it('should change nickname input', () => {
    const component = mount(onboarding);
    component
      .find('#nickname')
      .simulate('change', { target: { value: 'test nickname' } });
    expect(setFormMock).toBeCalledTimes(1);
  });

  it('should change introduction input', () => {
    const component = mount(onboarding);
    component
      .find('#introduction')
      .simulate('change', { target: { value: 'test introduction' } });
    expect(setFormMock).toBeCalledTimes(1);
  });

  it('should set preferred exercise', () => {
    const component = mount(onboarding);
    component
      .find('.exercise')
      .simulate('change', { target: { value: '축구' } });
    component
      .find('.skill-level')
      .simulate('change', { target: { value: '상' } });
    expect(setSelectedExerciseMock).toBeCalledTimes(2);
  });

  it('should alert when submitting before getting location', () => {
    const component = mount(onboarding);
    const { getCurrentPositionMock } = mockNavigatorGeolocation();
    getCurrentPositionMock.mockImplementation();
    component.find('.onboarding-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(2);
  });

  it('should delete selected exercise when clicking delete button', () => {
    const component = mount(onboarding);
    component.find('.exercise-in-array button').simulate('click');
    expect(setFormMock).toBeCalledTimes(1);
  });
});

describe('Onboarding on submit', () => {
  let onboarding: any;

  beforeEach(() => {
    onboarding = (
      <Provider store={mockStore}>
        <Onboarding history={history} />
      </Provider>
    );

    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { user: userInfo } }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should alert without gender', () => {
    const mockForm = {
      latitude: 37.12345,
      longitude: 127.12345,
      gu: '영등포구',
      dong: '당산동',
      gender: '미선택',
      nickname: '',
      introduction: '',
      preferredExercise: [{ exerciseName: '축구', skillLevel: '상' }],
    };
    useStateMock
      .mockReturnValueOnce([mockForm, setFormMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(onboarding);
    component.find('.onboarding-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should alert without nickname', () => {
    const mockForm = {
      latitude: 37.12345,
      longitude: 127.12345,
      gu: '영등포구',
      dong: '당산동',
      gender: '여성',
      nickname: '',
      introduction: '',
      preferredExercise: [{ exerciseName: '축구', skillLevel: '상' }],
    };
    useStateMock
      .mockReturnValueOnce([mockForm, setFormMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(onboarding);
    component.find('.onboarding-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should alert without preferred exercise', () => {
    const mockForm = {
      latitude: 37.12345,
      longitude: 127.12345,
      gu: '영등포구',
      dong: '당산동',
      gender: '여성',
      nickname: '구미',
      introduction: '',
      preferredExercise: [],
    };
    useStateMock
      .mockReturnValueOnce([mockForm, setFormMock])
      .mockReturnValueOnce([
        { exerciseName: '종목', skillLevel: '실력' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(onboarding);
    component.find('.onboarding-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });
});
