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
    queryPosts()
      .then((res) => setPosts(res.items))
      .catch((reason) => console.log(reason));
  }, []);

  // const getQueryString = (arr: FilterInputDTO[]) => {
  //   let search = '';
  //   arr.forEach((val, idx) => {
  //     if (idx === 0) search += '?';
  //     if (idx !== 0) search += '&';
  //     search += `exercise=${val.exerciseName}&level=${val.skillLevel}`;
  //   });

  //   return search;
  // };

  // const onClickApplyFilter = () => {
  //   const queryString = getQueryString(filterArray);
  //   // TODO: Filter 컨테이너 내에서 적용 버튼 누르면 getQuery with string
  // };

  // TODO: filterArray & queryString 리셋 with 리셋 버튼

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
