import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import axios from 'axios';
import { useSelector } from 'react-redux';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import SignOut from './containers/SignOut';
import Main from './containers/Main';
import PostCreate from './containers/PostCreate';
import PostDetail from './containers/PostDetail';
import PostEdit from './containers/PostEdit';
import Profile from './containers/Profile';
import ProfileEdit from './containers/ProfileEdit';
import Navbar from './containers/Navbar';
import { AppState } from './store/store';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

interface Props {
  history: History;
}

const App = ({ history }: Props) => {
  const user = useSelector((state: AppState) => state.user.user);

  return (
    <ConnectedRouter history={history}>
      {/* 로그인 user 있을 경우에만 (= SignIn, SignUp 페이지 아닐 경우) Navbar 보여주기 */}
      {user && <Navbar history={history} />}
      <Switch>
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/signout" exact component={SignOut} />
        <Route path="/main" exact component={Main} />
        <Route path="/post/new" exact component={PostCreate} />
        <Route path="/post/:id" exact component={PostDetail} />
        <Route path="/post/:id/edit" exact component={PostEdit} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/profile/edit" exact component={ProfileEdit} />
        <Route path="/profile/:id" exact component={Profile} />
        <Redirect exact from="/" to="/signin" />
        <Route render={() => <Redirect to="/signin" />} />
      </Switch>
    </ConnectedRouter>
  );
};

export default App;
