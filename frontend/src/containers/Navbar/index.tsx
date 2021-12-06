import { History } from 'history';
import logo from '../../assets/icon/green-logo.svg';
import profileIcon from '../../assets/icon/default-profile.svg';
import './index.scss';
import Notification from '../Notification';

interface NavbarProps {
  history: History;
}

const Navbar = ({ history }: NavbarProps) => (
  <div className="nav-bar">
    <button className="logo" onClick={() => history.push('/main')}>
      <img src={logo} alt="woondongjang logo" />
    </button>
    <div className="button-container">
      <Notification history={history} />
      <span
        className="mypage"
        aria-hidden="true"
        onClick={() => history.push('/profile/my')}
      >
        <img src={profileIcon} alt="profile-icon" />
      </span>
    </div>
  </div>
);

export default Navbar;
