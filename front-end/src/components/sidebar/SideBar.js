import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, selectUserRole } from '../../services/auth/authSlice';

import { Typography } from '@material-tailwind/react';
import { PowerIcon } from '@heroicons/react/24/solid';

import SideBarNavigation from './SideBarNavigation';

import { ROLES } from '../../config/constants';
import { studentNavigateList } from '../student/StudentSideBar';
import { teacherNavigateList } from '../teacher/TeacherSideBar';
import { adminNavigateList } from '../admin/AdminSideBar';
import { useLogoutMutation } from '../../services/auth/authApiSlice';

const Sidebar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userRole = useSelector(selectUserRole);
	let sidebar = null;
	switch (userRole) {
		case ROLES.STUDENT:
			sidebar = <SideBarNavigation list={studentNavigateList} />;
			break;
		case ROLES.TEACHER:
			sidebar = <SideBarNavigation list={teacherNavigateList} />;
			break;
		case ROLES.ADMIN:
			sidebar = <SideBarNavigation list={adminNavigateList} />;
			break;
		default:
			break;
	}
	const [logout] = useLogoutMutation();
	const handleLogout = async () => {
		try {
			await logout().unwrap();
			dispatch(logOut());
		} catch (error) {
			console.log(error);
		}
		navigate('/');
	};

	return (
		<div className="w-full h-full bg-white shadow-xl text-main shadow-blue-gray-900/5 flex flex-col pt-2">
			{sidebar !== null ? sidebar : <Navigate to="/" replace />}
			<hr className="border-blue-gray-50 pointer-events-none" />
			<div
				className="text-red-900 flex flex-row justify-center items-center gap-2 pb-3 pt-2 cursor-pointer hover:bg-red-50/50 hover:text-red-500 hover:font-extrabold"
				onClick={handleLogout}
			>
				<PowerIcon className="size-5" />
				<Typography className="font-semibold text-base pr-2">
					Đăng xuất
				</Typography>
			</div>
		</div>
	);
};

export default Sidebar;
