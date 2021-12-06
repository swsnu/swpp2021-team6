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
        user: (state = { user: null }, action) => state,
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

describe('App with signin user', () => {
  let app: any;
  const mockUserProfile = {
    userId: 1,
    nickname: 'juyoung',
    latitude: 37.12345,
    longitude: 127.12345,
  };

  beforeEach(() => {
    const history = createMemoryHistory({ initialEntries: ['/main'] });
    const mockStore = createStore(
      combineReducers({
        router: connectRouter(history),
        user: (state = { user: mockUserProfile }, action) => state,
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
