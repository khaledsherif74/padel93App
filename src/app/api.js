import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../features/auth/authSlice.js';

const rawQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE ?? '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const { token } = getState().auth;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

// A 401 anywhere (except the login call itself) means the token is dead: drop it and cached data.
const baseQuery = async (args, queryApi, extra) => {
  const result = await rawQuery(args, queryApi, extra);
  if (result.error?.status === 401 && queryApi.endpoint !== 'login') {
    queryApi.dispatch(logout());
    queryApi.dispatch(api.util.resetApiState());
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Shift', 'Summary', 'Appointments', 'OnAccount', 'Goal'],
  endpoints: () => ({}),
});
