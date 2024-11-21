import { apiSlice } from '../../api/apiSlice';
import { invalidatesList, providesList } from '../../utils/apiUtils';

export const levelApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getLevels: builder.query({
			query: ({ page, quantity }) =>
				'/levels?page=' +
				page.toString() +
				'&size=' +
				quantity.toString() +
				'&sort=levelNumber:asc',
			providesTags: (result) => providesList(result?.items, 'Level'),
		}),
		getLevelSubjects: builder.query({
			query: (id) => '/levels/' + id + '/subjects?page=0&size=100',
			providesTags: (result) => providesList(result?.items, 'Level'),
		}),
		addLevel: builder.mutation({
			query: (data) => ({
				url: '/levels',
				method: 'POST',
				body: { levelNumber: data.body },
			}),
			invalidatesTags: invalidatesList('Level'),
		}),
		editLevelSubjects: builder.mutation({
			query: (data) => ({
				url: '/levels/' + data.id + '/subjects',
				method: 'PUT',
				body: { levelSubjectDtos: [...data.body] },
			}),
			invalidatesTags: invalidatesList('Level'),
		}),
		deleteLevel: builder.mutation({
			query: (data) => ({
				url: '/levels/' + data.deleteId,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('Level'),
		}),
	}),
});

export const {
	useGetLevelsQuery,
	useGetLevelSubjectsQuery,
	useAddLevelMutation,
	useDeleteLevelMutation,
	useEditLevelSubjectsMutation,
} = levelApiSlice;
