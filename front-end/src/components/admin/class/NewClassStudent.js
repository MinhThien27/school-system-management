import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import {
	Button,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Spinner,
	Typography,
} from '@material-tailwind/react';
import {
	CheckIcon,
	EllipsisHorizontalIcon,
	PlusIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import {
	useAddStudentToClassMutation,
	useGetClassByIdQuery,
} from '../../../services/class/classApiSlice';
import { useGetStudentsToAddToClassQuery } from '../../../services/student/studentApiSlice';
import { useParams } from 'react-router-dom';

const NewClassStudent = ({ isActive, setActive }) => {
	const { classID } = useParams();

	const { data: classDataApi } = useGetClassByIdQuery(classID);
	const [classYear, setClassYear] = useState(null);
	useEffect(() => {
		if (classDataApi) setClassYear(classDataApi.academicYearId);
	}, [classDataApi]);

	const dispatch = useDispatch();

	//danh sách học sinh
	const { data: studentListDataApi, isLoading: studentsLoading } =
		useGetStudentsToAddToClassQuery({
			page: 0,
			quantity: 100,
			academicYearId: classYear,
		});
	const [studentListData, setStudentListData] = useState(null);

	useEffect(() => {
		if (studentListDataApi) setStudentListData(studentListDataApi?.items);
	}, [studentListDataApi]);

	const [chosenStudent, setChosenStudent] = useState(null);
	const handleChooseStudent = (id) => {
		setChosenStudent(studentListData.filter((s) => s.id === id)[0]);
	};

	const [addStudentToClass, { isLoading: addLoading }] =
		useAddStudentToClassMutation();
	const handleAddNewDepartment = async () => {
		try {
			await addStudentToClass({
				id: classID,
				body: { studentId: chosenStudent?.id },
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Thêm thành công!',
				})
			);
			setChosenStudent(null);
			setActive(false);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Vui lòng nhập đầy đủ thông tin!';
			} else if (err.status === 409) {
				mess = 'Đã tồn tại!';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn.';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	return (
		isActive && (
			<div className="w-full grid grid-cols-[80px_repeat(3,1fr)_100px] gap-4 p-3 border-b-[1px] border-solid border-gray-300 shadow-around">
				<Typography className="whitespace-nowrap text-sm flex justify-center items-center">
					<PlusIcon className="size-4" />
				</Typography>

				{/* chọn học sinh  */}

				{studentListData ? (
					<Menu placement="bottom" allowHover>
						<MenuHandler>
							<Button
								variant="text"
								className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
							>
								{chosenStudent ? (
									chosenStudent?.firstName +
									' ' +
									chosenStudent?.lastName
								) : (
									<EllipsisHorizontalIcon className="size-4" />
								)}
							</Button>
						</MenuHandler>
						<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
							{studentListData.map((student, index, arr) => (
								<MenuItem
									key={student.id}
									onClick={() =>
										handleChooseStudent(student.id)
									}
									className={`py-1 px-3 rounded-none ${
										index !== arr.length - 1 &&
										'border-b-[1px] border-solid border-gray-300'
									}`}
								>
									<Typography className="text-sm font-medium text-text">
										{student?.firstName +
											' ' +
											student?.lastName}
									</Typography>
								</MenuItem>
							))}
						</MenuList>
					</Menu>
				) : (
					!studentsLoading && (
						<Typography className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
							<EllipsisHorizontalIcon className="size-4" />
						</Typography>
					)
				)}
				{studentsLoading && (
					<div className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
						<Spinner color="indigo" className="size-5" />
					</div>
				)}

				<Typography className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
					{chosenStudent ? (
						chosenStudent?.user?.citizenIdentification
					) : (
						<EllipsisHorizontalIcon className="size-4" />
					)}
				</Typography>
				<Typography className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
					{chosenStudent ? (
						chosenStudent?.user?.phoneNumber
					) : (
						<EllipsisHorizontalIcon className="size-4" />
					)}
				</Typography>

				<Typography className="whitespace-nowrap text-sm text-center flex justify-center items-center gap-4">
					{addLoading ? (
						<Spinner color="gray" className="size-5" />
					) : (
						<CheckIcon
							className="size-6 text-indigo-900 cursor-pointer hover:opacity-70"
							onClick={handleAddNewDepartment}
						/>
					)}

					<XMarkIcon
						className="size-6 text-error cursor-pointer hover:opacity-70"
						onClick={() =>
							setActive(false) || setChosenStudent(null)
						}
					/>
				</Typography>
			</div>
		)
	);
};

export default NewClassStudent;
