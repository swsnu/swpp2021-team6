import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Post from '../../components/Post';
import mockPosts from '../../mocks/posts.json';
import Filter from '../Filter';
import './index.scss';

const Main = () => {
  const [posts, setPosts] = useState(mockPosts);
  useEffect(() => {
    // dispatch
    // dispatch result -> setPosts
  }, []);

  return (
    <div className="main">
      <div className="filter-container">
        <Filter />
      </div>
      <div className="post-container">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Main;
