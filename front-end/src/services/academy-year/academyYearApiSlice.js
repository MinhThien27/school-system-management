import { apiSlice } from '../../api/apiSlice';
import { invalidatesList, providesList } from '../../utils/apiUtils';

export const academyYearApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAcademyYears: builder.query({
			query: ({ page, quantity }) =>
				'/academic-years?page=' +
				page.toString() +
				'&size=' +
				quantity.toString(),
			providesTags: (result) =>
				providesList(result?.items, 'AcademyYear'),
		}),
		getAcademyYearById: builder.query({
			query: (id) => '/academic-years/' + id,
			providesTags: (result) => providesList([result], 'AcademyYear'),
		}),
		getSemesterByAcademyYear: builder.query({
			query: (id) =>
				`/academic-years/${id}/semesters?page=0&size=10&sort=semesterNumber:asc`,
			providesTags: (result) => providesList(result?.items, 'Semester'),
		}),
		addAcademyYear: builder.mutation({
			query: (data) => ({
				url: '/academic-years',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: invalidatesList('AcademyYear'),
		}),
		addSemester: builder.mutation({
			query: (data) => ({
				url: `/academic-years/${data.id}/semesters`,
				method: 'POST',
				body: { ...data.body },
			}),
			invalidatesTags: invalidatesList('Semester'),
		}),
		editAcademyYear: builder.mutation({
			query: (data) => ({
				url: '/academic-years/' + data.id,
				method: 'PATCH',
				body: data.body,
			}),
			invalidatesTags: invalidatesList('AcademyYear'),
		}),
		editSemesterInfo: builder.mutation({
			query: (data) => ({
				url: `/academic-years/${data.id}/semesters/${data.semesterId}`,
				method: 'PATCH',
				body: { ...data.body },
			}),
			invalidatesTags: invalidatesList('Semester'),
		}),
		deleteAcademyYear: builder.mutation({
			query: (id) => ({
				url: '/academic-years/' + id,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('AcademyYear'),
		}),
		deleteSemester: builder.mutation({
			query: (data) => ({
				url: `/academic-years/${data.id}/semesters/${data.semesterId}`,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('Semester'),
		}),
	}),
});

export const {
	useGetAcademyYearsQuery,
	useGetAcademyYearByIdQuery,
	useGetSemesterByAcademyYearQuery,
	useAddAcademyYearMutation,
	useAddSemesterMutation,
	useEditAcademyYearMutation,
	useEditSemesterInfoMutation,
	useDeleteAcademyYearMutation,
	useDeleteSemesterMutation,
} = academyYearApiSlice;
