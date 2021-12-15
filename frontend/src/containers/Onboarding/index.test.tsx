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
import { UserProfileDTO } from '../../backend/entity/user';

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
  useParams: () => ({ id: '1' }),
}));

const history = createMemoryHistory({
  initialEntries: ['/hello'],
});

const mockStore = createStore(
  combineReducers({
    router: connectRouter(history),
    user: (state = { user: null }, action) => state,
  }),
  applyMiddleware(routerMiddleware(history)),
);

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('Onboarding', () => {
  const mockForm: UserProfileDTO = {
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
  let spyCreateUserProfile: any;
  beforeEach(() => {
    onboarding = (
      <Provider store={mockStore}>
        <Onboarding />
      </Provider>
    );

    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { loginUserId: 1 } }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without error', () => {
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
    expect(component.find('.onboarding').length).toBe(1);
  });

  it('should change gender select', () => {
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
    component
      .find('#gender-dropdown')
      .simulate('change', { target: { value: '남성' } });
    expect(setFormMock).toBeCalledTimes(1);
  });

  it('should change nickname input', () => {
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
    component
      .find('#nickname')
      .simulate('change', { target: { value: 'test nickname' } });
    expect(setFormMock).toBeCalledTimes(1);
  });

  it('should change introduction input', () => {
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
    component
      .find('#introduction')
      .simulate('change', { target: { value: 'test introduction' } });
    expect(setFormMock).toBeCalledTimes(1);
  });

  it('should set preferred exercise', () => {
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
    component
      .find('.exercise')
      .simulate('change', { target: { value: '축구' } });
    component
      .find('.skill-level')
      .simulate('change', { target: { value: '상' } });
    expect(setSelectedExerciseMock).toBeCalledTimes(2);
  });

  it('should alert when submitting before getting location', () => {
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
    const { getCurrentPositionMock } = mockNavigatorGeolocation();
    getCurrentPositionMock.mockImplementation();
    component.find('.onboarding-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should alert without gu, dong', () => {
    const mockForm = {
      latitude: 37.12345,
      longitude: 127.12345,
      gu: '',
      dong: '',
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
    component.find('form').simulate('submit');
    expect(window.alert).toBeCalledTimes(1);
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
    component.find('form').simulate('submit');
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
    component.find('form').simulate('submit');
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
    component.find('form').simulate('submit');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should submit validate form', () => {
    const mockForm = {
      latitude: 37.12345,
      longitude: 127.12345,
      gu: '영등포구',
      dong: '당산동',
      gender: '여성',
      nickname: '구미',
      introduction: '',
      preferredExercise: [{ exerciseName: '농구', skillLevle: '중' }],
    };
    useStateMock
      .mockReturnValueOnce([mockForm, setFormMock])
      .mockReturnValueOnce([
        { exerciseName: '축구', skillLevel: '상' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(onboarding);
    component.find('form').simulate('submit');
  });

  it('should delete selected exercise when clicking delete button', () => {
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
    component.find('.exercise-in-array button').simulate('click');
    expect(setFormMock).toBeCalledTimes(1);
  });

  it('should check duplicate exercise', () => {
    useStateMock
      .mockReturnValueOnce([mockForm, setFormMock])
      .mockReturnValueOnce([
        { exerciseName: '축구', skillLevel: '중' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(onboarding);
  });

  it('should check duplicate exercise & set selected exercise', () => {
    useStateMock
      .mockReturnValueOnce([mockForm, setFormMock])
      .mockReturnValueOnce([
        { exerciseName: '농구', skillLevel: '중' },
        setSelectedExerciseMock,
      ])
      .mockReturnValueOnce([
        { loading: true, text: '동네 정보 조회 중' },
        setGuDongMock,
      ]);
    const component = mount(onboarding);
  });
});
