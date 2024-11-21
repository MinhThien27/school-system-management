import {
	CheckIcon,
	ChevronDownIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import {
	Button,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Spinner,
	Typography,
} from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import { Link, useParams } from 'react-router-dom';
import { useAddTeacherToDepartmentMutation } from '../../../services/department/departmentApiSlice';

const AddTeacher = ({ setActive, data, loading, refetch }) => {
	const { departmentId } = useParams();

	//them giáo viên vào phòng
	const dispatch = useDispatch();
	const [teacherListData, setTeacherListData] = useState(null);

	useEffect(() => {
		refetch();
		if (data)
			setTeacherListData(
				data?.items?.filter((t) => t.departmentTeachers.length === 0)
			);
	}, [data, refetch]);

	useEffect(() => {
		if (teacherListData) setChosenTeacher(teacherListData[0]);
	}, [teacherListData]);

	const [chosenTeacher, setChosenTeacher] = useState(null);
	const handleChooseTeacher = (id) => {
		const newTeacher = teacherListData.filter((s) => s.id === id)[0];
		if (newTeacher) {
			setChosenTeacher(newTeacher);
		}
	};

	const [addTeacherToDepartment, { isLoading: addLoading }] =
		useAddTeacherToDepartmentMutation();
	const handleAddTeacher = async () => {
		try {
			await addTeacherToDepartment({
				id: departmentId,
				addId: chosenTeacher?.id,
			}).unwrap();

			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Thêm thành công!',
				})
			);
			refetch();

			setActive(false);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Thông tin sai';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};
	return (
		<div className="w-full h-min ml-auto bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center mb-4">
			<div className="w-full flex flex-row relative">
				<div className="w-full grid grid-cols-2 items-center border-solid border-l-[1px] border-gray-300 px-12">
					{teacherListData && teacherListData.length > 0 ? (
						<>
							<Menu placement="bottom" allowHover>
								<MenuHandler>
									<Button
										variant="text"
										className="h-fit flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
									>
										<span className="flex-1">
											{chosenTeacher?.firstName +
												' ' +
												chosenTeacher?.lastName}
										</span>

										<ChevronDownIcon className="size-4" />
									</Button>
								</MenuHandler>
								<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
									{teacherListData.map(
										(teacher, index, arr) => (
											<MenuItem
												key={teacher.id}
												onClick={() =>
													handleChooseTeacher(
														teacher?.id
													)
												}
												className={`py-1 px-3 rounded-none ${
													index !== arr.length - 1 &&
													'border-b-[1px] border-solid border-gray-300'
												}`}
											>
												<Typography className="text-sm font-medium text-text">
													{teacher?.firstName +
														' ' +
														teacher?.lastName}{' '}
													&nbsp;
												</Typography>
											</MenuItem>
										)
									)}
								</MenuList>
							</Menu>
							<div className="w-full h-full flex flex-col ml-12 justify-center px-12 gap-x-4 border-solid border-l-[1px] border-gray-300">
								<div className="flex flex-row gap-2 py-2">
									<Typography className="text-sm font-normal whitespace-nowrap ">
										Họ và tên:
									</Typography>
									<Link
										to={
											'/admin/manage-teachers/' +
											chosenTeacher?.id
										}
									>
										<Typography className="text-sm font-semibold text-blue-900 cursor-pointer">
											{chosenTeacher?.firstName +
												' ' +
												chosenTeacher?.lastName}{' '}
											&nbsp;
										</Typography>
									</Link>
								</div>
								<div className="flex flex-row gap-2 py-2">
									<Typography className="text-sm font-normal whitespace-nowrap ">
										Mã định danh:
									</Typography>
									<Typography className="text-sm font-semibold ">
										{
											chosenTeacher?.user
												?.citizenIdentification
										}
										&nbsp;
									</Typography>
								</div>
							</div>
						</>
					) : (
						<Typography className="col-span-2 text-center text-sm font-semibold">
							Không tìm thấy giáo viên thích hợp
						</Typography>
					)}

					{loading && (
						<div className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
							<Spinner color="indigo" className="size-5" />
						</div>
					)}
				</div>
				<div className="flex flex-col">
					<Button
						className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() => setActive(false)}
						disabled={addLoading}
					>
						<XMarkIcon className="size-5 text-error" />
					</Button>
					<Button
						className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
						onClick={handleAddTeacher}
						disabled={addLoading}
					>
						{addLoading ? (
							<Spinner color="indigo" className="size-5" />
						) : (
							<CheckIcon className="size-5 text-main" />
						)}
					</Button>
				</div>
				{addLoading && <div className="absolute w-full h-full"></div>}
			</div>
		</div>
	);
};

export default AddTeacher;
