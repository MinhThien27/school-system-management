import {
	CalendarIcon,
	IdentificationIcon,
	LockClosedIcon,
	PencilSquareIcon,
	UserIcon,
	FolderMinusIcon,
} from '@heroicons/react/24/solid';

export const teacherNavigateList = [
	{
		title: 'Thông tin chung',
		list: [
			{
				title: 'Cá nhân',
				path: '/teacher',
				icon: <UserIcon className="w-4 h-4" />,
				end: true,
			},
			{
				title: 'Đổi mật khẩu',
				path: '/teacher/change-password',
				icon: <LockClosedIcon className="w-4 h-4" />,
				end: true,
			},
		],
	},
	{
		title: 'Giảng dạy',
		list: [
			{
				title: 'Nhập điểm',
				path: '/teacher/assigned-classes',
				icon: <PencilSquareIcon className="w-4 h-4" />,
			},
			{
				title: 'Lớp chủ nhiệm',
				path: '/teacher/form-class',
				icon: <IdentificationIcon className="w-4 h-4" />,
			},
			{
				title: 'Lịch',
				path: '/teacher/timetable',
				icon: <CalendarIcon className="w-4 h-4" />,
			},
			{
				title: 'Giao bài tập',
				path: '/teacher/homework',
				icon: <FolderMinusIcon className="w-4 h-4" />,
			},
		],
	},
];
