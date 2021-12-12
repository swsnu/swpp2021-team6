/* eslint-disable no-proto */
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import axios from 'axios';
import mockStore from '../../store/store';
import SignUp from '.';

window.alert = jest.fn().mockImplementation();
const mockPush = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
}));

describe('SignUp', () => {
  let signUp: any;

  beforeEach(() => {
    signUp = (
      <Provider store={mockStore}>
        <SignUp />
      </Provider>
    );

    jest
      .spyOn(reactRedux, 'useSelector')
      .mockReturnValue({ loginUserId: null });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without error', () => {
    const component = mount(signUp);
    expect(component.find('.signup-container').length).toBe(1);
  });

  it('should change form state with input change', () => {
    const component = mount(signUp);
    const signUpButton = component.find('#local-signup-button').at(0);

    signUpButton.simulate('click');
    expect(window.alert).toBeCalledTimes(1);

    component
      .find('#username')
      .simulate('change', { target: { value: 'test username' } });
    signUpButton.simulate('click');
    expect(window.alert).toBeCalledTimes(2);

    component
      .find('#password')
      .simulate('change', { target: { value: 'test password' } });
    signUpButton.simulate('click');
    expect(window.alert).toBeCalledTimes(3);

    component
      .find('#password-verify')
      .simulate('change', { target: { value: 'test password verify' } });
    signUpButton.simulate('click');
    expect(window.alert).toBeCalledTimes(4);
  });

  it('should dispatch signUp action & redirect to onboarding page', () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ entity: { userId: 1 } });
    const component = mount(signUp);
    component
      .find('#username')
      .simulate('change', { target: { value: 'test username' } });
    component
      .find('#password')
      .simulate('change', { target: { value: 'test password' } });
    component
      .find('#password-verify')
      .simulate('change', { target: { value: 'test password' } });
    component.find('#local-signup-button').at(0).simulate('click');
  });

  it('should handle key press on inputs', () => {
    const component = mount(signUp);
    component.find('#username').simulate('keypress', { key: 'Enter' });
    component.find('#password').simulate('keypress', { key: 'Enter' });
    component.find('#password-verify').simulate('keypress', { key: 'Enter' });
  });

  it('should move to SignIn page when clicking SignIn button', () => {
    const component = mount(signUp);
    component.find('.signin-button').simulate('click');
  });
});

describe('SignUp with login user', () => {
  let signUp: any;
  beforeEach(() => {
    signUp = (
      <Provider store={mockStore}>
        <SignUp />
      </Provider>
    );

    jest.spyOn(reactRedux, 'useSelector').mockReturnValue({ loginUserId: 1 });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('should redirect to main page', () => {
    const component = mount(signUp);
  });
});
