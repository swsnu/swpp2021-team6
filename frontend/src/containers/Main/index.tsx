import React, { useEffect, useState } from 'react';
import Post from '../../components/Post';
import Filter from '../Filter';
import './index.scss';
import { PostEntity } from '../../backend/entity/post';
import AddButton from '../../components/AddButton';
import { queryPosts } from '../../backend/api/api';
import { FilterInputDTO } from '../../backend/entity/exercise';

const Main: React.FC = () => {
  const [posts, setPosts] = useState<PostEntity[]>();
  const [filterArray, setFilterArray] = useState<FilterInputDTO[]>([]);

  useEffect(() => {
    queryPosts().then((res) => setPosts(res.items));
  }, []);

  console.log('filterArray', filterArray);

  return (
    <div className="main">
      <div className="filter-container">
        <Filter filterArray={filterArray} setFilterArray={setFilterArray} />
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
