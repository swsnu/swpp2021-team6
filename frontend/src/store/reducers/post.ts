import { PostEntity } from '../../model/post';
import { DefaultAction } from '../actions/index';
import { PostAction } from '../actions/post';
import * as actionTypes from '../actions/actionType';

export type PostState = {
  posts: PostEntity[];
  post: PostEntity | null;
};

const initialState: PostState = {
  posts: [],
  post: null,
};

const reducer = (
  state: PostState = initialState,
  action: PostAction | DefaultAction = { type: 'default' },
) => {
  switch (action.type) {
    case actionTypes.ADD_POST:
      return {
        ...state,
        posts: [...state.posts, action.newPost],
        post: action.newPost,
      };
    default:
      return state;
  }
};

export default reducer;
