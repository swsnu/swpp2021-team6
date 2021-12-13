import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter } from 'connected-react-router';
import { history, middlewares } from '../store/store';

const getMockUserReducer = jest.fn(
  (initialState) =>
    (state = initialState, action: any) =>
      state,
);

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

export const getMockStore = (initialState: any) => {
  const mockUserReducer = getMockUserReducer(initialState);
  const rootReducer = combineReducers({
    user: mockUserReducer,
    router: connectRouter(history),
  });
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const mockStore = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
  return mockStore;
};
