import React, { useEffect, useState } from 'react';
import { useAddDepartmentMutation } from '../../../services/department/departmentApiSlice';
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
import { useGetTeachersQuery } from '../../../services/teacher/teacherApiSlice';

const NewDepartment = ({ isActive, setActive }) => {
	const dispatch = useDispatch();
	const [newDepartment, setNewDepartment] = useState({
		name: '',
		headTeacherId: '',
		description: '',
	});

	const [addDepartment, { isLoading: addLoading }] =
		useAddDepartmentMutation();
	const handleAddNewDepartment = async () => {
		try {
			await addDepartment(newDepartment).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Thêm thành công!',
				})
			);
			setNewDepartment({
				name: '',
				headTeacherId: '',
				description: '',
			});
			setActive(false);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Vui lòng nhập đầy đủ thông tin!';
			} else if (err.status === 409) {
				mess = 'Giáo viên đã làm tổ trưởng của một tổ khác!';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn.';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	const { data: teacherListDataApi, isLoading: teachersLoading } =
		useGetTeachersQuery({
			page: 0,
			quantity: 100,
		});
	const [teacherListData, setTeacherListData] = useState(null);
	useEffect(() => {
		if (teacherListDataApi) setTeacherListData(teacherListDataApi?.items);
	}, [teacherListDataApi]);

	const [chosenTeacher, setChosenTeacher] = useState(null);
	const handleChooseTeacher = (id) => {
		setNewDepartment((prev) => {
			return { ...prev, headTeacherId: id };
		});
		setChosenTeacher(teacherListData.filter((s) => s.id === id)[0]);
	};

	return (
		isActive && (
			<div className="w-full grid grid-cols-[80px_repeat(4,1fr)] gap-4 p-2 px-3 border-b-[1px] border-solid border-gray-300 shadow-around">
				<Typography className="whitespace-nowrap text-sm flex justify-center items-center">
					<PlusIcon className="size-4" />
				</Typography>
				{/* tên tổ  */}
				<input
					value={newDepartment?.name}
					onChange={(e) =>
						setNewDepartment({
							...newDepartment,
							name: e.target.value,
						})
					}
					className={`w-full text-center text-sm font-semibold border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>

				{/* chọn tổ trưởng  */}
				{teacherListData && (
					<Menu placement="bottom" allowHover>
						<MenuHandler>
							<Button
								variant="text"
								className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
							>
								{chosenTeacher ? (
									chosenTeacher?.firstName +
									' ' +
									chosenTeacher?.lastName
								) : (
									<EllipsisHorizontalIcon className="size-4" />
								)}
								{}
							</Button>
						</MenuHandler>
						<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
							{teacherListData.map((teacher, index, arr) => (
								<MenuItem
									key={teacher.id}
									onClick={() =>
										handleChooseTeacher(teacher.id)
									}
									className={`py-1 px-3 rounded-none ${
										index !== arr.length - 1 &&
										'border-b-[1px] border-solid border-gray-300'
									}`}
								>
									<Typography className="text-sm font-medium text-text">
										{teacher?.firstName +
											' ' +
											teacher?.lastName}
									</Typography>
								</MenuItem>
							))}
						</MenuList>
					</Menu>
				)}
				{teachersLoading && (
					<div className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
						<Spinner color="indigo" className="size-5" />
					</div>
				)}
				{/* mô tả  */}
				<textarea
					value={newDepartment?.description}
					onChange={(e) =>
						setNewDepartment({
							...newDepartment,
							description: e.target.value,
						})
					}
					className={`w-full text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>

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
						onClick={() => setActive(false)}
					/>
				</Typography>
			</div>
		)
	);
};

export default NewDepartment;
