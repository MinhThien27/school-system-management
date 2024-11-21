import ChangePasswordPage from '../pages/student/ChangePasswordPage';
import LearningResultPage from '../pages/student/LearningResultPage';
import StudentDashboard from '../pages/student/StudentDashboard';
import UnderDevelopmentPage from '../pages/UnderDevelopmentPage';

const studentRoute = [
	{
		index: true,
		element: <StudentDashboard />,
	},
	{
		path: 'change-password',
		element: <ChangePasswordPage />,
	},
	{
		path: 'learning-result',
		element: <LearningResultPage />,
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

export default studentRoute;
