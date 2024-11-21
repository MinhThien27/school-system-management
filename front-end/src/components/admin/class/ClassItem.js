import {
	CheckIcon,
	EllipsisHorizontalIcon,
	PencilSquareIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import {
	Button,
	Checkbox,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Spinner,
	Typography,
} from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { ConfirmDialog } from '../../comfirm/ConfirmDialog';
import useConfirmDialog from '../../../hooks/useConfirmDialog';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import {
	MAX_CLASS_CAPACITY,
	MIN_CLASS_CAPACITY,
	NOTIFY_STYLE,
} from '../../../config/constants';
import { Link } from 'react-router-dom';
import {
	useDeleteClassMutation,
	useEditClassInfoMutation,
} from '../../../services/class/classApiSlice';
import { useGetTeachersQuery } from '../../../services/teacher/teacherApiSlice';
import { useGetLevelsQuery } from '../../../services/level/levelApiSlice';
import { useGetAcademyYearsQuery } from '../../../services/academy-year/academyYearApiSlice';

const ClassItem = (props) => {
	const dispatch = useDispatch();
	const [data, setData] = useState(null);
	useEffect(() => {
		if (props.data) setData(props.data);
	}, [props.data]);

	//xóa lớp
	const [deleteClass, { isLoading: deleteLoading }] =
		useDeleteClassMutation();
	const [openConfirmDeleteDialogState, toggleDeleteDialog] =
		useConfirmDialog(false);

	const handleDeleteClass = async () => {
		toggleDeleteDialog();
		try {
			await deleteClass(data.id).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã xóa thành công!',
				})
			);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Vui lòng nhập đầy đủ thông tin!';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn.';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	//chỉnh sửa phòng ban
	const [activeEdit, setActiveEdit] = useState(false);
	const [editClassInfo, { isLoading: editLoading }] =
		useEditClassInfoMutation();

	const handleActiveEdit = () => {
		setActiveEdit((prev) => !prev);
	};
	const handleInactiveEdit = () => {
		setData(props.data);
		setActiveEdit(false);
	};

	const handleSaveDepartment = async () => {
		try {
			await editClassInfo({ id: data?.id, body: data }).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			handleInactiveEdit();
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess =
					'Khối chưa đủ thông tin, giáo viên đã có lớp chủ nhiệm hoặc đã trùng tên lớp!';
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
		setData((prev) => {
			return { ...prev, formTeacherId: id };
		});
		setChosenTeacher(teacherListData.filter((s) => s.id === id)[0]);
	};

	//danh sách khối
	const { data: levelListDataApi, isLoading: levelsLoading } =
		useGetLevelsQuery({
			page: 0,
			quantity: 100,
		});
	const [levelListData, setLevelListData] = useState(null);
	useEffect(() => {
		if (levelListDataApi) setLevelListData(levelListDataApi?.items);
	}, [levelListDataApi]);

	useEffect(() => {
		if (levelListData && data)
			setChosenLevel(
				levelListData.filter((t) => t.id === data.levelId)[0]
			);
	}, [levelListData, data]);

	const [chosenLevel, setChosenLevel] = useState(null);
	const handleChooseLevel = (id) => {
		setData((prev) => {
			return { ...prev, levelId: id };
		});
		setChosenLevel(levelListData.filter((s) => s.id === id)[0]);
	};

	//danh sách năm học
	const { data: academyYearListDataApi, isLoading: academyYearsLoading } =
		useGetAcademyYearsQuery({
			page: 0,
			quantity: 100,
		});
	const [academyYearListData, setAcademyYearListData] = useState(null);
	useEffect(() => {
		if (academyYearListDataApi)
			setAcademyYearListData(academyYearListDataApi?.items);
	}, [academyYearListDataApi]);
	useEffect(() => {
		if (academyYearListData && data)
			setChosenAcademyYear(
				academyYearListData.filter(
					(t) => t.id === data.academicYearId
				)[0]
			);
	}, [academyYearListData, data]);
	const [chosenAcademyYear, setChosenAcademyYear] = useState(null);
	const handleChooseAcademyYear = (id) => {
		setData((prev) => {
			return { ...prev, academicYearId: id };
		});
		setChosenAcademyYear(academyYearListData.filter((s) => s.id === id)[0]);
	};

	return data ? (
		!activeEdit ? (
			<>
				<div className={props.className}>
					<Typography className="whitespace-nowrap text-sm text-center">
						{props.index}
					</Typography>
					<Link to={'/admin/manage-classes/' + data?.id + '?page=1'}>
						<Typography className="whitespace-nowrap text-sm text-center text-blue-900 font-semibold hover:opacity-70">
							{data?.name}&nbsp;
						</Typography>
					</Link>
					<Typography className="whitespace-nowrap text-sm text-center">
						{data?.roomCode}&nbsp;
					</Typography>
					<Link to={'/admin/manage-levels'}>
						<Typography className="whitespace-nowrap text-sm text-center text-blue-900 font-semibold hover:opacity-70">
							{data?.level?.levelNumber}&nbsp;
						</Typography>
					</Link>
					<Link
						to={
							'/admin/manage-academy-years/' +
							data?.academicYearId
						}
					>
						<Typography className="whitespace-nowrap text-sm text-center text-blue-900 font-semibold hover:opacity-70">
							{data?.academicYear?.name}&nbsp;
						</Typography>
					</Link>
					<Link to={'/admin/manage-teachers/' + data?.formTeacherId}>
						<Typography className="whitespace-nowrap font-semibold text-sm text-center text-blue-900 hover:opacity-70">
							{data?.formTeacher?.firstName +
								' ' +
								data?.formTeacher?.lastName}
							&nbsp;
						</Typography>
					</Link>

					<Typography className="whitespace-nowrap text-sm text-center">
						{data?.capacity || ' '}
					</Typography>
					<Typography className="whitespace-nowrap text-sm flex justify-center">
						{data?.status === 'Active' ? (
							<CheckIcon className="size-5 text-success" />
						) : (
							<EllipsisHorizontalIcon className="size-5" />
						)}
					</Typography>
					<Typography className="whitespace-nowrap text-sm text-center flex justify-center items-center gap-4">
						<PencilSquareIcon
							className="size-5 text-indigo-900 cursor-pointer hover:opacity-70"
							onClick={handleActiveEdit}
						/>
						{deleteLoading ? (
							<Spinner color="red" className="size-5" />
						) : (
							<TrashIcon
								className="size-5 text-error cursor-pointer hover:opacity-70"
								onClick={toggleDeleteDialog}
							/>
						)}
					</Typography>
				</div>
				<ConfirmDialog
					open={openConfirmDeleteDialogState}
					toggle={toggleDeleteDialog}
					type={'Err'}
					header={
						<Typography className="text-error text-2xl p-4 pb-0 font-bold">
							Xác nhận hành động.
						</Typography>
					}
					content={
						'Thao tác này sẽ không thể khôi phục. Bạn có muốn tiếp tục?'
					}
					confirmButton={
						<Button
							className="bg-error text-textWhite"
							onClick={handleDeleteClass}
						>
							Xác nhận
						</Button>
					}
				/>
			</>
		) : (
			<div className={props.className}>
				<Typography className="whitespace-nowrap text-sm flex justify-center items-center">
					{props?.index}
				</Typography>
				<input
					value={data?.name}
					onChange={(e) => setData({ ...data, name: e.target.value })}
					className={`w-full text-center text-sm font-semibold border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>
				{/* phòng học  */}
				<input
					value={data?.roomCode}
					onChange={(e) =>
						setData({ ...data, roomCode: e.target.value })
					}
					className={`w-full text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>
				{/* Khối  */}
				{levelListData && (
					<Menu placement="bottom" allowHover>
						<MenuHandler>
							<Button
								variant="text"
								className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
							>
								{chosenLevel ? (
									chosenLevel?.levelNumber
								) : (
									<EllipsisHorizontalIcon className="size-4" />
								)}
							</Button>
						</MenuHandler>
						<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
							{levelListData.map((level, index, arr) => (
								<MenuItem
									key={level.id}
									onClick={() => handleChooseLevel(level.id)}
									className={`py-1 px-3 rounded-none ${
										index !== arr.length - 1 &&
										'border-b-[1px] border-solid border-gray-300'
									}`}
								>
									<Typography className="text-sm font-medium text-text">
										{level?.levelNumber}&nbsp;
									</Typography>
								</MenuItem>
							))}
						</MenuList>
					</Menu>
				)}
				{levelsLoading && (
					<div className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
						<Spinner color="indigo" className="size-5" />
					</div>
				)}
				{/* Năm học  */}
				{academyYearListData && (
					<Menu placement="bottom" allowHover>
						<MenuHandler>
							<Button
								variant="text"
								className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
							>
								{chosenAcademyYear ? (
									chosenAcademyYear?.name
								) : (
									<EllipsisHorizontalIcon className="size-4" />
								)}
							</Button>
						</MenuHandler>
						<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
							{academyYearListData?.map(
								(academyYear, index, arr) => (
									<MenuItem
										key={academyYear.id}
										onClick={() =>
											handleChooseAcademyYear(
												academyYear.id
											)
										}
										className={`py-1 px-3 rounded-none ${
											index !== arr.length - 1 &&
											'border-b-[1px] border-solid border-gray-300'
										}`}
									>
										<Typography className="text-sm font-medium text-text">
											{academyYear?.name}&nbsp;
										</Typography>
									</MenuItem>
								)
							)}
						</MenuList>
					</Menu>
				)}
				{academyYearsLoading && (
					<div className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
						<Spinner color="indigo" className="size-5" />
					</div>
				)}
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
					<div className="flex items-center w-full justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
						<Spinner color="indigo" className="size-5" />
					</div>
				)}
				{/* sỉ số  */}
				<input
					type="number"
					min={MIN_CLASS_CAPACITY}
					max={MAX_CLASS_CAPACITY}
					value={data?.capacity}
					onChange={(e) =>
						setData({ ...data, capacity: Number(e.target.value) })
					}
					className={`w-full pl-4 text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>
				{/* trạng thái  */}
				<div className="w-full text-center">
					<Checkbox
						color="green"
						className="hover:before:opacity-0 hover:opacity-70 border-gray-500 border-[2px] w-5 h-5 mx-auto"
						containerProps={{
							className: 'p-1',
						}}
						checked={data.status === 'Active'}
						onChange={(e) =>
							setData({
								...data,
								status:
									data.status === 'Active'
										? 'Inactive'
										: 'Active',
							})
						}
					/>
				</div>

				<Typography className="whitespace-nowrap text-sm text-center flex justify-center items-center gap-4">
					{editLoading ? (
						<Spinner color="gray" className="size-5" />
					) : (
						<CheckIcon
							className="size-6 text-indigo-900 cursor-pointer hover:opacity-70"
							onClick={handleSaveDepartment}
						/>
					)}

					<XMarkIcon
						className="size-6 text-error cursor-pointer hover:opacity-70"
						onClick={handleInactiveEdit}
					/>
				</Typography>
			</div>
		)
	) : (
		<div className="w-full flex justify-center">Error</div>
	);
};

export default ClassItem;
