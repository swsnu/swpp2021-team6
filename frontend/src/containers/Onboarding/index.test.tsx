import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import SignUp from './index';
import mockStore, { history } from '../../store/store';
import { mockNavigatorGeolocation } from '../../test-utils/mockNavigatorGeolocation';

describe('SignUp', () => {
  let signup: any;
  beforeEach(() => {
    signup = (
      <Provider store={mockStore}>
        <SignUp history={history} />
      </Provider>
    );
    window.alert = jest.fn().mockImplementation();
    console.log = jest.fn().mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const component = shallow(signup);
    expect(component.find('SignUp').length).toBe(1);
  });

  it('should change username input', () => {
    const component = mount(signup);
    component
      .find('.username-input')
      .simulate('change', { target: { value: 'test username' } });
    expect(component.find('.username-input').prop('value')).toBe(
      'test username',
    );
  });

  it('should change password input', () => {
    const component = mount(signup);
    component
      .find('.password-input')
      .simulate('change', { target: { value: 'test password' } });
    expect(component.find('.password-input').prop('value')).toBe(
      'test password',
    );
  });

  it('should change nickname input', () => {
    const component = mount(signup);
    component
      .find('.nickname-input')
      .simulate('change', { target: { value: 'test nickname' } });
    expect(component.find('.nickname-input').prop('value')).toBe(
      'test nickname',
    );
  });

  it('should set preferred exercise', () => {
    const component = mount(signup);
    component
      .find('.exercise')
      .simulate('change', { target: { value: '축구' } });
    component
      .find('.skill-level')
      .simulate('change', { target: { value: '상' } });
  });

  it('should change introduction input', () => {
    const component = mount(signup);
    component
      .find('.introduction-input')
      .simulate('change', { target: { value: 'test introduction' } });
    expect(component.find('.introduction-input').prop('value')).toBe(
      'test introduction',
    );
  });

  it('should change gender radio', () => {
    const component = mount(signup);
    component.find('#gender-male').simulate('change');
    expect(component.find('#gender-male').prop('checked')).toBe(true);
    component.find('#gender-female').simulate('change');
    expect(component.find('#gender-female').prop('checked')).toBe(true);
  });

  it('should alert when submitting before getting location', () => {
    const component = mount(signup);
    component.find('.signup-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(2);
  });

  it('should alert on clicking submit button without username', () => {
    const { getCurrentPositionMock } = mockNavigatorGeolocation();
    getCurrentPositionMock.mockImplementation();
    const useStateMock = jest.spyOn(React, 'useState');
    const setFormMock = jest.fn();
    const setPreferredExerciseMock = jest.fn();
    jest.mock('../../utils/getGuDong', () => jest.fn());
    useStateMock
      .mockReturnValueOnce([
        {
          username: '',
          nickname: '',
          password: '',
          latitude: 37.12345,
          longitude: 127.12345,
          gu: '관악구',
          dong: '신림동',
          gender: '미선택',
          introduction: '',
          preferredExercise: [],
        },
        setFormMock,
      ])
      .mockReturnValueOnce([
        { exerciseName: '', skillLevel: '' },
        setPreferredExerciseMock,
      ]);
    const component = mount(signup);
    component.find('.signup-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should alert on clicking submit button without password', () => {
    const useStateMock = jest.spyOn(React, 'useState');
    const setFormMock = jest.fn();
    const setPreferredExerciseMock = jest.fn();
    jest.mock('../../utils/getGuDong', () => jest.fn());
    useStateMock
      .mockReturnValueOnce([
        {
          username: 'test username',
          nickname: '',
          password: '',
          latitude: 37.12345,
          longitude: 127.12345,
          gu: '관악구',
          dong: '신림동',
          gender: '미선택',
          introduction: '',
          preferredExercise: [],
        },
        setFormMock,
      ])
      .mockReturnValueOnce([
        { exerciseName: '', skillLevel: '' },
        setPreferredExerciseMock,
      ]);
    const component = mount(signup);
    component.find('.signup-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should alert on clicking submit button without gender', () => {
    const useStateMock = jest.spyOn(React, 'useState');
    const setFormMock = jest.fn();
    const setPreferredExerciseMock = jest.fn();
    jest.mock('../../utils/getGuDong', () => jest.fn());
    useStateMock
      .mockReturnValueOnce([
        {
          username: 'test username',
          nickname: '',
          password: 'test password',
          latitude: 37.12345,
          longitude: 127.12345,
          gu: '관악구',
          dong: '신림동',
          gender: '미선택',
          introduction: '',
          preferredExercise: [],
        },
        setFormMock,
      ])
      .mockReturnValueOnce([
        { exerciseName: '', skillLevel: '' },
        setPreferredExerciseMock,
      ]);
    const component = mount(signup);
    component.find('.signup-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should alert on clicking submit button without nickname', () => {
    const useStateMock = jest.spyOn(React, 'useState');
    const setFormMock = jest.fn();
    const setPreferredExerciseMock = jest.fn();
    jest.mock('../../utils/getGuDong', () => jest.fn());
    useStateMock
      .mockReturnValueOnce([
        {
          username: 'test username',
          nickname: '',
          password: 'test password',
          latitude: 37.12345,
          longitude: 127.12345,
          gu: '관악구',
          dong: '신림동',
          gender: '여성',
          introduction: '',
          preferredExercise: [],
        },
        setFormMock,
      ])
      .mockReturnValueOnce([
        { exerciseName: '', skillLevel: '' },
        setPreferredExerciseMock,
      ]);
    const component = mount(signup);
    component.find('.signup-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should alert on clicking submit button without preferred exercise', () => {
    const useStateMock = jest.spyOn(React, 'useState');
    const setFormMock = jest.fn();
    const setPreferredExerciseMock = jest.fn();
    jest.mock('../../utils/getGuDong', () => jest.fn());
    useStateMock
      .mockReturnValueOnce([
        {
          username: 'test username',
          nickname: 'test nickname',
          password: 'test password',
          latitude: 37.12345,
          longitude: 127.12345,
          gu: '관악구',
          dong: '신림동',
          gender: '여성',
          introduction: '',
          preferredExercise: [],
        },
        setFormMock,
      ])
      .mockReturnValueOnce([
        { exerciseName: '', skillLevel: '' },
        setPreferredExerciseMock,
      ]);
    const component = mount(signup);
    component.find('.signup-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(1);
  });

  it('should handle submit', () => {
    const useStateMock = jest.spyOn(React, 'useState');
    const setFormMock = jest.fn();
    const setPreferredExerciseMock = jest.fn();
    jest.mock('../../utils/getGuDong', () => jest.fn());
    useStateMock
      .mockReturnValueOnce([
        {
          username: 'test username',
          nickname: 'test nickname',
          password: 'test password',
          latitude: 37.12345,
          longitude: 127.12345,
          gu: '관악구',
          dong: '신림동',
          gender: '여성',
          introduction: '',
          preferredExercise: [{ exerciseName: '축구', skillLevel: '상' }],
        },
        setFormMock,
      ])
      .mockReturnValueOnce([
        { exerciseName: '', skillLevel: '' },
        setPreferredExerciseMock,
      ]);
    const component = mount(signup);
    component.find('.signup-submit-button').simulate('click');
    expect(window.alert).toBeCalledTimes(0);
  });
});
