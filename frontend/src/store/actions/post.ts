import axios from 'axios';
import { Dispatch } from 'redux';
import { push } from 'connected-react-router';
import * as actionTypes from './actionType';
import { PostEntity, CreatePostEntity } from '../../model/post';

// export const getPosts_ = (posts: PostEntity[]) => ({
//   type: actionTypes.GET_POSTS,
//   posts,
// });

/*
TODO: 필터를 어떻게 보낼지? 별도의 함수? or 파라미터에 query? 포함해서?
export const getPosts = () => {}
*/

export const createPost_ = (post: PostEntity) => ({
  type: actionTypes.ADD_POST,
  newPost: post,
});

export const createPost =
  (post: CreatePostEntity) => async (dispatch: Dispatch<any>) => {
    const response = await axios.post('/posts/', post);
    dispatch(createPost_(response.data));
    dispatch(push(`/post/${response.data.id}`));
  };

export type PostAction = ReturnType<typeof createPost_>;
