import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Post from '../../components/Post';
import Filter from '../Filter';
import './index.scss';
import { PostEntity } from '../../backend/entity/post';
import { queryFilterPosts, queryPosts } from '../../backend/api/api';
import { FilterInputDTO } from '../../backend/entity/exercise';
import { AppState } from '../../store/store';
import plusIcon from '../../assets/image/main/plus-icon.svg';
import mainIcon from '../../assets/image/main/main-icon.svg';
import bottomIcon from '../../assets/image/main/side-bar-bottom.svg';

const Main = () => {
  const history = useHistory();
  const [posts, setPosts] = useState<PostEntity[]>();
  const [filterArray, setFilterArray] = useState<FilterInputDTO[]>([]);
  const { loginUserId } = useSelector((state: AppState) => state.user);

  const fetchPosts = async () => {
    try {
      const { items } = await queryPosts();
      setPosts(items);
    } catch {
      alert('포스트를 불러오는 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (!loginUserId) history.push('/signin');
    fetchPosts();
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

  const onClickAddButton = () => {
    history.push('/post/new');
  };

  return (
    <div className="main">
      <div id="side-bar">
        <div>
          <div id="main-icon">
            <img src={mainIcon} alt="main icon" />
          </div>
          <div id="create-post">
            <button className="plus-button" onClick={onClickAddButton}>
              <img src={plusIcon} alt="plus button" />
            </button>
          </div>
        </div>
        <div id="bottom-logo">
          <img src={bottomIcon} alt="bottom icon" />
        </div>
      </div>

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
    </div>
  );
};

export default Main;
