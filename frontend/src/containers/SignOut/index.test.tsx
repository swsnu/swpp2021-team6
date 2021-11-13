import React from 'react';
import { mount } from 'enzyme';
import * as userActionCreators from '../../store/actions/user';
import SignOut from './index';
import { history } from '../../store/store';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  connect: () => jest.fn(),
}));

describe('SignOut', () => {
  let signout: any;
  let spyLogoutAction: any;
  let spyHistoryPush: any;

  beforeEach(() => {
    signout = <SignOut history={history} />;
    spyLogoutAction = jest
      .spyOn(userActionCreators, 'signout')
      .mockImplementation(() => jest.fn());
    spyHistoryPush = jest.spyOn(history, 'push').mockImplementation(jest.fn());
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
    expect(spyHistoryPush).toBeCalledWith('/signin');
  });
});
