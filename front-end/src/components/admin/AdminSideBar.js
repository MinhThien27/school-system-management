import {
	LockClosedIcon,
	UserIcon,
	InformationCircleIcon,
	AcademicCapIcon,
	CubeTransparentIcon,
	UserGroupIcon,
	CalendarDateRangeIcon,
	BuildingOfficeIcon,
	Bars3BottomLeftIcon,
	// Square3Stack3DIcon,
} from '@heroicons/react/24/solid';

export const adminNavigateList = [
	{
		title: 'Bảng điều khiển',
		list: [
			{
				title: 'Thông tin chung',
				path: '/admin',
				icon: <InformationCircleIcon className="w-4 h-4" />,
				end: true,
			},
			{
				title: 'Đổi mật khẩu',
				path: '/admin/change-password',
				icon: <LockClosedIcon className="w-4 h-4" />,
				end: true,
			},
		],
	},
	{
		title: 'Quản lý',
		list: [
			{
				title: 'Năm học',
				path: '/admin/manage-academy-years?page=1',
				icon: <CalendarDateRangeIcon className="w-4 h-4" />,
			},
			// {
			// 	title: 'Học kỳ',
			// 	path: '/admin/manage-semesters',
			// 	icon: <Square3Stack3DIcon className="w-4 h-4" />,
			// },
			{
				title: 'Môn học',
				path: '/admin/manage-subjects?page=1',
				icon: <CubeTransparentIcon className="w-4 h-4" />,
			},
			{
				title: 'Khối',
				path: '/admin/manage-levels',
				icon: <Bars3BottomLeftIcon className="w-4 h-4" />,
			},
			{
				title: 'Giáo viên',
				path: '/admin/manage-teachers?page=1',
				icon: <AcademicCapIcon className="w-4 h-4" />,
			},
			{
				title: 'Tổ bộ môn',
				path: '/admin/manage-departments?page=1',
				icon: <BuildingOfficeIcon className="w-4 h-4" />,
			},
			{
				title: 'Học sinh',
				path: '/admin/manage-students?page=1',
				icon: <UserIcon className="w-4 h-4" />,
			},
			{
				title: 'Lớp',
				path: '/admin/manage-classes?page=1',
				icon: <UserGroupIcon className="w-4 h-4" />,
			},
		],
	},
];
