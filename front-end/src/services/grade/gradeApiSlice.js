import { apiSlice } from '../../api/apiSlice';
import { invalidatesList, providesList } from '../../utils/apiUtils';

export const classApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getGradeByStudent: builder.query({
			query: (id) => `/students/${id}/grades?page=0&size=100`,
			providesTags: (result) => providesList(result?.items, 'Grade'),
		}),
		getGradeByClass: builder.query({
			query: ({ classId, classSubjectId }) =>
				'/classes/' +
				classId +
				'/subjects/' +
				classSubjectId +
				'/grades?page=' +
				0 +
				'&size=' +
				100,
			providesTags: (result) => providesList(result?.items, 'Grade'),
		}),
		editGradeByClass: builder.mutation({
			query: ({ classId, classSubjectId, body }) => ({
				url:
					'/classes/' +
					classId +
					'/subjects/' +
					classSubjectId +
					'/grades',
				method: 'PUT',
				body: { gradesDto: [...body] },
			}),
			invalidatesTags: invalidatesList('Grade'),
		}),
	}),
});

export const {
	useGetGradeByStudentQuery,
	useGetGradeByClassQuery,
	useEditGradeByClassMutation,
} = classApiSlice;
