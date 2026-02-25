export type UserRole = 'admin' | 'member';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthResponse {
  user: IUserResponse;
  accessToken: string;
  refreshToken: string;
}
