/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
// interface PostProps {
//   post: {
//     title: string;
//     place: string;
//     meetAt: string;
//     memberCount: number;
//     maxCapacity: number;
//   };
// }

import { PostEntity } from '../../model/post';

const Post = ({
  post: { title, place, meet_at, member_count, max_capacity, ...rest },
}: any) => (
  <div className="post">
    <span className="title">{title} 나오세요</span>
    <div className="place">{place}</div>
    <div className="meet-at">{meet_at}</div>
    <div className="occupance">
      {member_count}/{max_capacity}
    </div>
  </div>
);

export default Post;
