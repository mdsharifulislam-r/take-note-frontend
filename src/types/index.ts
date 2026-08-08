export type UserRole = 'user' | 'admin' | 'super_admin';

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
  pagination?: PaginationMeta;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
  profileImage?: string;
};

export type Profile = SessionUser & { createdAt: string };

export type AuthResponse = {
  token: string;
  user: SessionUser;
};

export type NoteAuthor = {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
};

export type Note = {
  _id: string;
  title: string;
  content: string;
  image?: string | null;
  author: string | NoteAuthor;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  interests: string[];
  profileImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type InterestGroup = {
  _id: string;
  count: number;
  users: { _id: string; name: string; email: string }[];
};

export type UserWithPosts = Omit<User, 'password'> & {
  posts: Post[];
};

export type PaginationParams = {
  page?: number;
  limit?: number;
};
