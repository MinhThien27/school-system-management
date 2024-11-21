import { apiSlice } from '../../api/apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		changeAdminPassword: builder.mutation({
			query: (data) => ({
				url: '/auth/change-password',
				method: 'PATCH',
				body: { ...data },
			}),
		}),
	}),
});

export const { useChangeAdminPasswordMutation } = adminApiSlice;
