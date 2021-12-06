import { useEffect, useState } from 'react';
import { History } from 'history';
import Post from '../../components/Post';
import Filter from '../Filter';
import './index.scss';
import { PostEntity } from '../../backend/entity/post';
import AddButton from '../../components/AddButton';
import { queryFilterPosts, queryPosts } from '../../backend/api/api';
import { FilterInputDTO } from '../../backend/entity/exercise';

interface Props {
  history: History;
}

const Main = ({ history }: Props) => {
  const [posts, setPosts] = useState<PostEntity[]>();
  const [filterArray, setFilterArray] = useState<FilterInputDTO[]>([]);
  const user = window.localStorage.getItem('profileInfo') || null;

  useEffect(() => {
    if (!user) history.push('/signin');

    queryPosts()
      .then((res) => setPosts(res.items))
      .catch((reason) => console.log(reason));
  }, []);

  const getQueryString = (arr: FilterInputDTO[]) => {
    let search = '';
    arr.forEach((val, idx) => {
      if (idx !== 0) search += '&';
      search += `exercise=${val.exerciseName}&level=${val.skillLevel}`;
    });

    return search;
  };

  const onClickApplyFilter = () => {
    const queryString = getQueryString(filterArray);

    queryFilterPosts(queryString)
      .then((res) => setPosts(res.items))
      .catch((reason) => console.log(reason));
  };

  // const redirect = !user ? <Redirect to="/signin" /> : null;

  return (
    <div className="main">
      <div className="filter-container">
        <Filter
          filterArray={filterArray}
          setFilterArray={setFilterArray}
          onClickApplyFilter={onClickApplyFilter}
        />
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
