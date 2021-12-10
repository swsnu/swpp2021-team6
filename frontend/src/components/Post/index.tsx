import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { PostEntity } from '../../backend/entity/post';
import * as thumbnails from '../../utils/thumbnails';
import './index.scss';
import { changeDateFormat2 } from '../../utils/dateToString';
import Label from '../Label';
import * as labelColors from '../../style/labelColors';
import capacityIcon from '../../assets/image/main/capacity.svg';

interface Props {
  post: PostEntity;
}

const Post: React.FC<Props> = ({ post }: Props) => {
  const history = useHistory();
  const [imgSrc, setImgSrc] = useState<string>(thumbnails.soccer[0]);
  const [labelColor, setLabelColor] = useState<string>(labelColors.blue);

  useEffect(() => {
    const date = new Date();
    const idx = date.getTime() % 4;
    let imgArray = thumbnails.soccer;

    switch (post.exerciseName) {
      case '축구':
        imgArray = thumbnails.soccer;
        break;
      case '농구':
        imgArray = thumbnails.basketball;
        break;
      case '배드민턴':
        imgArray = thumbnails.soccer;
        break;
      case '테니스':
        imgArray = thumbnails.soccer;
        break;
      case '탁구':
        imgArray = thumbnails.tabletennis;
        break;
      case '러닝':
        imgArray = thumbnails.running;
        break;
      case '라이딩':
        imgArray = thumbnails.riding;
        break;
      default:
        window.alert('Post: 운동 타입이 잘못 설정된 데이터가 있습니다.');
    }
    setImgSrc(imgArray[idx]);
  }, []);
  const dateTime = changeDateFormat2(post.meetAt);

  const onClickPost = (postId: number) => {
    history.push(`/post/${postId}`);
  };

  return (
    <button className="post" onClick={() => onClickPost(post.postId)}>
      <div id="place">
        {post.place.gu} {post.place.dong}
      </div>
      <img className="thumbnail" src={imgSrc} alt="" />
      <div className="date">{dateTime}</div>
      <div className="post-capacity">
        <img className="capacity-icon" src={capacityIcon} alt="" />
        {post.memberCount} / {post.maxCapacity}
      </div>
      <div className="post-body">
        <div className="title">{post.title}</div>
        <div className="host-name">{post.hostName}</div>
      </div>
      <div className="post-footer">
        <div className="keyword-container">
          {post.keywords.map((keyword, idx) => (
            <Label key={idx} font="#247100" color="rgba(36, 113, 0, 0)">
              {keyword}
            </Label>
          ))}
        </div>
      </div>
    </button>
  );
};

export default Post;
