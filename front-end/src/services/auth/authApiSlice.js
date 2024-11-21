import { apiSlice } from '../../api/apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: '/auth',
				method: 'POST',
				body: { ...credentials },
			}),
		}),
		logout: builder.mutation({
			query: (credentials) => ({
				url: '/auth/logout',
				method: 'POST',
			}),
		}),
		refresh: builder.mutation({
			query: () => ({
				url: '/auth/refresh',
				method: 'GET',
			}),
		}),
	}),
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation } =
	authApiSlice;
