import axios from 'axios';
import { Dispatch } from 'redux';
import { push } from 'connected-react-router';
import * as actionTypes from './actionTypes';
import { PostEntity, CreatePostEntity } from '../../types/post';

export const getPosts_ = (posts: PostEntity[]) => ({
  type: actionTypes.GET_POSTS,
  posts,
});

// TODO: 필터를 어떻게 보낼지? 별도의 함수? or 파라미터에 query? 포함해서?
export const getPosts = () => async (dispatch: Dispatch<any>) => {
  try {
    const response = await axios.get('/posts/');
    console.log(response.data);
    dispatch(getPosts_(response.data));
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
    console.log(response);
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
    const response = await axios.post('/posts/', post);
    dispatch(createPost_(response.data));
    dispatch(push(`/post/${response.data.post_id}`));
  };

export type PostAction =
  | ReturnType<typeof getPosts_>
  | ReturnType<typeof getPost_>
  | ReturnType<typeof createPost_>;
