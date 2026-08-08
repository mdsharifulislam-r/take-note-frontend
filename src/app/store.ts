import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/lib/api';
import authReducer from '@/features/auth/authSlice';
import '@/features/auth/authApi';
import '@/features/notes/notesApi';
import '@/features/users/usersApi';
import '@/features/posts/postsApi';
import '@/features/admin/adminApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
