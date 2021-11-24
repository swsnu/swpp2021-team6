import axios from 'axios';
import { CommentEntity, CreateCommentEntity } from '../entity/comment';
import { CreatePostEntity, PostEntity, UpdatePostEntity } from '../entity/post';
import { UserEntity } from '../entity/user';
import {
  CreateProps,
  produceCreateAPI,
  produceDeleteAPI,
  produceQueryAPI,
  produceReadAPI,
  produceUpdateAPI,
  queryReturnType,
} from './apiUtils';

export const createPost = produceCreateAPI<CreatePostEntity, PostEntity>(
  '/posts/',
);
export const queryPosts = produceQueryAPI<PostEntity>('/posts');
export const readPost = produceReadAPI<PostEntity>('/posts');
export const deletePost = produceDeleteAPI('/posts');
export const updatePost = produceUpdateAPI<UpdatePostEntity>('/posts');

export const queryUsers = produceQueryAPI<UserEntity>('/users');
export const readUser = produceReadAPI<UserEntity>('/users');
export const updateUser = produceUpdateAPI<UserEntity>('/users');

export const queryComments = async ({
  postId,
}: {
  postId: number;
}): Promise<queryReturnType<CommentEntity>> => {
  const res = await axios.get(`posts/${postId}/comments`);
  return { items: res.data };
};

export const createComment = async ({
  createPayload,
  postId,
}: CreateProps<CreateCommentEntity> & { postId: string }): Promise<{
  entityId: string;
}> => {
  const res: any = await axios.post(`posts/${postId}/comments`, createPayload);
  return { entityId: `${res.data.id}` };
};

export const readComment = produceReadAPI<CommentEntity>('/comments');
export const updateComment = produceUpdateAPI<CommentEntity>('/comments');
export const deleteComemnt = produceDeleteAPI('/comments');
