import { useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import SignOut from './containers/SignOut';
import Onboarding from './containers/Onboarding';
import Main from './containers/Main';
import PostCreate from './containers/PostCreate';
import PostDetail from './containers/PostDetail';
import PostEdit from './containers/PostEdit';
import Profile from './containers/Profile';
import ProfileEdit from './containers/ProfileEdit';
import Navbar from './containers/Navbar';
import { AppState } from './store/store';
import { autoSignin } from './store/actions/user';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const App = ({ history }: { history: History }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(autoSignin());
  }, []);

  const { loginUserId } = useSelector((state: AppState) => state.user);

  return (
    <ConnectedRouter history={history}>
      {loginUserId ? <Navbar /> : null}
      <Switch>
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/signout" exact component={SignOut} />
        <Route path="/onboarding/:id" exact component={Onboarding} />
        <Route path="/main" exact component={Main} />
        <Route path="/post/new" exact component={PostCreate} />
        <Route path="/post/:id" exact component={PostDetail} />
        <Route path="/post/:id/edit" exact component={PostEdit} />
        <Route path="/profile/edit" exact component={ProfileEdit} />
        <Route path="/profile/:id" exact component={Profile} />
        <Redirect exact from="/" to="/signin" />
        <Route render={() => <Redirect to="/signin" />} />
      </Switch>
    </ConnectedRouter>
  );
};

export default App;
