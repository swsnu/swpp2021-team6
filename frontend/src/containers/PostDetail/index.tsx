import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';

import { PostEntity } from '../../types/post';
import PostDetail from '../../components/Post/Detail';
import { AppState } from '../../store/store';

/* TODO
post interface 만들기
*/

const PostDetailContainer = ({
  history,
}: {
  history: RouteComponentProps['history'];
}) => {
  const postId = useParams<{ id: string }>().id;
  const [post, setPost] = useState<PostEntity>();

  // Fetch Post on mount
  useEffect(() => {
    // TODO: api.ts로 옮기기
    const getPost = async ({ id }: { id: string }): Promise<PostEntity> =>
      (await axios.get(`/posts/${id}`)).data;

    getPost({ id: postId }).then((p) => setPost(p));
  }, [postId]);

  const { user } = useSelector((state: AppState) => state.user);

  // Redirect to sign-in page if not signed in
  useEffect(() => {
    if (user === null) history.push('/signin');
  }, [user]);

  // Render Component
  if (post === undefined) return null;
  return <PostDetail post={post} isHost={user?.id === post.host_id} />;
};

export default PostDetailContainer;
