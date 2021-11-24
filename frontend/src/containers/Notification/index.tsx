import { History } from 'history';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, Dropdown } from 'antd';
import humps from 'humps';
import { AppState } from '../../store/store';
import notifications from '../../mocks/notification.json';
import mockUserInfo from '../../mocks/userInfo.json';
import notiIcon from '../../assets/icon/notification.png';
import { getUserNotification } from '../../store/actions/user';
import './index.scss';
import { UserInfoEntity } from '../../types/user';

interface NotificationProps {
  history: History;
}

const Notification = ({ history }: NotificationProps) => {
  // const [postTitle, setPostTitle] = useState<string>('');
  const dispatch = useDispatch();
  // const userInfo = useSelector((state: AppState) => state.user.userInfo);
  const userInfo = humps.camelizeKeys(mockUserInfo) as UserInfoEntity;
  const mockNotifications = humps.camelizeKeys(notifications);

  // useEffect(() => {
  //   dispatch(getUserNotification(userInfo?.userId));
  // }, []); //다음에 implement

  const getMessage = (type: string, postId: number) => {
    const targetPost =
      userInfo?.participatingPost.filter((post) => post.postId === postId)[0] ||
      userInfo?.hostingPost.filter((post) => post.postId === postId)[0];
    let postTitle: string = '';
    if (targetPost) {
      // setPostTitle(targetPost.title);
      postTitle = targetPost.title;
    }
    if (postTitle.length > 10) {
      // setPostTitle(postTitle.substr(0, 9).concat('...'));
      postTitle = postTitle.substr(0, 9).concat('...');
    }
    switch (type) {
      case 'request participation':
        return `"${postTitle}" 게시글에 참가 신청이 있습니다`;
      case 'request approved':
        return `"${postTitle}" 게시글에 참가 신청이 승인되었습니다`;
      case 'request denied':
        return `"${postTitle}" 게시글에 참가 신청이 거절되었습니다`;
      case 'comment':
        return `"${postTitle}" 게시글에 댓글이 달렸습니다`;
      default:
        return '';
    }
  };

  const myNotis = () => (
    <Menu>
      {mockNotifications.map((notification: any) => (
        <Menu.Item
          key={notification.id}
          className={notification.isRead === true ? 'read' : 'unread'}
        >
          <span
            aria-hidden="true"
            onClick={() => history.push(`/post/${notification.postId}`)}
          >
            {getMessage(notification.type, notification.postId)}
          </span>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown overlay={myNotis} trigger={['click']} placement="bottomRight">
      <span
        className="notification"
        aria-hidden="true"
        onClick={(e) => e.preventDefault()}
      >
        알림
        <img src={notiIcon} alt="notification" />
      </span>
    </Dropdown>
  );
};

export default Notification;
