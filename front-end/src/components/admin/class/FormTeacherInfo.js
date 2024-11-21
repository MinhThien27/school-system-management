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
import {
	CheckIcon,
	EllipsisHorizontalIcon,
	PencilSquareIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import { useChangeClassFormTeacherMutation } from '../../../services/class/classApiSlice';
import { useGetTeachersQuery } from '../../../services/teacher/teacherApiSlice';
import { Link } from 'react-router-dom';

const FormTeacherInfo = ({ data }) => {
	const dispatch = useDispatch();
	const [teacherData, setTeacherData] = useState(null);
	useEffect(() => {
		if (data) {
			setTeacherData(data?.formTeacher);
		}
	}, [data]);

	const [isActiveChangeFormTeacher, setIsActiveChangeFormTeacher] =
		useState(false);
	const [changeClassFormTeacher, { isLoading: editLoading }] =
		useChangeClassFormTeacherMutation();

	const handleSaveFormTeacher = async () => {
		try {
			await changeClassFormTeacher({
				id: data?.id,
				body: { formTeacherId: chosenTeacher?.id },
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsActiveChangeFormTeacher(false);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Giáo viên đã có lớp chủ nhiệm!';
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

	const resetData = () => {
		setTeacherData(data?.formTeacher);
	};

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
				teacherListData.filter((t) => t.id === data.formTeacherId)[0]
			);
	}, [teacherListData, data]);

	const [chosenTeacher, setChosenTeacher] = useState(null);
	const handleChooseTeacher = (id) => {
		setTeacherData((prev) => {
			return { ...prev, formTeacherId: id };
		});
		setChosenTeacher(teacherListData.filter((s) => s.id === id)[0]);
	};
	return (
		<div
			className={`w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row relative ${
				isActiveChangeFormTeacher && 'shadow-top'
			}`}
		>
			{teacherData &&
				(isActiveChangeFormTeacher ? (
					<div className="flex flex-col py-6 px-12 w-full border-solid border-l-[1px] border-gray-300">
						{/* họ tên  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="name"
								className="text-sm font-normal whitespace-nowrap "
							>
								Họ và tên đệm:
							</label>
							{/* chọn chủ nhiệm  */}
							{teacherListData && (
								<Menu placement="bottom" allowHover>
									<MenuHandler>
										<Button
											variant="text"
											className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
										>
											{chosenTeacher ? (
												chosenTeacher?.firstName +
												' ' +
												chosenTeacher?.lastName
											) : (
												<EllipsisHorizontalIcon className="size-4" />
											)}
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
															teacher?.lastName}
													</Typography>
												</MenuItem>
											)
										)}
									</MenuList>
								</Menu>
							)}
							{teachersLoading && (
								<div className="flex items-center w-full justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
									<Spinner
										color="indigo"
										className="size-5"
									/>
								</div>
							)}
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap">
								Email:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{chosenTeacher?.user?.email}&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Số điện thoại:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{chosenTeacher?.user?.phoneNumber}&nbsp;
							</Typography>
						</div>

						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Mã định danh:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{chosenTeacher?.user?.citizenIdentification}
								&nbsp;
							</Typography>
						</div>
					</div>
				) : (
					<div className="flex flex-col py-6 px-12 w-full border-solid border-l-[1px] border-gray-300">
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Chủ nhiệm:
							</Typography>
							<Link
								to={'/admin/manage-teachers/' + teacherData?.id}
							>
								<Typography className="text-sm font-semibold text-blue-900 cursor-pointer">
									{teacherData?.firstName +
										' ' +
										teacherData?.lastName}
									&nbsp;
								</Typography>
							</Link>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap">
								Email:
							</Typography>
							<Typography className="text-sm font-semibold text-blue-900 cursor-pointer">
								<a href={'mailTo:' + teacherData?.user?.email}>
									{teacherData?.user?.email}&nbsp;
								</a>
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Số điện thoại:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{teacherData?.user?.phoneNumber}&nbsp;
							</Typography>
						</div>

						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Mã định danh:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{teacherData?.user?.citizenIdentification}&nbsp;
							</Typography>
						</div>
					</div>
				))}

			{/* button  */}
			{isActiveChangeFormTeacher ? (
				<div className="flex flex-col">
					<Button
						className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() =>
							resetData() || setIsActiveChangeFormTeacher(false)
						}
						disabled={editLoading}
					>
						<XMarkIcon className="size-5 text-error" />
					</Button>
					<Button
						className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
						onClick={handleSaveFormTeacher}
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
					className="h-full bg-main/30 rounded-md rounded-l-none hover:opacity-80 px-3"
					onClick={() => setIsActiveChangeFormTeacher(true)}
				>
					<PencilSquareIcon className="size-5 text-main" />
				</Button>
			)}
			{editLoading && <div className="absolute w-full h-full"></div>}
		</div>
	);
};

export default FormTeacherInfo;
