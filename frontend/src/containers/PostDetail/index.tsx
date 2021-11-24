import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { History } from 'history';
import axios from 'axios';
import humps from 'humps';
import { PostEntity } from '../../types/post';
import PostDetail from '../../components/PostDetail';
import { AppState } from '../../store/store';

interface Props {
  history: History;
}

const PostDetailContainer = ({ history }: Props) => {
  const postId = useParams<{ id: string }>().id;
  const [post, setPost] = useState<PostEntity>();

  // Fetch Post on mount
  useEffect(() => {
    // TODO: api.ts로 옮기기
    const getPost = async ({ id }: { id: string }): Promise<PostEntity> =>
      (await axios.get(`/posts/${id}`)).data;

    getPost({ id: postId }).then((value) =>
      setPost(humps.camelizeKeys(value) as PostEntity),
    );
  }, [postId]);

  const { user } = useSelector((state: AppState) => state.user);

  // Redirect to sign-in page if not signed in
  useEffect(() => {
    if (user === null) history.push('/signin');
  }, [user]);

  // Render Component
  if (post === undefined) return null;
  return <PostDetail post={post} isHost={user?.userId === post.hostId} />;
};

export default PostDetailContainer;
