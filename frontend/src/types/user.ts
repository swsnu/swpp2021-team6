export interface UserEntity {
  id: number;
  nickname: string;
  latitude: number;
  longitude: number;
  gu: string;
  dong: string;
  gender: string;
}

export interface UserSignInInputDTO {
  username: string;
  password: string;
}
