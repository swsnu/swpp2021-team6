import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Post from '../../components/Post';
import mockPosts from '../../mocks/posts.json';
import Filter from '../Filter';

const Main = () => {
  const [posts, setPosts] = useState(mockPosts);
  useEffect(() => {
    // dispatch
    // dispatch result -> setPosts
  }, []);

  return (
    <div>
      <div>
        <Filter />
      </div>
      <div>
        {posts.map((post) => (
          <Link key={post.id} to={`/post/${post.id}`}>
            <Post post={post} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Main;
