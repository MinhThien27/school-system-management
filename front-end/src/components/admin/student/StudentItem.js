import { TrashIcon } from '@heroicons/react/24/solid';
import { Button, Spinner, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { ConfirmDialog } from '../../comfirm/ConfirmDialog';
import useConfirmDialog from '../../../hooks/useConfirmDialog';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';

import { Link } from 'react-router-dom';
import { useDeleteStudentMutation } from '../../../services/student/studentApiSlice';

const StudentItem = (props) => {
	const [data, setData] = useState(null);
	useEffect(() => {
		if (props.data) setData(props.data);
	}, [props.data]);

	const dispatch = useDispatch();

	//xóa học sinh
	const [deleteStudent, { isLoading: deleteLoading }] =
		useDeleteStudentMutation();
	const [openConfirmDeleteDialogState, toggleDeleteDialog] =
		useConfirmDialog(false);

	const handleDeleteStudent = async () => {
		toggleDeleteDialog();
		try {
			await deleteStudent(data.id).unwrap();
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
				mess = 'No Server Response';
			} else if (err.status === 400) {
				mess = 'Missing Username or Password';
			} else if (err.status === 401) {
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
				<Link to={'/admin/manage-students/' + data?.id}>
					<Typography className="whitespace-nowrap text-sm font-semibold cursor-pointer text-blue-900 hover:opacity-70">
						{data?.firstName + ' ' + data?.lastName}&nbsp;
					</Typography>
				</Link>
				<Typography className="whitespace-nowrap text-sm text-center font-medium text-blue-900 cursor-pointer">
					<a href={'mailTo:' + data?.user?.email}>
						{data?.user?.email}&nbsp;
					</a>
				</Typography>
				<Typography className="whitespace-nowrap text-sm text-center">
					{data?.user?.phoneNumber}&nbsp;
				</Typography>
				{data?.classStudents?.length !== 0 ? (
					<Link
						to={
							'/admin/manage-classes/' +
							data?.classStudents[0]?.class?.id
						}
					>
						<Typography className="whitespace-nowrap text-sm text-center font-semibold cursor-pointer text-blue-900 hover:opacity-70">
							{data?.classStudents[0]?.class?.name}&nbsp;
						</Typography>
					</Link>
				) : (
					<Typography className="whitespace-nowrap text-sm text-center font-semibold">
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
						onClick={handleDeleteStudent}
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

export default StudentItem;
