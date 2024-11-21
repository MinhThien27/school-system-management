import { apiSlice } from '../../api/apiSlice';
import {
	invalidatesId,
	invalidatesList,
	providesId,
	providesList,
} from '../../utils/apiUtils';

export const teacherApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getTeachers: builder.query({
			query: ({ page, quantity }) =>
				'/teachers?page=' +
				page.toString() +
				'&size=' +
				quantity.toString(),
			providesTags: (result) => providesList(result?.items, 'Teacher'),
		}),
		getTeachersBySubjectId: builder.query({
			query: (id) => '/subjects/' + id,
			providesTags: (result) => providesList(result?.items, 'Teacher'),
		}),
		getClassesByTeacherId: builder.query({
			query: ({ page, quantity, id }) =>
				'/teachers/' +
				id +
				'/class-subjects?page=' +
				page.toString() +
				'&size=' +
				quantity.toString(),
			providesTags: (result) => providesList(result?.items, 'Teacher'),
		}),
		getTeachersForDepartment: builder.query({
			query: ({ page, quantity }) =>
				'/teachers?page=' +
				page.toString() +
				'&size=' +
				quantity.toString(),
		}),
		getTeacherById: builder.query({
			query: (id) => '/teachers/' + id,
			providesTags: (result, error, id) => providesId(id, 'Teacher'),
		}),
		changeTeacherPassword: builder.mutation({
			query: (data) => ({
				url: '/auth/change-password',
				method: 'PATCH',
				body: { ...data },
			}),
		}),
		editTeacherInfo: builder.mutation({
			query: (data) => ({
				url: '/teachers/' + data.id,
				method: 'PATCH',
				body: data.body,
			}),
			invalidatesTags: (result, error, { id }) =>
				invalidatesId(id, 'Teacher'),
		}),
		addTeacher: builder.mutation({
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
				bodyFormData.append('startDate', data.startDate);
				bodyFormData.append('image', data.image);

				return {
					url: '/teachers',
					method: 'POST',
					body: bodyFormData,
				};
			},
			invalidatesTags: invalidatesList('Teacher'),
		}),
		changeTeacherAvatar: builder.mutation({
			query: (data) => {
				const bodyFormData = new FormData();
				bodyFormData.append('image', data.image);

				return {
					url: '/teachers/' + data.id,
					method: 'PATCH',
					body: bodyFormData,
				};
			},
			invalidatesTags: (result, error, { id }) =>
				invalidatesId(id, 'Teacher'),
		}),
		deleteTeacher: builder.mutation({
			query: (id) => ({
				url: '/teachers/' + id,
				method: 'DELETE',
			}),
			invalidatesTags: invalidatesList('Teacher'),
		}),
	}),
});

export const {
	useGetTeachersQuery,
	useGetClassesByTeacherIdQuery,
	useGetTeachersBySubjectIdQuery,
	useGetTeachersForDepartmentQuery,
	useGetTeacherByIdQuery,
	useChangeTeacherPasswordMutation,
	useAddTeacherMutation,
	useDeleteTeacherMutation,
	useChangeTeacherAvatarMutation,
	useEditTeacherInfoMutation,
} = teacherApiSlice;
