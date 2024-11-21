import { apiSlice } from '../../api/apiSlice';
import {
	invalidatesId,
	invalidatesList,
	providesList,
} from '../../utils/apiUtils';

export const studentApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		changeStudentPassword: builder.mutation({
			query: (data) => ({
				url: '/auth/change-password',
				method: 'PATCH',
				body: { ...data },
			}),
		}),
		getStudents: builder.query({
			query: ({ page, quantity }) =>
				'/students?page=' +
				page.toString() +
				'&size=' +
				quantity.toString(),
			providesTags: (result) => providesList(result?.items, 'Student'),
		}),
		getStudentsToAddToClass: builder.query({
			query: ({ page, quantity, academicYearId }) =>
				'/students?page=' +
				page.toString() +
				'&size=' +
				quantity.toString() +
				'&filter=academicYearId:neq:' +
				academicYearId,
			providesTags: (result) => providesList(result?.items, 'Class'),
		}),
		getStudentById: builder.query({
			query: (id) => '/students/' + id,
			providesTags: (result) => providesList([result], 'Student'),
		}),
		getParentByStudent: builder.query({
			query: (id) => `/students/${id}/parents?page=0&size=100`,
			providesTags: (result) => providesList(result?.items, 'Parent'),
		}),
		editStudentInfo: builder.mutation({
			query: (data) => ({
				url: '/students/' + data.id,
				method: 'PATCH',
				body: data.body,
			}),
			invalidatesTags: (result, error, { id }) =>
				invalidatesId(id, 'Student'),
		}),
		addStudent: builder.mutation({
			query: (data) => {
				const bodyFormData = new FormData();
				bodyFormData.append('firstName', data.firstName);
				bodyFormData.append('lastName', data.lastName);
				bodyFormData.append('address', data.address);
				bodyFormData.append('phoneNumber', data.phoneNumber);
				// bodyFormData.append('email', data.email);
				bodyFormData.append('gender', data.gender);
				bodyFormData.append(
					'citizenIdentification',
					data.citizenIdentification
				);
				bodyFormData.append('dob', data.dob);
				bodyFormData.append('enrollmentDate', data.enrollmentDate);
				bodyFormData.append('image', data.image);

				return {
					url: '/students',
					method: 'POST',
					body: bodyFormData,
				};
			},
			invalidatesTags: invalidatesList('Student'),
		}),
		changeStudentAvatar: builder.mutation({
			query: (data) => {
				const bodyFormData = new FormData();
				bodyFormData.append('image', data.image);

				return {
					url: '/students/' + data.id,
					method: 'PATCH',
					body: bodyFormData,
				};
			},
			invalidatesTags: (result, error, { id }) =>
				invalidatesId(id, 'Student'),
		}),
		deleteStudent: builder.mutation({
			query: (id) => ({
				url: '/students/' + id,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('Student'),
		}),
		addParent: builder.mutation({
			query: (data) => ({
				url: `/students/${data.id}/parents`,
				method: 'POST',
				body: { ...data.body },
			}),
			invalidatesTags: invalidatesList('Parent'),
		}),
		editParentInfo: builder.mutation({
			query: (data) => ({
				url: `/students/${data.id}/parents/${data.parentId}`,
				method: 'PATCH',
				body: { ...data.body },
			}),
			invalidatesTags: invalidatesList('Parent'),
		}),
		deleteParent: builder.mutation({
			query: (data) => ({
				url: `/students/${data.id}/parents/${data.parentId}`,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('Parent'),
		}),
	}),
});

export const {
	useGetStudentsQuery,
	useGetStudentsToAddToClassQuery,
	useGetStudentByIdQuery,
	useGetParentByStudentQuery,
	useChangeStudentPasswordMutation,
	useAddStudentMutation,
	useDeleteStudentMutation,
	useChangeStudentAvatarMutation,
	useEditStudentInfoMutation,
	useAddParentMutation,
	useDeleteParentMutation,
	useEditParentInfoMutation,
} = studentApiSlice;
