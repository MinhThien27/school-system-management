import { createBrowserRouter } from 'react-router-dom';
import { ROLES } from '../config/constants';

import PublicLayout from '../layouts/PublicLayout';
import SideBarLayout from '../layouts/SideBarLayout';

import studentRoute from './studentRoute';
import teacherRoute from './teacherRoute';
import adminRoute from './adminRoute';

import RequireAuthWrapper from '../components/navigator/RequireAuthWrapper';

import NotFoundPage from '../pages/NotFoundPage';
import HomePage from '../pages/HomePage';
import Redirect from '../components/navigator/Redirect';
import PersistLogin from '../components/navigator/PersistLogin';

const AppRouter = createBrowserRouter([
	{
		path: '/',

		element: <PublicLayout />,
		children: [
			{
				index: true,
				element: <HomePage />,
			},
			{
				path: 'redirect',
				element: <Redirect />,
			},
			{
				path: '*',
				element: <NotFoundPage />,
			},
		],
	},
	{
		element: (
			<PersistLogin>
				<SideBarLayout />
			</PersistLogin>
		),
		children: [
			{
				path: 'admin',
				element: <RequireAuthWrapper allowedRoles={[ROLES.ADMIN]} />,
				children: adminRoute,
			},
			{
				path: 'student',
				element: <RequireAuthWrapper allowedRoles={[ROLES.STUDENT]} />,
				children: studentRoute,
			},
			{
				path: 'teacher',
				element: <RequireAuthWrapper allowedRoles={[ROLES.TEACHER]} />,
				children: teacherRoute,
			},
		],
	},
]);

export default AppRouter;
