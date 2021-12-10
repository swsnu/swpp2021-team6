import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import App from './App';

describe('App without signin user', () => {
  let app: any;

  beforeEach(() => {
    const history = createMemoryHistory({ initialEntries: ['/hello'] });
    const mockStore = createStore(
      combineReducers({
        router: connectRouter(history),
        user: (state = { loginUserId: null }, action) => state,
      }),
      applyMiddleware(thunk, routerMiddleware(history)),
    );

    jest.mock('react-redux', () => {
      const actualTracker = jest.requireActual('react-redux');
      return {
        ...actualTracker,
        useSelector: jest.fn((selector) => selector(mockStore.getState())),
      };
    });

    app = (
      <Provider store={mockStore}>
        <App history={history} />
      </Provider>
    );
  });

  it('should render SignIn page without errors', () => {
    const component = mount(app);
    expect(component.find('.signin-container').length).toBe(1);
  });
});

describe('App with login user', () => {
  let app: any;

  const mockUserNotification = [{ isRead: true }];

  beforeEach(() => {
    const history = createMemoryHistory({ initialEntries: ['/main'] });
    const mockStore = createStore(
      combineReducers({
        router: connectRouter(history),
        user: (
          state = {
            loginUserId: 1,
            notification: mockUserNotification,
          },
          action,
        ) => state,
      }),
      applyMiddleware(thunk, routerMiddleware(history)),
    );

    jest.mock('react-redux', () => {
      const actualTracker = jest.requireActual('react-redux');
      return {
        ...actualTracker,
        useSelector: jest.fn((selector) => selector(mockStore.getState())),
      };
    });

    app = (
      <Provider store={mockStore}>
        <App history={history} />
      </Provider>
    );
  });

  it('should show Navbar', () => {
    const component = mount(app);
    expect(component.find('.nav-bar').length).toBe(1);
  });
});
