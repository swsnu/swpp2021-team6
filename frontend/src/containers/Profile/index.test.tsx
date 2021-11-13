import { Provider } from 'react-redux';
import * as reactRedux from 'react-redux';
import { mount } from 'enzyme';
import * as userActionCreators from '../../store/actions/user';
import Profile from './index';
import mockStore, { history } from '../../store/store';
import currentUser from '../../mocks/users.json';
import userInfo from '../../mocks/userInfo.json';

const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

describe('profile', () => {
  let profile: any;
  let spyLoginAction: any;
  let spyHistoryPush: any;

  beforeEach(() => {
    profile = (
      <Provider store={mockStore}>
        <Profile history={history} />
      </Provider>
    );

    useSelectorMock.mockReturnValue({ currentUser, userInfo });
    useDispatchMock.mockReturnValue(jest.fn());
    spyLoginAction = jest
      .spyOn(userActionCreators, 'signout')
      .mockImplementation(() => jest.fn());
    spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
    window.matchMedia =
      window.matchMedia ||
      // eslint-disable-next-line func-names
      function () {
        return {
          matches: false,
          addListener() {},
          removeListener() {},
        };
      };
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Profile renders without crashing', () => {
    const component = mount(profile);
    expect(component.find('Profile').length).toBe(1);
  });

  it('signout button should push to signout page', () => {
    const component = mount(profile);
    const signoutButton = component.find('.signout-button');

    signoutButton.simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
    expect(spyHistoryPush).toBeCalledWith('/signout');
  });

  it('profile edit button should push to post edit page', () => {
    const component = mount(profile);
    const signoutButton = component.find('.edit-profile-button');

    signoutButton.simulate('click');
    expect(spyHistoryPush).toBeCalledTimes(1);
    expect(spyHistoryPush).toBeCalledWith('/profile/edit');
  });
});
