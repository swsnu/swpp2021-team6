/* eslint-disable indent */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { History } from 'history';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Dropdown } from 'antd';
import humps from 'humps';
import { AppState } from '../../store/store';
import notiIconWithDot from '../../assets/image/icon/noti-with-dot.svg';
import notiIcon from '../../assets/image/icon/noti-without-dot.svg';
import notiDot from '../../assets/image/icon/noti-dot.svg';
import {
  getUserInfo,
  getUserNotification,
  readNotification,
} from '../../store/actions/user';
import './index.scss';
import { UserInfoEntity } from '../../backend/entity/user';

interface NotificationProps {
  history: History;
}

const Notification = ({ history }: NotificationProps) => {
  // const [postTitle, setPostTitle] = useState<string>('');
  const dispatch = useDispatch();
  const userState = useSelector((state: AppState) => state.user);
  // const userInfo = humps.camelizeKeys(mockUserInfo) as UserInfoEntity;
  // const mockNotifications = humps.camelizeKeys(notifications);
  const loginProfile = window.localStorage.getItem('profileInfo');
  let parsedLoginProfile: any;
  if (loginProfile !== null) {
    parsedLoginProfile = JSON.parse(loginProfile);
  }

  useEffect(() => {
    if (parsedLoginProfile) {
      dispatch(getUserNotification(parsedLoginProfile.userId));
      if (loginProfile !== null) {
        parsedLoginProfile = JSON.parse(loginProfile);
      }
    }
    console.log(userState.userNotification === null);
  }, [loginProfile]);

  const getMessage = (postTitle: string, notiType: string) => {
    let displayedTitle = postTitle;
    if (postTitle.length > 10) {
      displayedTitle = postTitle.slice(0, 10);
      displayedTitle += '...';
    }

    let message;
    switch (notiType) {
      case 'request participation':
        message = `"${displayedTitle}" 게시글에 참가 신청이 있습니다.`;
        break;
      case 'request approved':
        message = `"${displayedTitle}" 게시글에 참가 신청이 승인되었습니다.`;
        break;
      case 'request denied':
        message = `"${displayedTitle}" 게시글에 참가 신청이 거절되었습니다.`;
        break;
      case 'comment':
        message = `"${displayedTitle}" 게시글에 댓글이 달렸습니다.`;
        break;
      default:
        message = '';
    }
    return message;
  };

  const onClickNotification = (notiId: number, postId: number) => {
    dispatch(readNotification(notiId));
    history.push(`/post/${postId}`);
  };

  const myNotis = () => (
    <Menu>
      {userState.userNotification === null ||
      userState.userNotification.length === 0 ? (
        <div style={{ margin: '0 5 0 5' }}>
          <span style={{ margin: '0 20 0 20' }}>표시할 알림이 없습니다</span>
        </div>
      ) : (
        userState.userNotification.map((notification: any) => (
          // <Menu.Item
          //   key={notification.notiId}
          //   className={notification.isRead === true ? 'read' : 'unread'}
          // >
          <div
            className="noti-item-container"
            onClick={() =>
              onClickNotification(notification.notiId, notification.postId)
            }
          >
            <div className="noti-left">
              <div className="noti-text">
                <span className="noti-text" aria-hidden="true">
                  {getMessage(notification.postTitle, notification.notiType)}
                </span>
              </div>
              <div>
                <span className="noti-time">{notification.createdAt}</span>
              </div>
            </div>
            <div className="noti-right">
              <img
                className={notification.isRead ? 'read' : 'noti-dot'}
                src={notiDot}
                alt="noti-dot"
              />
            </div>
          </div>
          /* </Menu.Item> */
        ))
      )}
    </Menu>
  );

  return (
    <Dropdown overlay={myNotis} trigger={['click']} placement="bottomRight">
      {/* <span
        className="notification"
        aria-hidden="true"
        onClick={(e) => e.preventDefault()}
      > */}
      {userState.userNotification !== null ? (
        <img
          className="noti-icon"
          src={
            userState.userNotification.filter(
              (noti: any) => noti.isRead === false,
            ).length > 0
              ? notiIconWithDot
              : notiIcon
          }
          alt="notification-icon"
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <img className="noti-icon" src={notiIcon} alt="notification-icon" />
      )}
      {/* </span> */}
    </Dropdown>
  );
};

export default Notification;
