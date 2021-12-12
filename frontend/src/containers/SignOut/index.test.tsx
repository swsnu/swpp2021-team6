import { mount } from 'enzyme';
import * as userActionCreators from '../../store/actions/user';
import SignOut from './index';
import { history } from '../../store/store';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  connect: () => jest.fn(),
}));

const mockPush = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
}));

describe('SignOut', () => {
  let signout: any;
  let spyLogoutAction: any;
  let spyHistoryPush: any;

  beforeEach(() => {
    signout = <SignOut />;
    spyLogoutAction = jest
      .spyOn(userActionCreators, 'signout')
      .mockImplementation(() => jest.fn());
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('signout renders without crashing', () => {
    const component = mount(signout);
    expect(component.find('SignOut').length).toBe(1);
  });

  it('Signout should dispatch logout correctly', () => {
    mount(signout);
    expect(spyLogoutAction).toBeCalledTimes(1);
    expect(mockPush).toBeCalledTimes(1);
  });
});
