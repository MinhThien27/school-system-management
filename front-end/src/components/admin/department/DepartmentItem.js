import {
	CheckIcon,
	PencilSquareIcon,
	TrashIcon,
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
import { ConfirmDialog } from '../../comfirm/ConfirmDialog';
import useConfirmDialog from '../../../hooks/useConfirmDialog';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import {
	useDeleteDepartmentMutation,
	useEditDepartmentMutation,
} from '../../../services/department/departmentApiSlice';
import { Link } from 'react-router-dom';
import { useGetTeachersQuery } from '../../../services/teacher/teacherApiSlice';

const DepartmentItem = (props) => {
	const dispatch = useDispatch();
	const [data, setData] = useState(null);
	useEffect(() => {
		if (props.data) setData(props.data);
	}, [props.data]);

	//xóa phòng ban
	const [deleteDepartment, { isLoading: deleteLoading }] =
		useDeleteDepartmentMutation();
	const [openConfirmDeleteDialogState, toggleDeleteDialog] =
		useConfirmDialog(false);

	const handleDeleteDepartment = async () => {
		toggleDeleteDialog();
		try {
			await deleteDepartment(data.id).unwrap();
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
	const [editDepartment, { isLoading: editLoading }] =
		useEditDepartmentMutation();

	const handleActiveEdit = () => {
		setActiveEdit((prev) => !prev);
	};
	const handleInactiveEdit = () => {
		setData(props.data);
		setActiveEdit(false);
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
			setData((prev) => {
				return {
					...prev,
					headTeacherId: newTeacher.id,
					headTeacher: newTeacher,
				};
			});
			setChosenTeacher(newTeacher);
		}
	};

	const handleSaveDepartment = async () => {
		try {
			await editDepartment({ id: data?.id, body: data }).unwrap();
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

	return data ? (
		!activeEdit ? (
			<>
				<div className={props.className}>
					<Typography className="whitespace-nowrap text-sm text-center">
						{props.index}
					</Typography>
					<Link to={'/admin/manage-departments/' + data?.id}>
						<Typography className="whitespace-nowrap text-sm text-center font-semibold hover:opacity-70">
							{data?.name}&nbsp;
						</Typography>
					</Link>
					<Link to={'/admin/manage-teachers/' + data?.headTeacher.id}>
						<Typography className="whitespace-nowrap text-sm text-main text-center font-semibold hover:opacity-70">
							{data?.headTeacher?.firstName +
								' ' +
								data?.headTeacher?.lastName}
							&nbsp;
						</Typography>
					</Link>
					<Typography className="text-sm text-center py-1 px-2 col-span-2">
						{data?.description}&nbsp;
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
							onClick={handleDeleteDepartment}
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
					className={`w-full py-1 text-center text-sm font-semibold border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>
				{/* chọn tổ trưởng  */}
				{teacherListData && (
					<Menu placement="bottom" allowHover>
						<MenuHandler>
							<Button
								variant="text"
								className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
							>
								{chosenTeacher?.firstName +
									' ' +
									chosenTeacher?.lastName}
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
										&nbsp;
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
				<textarea
					value={data?.description}
					onChange={(e) =>
						setData({ ...data, description: e.target.value })
					}
					className={`w-full p-1 px-2 text-center col-span-2 text-sm border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>

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

export default DepartmentItem;
