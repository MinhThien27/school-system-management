import AssignedClassesPage from '../pages/teacher/AssignedClassesPage';
import ChangePasswordPage from '../pages/teacher/ChangePasswordPage';
import FormClassPage from '../pages/teacher/FormClassPage';
import ModifyGrade from '../pages/teacher/ModifyGrade';
import StudentDetailPage from '../pages/teacher/StudentDetailPage';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import UnderDevelopmentPage from '../pages/UnderDevelopmentPage';

const teacherRoute = [
	{
		index: true,
		element: <TeacherDashboard />,
	},
	{
		path: 'change-password',
		element: <ChangePasswordPage />,
	},
	{
		path: 'assigned-classes',
		children: [
			{
				index: true,
				element: <AssignedClassesPage />,
			},
			{
				path: 'class',
				element: <ModifyGrade />,
			},
		],
	},
	{
		path: 'form-class',
		children: [
			{
				index: true,
				element: <FormClassPage />,
			},
			{
				path: ':studentId',
				element: <StudentDetailPage />,
			},
		],
	},
	{
		path: 'timetable',
		element: <UnderDevelopmentPage />,
	},
	{
		path: 'homework',
		element: <UnderDevelopmentPage />,
	},
];

export default teacherRoute;
