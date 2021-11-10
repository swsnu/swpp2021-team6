import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { PostEntity } from '../../types/post';
import * as thumbnails from '../../utils/thumbnails';
import './index.scss';
import dateToString from '../../utils/dateToString';
import Label from '../Label';
import * as labelColors from '../../constants/labelColors';

interface Props {
  post: PostEntity;
}

const Post = ({ post }: Props) => {
  const [imgSrc, setImgSrc] = useState<string>('');
  const [labelColor, setLabelColor] = useState<string>('');
  useEffect(() => {
    const idx = Math.floor(Math.random() * 4);
    let imgArray;
    switch (post.exercise) {
      case '축구':
        // type = 'soccer';
        imgArray = thumbnails.soccer;
        break;
      case '농구':
        // type = 'basketball';
        imgArray = thumbnails.basketball;
        break;
      // case '배드민턴':
      //   // type = 'badminton';
      //   break;
      // case '테니스':
      //   // type = 'tennis';
      //   break;
      // case '탁구':
      //   // type = 'tabletennis';
      //   break;
      // case '러닝':
      //   // type = 'running';
      //   break;
      // case '라이딩':
      //   // type = 'riding';
      //   break;
      default:
        imgArray = thumbnails.soccer;
    }
    setImgSrc(imgArray[idx]);

    switch (post.expected_level) {
      case '상':
        setLabelColor(labelColors.red);
        break;
      case '중':
        setLabelColor(labelColors.green);
        break;
      case '하':
        setLabelColor(labelColors.yellow);
        break;
      case '상관 없음':
        setLabelColor(labelColors.blue);
        break;
      default:
        setLabelColor(labelColors.blue);
    }
  }, []);
  const dateTime = dateToString(post.meet_at);

  return (
    <Link to={`/post/${post.id}`} className="post">
      <img className="thumbnail" src={imgSrc} alt="" />
      <Label className="level-label" color={labelColor}>
        실력 : {post.expected_level}
      </Label>
      <div className="post-body">
        <div>
          <Avatar className="user-icon" size={35} icon={<UserOutlined />} />
        </div>
        <div>
          <p className="title">{post.title}</p>
          <p className="place">
            {post.gu} {post.dong}
          </p>
          <p className="date">{dateTime}</p>
        </div>
      </div>
      <div className="post-footer">
        <UserOutlined />
        {post.member_count} / {post.max_capacity}
      </div>
    </Link>
  );
};

export default Post;
