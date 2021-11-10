import { useState } from 'react';
import { History } from 'history';
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
      <div>
        <span
          className="Logo"
          aria-hidden="true"
          onClick={() => history.push('/main')}
        >
          운동장
        </span>
      </div>
      <div>
        <span aria-hidden="true" onClick={onClickNoti}>
          알림
        </span>
        <span aria-hidden="true" onClick={() => history.push('/profile')}>
          마이페이지
        </span>
      </div>
    </div>
  );
};

export default Navbar;
