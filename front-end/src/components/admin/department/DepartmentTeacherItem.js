import { Button, Spinner, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DepartmentSubjectsForTeacher from './DepartmentSubjectsForTeacher';
import {
	// ArrowRightStartOnRectangleIcon,
	CheckIcon,
	PencilSquareIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import { ConfirmDialog } from '../../comfirm/ConfirmDialog';
import useConfirmDialog from '../../../hooks/useConfirmDialog';
import {
	useEditTeacherSubjectsMutation,
	useRemoveTeacherFromDepartmentMutation,
} from '../../../services/department/departmentApiSlice';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import { formatTimestamp } from '../../../utils';

const DepartmentTeacherItem = ({ data, setInactive }) => {
	const dispatch = useDispatch();
	const { departmentId } = useParams();

	const [teacherData, setTeacherData] = useState(null);
	useEffect(() => {
		if (data) setTeacherData(data?.teacher);
	}, [data]);

	const [isEditDepartTeacher, setIsEditDepartTeacher] = useState(false);

	//chỉnh sửa môn
	const [teacherSubjects, setTeacherSubjects] = useState(null);
	useEffect(() => {
		if (data?.availableSubjects)
			setTeacherSubjects(
				data.availableSubjects.map((s) => ({
					...s.subject,
					isRemove: false,
				}))
			);
	}, [data]);

	const resetTeacherSubjects = () => {
		setTeacherSubjects(
			data.availableSubjects.map((s) => ({
				...s.subject,
				isRemove: false,
			}))
		);
	};

	const handleRemoveSubject = (id) => {
		setTeacherSubjects((prev) =>
			prev.map((s) => {
				return s.id === id ? { ...s, isRemove: true } : s;
			})
		);
	};
	const handleAddSubject = (subject) => {
		setTeacherSubjects((prev) => {
			if (prev.map((s) => s.id).includes(subject.id)) {
				return prev.map((s) => {
					return s.id === subject.id ? { ...s, isRemove: false } : s;
				});
			}
			return [...prev, { ...subject, isRemove: false }];
		});
	};

	const [editTeacherSubjects, { isLoading: editLoading }] =
		useEditTeacherSubjectsMutation();

	const handleSaveTeacherSubjects = async () => {
		try {
			await editTeacherSubjects({
				departmentId: departmentId,
				editId: data.id,
				body: teacherSubjects
					.filter((s) => s.isRemove === false)
					.map((s) => {
						return s.id;
					}),
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsEditDepartTeacher(false);
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
	//xóa giáo viên khỏi phòng
	const [removeTeacherFromDepartment, { isLoading: removeLoading }] =
		useRemoveTeacherFromDepartmentMutation();
	const [openConfirmRemoveDialogState, toggleRemoveDialog] =
		useConfirmDialog(false);

	const handleRemoveTeacher = async () => {
		toggleRemoveDialog();
		try {
			await removeTeacherFromDepartment({
				id: departmentId,
				removeId: data?.id,
			}).unwrap();
			setInactive();

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
		<div
			className={`w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center mb-4 ${
				isEditDepartTeacher && 'shadow-top'
			}`}
		>
			<div className="w-full flex flex-row relative">
				<div className="grid grid-cols-2 py-3 w-full border-solid border-l-[1px] border-gray-300">
					{/* thông tin cá nhân  */}
					{teacherData && (
						<div className="flex flex-col px-12 gap-x-4">
							<div className="flex flex-row gap-2 py-2">
								<Typography className="text-sm font-normal whitespace-nowrap ">
									Họ và tên:
								</Typography>
								<Link
									to={
										'/admin/manage-teachers/' +
										teacherData?.id
									}
								>
									<Typography className="text-sm font-semibold text-blue-900 cursor-pointer">
										{teacherData?.firstName +
											' ' +
											teacherData?.lastName}
									</Typography>
								</Link>
							</div>
							<div className="flex flex-row gap-2 py-2">
								<Typography className="text-sm font-normal whitespace-nowrap ">
									Số điện thoại:
								</Typography>
								<Typography className="text-sm font-semibold ">
									{teacherData?.user?.phoneNumber}
								</Typography>
							</div>
							<div className="flex flex-row gap-2 py-2">
								<Typography className="text-sm font-normal whitespace-nowrap ">
									Mã định danh:
								</Typography>
								<Typography className="text-sm font-semibold ">
									{teacherData?.user?.citizenIdentification}
								</Typography>
							</div>

							<div className="flex flex-row gap-2 py-2">
								<Typography className="text-sm font-normal whitespace-nowrap ">
									Ngày sinh:
								</Typography>
								<Typography className="text-sm font-semibold ">
									{formatTimestamp(teacherData?.dob)}
								</Typography>
							</div>
							<div className="flex flex-row gap-2 py-2">
								<Typography className="text-sm font-normal whitespace-nowrap">
									Email:
								</Typography>
								<Typography className="text-sm font-semibold text-blue-900 cursor-pointer">
									{teacherData?.user?.email}
								</Typography>
							</div>
						</div>
					)}
					{/* môn  */}
					{teacherSubjects && (
						<DepartmentSubjectsForTeacher
							teacherSubjects={teacherSubjects}
							isEdit={isEditDepartTeacher}
							remove={handleRemoveSubject}
							add={handleAddSubject}
						/>
					)}
					{/* thao tác  */}
					{isEditDepartTeacher && (
						<div className="w-full flex justify-center items-center gap-4 mb-1 col-start-2">
							{/* <Button className="bg-main/30 rounded-md hover:opacity-80 px-3 text-main flex gap-1 items-center">
								Chuyển
								<ArrowRightStartOnRectangleIcon className="size-4 mb-[1px]" />
							</Button> */}
							<Button
								className="bg-error/30 rounded-md hover:opacity-80 px-4 py-2 text-error flex gap-1 items-center"
								onClick={toggleRemoveDialog}
							>
								{removeLoading ? (
									<Spinner color="red" className="size-4" />
								) : (
									<>
										Xóa
										<TrashIcon className="size-4 mb-[2px]" />
									</>
								)}
							</Button>
						</div>
					)}
				</div>
				{isEditDepartTeacher ? (
					<div className="flex flex-col">
						<Button
							className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
							onClick={() =>
								resetTeacherSubjects() ||
								setIsEditDepartTeacher(false)
							}
							disabled={editLoading}
						>
							<XMarkIcon className="size-5 text-error" />
						</Button>
						<Button
							className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
							onClick={handleSaveTeacherSubjects}
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
						onClick={() => setIsEditDepartTeacher(true)}
					>
						<PencilSquareIcon className="size-5 text-main" />
					</Button>
				)}
				{editLoading && <div className="absolute w-full h-full"></div>}
			</div>
			{/* xác nhận xóa  */}
			<ConfirmDialog
				open={openConfirmRemoveDialogState}
				toggle={toggleRemoveDialog}
				type={'Err'}
				header={
					<Typography className="text-error text-2xl p-4 pb-0 font-bold text-center">
						Xóa giáo viên khỏi phòng ban này?
					</Typography>
				}
				content={
					'Thao tác này sẽ không thể khôi phục. Bạn có muốn tiếp tục?'
				}
				confirmButton={
					<Button
						className="bg-error text-textWhite"
						onClick={handleRemoveTeacher}
					>
						Xác nhận
					</Button>
				}
			/>
		</div>
	);
};

export default DepartmentTeacherItem;
