import { baseApi } from '@/lib/api';
import type { ApiSuccessResponse, AuthResponse, Profile } from '@/types';

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = {
  name: string;
  email: string;
  password: string;
  interests?: string[];
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiSuccessResponse<AuthResponse>, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'Profile'],
    }),
    signup: builder.mutation<ApiSuccessResponse<AuthResponse>, SignupRequest>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth', 'Profile'],
    }),
    getProfile: builder.query<ApiSuccessResponse<Profile>, void>({
      query: () => '/auth/profile',
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<ApiSuccessResponse<Profile>, FormData>({
      query: (body) => ({
        url: '/auth/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile', 'Auth'],
    }),
    healthCheck: builder.query<ApiSuccessResponse<{ status: string }>, void>({
      query: () => '/health',
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useHealthCheckQuery,
} = authApi;
