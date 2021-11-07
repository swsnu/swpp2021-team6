import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { History } from 'history';
import './App.scss';
import SignIn from './containers/SignIn';
import SignUp from './containers/SignUp';
import Main from './containers/Main';
import PostNew from './containers/PostNew';
import PostDetail from './containers/PostDetail';
import PostEdit from './containers/PostEdit';
import Profile from './containers/Profile';
import Navbar from './containers/Navbar';

interface Props {
  history: History;
}

const App = ({ history }: Props) => (
  <ConnectedRouter history={history}>
    <div className="App">
      <Navbar history={history} />
      <Switch>
        <Route path="/signin" exact component={SignIn} />
        <Route path="/signup" exact component={SignUp} />
        <Route path="/main" exact component={Main} />
        <Route path="/post/new" exact component={PostNew} />
        <Route path="/post/:id" exact component={PostDetail} />
        <Route path="/post/:id/edit" exact component={PostEdit} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/profile/:id" exact component={Profile} />
        <Redirect exact from="/" to="/signin" />
        <Route render={() => <Redirect to="/signin" />} />
      </Switch>
    </div>
  </ConnectedRouter>
);

export default App;
