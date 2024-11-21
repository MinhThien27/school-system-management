import {
	AcademicCapIcon,
	CalendarDaysIcon,
	DocumentTextIcon,
	LockClosedIcon,
	UserIcon,
} from '@heroicons/react/24/solid';

export const studentNavigateList = [
	{
		title: 'Thông tin chung',
		list: [
			{
				title: 'Cá nhân',
				path: '/student',
				icon: <UserIcon className="w-4 h-4" />,
				end: true,
			},
			{
				title: 'Đổi mật khẩu',
				path: '/student/change-password',
				icon: <LockClosedIcon className="w-4 h-4" />,
				end: true,
			},
		],
	},
	{
		title: 'Học tập',
		list: [
			{
				title: 'Điểm số',
				path: '/student/learning-result',
				icon: <AcademicCapIcon className="w-4 h-4" />,
			},
			{
				title: 'Lịch học',
				path: '/student/timetable',
				icon: <CalendarDaysIcon className="w-4 h-4" />,
			},
			{
				title: 'Bài tập',
				path: '/student/homework',
				icon: <DocumentTextIcon className="w-4 h-4" />,
			},
		],
	},
];
