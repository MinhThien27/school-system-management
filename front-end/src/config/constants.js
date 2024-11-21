export const BASE_URL = 'http://localhost:3500/v1';
export const TAG_TYPES = [
	'User',
	'Class',
	'Department',
	'Level',
	'Semester',
	'AcademyYear',
	'Student',
	'Parent',
	'Teacher',
	'Subject',
	'Grade',
];
export const ROLES = {
	STUDENT: 'Student',
	TEACHER: 'Teacher',
	ADMIN: 'Admin',
};
export const NOTIFY_STYLE = {
	ERROR: 'error',
	SUCCESS: 'success',
	WARNING: 'warning',
};
export const NOTIFY_DURATION = 3000;
export const PWD_REGEX =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
export const MAX_POINT = 10;
export const MIN_POINT = 0;
export const DECIMAL_COUNT = 1;
export const CONDUCT = {
	EXCELLENT: 'Tốt',
	GOOD: 'Khá',
	AVERAGE: 'Trung bình',
	POOR: 'Yếu',
};
export const MAX_LEVEL = 12;
export const MIN__LEVEL = 1;
export const GENDER = {
	MALE: { show: 'Nam', send: 'Male' },
	FEMALE: { show: 'Nữ', send: 'Female' },
};
export const IMAGE_FILE_TYPES = ['JPG', 'PNG', 'JPEG'];
export const MAX_PARENT = 2;
export const PARENT = [
	{ show: 'Bố', send: 'Father' },
	{ show: 'Mẹ', send: 'Mother' },
	{ show: 'Người bảo bộ', send: 'Other' },
];
export const DEFAULT_CLASS_CAPACITY = 40;
export const MIN_CLASS_CAPACITY = 1;
export const MAX_CLASS_CAPACITY = 50;
export const NUMBER_ITEM_PER_PAGE = 8;

export const MAX_SEMESTERS = 2;
export const SEMESTERS_NAME = ['Học kì I', 'Học kì II'];
