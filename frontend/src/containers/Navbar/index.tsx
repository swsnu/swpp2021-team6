import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import logo from '../../assets/image/icon/green-logo.svg';
import profileIcon from '../../assets/image/icon/profile-icon.svg';
import Notification from '../Notification';
import { AppState } from '../../store/store';
import './index.scss';

const Navbar = () => {
  const history = useHistory();
  const { loginUserId } = useSelector((state: AppState) => state.user);

  return (
    <div className="nav-bar">
      <button className="logo" onClick={() => history.push('/main')}>
        <img src={logo} alt="woondongjang logo" />
      </button>
      <div className="nav-button-container">
        <Notification />
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
