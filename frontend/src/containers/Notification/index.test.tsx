/* eslint-disable object-shorthand */
import { mount } from 'enzyme';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import mockNotis from '../../mocks/notification.json';
import Notification from '.';
import { history } from '../../store/store';

const mockPush = jest.fn();
const useSelectorMock = jest.spyOn(reactRedux, 'useSelector');
const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: () => ({ push: mockPush }),
}));

const mockStore = createStore(
  combineReducers({
    router: connectRouter(history),
    user: (state = { loginUsrId: 1, notification: mockNotis }, action) => state,
  }),
  applyMiddleware(routerMiddleware(history)),
);

describe('Notification', () => {
  let noti: any;

  beforeEach(() => {
    noti = (
      <Provider store={mockStore}>
        <Notification />
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
    useDispatchMock.mockImplementation(() => jest.fn());
    useSelectorMock.mockReturnValue({
      loginUserId: 1,
      notification: mockNotis,
    });
    const component = mount(noti);
    expect(component.find('.dropdown').length).toBeTruthy();
  });

  it('should dispatch getNotification', () => {
    useDispatchMock.mockImplementation(() => jest.fn());
    useSelectorMock.mockReturnValueOnce({
      loginUserId: 1,
      notification: mockNotis,
    });
    const component = mount(noti);
    component.find('.ant-dropdown-trigger').simulate('click');
    component.find('.noti-item-container').at(0).simulate('click');
    expect(mockPush).toBeCalledTimes(1);
  });
});
