import React from 'react';
import { mount } from 'enzyme';
import * as userActionCreators from '../../store/actions/user';
import SignIn from './index';
import { history } from '../../store/store';
import { UserSignInInputDTO } from '../../types/user';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  connect: () => jest.fn(),
}));

describe('signin', () => {
  let signin: any;
  let spyLoginAction: any;
  let spyHistoryPush: any;
  const mockUser: UserSignInInputDTO = {
    username: 'test',
    password: 'test',
  };

  beforeEach(() => {
    signin = <SignIn history={history} />;
    spyLoginAction = jest
      .spyOn(userActionCreators, 'signin')
      .mockImplementation(() => jest.fn());
    spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Login renders without crashing', () => {
    const component = mount(signin);
    expect(component.find('SignIn').length).toBe(1);
    expect(component.find('input').length).toBe(2);
    expect(component.find('button').length).toBe(3);
  });

  it('Signin should dispatch signin correctly', () => {
    const component = mount(signin);
    const inputList = component.find('input');
    inputList
      .find('#username')
      .simulate('change', { target: { value: mockUser.username } }); // username
    inputList
      .find('#password')
      .simulate('change', { target: { value: mockUser.password } }); // password

    const signinButton = component.find('button#local-signin-button');
    signinButton.simulate('click');
    expect(spyLoginAction).toBeCalledTimes(1);
    expect(spyLoginAction).toBeCalledWith(mockUser);
  });

  it('Login should not dispatch login with insufficient inputs', () => {
    const component = mount(signin);
    const inputList = component.find('input');
    const loginButton = component.find('button#local-signin-button');
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation();

    inputList
      .find('#username')
      .simulate('change', { target: { value: mockUser.username } }); // username

    loginButton.simulate('click');
    expect(spyLoginAction).toBeCalledTimes(0);
    expect(spyAlert).toBeCalledTimes(1);

    inputList.find('#username').simulate('change', { target: { value: '' } }); // username to null
    inputList
      .find('#password')
      .simulate('change', { target: { value: mockUser.password } }); // password
    loginButton.simulate('click');
    expect(spyLoginAction).toBeCalledTimes(0);
    expect(spyAlert).toBeCalledTimes(2);
  });

  it('signup button should push to signup page', () => {
    const component = mount(signin);
    const signupButton = component.find('button#signup-button');

    signupButton.simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
    expect(spyHistoryPush).toBeCalledWith('/signup');
  });

  it('should call login function on pressing enter at username', () => {
    const component = mount(signin);
    const inputList = component.find('input');

    inputList
      .find('#username')
      .simulate('change', { target: { value: mockUser.username } }); // username
    inputList
      .find('#password')
      .simulate('change', { target: { value: mockUser.password } }); // password

    inputList.find('#username').simulate('keypress', { key: 'Enter' });
    expect(spyLoginAction).toBeCalledTimes(1);
  });

  it('should not call login function on pressing non-enter at input', () => {
    const component = mount(signin);
    const inputList = component.find('input');

    inputList
      .find('#username')
      .simulate('change', { target: { value: mockUser.username } }); // username
    inputList
      .find('#password')
      .simulate('change', { target: { value: mockUser.password } }); // password

    inputList.find('#username').simulate('keypress', { key: 'backspace' });
    expect(spyLoginAction).toBeCalledTimes(0);
  });
});
