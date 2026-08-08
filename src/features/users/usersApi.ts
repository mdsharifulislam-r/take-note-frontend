import { baseApi } from '@/lib/api';
import type { ApiSuccessResponse, User, UserRole, PaginationParams } from '@/types';

export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  interests?: string[];
};

export type UpdateUserRequest = {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  interests?: string[];
};

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiSuccessResponse<User[]>, PaginationParams>({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/users?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Users' as const, id: _id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    getUserById: builder.query<ApiSuccessResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),
    createUser: builder.mutation<ApiSuccessResponse<User>, CreateUserRequest>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateUser: builder.mutation<ApiSuccessResponse<User>, UpdateUserRequest>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
    deleteUser: builder.mutation<ApiSuccessResponse<null>, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
