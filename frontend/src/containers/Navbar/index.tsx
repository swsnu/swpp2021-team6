import { History } from 'history';
import logo from '../../assets/logo.png';
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
        onClick={() => history.push('/profile')}
      >
        마이페이지
      </span>
    </div>
  </div>
);

export default Navbar;
