import { apiSlice } from '../../api/apiSlice';

export const semesterApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAllSemester: builder.query({
			query: () => '',
		}),

		addSemester: builder.mutation({
			query: (credentials) => ({
				url: '/semester',
				method: 'POST',
				body: { ...credentials },
			}),
		}),
		editSemester: builder.mutation({
			query: (credentials) => ({
				url: '/semester',
				method: 'PATCH',
				body: { ...credentials },
			}),
		}),
		deleteSemester: builder.mutation({
			query: (credentials) => ({
				url: '/semester/' + credentials,
				method: 'DELETE',
			}),
		}),
	}),
});

export const {
	useDeleteSemesterMutation,
	useAddSemesterMutation,
	useEditSemesterMutation,
} = semesterApiSlice;
