import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { History } from 'history';
import Post from '../../components/Post';
import Filter from '../Filter';
import * as actionCreators from '../../store/actions';
import './index.scss';
import { AppState } from '../../store/store';
import { PostEntity } from '../../backend/entity/post';
import AddButton from '../../components/AddButton';
import { queryPosts } from '../../backend/api/api';

const Main: React.FC = () => {
  const [posts, setPosts] = useState<PostEntity[]>();
  useEffect(() => {
    queryPosts().then((res) => setPosts(res.items));
  }, []);

  console.log('posts', posts);

  return (
    <div className="main">
      <div className="filter-container">
        <Filter />
      </div>
      <div className="post-container">
        {posts?.map((post: PostEntity) => (
          <Post key={post.postId} post={post} />
        ))}
      </div>
      <AddButton />
    </div>
  );
};

export default Main;
