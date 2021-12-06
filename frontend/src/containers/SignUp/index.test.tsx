/* eslint-disable no-proto */
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { history } from '../../store/store';
import { getMockStore } from '../../test-utils/mocks';
import SignUp from '.';
import Main from '../Main';

const mockStore = getMockStore({});

jest.spyOn(window.localStorage.__proto__, 'getItem');
window.localStorage.__proto__.getItem = jest
  .fn()
  .mockReturnValue({ username: 'test', password: 'test' });

window.alert = jest.fn().mockImplementation();

const spyHistoryPush = jest
  .spyOn(history, 'push')
  .mockImplementation(jest.fn());

describe('SignUp', () => {
  let signUp: any;
  const mockUser = {
    username: 'test',
    password: 'test',
  };

  beforeEach(() => {
    signUp = (
      <Provider store={mockStore}>
        <SignUp history={history} />
      </Provider>
    );
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

  it('should dispatch signUp action with inputs filled', () => {
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

  it('should move to SignIn page when clicking SignIn button', () => {
    const component = mount(signUp);
    component.find('.signin-button').simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
  });
});

describe('SignUp with signIn user', () => {
  const mockUserProfile = {
    userId: 1,
    nickname: 'juyoung',
    latitude: 37.12345,
    longitude: 127.12345,
  };

  let signUp: any;
  beforeEach(() => {
    signUp = (
      <Router>
        <Main history={history} />
        <SignUp history={history} />
      </Router>
    );
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest
      .fn()
      .mockReturnValue(mockUserProfile);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should redirect to Main page', () => {
    const component = mount(signUp);
    expect(component.find('.main').length).toBe(1);
  });
});
