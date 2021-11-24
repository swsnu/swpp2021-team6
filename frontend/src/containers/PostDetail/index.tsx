import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router';
import axios from 'axios';
import humps from 'humps';
import { PostEntity } from '../../backend/entity/post';
import PostDetail from '../../components/PostDetail';
import { AppState } from '../../store/store';
import {
  createComment,
  deletePost,
  queryComments,
  readPost,
  readUser,
} from '../../backend/api/api';

const PostDetailContainer: React.FC = () => {
  const history = useHistory();
  const postId: number = Number(useParams<{ id: string }>().id);
  const [post, setPost] = useState<PostEntity>();

  const onPostDelete = async () => {
    await deletePost({ id: postId });
    history.push('/main');
  };

  // Fetch Post on mount
  useEffect(() => {
    readPost({ id: postId }).then((res) => {
      setPost(res.entity);
    });
  }, [postId]);

  const { user } = useSelector((state: AppState) => state.user);

  // Redirect to sign-in page if not signed in
  useEffect(() => {
    if (user === null) history.push('/signin');
  }, [user]);

  // Render Component
  if (post === undefined) return null;
  return (
    <PostDetail
      post={post}
      isHost={user?.userId === post.hostId}
      onDelete={onPostDelete}
    />
  );
};

export default PostDetailContainer;
