import { useHistory } from 'react-router';
import logo from '../../assets/image/icon/green-logo.svg';
import profileIcon from '../../assets/image/icon/profile-icon.svg';
import Notification from '../Notification';
import './index.scss';

const Navbar = () => {
  const history = useHistory();
  const loginUserId = Number(localStorage.getItem('loginUser'));

  return (
    <div className="nav-bar">
      <button className="logo" onClick={() => history.push('/main')}>
        <img src={logo} alt="woondongjang logo" />
      </button>
      <div className="nav-button-container">
        <Notification history={history} />
        <span
          className="mypage"
          aria-hidden="true"
          onClick={() => history.push(`/profile/${loginUserId}`)}
        >
          <img src={profileIcon} alt="profile-icon" />
        </span>
      </div>
    </div>
  );
};

export default Navbar;
