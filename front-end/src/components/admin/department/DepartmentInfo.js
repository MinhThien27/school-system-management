import {
	CheckIcon,
	ChevronDownIcon,
	PencilSquareIcon,
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
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEditDepartmentMutation } from '../../../services/department/departmentApiSlice';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import { useGetTeachersQuery } from '../../../services/teacher/teacherApiSlice';

const DepartmentInfo = ({ data }) => {
	const dispatch = useDispatch();
	const [departmentData, setDepartmentData] = useState(null);
	useEffect(() => {
		if (data) {
			setDepartmentData(data);
		}
	}, [data]);
	const [isEditDepartmentInfo, setIsEditDepartmentInfo] = useState(false);

	//danh sách giáo viên
	const { data: teacherListDataApi, isLoading: teachersLoading } =
		useGetTeachersQuery({
			page: 0,
			quantity: 100,
		});
	const [teacherListData, setTeacherListData] = useState(null);
	useEffect(() => {
		if (teacherListDataApi) setTeacherListData(teacherListDataApi?.items);
	}, [teacherListDataApi]);

	useEffect(() => {
		if (teacherListData && data)
			setChosenTeacher(
				teacherListData.filter((t) => t.id === data.headTeacherId)[0]
			);
	}, [teacherListData, data]);

	const [chosenTeacher, setChosenTeacher] = useState(null);
	const handleChooseTeacher = (id) => {
		const newTeacher = teacherListData.filter((s) => s.id === id)[0];
		if (newTeacher) {
			setDepartmentData((prev) => {
				return {
					...prev,
					headTeacherId: newTeacher.id,
					headTeacher: newTeacher,
				};
			});
			setChosenTeacher(newTeacher);
		}
	};

	const [editDepartment, { isLoading: editLoading }] =
		useEditDepartmentMutation();

	const handleSaveDepartmentInfo = async () => {
		try {
			await editDepartment({
				id: data?.id,
				body: departmentData,
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsEditDepartmentInfo(false);
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

	const inputRef = useRef();
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [isEditDepartmentInfo]);

	return (
		<div
			className={`w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row relative ${
				isEditDepartmentInfo && 'shadow-top'
			}`}
		>
			{departmentData &&
				(isEditDepartmentInfo ? (
					<div className="flex flex-col py-4 pt-3 px-6 flex-1">
						{/* tên tổ  */}
						<div className="flex flex-row gap-4 py-2 items-center">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Tên phòng ban:
							</Typography>
							<input
								ref={inputRef}
								type="text"
								spellCheck="false"
								className="w-full text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
								value={departmentData?.name}
								onChange={(e) =>
									setDepartmentData((prev) => {
										return {
											...prev,
											name: e.target.value,
										};
									})
								}
							/>
						</div>
						{/* chọn tổ trưởng  */}
						<div className="flex flex-row gap-4 py-2 items-center">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Trưởng phòng:
							</Typography>
							{teacherListData && (
								<Menu placement="bottom" allowHover>
									<MenuHandler>
										<Button
											variant="text"
											className="w-full flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium capitalize outline-none bg-upperBg py-1 px-2 border-solid border-[1px] border-gray-400 rounded-sm"
										>
											{chosenTeacher?.firstName +
												' ' +
												chosenTeacher?.lastName}
											<ChevronDownIcon
												strokeWidth={2.5}
												className={`h-3.5 w-3.5 transition-transform `}
											/>
										</Button>
									</MenuHandler>
									<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
										{teacherListData.map(
											(teacher, index, arr) => (
												<MenuItem
													key={teacher.id}
													onClick={() =>
														handleChooseTeacher(
															teacher.id
														)
													}
													className={`py-1 px-3 rounded-none ${
														index !==
															arr.length - 1 &&
														'border-b-[1px] border-solid border-gray-300'
													}`}
												>
													<Typography className="text-sm font-medium text-text">
														{teacher?.firstName +
															' ' +
															teacher?.lastName ||
															' '}
													</Typography>
												</MenuItem>
											)
										)}
									</MenuList>
								</Menu>
							)}
							{teachersLoading && (
								<div className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
									<Spinner
										color="indigo"
										className="size-5"
									/>
								</div>
							)}
						</div>
						{/* mô tả  */}
						<div className="flex flex-row gap-4 py-2 items-center">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Mô tả:
							</Typography>
							<textarea
								type="text"
								spellCheck="false"
								className="text-sm w-full font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
								value={departmentData?.description}
								onChange={(e) =>
									setDepartmentData((prev) => {
										return {
											...prev,
											description: e.target.value,
										};
									})
								}
							/>
						</div>
					</div>
				) : (
					<div className="flex flex-col py-4 pt-3 px-12 w-full">
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Tên phòng ban:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{departmentData?.name}&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Trưởng phòng:
							</Typography>
							<Link
								to={
									'/admin/manage-teachers/' +
									departmentData?.headTeacher?.id
								}
							>
								<Typography className="text-sm font-semibold text-main cursor-pointer">
									{departmentData?.headTeacher?.firstName +
										' ' +
										departmentData?.headTeacher?.lastName}
									&nbsp;
								</Typography>
							</Link>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Email:
							</Typography>
							<Typography className="text-sm font-semibold text-main cursor-pointer">
								<a
									href={
										'mailTo:' +
										departmentData?.headTeacher?.user?.email
									}
								>
									{departmentData?.headTeacher?.user?.email}
									&nbsp;
								</a>
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Mô tả:
							</Typography>
							<Typography className="text-sm font-normal">
								{departmentData?.description}&nbsp;
							</Typography>
						</div>
					</div>
				))}
			{isEditDepartmentInfo ? (
				<div className="flex flex-col">
					<Button
						className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() =>
							setDepartmentData(data) ||
							setIsEditDepartmentInfo(false)
						}
						disabled={editLoading}
					>
						<XMarkIcon className="size-5 text-error" />
					</Button>
					<Button
						className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
						onClick={handleSaveDepartmentInfo}
						disabled={editLoading}
					>
						{editLoading ? (
							<Spinner color="indigo" className="size-5" />
						) : (
							<CheckIcon className="size-5 text-main" />
						)}
					</Button>
				</div>
			) : (
				<Button
					className="bg-main/30 rounded-md rounded-l-none hover:opacity-80 px-3"
					onClick={() => setIsEditDepartmentInfo(true)}
				>
					<PencilSquareIcon className="size-5 text-main" />
				</Button>
			)}
			{editLoading && <div className="absolute w-full h-full"></div>}
		</div>
	);
};

export default DepartmentInfo;
