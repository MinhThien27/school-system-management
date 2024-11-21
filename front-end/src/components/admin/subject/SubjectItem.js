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
	Spinner,
	Typography,
} from '@material-tailwind/react';
import React, { useEffect, useRef, useState } from 'react';
import { ConfirmDialog } from '../../comfirm/ConfirmDialog';
import useConfirmDialog from '../../../hooks/useConfirmDialog';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import {
	useDeleteSubjectMutation,
	useEditSubjectMutation,
} from '../../../services/subject/subjectApiSlice';

const SubjectItem = (props) => {
	const [data, setData] = useState(null);
	useEffect(() => {
		if (props.data) setData(props.data);
	}, [props.data]);
	const dispatch = useDispatch();

	//xóa môn
	const [deleteSubject, { isLoading: deleteLoading }] =
		useDeleteSubjectMutation();
	const [openConfirmDeleteDialogState, toggleDeleteDialog] =
		useConfirmDialog(false);

	const handleDeleteSubject = async () => {
		toggleDeleteDialog();
		try {
			await deleteSubject(data.id).unwrap();
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

	//chỉnh sửa môn
	const [activeEdit, setActiveEdit] = useState(false);
	const [editSubject, { isLoading: editLoading }] = useEditSubjectMutation();

	const handleActiveEdit = () => {
		setActiveEdit((prev) => !prev);
	};
	const handleInactiveEdit = () => {
		setData(props.data);
		setActiveEdit(false);
	};

	const handleSaveSubject = async () => {
		try {
			await editSubject({ id: data?.id, body: data }).unwrap();
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
				mess = 'Thông tin không hợp lệ';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	//input control
	const inputRefs = useRef([]);
	const handleKeyDown = (event, index) => {
		const len = inputRefs.current.length;
		if (event.key === 'Enter') {
			event.preventDefault();
			if (index < len - 1) {
				inputRefs.current[index + 1].focus();
				inputRefs.current[index + 1].select();
			} else if (index === len - 1) {
				inputRefs.current[0].focus();
				inputRefs.current[0].select();
			}
		}
	};

	useEffect(() => {
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus();
			inputRefs.current[0].select();
		}
	}, [activeEdit]);

	return data ? (
		!activeEdit ? (
			<>
				<div className={props.className}>
					<Typography className="whitespace-nowrap text-sm text-center">
						{props.index}&nbsp;
					</Typography>
					<Typography className="whitespace-nowrap text-sm text-center font-semibold">
						{data?.name}&nbsp;
					</Typography>
					<Typography className="whitespace-nowrap col-span-2 text-sm text-center">
						{data?.description}&nbsp;
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
							onClick={handleDeleteSubject}
						>
							Xác nhận
						</Button>
					}
				/>
			</>
		) : (
			<div className={props.className}>
				<Typography className="whitespace-nowrap text-sm flex justify-center items-center">
					{props?.index}&nbsp;
				</Typography>
				<input
					value={data?.name}
					onChange={(e) => setData({ ...data, name: e.target.value })}
					ref={(el) => (inputRefs.current[0] = el)}
					onKeyDown={(e) => handleKeyDown(e, 0)}
					className={`w-full text-center text-sm font-semibold border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>
				<input
					value={data?.description}
					onChange={(e) =>
						setData({ ...data, description: e.target.value })
					}
					ref={(el) => (inputRefs.current[2] = el)}
					onKeyDown={(e) => handleKeyDown(e, 2)}
					className={`w-full text-center col-span-2 text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>
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
							onClick={handleSaveSubject}
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

export default SubjectItem;
