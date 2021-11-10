import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Post from '../../components/Post';
import mockPosts from '../../mocks/posts.json';
import Filter from '../Filter';
import * as actionCreators from '../../store/actions';
import './index.scss';
import { AppState } from '../../store/store';
import { PostEntity } from '../../types/post';

const Main = () => {
  // const [posts, setPosts] = useState(mockPosts);
  const posts = useSelector((state: AppState) => state.post?.posts);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actionCreators.getPosts());
  }, []);

  return (
    <div className="main">
      <div className="filter-container">
        <Filter />
      </div>
      <div className="post-container">
        {posts.map((post: PostEntity) => (
          <Post key={post.post_id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Main;
