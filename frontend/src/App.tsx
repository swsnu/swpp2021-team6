import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.scss';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Main from './pages/Main';
import PostNew from './pages/PostNew';
import PostDetail from './pages/PostDetail';
import PostEdit from './pages/PostEdit';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
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
    </BrowserRouter>
  );
}

export default App;
