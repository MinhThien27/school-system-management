import AdminDashboard from '../pages/admin/AdminDashboard';
import ChangePasswordPage from '../pages/admin/ChangePasswordPage';

import DetailAcademyYearPage from '../pages/admin/DetailAcademyYearPage';
import DetailClassPage from '../pages/admin/DetailClassPage';
import DetailDepartmentPage from '../pages/admin/DetailDepartmentPage';
import DetailStudentPage from '../pages/admin/DetailStudentPage';
import DetailTeacherPage from '../pages/admin/DetailTeacherPage';

import ManageAcademyYearsPage from '../pages/admin/ManageAcademyYearsPage';
import ManageClassesPage from '../pages/admin/ManageClassesPage';
import ManageDepartmentsPage from '../pages/admin/ManageDepartmentsPage';
import ManageLevelsPage from '../pages/admin/ManageLevelsPage';
// import ManageSemestersPage from '../pages/admin/ManageSemestersPage';
import ManageStudentsPage from '../pages/admin/ManageStudentsPage';
import ManageSubjectsPage from '../pages/admin/ManageSubjectsPage';
import ManageTeachersPage from '../pages/admin/ManageTeachersPage';

const adminRoute = [
	{
		index: true,
		element: <AdminDashboard />,
	},
	{
		path: 'change-password',
		element: <ChangePasswordPage />,
	},
	{
		path: 'manage-classes',
		children: [
			{
				index: true,
				element: <ManageClassesPage />,
			},
			{
				path: ':classID',
				element: <DetailClassPage />,
			},
		],
	},
	{
		path: 'manage-students',
		children: [
			{
				index: true,
				element: <ManageStudentsPage />,
			},
			{
				path: ':studentID',
				element: <DetailStudentPage />,
			},
		],
	},
	{
		path: 'manage-teachers',
		children: [
			{
				index: true,
				element: <ManageTeachersPage />,
			},
			{
				path: ':teacherID',
				element: <DetailTeacherPage />,
			},
		],
	},
	{
		path: 'manage-subjects',
		children: [
			{
				index: true,
				element: <ManageSubjectsPage />,
			},
		],
	},
	{
		path: 'manage-academy-years',
		children: [
			{
				index: true,
				element: <ManageAcademyYearsPage />,
			},
			{
				path: ':academyYearId',
				element: <DetailAcademyYearPage />,
			},
		],
	},
	// {
	// 	path: 'manage-semesters',
	// 	children: [
	// 		{
	// 			index: true,
	// 			element: <ManageSemestersPage />,
	// 		},
	// 	],
	// },
	{
		path: 'manage-levels',
		children: [
			{
				index: true,
				element: <ManageLevelsPage />,
			},
		],
	},
	{
		path: 'manage-departments',
		children: [
			{
				index: true,
				element: <ManageDepartmentsPage />,
			},
			{
				path: ':departmentId',
				element: <DetailDepartmentPage />,
			},
		],
	},
];

export default adminRoute;
