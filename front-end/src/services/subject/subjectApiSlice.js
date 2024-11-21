import { apiSlice } from '../../api/apiSlice';
import { invalidatesList, providesList } from '../../utils/apiUtils';

export const subjectApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getSubjects: builder.query({
			query: ({ page, quantity }) =>
				'/subjects?page=' +
				page.toString() +
				'&size=' +
				quantity.toString(),
			providesTags: (result) => providesList(result?.items, 'Subject'),
		}),
		addSubject: builder.mutation({
			query: (data) => ({
				url: '/subjects',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: invalidatesList('Subject'),
		}),
		editSubject: builder.mutation({
			query: (data) => ({
				url: '/subjects/' + data.id,
				method: 'PATCH',
				body: data.body,
			}),
			invalidatesTags: invalidatesList('Subject'),
		}),
		deleteSubject: builder.mutation({
			query: (id) => ({
				url: '/subjects/' + id,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('Subject'),
		}),
	}),
});

export const {
	useGetSubjectsQuery,
	useAddSubjectMutation,
	useDeleteSubjectMutation,
	useEditSubjectMutation,
} = subjectApiSlice;
