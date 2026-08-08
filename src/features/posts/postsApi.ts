import { baseApi } from '@/lib/api';
import type { ApiSuccessResponse, Post } from '@/types';

export type CreatePostRequest = {
  title: string;
  content: string;
};

export const postsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<ApiSuccessResponse<Post>, CreatePostRequest>({
      query: (body) => ({
        url: '/users/posts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Posts'],
    }),
  }),
});

export const { useCreatePostMutation } = postsApi;
