import { apiSlice } from '../../api/apiSlice';
import { invalidatesList, providesList } from '../../utils/apiUtils';

export const classApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getClasses: builder.query({
			query: ({ page, quantity }) =>
				'/classes?page=' +
				page.toString() +
				'&size=' +
				quantity.toString(),
			providesTags: (result) => providesList(result?.items, 'Class'),
		}),
		getClassById: builder.query({
			query: (id) => '/classes/' + id,
			providesTags: (result) => providesList([result], 'Class'),
		}),
		getClassesByFormTeacher: builder.query({
			query: (teacherId) =>
				`/classes?page=0&size=100&filter=formTeacherId:eq:${teacherId}`,
		}),
		getStudentsByClassId: builder.query({
			query: ({ page, quantity, id }) =>
				'/classes/' +
				id +
				'/students?page=' +
				page.toString() +
				'&size=' +
				quantity.toString(),
			providesTags: (result) => providesList(result?.items, 'Class'),
		}),
		getSubjectsByClassId: builder.query({
			query: ({ page, quantity, id }) =>
				'/classes/' +
				id +
				'/subjects?page=' +
				page.toString() +
				'&size=' +
				quantity.toString(),
			providesTags: (result) => providesList(result?.items, 'Class'),
		}),
		addClass: builder.mutation({
			query: (data) => ({
				url: '/classes',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: invalidatesList('Class'),
		}),
		editClassInfo: builder.mutation({
			query: (data) => ({
				url: '/classes/' + data.id,
				method: 'PATCH',
				body: data.body,
			}),
			invalidatesTags: invalidatesList('Class'),
		}),
		changeClassFormTeacher: builder.mutation({
			query: (data) => ({
				url: '/classes/' + data.id,
				method: 'PATCH',
				body: data.body,
			}),
			invalidatesTags: invalidatesList('Class'),
		}),
		deleteClass: builder.mutation({
			query: (id) => ({
				url: '/classes/' + id,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('Class'),
		}),
		addStudentToClass: builder.mutation({
			query: (data) => ({
				url: '/classes/' + data.id + '/students',
				method: 'POST',
				body: { ...data.body },
			}),
			invalidatesTags: invalidatesList('Class'),
		}),
		removeStudentFromClass: builder.mutation({
			query: (data) => ({
				url: '/classes/' + data.id + '/students/' + data.removeId,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('Class'),
		}),
		addSubjectToClass: builder.mutation({
			query: (data) => ({
				url: '/classes/' + data.id + '/subjects',
				method: 'POST',
				body: { ...data.body },
			}),
			invalidatesTags: invalidatesList('Class'),
		}),
		editClassSubject: builder.mutation({
			query: (data) => ({
				url: '/classes/' + data.id + '/subjects/' + data.editId,
				method: 'PATCH',
				body: data.body,
			}),
			invalidatesTags: invalidatesList('Class'),
		}),
		removeSubjectFromClass: builder.mutation({
			query: (data) => ({
				url: '/classes/' + data.id + '/subjects/' + data.removeId,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('Class'),
		}),
		editClassTeacherTeachSubject: builder.mutation({
			query: (data) => {
				const url = data.editId
					? '/teachers/' + data.id + '/class-subjects/' + data.editId
					: '/teachers/' + data.id + '/class-subjects';
				return {
					url: url,
					method: data.method,
					body: data.body,
				};
			},
			invalidatesTags: invalidatesList('Class'),
		}),
	}),
});

export const {
	useGetClassesQuery,
	useGetClassByIdQuery,
	useGetClassesByFormTeacherQuery,
	useGetStudentsByClassIdQuery,
	useGetSubjectsByClassIdQuery,
	useAddClassMutation,
	useDeleteClassMutation,
	useEditClassInfoMutation,
	useEditClassSubjectMutation,
	useEditClassTeacherTeachSubjectMutation,
	useChangeClassFormTeacherMutation,
	useAddSubjectToClassMutation,
	useAddStudentToClassMutation,
	useRemoveStudentFromClassMutation,
	useRemoveSubjectFromClassMutation,
} = classApiSlice;
