import { apiSlice } from '../../api/apiSlice';
import { invalidatesList, providesList } from '../../utils/apiUtils';

export const departmentApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getDepartments: builder.query({
			query: ({ page, quantity }) =>
				'/departments?page=' +
				page.toString() +
				'&size=' +
				quantity.toString(),
			providesTags: (result) => providesList(result?.items, 'Department'),
		}),
		getDepartmentById: builder.query({
			query: (id) => '/departments/' + id,
			providesTags: (result) => providesList([result], 'Department'),
		}),
		getDepartmentTeachers: builder.query({
			query: (id) => '/departments/' + id + '/teachers?page=0&size=100',
			providesTags: (result) => providesList(result?.items, 'Department'),
		}),
		getDepartmentSubjects: builder.query({
			query: (id) => '/departments/' + id + '/subjects?page=0&size=100',
			providesTags: (result) => providesList(result?.items, 'Department'),
		}),
		addDepartment: builder.mutation({
			query: (data) => ({
				url: '/departments',
				method: 'POST',
				body: data,
			}),
			invalidatesTags: invalidatesList('Department'),
		}),
		editDepartment: builder.mutation({
			query: (data) => ({
				url: '/departments/' + data.id,
				method: 'PATCH',
				body: data.body,
			}),
			invalidatesTags: invalidatesList('Department'),
		}),
		editDepartmentSubjects: builder.mutation({
			query: (data) => ({
				url: '/departments/' + data.id + '/subjects',
				method: 'PUT',
				body: { subjectIds: [...data.body] },
			}),
			invalidatesTags: invalidatesList('Department'),
		}),
		deleteDepartment: builder.mutation({
			query: (id) => ({
				url: '/departments/' + id,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('Department'),
		}),
		addTeacherToDepartment: builder.mutation({
			query: (data) => ({
				url: '/departments/' + data.id + '/teachers',
				method: 'POST',
				body: {
					teacherId: data.addId,
					subjectIds: [],
				},
			}),
			invalidatesTags: invalidatesList('Department'),
		}),
		removeTeacherFromDepartment: builder.mutation({
			query: (data) => ({
				url: '/departments/' + data.id + '/teachers/' + data.removeId,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('Department'),
		}),
		editTeacherSubjects: builder.mutation({
			query: (data) => ({
				url:
					'/departments/' +
					data.departmentId +
					'/teachers/' +
					data.editId,
				method: 'PATCH',
				body: { subjectIds: [...data.body] },
			}),
			invalidatesTags: invalidatesList('Department'),
		}),
	}),
});

export const {
	useGetDepartmentsQuery,
	useGetDepartmentByIdQuery,
	useGetDepartmentTeachersQuery,
	useGetDepartmentSubjectsQuery,
	useAddDepartmentMutation,
	useDeleteDepartmentMutation,
	useEditDepartmentMutation,
	useEditDepartmentSubjectsMutation,
	useAddTeacherToDepartmentMutation,
	useEditTeacherSubjectsMutation,
	useRemoveTeacherFromDepartmentMutation,
} = departmentApiSlice;
