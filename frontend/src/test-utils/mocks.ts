import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter } from 'connected-react-router';
import { history, middlewares, AppState } from '../store/store';

const getMockArticleReducer = jest.fn(
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
  const mockArticleReducer = getMockArticleReducer(initialState);
  const rootReducer = combineReducers({
    art: mockArticleReducer,
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
