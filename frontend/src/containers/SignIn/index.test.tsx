/* eslint-disable no-proto */
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import userInfo from '../../mocks/userInfo.json';
import * as userActionCreators from '../../store/actions/user';
import mockStore, { history } from '../../store/store';
import SignIn from '.';

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');

const mockPush = jest.fn();
const mockDispatch = jest.fn();

const mockUserProfile = {
  userId: 1,
  nickname: 'juyoung',
  latitude: 37.12345,
  longitude: 127.12345,
};
const mockUser = {
  username: 'juyoung',
  password: 'test',
};
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const spyAlert = jest.spyOn(window, 'alert').mockImplementation();
const spyHistoryPush = jest
  .spyOn(history, 'push')
  .mockImplementation(jest.fn());

const spySignInAction: any = jest
  .spyOn(userActionCreators, 'signin')
  .mockImplementation(() => jest.fn());

describe('SignIn without user', () => {
  let signIn: any;

  beforeEach(() => {
    signIn = (
      <Provider store={mockStore}>
        <SignIn />
      </Provider>
    );
    useSelectorMock.mockImplementation((callback) =>
      callback({ user: { user: userInfo } }),
    );
    jest.spyOn(window.localStorage.__proto__, 'getItem');
    window.localStorage.__proto__.getItem = jest.fn().mockReturnValue(null);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render without errors', () => {
    const component = mount(signIn);
    expect(component.find('.signin-container').length).toBe(1);
  });

  it('should dispatch signin correctly', () => {
    const component = mount(signIn);
    component
      .find('#username')
      .simulate('change', { target: { value: mockUser.username } });
    component
      .find('#password')
      .simulate('change', { target: { value: mockUser.password } });

    component.find('#local-signin-button').at(0).simulate('click');

    expect(spySignInAction).toBeCalledTimes(1);
    expect(spySignInAction).toBeCalledWith(mockUser);
  });

  it('should not dispatch signIn action with insufficient inputs', () => {
    const component = mount(signIn);
    const signInButton = component.find('button#local-signin-button');

    // without username
    component
      .find('#username')
      .simulate('change', { target: { value: mockUser.username } });
    signInButton.simulate('click');
    expect(spySignInAction).toBeCalledTimes(0);
    expect(spyAlert).toBeCalledTimes(1);

    // without password
    component.find('#username').simulate('change', { target: { value: '' } });
    component
      .find('#password')
      .simulate('change', { target: { value: mockUser.password } });
    signInButton.simulate('click');
    expect(spySignInAction).toBeCalledTimes(0);
    expect(spyAlert).toBeCalledTimes(2);
  });

  it('should move to SignUp page when clicking SignUp button', () => {
    const component = mount(signIn);
    const signupButton = component.find('span.signup-button');
    signupButton.simulate('click');
    expect(mockPush).toBeCalledWith('/signup');
  });

  it('should dispatch signIn action on pressing enter', () => {
    const component = mount(signIn);
    component
      .find('#username')
      .simulate('change', { target: { value: mockUser.username } });
    component
      .find('#password')
      .simulate('change', { target: { value: mockUser.password } });

    component.find('#username').simulate('keypress', { key: 'Enter' });

    expect(spySignInAction).toBeCalledTimes(1);
  });

  it('should not dispatch signIn action on pressing non-enter at input', () => {
    const component = mount(signIn);

    component
      .find('#username')
      .simulate('change', { target: { value: mockUser.username } });
    component
      .find('#password')
      .simulate('change', { target: { value: mockUser.password } });

    component.find('#username').simulate('keypress', { key: 'backspace' });
    expect(spySignInAction).toBeCalledTimes(0);
  });
});

// describe('SignIn with signIn user', () => {
//   let signIn: any;
//   beforeEach(() => {
//     signIn = (
//       <Router>
//         <Main />
//         <SignIn history={history} />
//       </Router>
//     );
//     jest.spyOn(window.localStorage.__proto__, 'getItem');
//     window.localStorage.__proto__.getItem = jest
//       .fn()
//       .mockReturnValue(mockUserProfile);
//   });
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//   afterAll(() => {
//     jest.restoreAllMocks();
//   });
//   // it('should redirect to Main page', () => {
//   //   const component = mount(signIn);
//   //   expect(component.find('.main').length).toBe(1);
//   // });
// });
