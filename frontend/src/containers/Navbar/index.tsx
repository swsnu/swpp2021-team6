import { History } from 'history';
import logo from '../../assets/image/logo.png';
import noti from '../../assets/image/icon/notification.png';
import './index.scss';

interface NavbarProps {
  history: History;
}

const Navbar = ({ history }: NavbarProps) => {
  const onClickNoti = () => {
    alert('noti open!');
  };

  return (
    <div className="nav-bar">
      <button className="logo" onClick={() => history.push('/main')}>
        <img src={logo} alt="woondongjang logo" />
      </button>
      <div className="button-container">
        <span className="notification" aria-hidden="true" onClick={onClickNoti}>
          알림
          {/* TODO: 평소에는 visibility: hidden 이다가 알람 있을 경우 visibility: visible */}
          <img src={noti} alt="notification" />
        </span>
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
};

export default Navbar;
