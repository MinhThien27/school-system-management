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
import { NOTIFY_STYLE } from '../../../config/constants';

import { Link, useParams } from 'react-router-dom';
import {
	useEditClassSubjectMutation,
	useEditClassTeacherTeachSubjectMutation,
	useRemoveSubjectFromClassMutation,
} from '../../../services/class/classApiSlice';
import { useGetTeachersBySubjectIdQuery } from '../../../services/teacher/teacherApiSlice';
import ListItemLoading from '../../loading/ListItemLoading';

const ClassSubjectItem = (props) => {
	const { classID } = useParams();
	const [data, setData] = useState(null);
	useEffect(() => {
		if (props.data) setData(props.data);
	}, [props.data]);
	const dispatch = useDispatch();

	//xóa môn ->done
	const [removeSubjectFromClass, { isLoading: deleteLoading }] =
		useRemoveSubjectFromClassMutation();
	const [openConfirmDeleteDialogState, toggleDeleteDialog] =
		useConfirmDialog(false);

	const handleRemoveSubjectFromClass = async () => {
		toggleDeleteDialog();
		try {
			await removeSubjectFromClass({
				id: props.classId,
				removeId: data.id,
			}).unwrap();
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
				mess = 'Thông tin không chính xác';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	//chỉnh sửa ->done
	const [activeEdit, setActiveEdit] = useState(false);
	const [editClassSubject, { isLoading: editLoading1 }] =
		useEditClassSubjectMutation();
	const [editClassTeacherTeachSubject, { isLoading: editLoading2 }] =
		useEditClassTeacherTeachSubjectMutation();

	const handleActiveEdit = () => {
		setActiveEdit((prev) => !prev);
	};
	const handleInactiveEdit = () => {
		setData(props.data);
		setActiveEdit(false);
	};

	const handleSaveClassSubject = async () => {
		try {
			await editClassSubject({
				id: classID,
				editId: data?.id,
				body: data,
			}).unwrap();
			if (data.teacherClassSubjects.length <= 0) {
				await editClassTeacherTeachSubject({
					id: chosenTeacher?.departmentTeacher?.teacher?.id,
					method: 'POST',
					body: { classSubjectId: data.id },
				}).unwrap();
			} else {
				await editClassTeacherTeachSubject({
					id: chosenTeacher?.departmentTeacher?.teacher?.id,
					editId: data?.teacherClassSubjects[0]?.id,
					method: 'PATCH',
					body: { classSubjectId: data.id },
				}).unwrap();
			}

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
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn.';
			} else if (err.status === 409) {
				mess = 'Đã tồn tại!';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	//danh sách giáo viên
	const { data: teacherListDataApi, isLoading: teachersLoading } =
		useGetTeachersBySubjectIdQuery(data?.subjectId);
	const [teacherListData, setTeacherListData] = useState(null);
	useEffect(() => {
		if (teacherListDataApi)
			setTeacherListData(teacherListDataApi?.availableTeacherSubjects);
	}, [teacherListDataApi]);

	useEffect(() => {
		if (teacherListData && data.teacherClassSubjects.length > 0)
			setChosenTeacher(
				teacherListData.filter(
					(t) =>
						t.departmentTeacher?.teacher?.id ===
						data.teacherClassSubjects[0].teacherId
				)[0]
			);
	}, [teacherListData, data]);

	const [chosenTeacher, setChosenTeacher] = useState(null);
	const handleChooseTeacher = (id) => {
		setChosenTeacher(
			teacherListData.filter(
				(s) => s?.departmentTeacher?.teacher?.id === id
			)[0]
		);
	};

	return data ? (
		!activeEdit ? (
			<>
				<div className={props.className + ' relative'}>
					<Typography className="whitespace-nowrap text-sm text-center">
						{props.index}
					</Typography>

					<Typography className="whitespace-nowrap text-sm font-semibold text-center">
						{data?.subject?.name}&nbsp;
					</Typography>

					{data?.teacherClassSubjects.length > 0 ? (
						<Link
							to={
								'/admin/manage-teachers/' +
								data?.teacherClassSubjects[0].teacherId
							}
							className="col-span-2"
						>
							<Typography className="whitespace-nowrap text-sm font-semibold cursor-pointer text-blue-900 hover:opacity-70">
								{data?.teacherClassSubjects[0]?.teacher
									?.firstName +
									' ' +
									data?.teacherClassSubjects[0]?.teacher
										?.lastName}
								&nbsp;
							</Typography>
						</Link>
					) : (
						<div className="w-full flex justify-center col-span-2">
							<EllipsisHorizontalIcon className="size-4" />
						</div>
					)}
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
				{deleteLoading && (
					<div className="absolute w-full h-full"></div>
				)}
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
							onClick={handleRemoveSubjectFromClass}
						>
							Xác nhận
						</Button>
					}
				/>
			</>
		) : (
			<div className={props.className + ' relative'}>
				<Typography className="whitespace-nowrap text-sm flex justify-center items-center">
					{props?.index}
				</Typography>
				<Typography className="whitespace-nowrap text-sm font-semibold text-center cursor-not-allowed">
					{data?.subject?.name}&nbsp;
				</Typography>

				{/* chọn giáo viên  */}
				{/* {data.teacherClassSubjects.length > 0 ? (
					<Typography className="whitespace-nowrap col-span-2 text-sm font-semibold cursor-not-allowed">
						{data?.teacherClassSubjects[0]?.teacher?.firstName +
							' ' +
							data?.teacherClassSubjects[0]?.teacher?.lastName}
						&nbsp;
					</Typography>
				) : (
					<div className="col-span-2 w-full px-12">
						{teacherListData && (
							<Menu placement="bottom" allowHover>
								<MenuHandler>
									<Button
										variant="text"
										className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
									>
										{chosenTeacher ? (
											chosenTeacher?.departmentTeacher
												?.teacher?.firstName +
											' ' +
											chosenTeacher?.departmentTeacher
												?.teacher?.lastName
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
														teacher
															?.departmentTeacher
															?.teacher?.id
													)
												}
												className={`py-1 px-3 rounded-none ${
													index !== arr.length - 1 &&
													'border-b-[1px] border-solid border-gray-300'
												}`}
											>
												<Typography className="text-sm font-medium text-text">
													{teacher?.departmentTeacher
														?.teacher?.firstName +
														' ' +
														teacher
															?.departmentTeacher
															?.teacher?.lastName}
												</Typography>
											</MenuItem>
										)
									)}
								</MenuList>
							</Menu>
						)}
						{teachersLoading && (
							<div className="flex items-center w-full justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
								<Spinner color="indigo" className="size-5" />
							</div>
						)}
					</div>
				)} */}
				<div className="col-span-2 w-full px-12">
					{teacherListData && (
						<Menu placement="bottom" allowHover>
							<MenuHandler>
								<Button
									variant="text"
									className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
								>
									{chosenTeacher ? (
										chosenTeacher?.departmentTeacher
											?.teacher?.firstName +
										' ' +
										chosenTeacher?.departmentTeacher
											?.teacher?.lastName
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
											handleChooseTeacher(
												teacher?.departmentTeacher
													?.teacher?.id
											)
										}
										className={`py-1 px-3 rounded-none ${
											index !== arr.length - 1 &&
											'border-b-[1px] border-solid border-gray-300'
										}`}
									>
										<Typography className="text-sm font-medium text-text">
											{teacher?.departmentTeacher?.teacher
												?.firstName +
												' ' +
												teacher?.departmentTeacher
													?.teacher?.lastName}
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
				</div>

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
					{editLoading1 || editLoading2 ? (
						<Spinner color="gray" className="size-5" />
					) : (
						<CheckIcon
							className="size-6 text-indigo-900 cursor-pointer hover:opacity-70"
							onClick={handleSaveClassSubject}
						/>
					)}

					<XMarkIcon
						className="size-6 text-error cursor-pointer hover:opacity-70"
						onClick={handleInactiveEdit}
					/>
				</Typography>
				{(editLoading1 || editLoading2) && (
					<div className="absolute w-full h-full"></div>
				)}
			</div>
		)
	) : (
		<ListItemLoading />
	);
};

export default ClassSubjectItem;
