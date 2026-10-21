import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../lib/storage.js';

const TOKEN_KEY = 'p93.token';

const slice = createSlice({
  name: 'auth',
  initialState: { token: storage.get(TOKEN_KEY), user: null, permissions: {} },
  reducers: {
    setSession(state, { payload: { token, user, permissions } }) {
      state.token = token;
      state.user = user;
      state.permissions = permissions;
      storage.set(TOKEN_KEY, token);
    },
    setProfile(state, { payload: { permissions, ...user } }) {
      state.user = user;
      state.permissions = permissions;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.permissions = {};
      storage.remove(TOKEN_KEY);
    },
  },
});

export const { setSession, setProfile, logout } = slice.actions;
export default slice.reducer;
