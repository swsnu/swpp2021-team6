import axios from 'axios';
import humps from 'humps';
import { CommentEntity, CreateCommentEntity } from '../entity/comment';
import { CreatePostEntity, PostEntity, UpdatePostDTO } from '../entity/post';
import {
  ProfileDTO,
  SignUpDTO,
  SignupInfo,
  UserEntity,
  UserProfileInfo,
  UserSignInInputDTO,
} from '../entity/user';
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
export const updatePost = produceUpdateAPI<UpdatePostDTO>('/posts');

export const createUser = produceCreateAPI<SignUpDTO, SignupInfo>(
  '/users/signup',
);
export const createUserProfile = async ({
  createPayload,
  userId,
}: CreateProps<ProfileDTO> & { userId: number }): Promise<{
  entity: UserProfileInfo;
}> => {
  const res = await axios.post(`/users/${userId}`, createPayload);
  console.log(`res${res}`);
  return { entity: res.data };
};

export const queryUsers = produceQueryAPI<UserEntity>('/users');
export const readUser = produceReadAPI<UserEntity>('/users');
export const updateUser = produceUpdateAPI<UserEntity>('/users');

export const queryFilterPosts = async (
  filterString: string,
): Promise<queryReturnType<PostEntity>> => {
  const res = await axios.get(`/posts/?${filterString}`);
  return { items: humps.camelizeKeys(res.data) as PostEntity[] };
};

export const queryComments = async ({
  postId,
}: {
  postId: number;
}): Promise<queryReturnType<CommentEntity>> => {
  const res = await axios.get(`/posts/${postId}/comments`);
  return { items: res.data };
};

export const createComment = async ({
  createPayload,
  postId,
}: CreateProps<CreateCommentEntity> & { postId: number }): Promise<{
  entityId: string;
}> => {
  const res: any = await axios.post(`/posts/${postId}/comments`, createPayload);
  return { entityId: `${res.data.id}` };
};

export const readComment = produceReadAPI<CommentEntity>('/posts/comments');
export const updateComment = produceUpdateAPI<CommentEntity>('/posts/comments');
export const deleteComment = produceDeleteAPI('/posts/comments');
