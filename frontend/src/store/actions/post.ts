import axios from 'axios';
import { Dispatch } from 'redux';
import { push } from 'connected-react-router';
import humps from 'humps';
import * as actionTypes from './actionTypes';
import { PostEntity, CreatePostEntity } from '../../backend/entity/post';

export const getPosts_ = (posts: PostEntity[]) => ({
  type: actionTypes.GET_POSTS,
  posts,
});

export const getPosts = () => async (dispatch: Dispatch<any>) => {
  try {
    const response = await axios.get('/posts/');
    const data = humps.camelizeKeys(response.data) as unknown as PostEntity[];
    dispatch(getPosts_(data));
  } catch {
    console.log('error');
  }
};

export const getPost_ = (post: PostEntity) => ({
  type: actionTypes.GET_POSTS,
  post,
});

export const getPost = (postId: number) => async (dispatch: Dispatch<any>) => {
  try {
    const response = await axios.get(`/posts/${postId}`);
    dispatch(getPost_(response.data));
  } catch {
    console.log('error');
  }
};

export const selectPost_ = (postId: number) => ({
  type: actionTypes.SELECT_POST,
  postId,
});

export const selectPost = (postId: number) => (dispatch: Dispatch<any>) => {
  dispatch(selectPost_(postId));
};

export const createPost_ = (post: PostEntity) => ({
  type: actionTypes.ADD_POST,
  post,
});

export const createPost =
  (post: CreatePostEntity) => async (dispatch: Dispatch<any>) => {
    const response = await axios.post('/posts/', humps.decamelizeKeys(post));
    const data = humps.camelizeKeys(response.data) as unknown as PostEntity;
    dispatch(createPost_(data));
    dispatch(push(`/post/${data.postId}`));
  };

export type PostAction =
  | ReturnType<typeof getPosts_>
  | ReturnType<typeof getPost_>
  | ReturnType<typeof createPost_>;
