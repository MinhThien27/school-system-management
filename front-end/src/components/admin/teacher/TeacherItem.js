import { TrashIcon } from '@heroicons/react/24/solid';
import { Button, Spinner, Typography } from '@material-tailwind/react';
import React from 'react';
import { ConfirmDialog } from '../../comfirm/ConfirmDialog';
import useConfirmDialog from '../../../hooks/useConfirmDialog';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import { useDeleteTeacherMutation } from '../../../services/teacher/teacherApiSlice';
import { Link } from 'react-router-dom';

const TeacherItem = (props) => {
	const data = props.data || null;
	const department = props.data.departmentTeachers || [];
	const dispatch = useDispatch();

	//xóa giáo viên
	const [deleteTeacher, { isLoading: deleteLoading }] =
		useDeleteTeacherMutation();
	const [openConfirmDeleteDialogState, toggleDeleteDialog] =
		useConfirmDialog(false);

	const handleDeleteTeacher = async () => {
		toggleDeleteDialog();
		try {
			await deleteTeacher(data.id).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã xóa thành công!',
				})
			);
		} catch (err) {
			let mess = '';
			if (!err?.originalStatus) {
				// isLoading: true until timeout occurs
				mess = 'No Server Response';
			} else if (err.originalStatus === 400) {
				mess = 'Missing Username or Password';
			} else if (err.originalStatus === 401) {
				mess = 'Unauthorized';
			} else {
				mess = 'Login Failed';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	return data ? (
		<>
			<div className={props.className}>
				<Typography className="whitespace-nowrap text-sm text-center">
					{props.index}
				</Typography>
				<Link to={'/admin/manage-teachers/' + data?.id}>
					<Typography className="whitespace-nowrap text-sm font-semibold cursor-pointer text-blue-900 hover:opacity-70">
						{data?.firstName + ' ' + data?.lastName || ' '}
					</Typography>
				</Link>
				<Typography className="whitespace-nowrap text-sm text-center font-medium text-blue-900 hover:opacity-70 cursor-pointer">
					<a href={'mailTo:' + data?.user?.email}>
						{data?.user?.email || ' '}
					</a>
				</Typography>
				<Typography className="whitespace-nowrap text-sm text-center">
					{data?.user?.phoneNumber || ' '}
				</Typography>
				{department?.length !== 0 ? (
					<Link
						to={
							'/admin/manage-departments/' +
							department[0]?.departmentId
						}
					>
						<Typography className="whitespace-nowrap text-sm text-center font-semibold cursor-pointer text-blue-900 hover:opacity-70">
							{department[0]?.department?.name || ' '}
						</Typography>
					</Link>
				) : (
					<Typography className="whitespace-nowrap text-sm text-center font-normal">
						Chưa có
					</Typography>
				)}

				<Typography className="whitespace-nowrap text-sm text-center flex justify-center items-center gap-4">
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
						onClick={handleDeleteTeacher}
					>
						Xác nhận
					</Button>
				}
			/>
		</>
	) : (
		<div className="w-full flex justify-center">Error</div>
	);
};

export default TeacherItem;
