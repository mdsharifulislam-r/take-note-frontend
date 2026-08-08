import { baseApi } from '@/lib/api';
import type { ApiSuccessResponse, InterestGroup, UserWithPosts } from '@/types';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsersByInterests: builder.query<ApiSuccessResponse<InterestGroup[]>, void>({
      query: () => '/admin/users-by-interests',
      providesTags: ['Admin'],
    }),
    getUserPosts: builder.query<ApiSuccessResponse<UserWithPosts>, string>({
      query: (userId) => `/admin/users/${userId}/posts`,
      providesTags: (_result, _error, userId) => [{ type: 'Posts', id: userId }],
    }),
  }),
});

export const { useGetUsersByInterestsQuery, useGetUserPostsQuery } = adminApi;
