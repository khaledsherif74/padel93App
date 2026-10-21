import { api } from '../../app/api.js';
import { setProfile, setSession } from './authSlice.js';

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setSession((await queryFulfilled).data));
        } catch { /* the form shows the error */ }
      },
    }),
    me: build.query({
      query: () => '/auth/me',
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          dispatch(setProfile((await queryFulfilled).data));
        } catch { /* a 401 is handled by the base query */ }
      },
    }),
  }),
});

export const { useLoginMutation, useMeQuery } = authApi;
