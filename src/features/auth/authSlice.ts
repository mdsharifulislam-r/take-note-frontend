import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SessionUser } from '@/types';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

type AuthState = {
  token: string | null;
  user: SessionUser | null;
  isRehydrated: boolean;
};

function loadFromStorage(): Pick<AuthState, 'token' | 'user'> {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    const user = userRaw ? (JSON.parse(userRaw) as SessionUser) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

const stored = loadFromStorage();

const initialState: AuthState = {
  token: stored.token,
  user: stored.user,
  isRehydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    rehydrateAuth(state) {
      const { token, user } = loadFromStorage();
      state.token = token;
      state.user = user;
      state.isRehydrated = true;
    },
    setCredentials(state, action: PayloadAction<{ token: string; user: SessionUser }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    },
    updateUser(state, action: PayloadAction<SessionUser>) {
      state.user = action.payload;
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { rehydrateAuth, setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
