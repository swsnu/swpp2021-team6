import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
// import postReducer from './reducers/post';
// import commentReducer from './reducers/comment';
// import userReducer from './reducers/user';

export const history = createBrowserHistory();

const rootReducer = combineReducers({
  // post: postReducer,
  // comment: commentReducer,
  // user: userReducer,
  router: connectRouter(history),
});

export type AppState = ReturnType<typeof rootReducer>;

export const middlewares = [thunk, routerMiddleware(history)];
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

export default store;
