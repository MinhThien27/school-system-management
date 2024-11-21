import { TrashIcon } from '@heroicons/react/24/solid';
import { Button, Spinner, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { ConfirmDialog } from '../../comfirm/ConfirmDialog';
import useConfirmDialog from '../../../hooks/useConfirmDialog';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';

import { Link } from 'react-router-dom';
import { useRemoveStudentFromClassMutation } from '../../../services/class/classApiSlice';

const ClassStudentItem = (props) => {
	const [data, setData] = useState(null);
	useEffect(() => {
		if (props.data) setData(props.data);
	}, [props.data]);

	const dispatch = useDispatch();

	//xóa học sinh
	const [removeStudentFromClass, { isLoading: deleteLoading }] =
		useRemoveStudentFromClassMutation();
	const [openConfirmDeleteDialogState, toggleDeleteDialog] =
		useConfirmDialog(false);

	const handleRemoveStudentFromClass = async () => {
		toggleDeleteDialog();
		try {
			await removeStudentFromClass({
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
				mess = 'Thông tin không hợp lệ!';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn.';
			} else {
				mess = 'Hành động thất bại';
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
				<Link to={'/admin/manage-students/' + data?.studentId}>
					<Typography className="whitespace-nowrap text-sm font-semibold cursor-pointer text-blue-900 hover:opacity-70">
						{data?.student?.firstName +
							' ' +
							data?.student?.lastName}
						&nbsp;
					</Typography>
				</Link>
				<Typography className="whitespace-nowrap text-sm text-center font-normal ">
					{data?.student?.user?.citizenIdentification}&nbsp;
				</Typography>
				<Typography className="whitespace-nowrap text-sm text-center font-normal">
					{data?.student?.user?.phoneNumber}&nbsp;
				</Typography>

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
						onClick={handleRemoveStudentFromClass}
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

export default ClassStudentItem;
