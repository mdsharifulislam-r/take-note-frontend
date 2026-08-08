import { baseApi } from '@/lib/api';
import type { ApiSuccessResponse, Note, PaginationParams } from '@/types';

export const notesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotes: builder.query<ApiSuccessResponse<Note[]>, PaginationParams>({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/notes?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Notes' as const, id: _id })),
              { type: 'Notes', id: 'MY_LIST' },
            ]
          : [{ type: 'Notes', id: 'MY_LIST' }],
    }),
    getAllNotes: builder.query<ApiSuccessResponse<Note[]>, PaginationParams>({
      query: ({ page = 1, limit = 10 } = {}) =>
        `/notes/all?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Notes' as const, id: _id })),
              { type: 'Notes', id: 'ALL_LIST' },
            ]
          : [{ type: 'Notes', id: 'ALL_LIST' }],
    }),
    getNoteById: builder.query<ApiSuccessResponse<Note>, string>({
      query: (id) => `/notes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Notes', id }],
    }),
    createNote: builder.mutation<ApiSuccessResponse<Note>, FormData>({
      query: (body) => ({
        url: '/notes',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Notes', id: 'MY_LIST' }, { type: 'Notes', id: 'ALL_LIST' }],
    }),
    updateNote: builder.mutation<
      ApiSuccessResponse<Note>,
      { id: string; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Notes', id },
        { type: 'Notes', id: 'MY_LIST' },
        { type: 'Notes', id: 'ALL_LIST' },
      ],
    }),
    deleteNote: builder.mutation<ApiSuccessResponse<null>, string>({
      query: (id) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notes', id },
        { type: 'Notes', id: 'MY_LIST' },
        { type: 'Notes', id: 'ALL_LIST' },
      ],
    }),
  }),
});

export const {
  useGetMyNotesQuery,
  useGetAllNotesQuery,
  useGetNoteByIdQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
