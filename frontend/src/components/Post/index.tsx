import { useEffect, useState } from 'react';
import { History } from 'history';
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
  history: History;
  post: PostEntity;
}

const Post = ({ history, post }: Props) => {
  const [imgSrc, setImgSrc] = useState<string>(thumbnails.soccer[0]);
  const [labelColor, setLabelColor] = useState<string>(labelColors.blue);
  useEffect(() => {
    const idx = Math.floor(Math.random() * 4);
    let imgArray = thumbnails.soccer;
    switch (post.exerciseName) {
      case '축구':
        imgArray = thumbnails.soccer;
        break;
      case '농구':
        imgArray = thumbnails.basketball;
        break;
      // case '배드민턴':
      // imgArray = thumbnails.soccer;
      // break;
      // case '테니스':
      // imgArray = thumbnails.soccer;
      // break;
      // case '탁구':
      // type = 'tabletennis';
      // break;
      // case '러닝':
      // type = 'running';
      // break;
      // case '라이딩':
      // type = 'riding';
      // break;
      default:
        window.alert('잘못된 데이터입니다');
    }
    setImgSrc(imgArray[idx]);

    switch (post.expectedLevel) {
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
        window.alert('잘못된 데이터입니다');
    }
  }, []);
  const dateTime = dateToString(post.meetAt);

  const onClickPost = (postId: number) => {
    history.push(`/post/${postId}`);
  };

  return (
    <button className="post" onClick={() => onClickPost(post.postId)}>
      <img className="thumbnail" src={imgSrc} alt="" />
      <Label className="level-label" color={labelColor}>
        실력 : {post.expectedLevel}
      </Label>
      <div className="post-body">
        <div>
          <Avatar className="user-icon" size={35} icon={<UserOutlined />} />
        </div>
        <div>
          <p className="title">{post.title}</p>
          <p className="place">
            {post.place.gu} {post.place.dong}
          </p>
          <p className="date">{dateTime}</p>
        </div>
      </div>
      <div className="post-footer">
        <div className="keyword-container">
          {post.keywords.map((keyword, idx) => (
            <Label key={idx} color="#3B5BDB">
              {keyword}
            </Label>
          ))}
        </div>
        <div className="post-capacity">
          <UserOutlined />
          {post.memberCount} / {post.maxCapacity}
        </div>
      </div>
    </button>
  );
};

export default Post;
