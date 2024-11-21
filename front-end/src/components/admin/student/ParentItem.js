import { Button, Spinner, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import {
	CheckIcon,
	PencilSquareIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import {
	useDeleteParentMutation,
	useEditParentInfoMutation,
} from '../../../services/student/studentApiSlice';
import { formatTimestamp, formatTimestampToValue } from '../../../utils';
import { ConfirmDialog } from '../../comfirm/ConfirmDialog';
import useConfirmDialog from '../../../hooks/useConfirmDialog';

const ParentItem = ({ data, studentID }) => {
	const dispatch = useDispatch();
	const [parentData, setParentData] = useState(null);
	useEffect(() => {
		if (data) setParentData(data);
	}, [data]);

	const [isEditParentInfo, setIsEditParentInfo] = useState(false);

	//edit
	const [editParentInfo, { isLoading: editLoading }] =
		useEditParentInfoMutation();
	const handleSaveParentInfo = async () => {
		try {
			await editParentInfo({
				id: studentID,
				parentId: data.id,
				body: parentData,
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsEditParentInfo(false);
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

	//delete
	const [openConfirmDeleteDialogState, toggleDeleteDialog] =
		useConfirmDialog(false);
	const [deleteParent, { isLoading: deleteLoading }] =
		useDeleteParentMutation();
	const handleDeleteParent = async () => {
		try {
			await deleteParent({
				id: studentID,
				parentId: data.id,
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã xóa!',
				})
			);
			setIsEditParentInfo(false);
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

	const resetData = () => {
		setParentData(data);
	};
	return (
		<div
			className={`w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row relative ${
				isEditParentInfo && 'shadow-top'
			}`}
		>
			{isEditParentInfo ? (
				<div className="flex flex-col py-6 px-6 w-full border-solid border-l-[1px] border-gray-300">
					{/* họ tên  */}
					<div className="flex flex-row gap-2 py-1 items-center">
						<label
							htmlFor="name"
							className="text-sm font-normal whitespace-nowrap "
						>
							Họ và tên đệm:
						</label>
						<div className="flex gap-2">
							<input
								id="name"
								type="text"
								spellCheck="false"
								className="w-2/3 text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
								value={parentData?.firstName}
								onChange={(e) =>
									setParentData((prev) => {
										return {
											...prev,
											firstName: e.target.value,
										};
									})
								}
							/>
							<input
								type="text"
								spellCheck="false"
								className="w-1/3 text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
								value={parentData?.lastName}
								onChange={(e) =>
									setParentData((prev) => {
										return {
											...prev,
											lastName: e.target.value,
										};
									})
								}
							/>
						</div>
					</div>
					{/* email  */}
					<div className="flex flex-row gap-2 py-1 items-center">
						<label
							htmlFor="email"
							className="text-sm font-normal whitespace-nowrap"
						>
							Email:
						</label>
						<input
							id="email"
							type="text"
							spellCheck="false"
							className="w-full text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
							value={parentData?.email}
							onChange={(e) =>
								setParentData((prev) => {
									return {
										...prev,
										email: e.target.value,
									};
								})
							}
						/>
					</div>
					{/* quan hệ  */}
					{/* <div className="flex flex-row gap-2 py-1 items-center">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Quan hệ:
						</Typography>
						<Menu placement="bottom" allowHover>
							<MenuHandler>
								<Button
									variant="text"
									className="flex min-w-24 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium capitalize text-text outline-none bg-upperBg py-1 px-2 border-solid border-[1px] border-gray-400 rounded-sm"
								>
									{parentData.relationship.show}
									<ChevronDownIcon
										strokeWidth={2.5}
										className={`h-3.5 w-3.5 transition-transform `}
									/>
								</Button>
							</MenuHandler>
							<MenuList className="shadow-top min-w-fit p-0 rounded-none h-fit">
								{PARENT.map((parent, index, arr) => (
									<MenuItem
										key={parent.send}
										onClick={() =>
											setParentData((prev) => ({
												...prev,
												relationship: parent,
											}))
										}
										className={`py-1 px-3 rounded-none ${
											index !== arr.length - 1 &&
											'border-b-[1px] border-solid border-gray-300'
										}`}
									>
										<Typography className="text-sm font-medium text-text">
											{parent.show}
										</Typography>
									</MenuItem>
								))}
							</MenuList>
						</Menu>
					</div> */}

					{/* số điện thoại  */}
					<div className="flex flex-row gap-2 py-1 items-center">
						<label
							htmlFor="phone"
							className="text-sm font-normal whitespace-nowrap"
						>
							Số điện thoại:
						</label>
						<input
							id="phone"
							type="text"
							spellCheck="false"
							className="w-full text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
							value={parentData?.phoneNumber}
							onChange={(e) =>
								setParentData((prev) => {
									return {
										...prev,
										phoneNumber: e.target.value,
									};
								})
							}
						/>
					</div>
					{/* ngày sinh  */}
					<div className="flex flex-row gap-2 py-1 items-center">
						<label
							htmlFor="dob"
							className="text-sm font-normal whitespace-nowrap "
						>
							Ngày sinh:
						</label>
						<input
							id="dob"
							type="date"
							defaultValue={formatTimestampToValue(
								parentData?.dob
							)}
							onChange={(e) =>
								setParentData({
									...parentData,
									dob: e.target.value,
								})
							}
							className="w-min h-[30px] p-1 text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
						/>
					</div>
				</div>
			) : (
				<div className="flex flex-col py-6 px-12 w-full border-solid border-l-[1px] border-gray-300">
					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Họ và tên:
						</Typography>
						<Typography className="text-sm font-semibold ">
							{parentData?.firstName + ' ' + parentData?.lastName}
							&nbsp;
						</Typography>
					</div>
					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap">
							Email:
						</Typography>
						<Typography className="text-sm font-semibold text-blue-900 cursor-pointer hover:opacity-70">
							<a href={'mailTo:' + parentData?.email}>
								{parentData?.email}&nbsp;
							</a>
						</Typography>
					</div>
					{/* <div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Quan hệ:
						</Typography>
						<Typography className="text-sm font-semibold ">
							{parentData?.relationship.show}
						</Typography>
					</div> */}

					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Số điện thoại:
						</Typography>
						<Typography className="text-sm font-semibold ">
							{parentData?.phoneNumber}&nbsp;
						</Typography>
					</div>

					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Ngày sinh:
						</Typography>
						<Typography className="text-sm font-semibold ">
							{formatTimestamp(parentData?.dob)}&nbsp;
						</Typography>
					</div>
				</div>
			)}

			{isEditParentInfo ? (
				<div className="flex flex-col">
					<Button
						className="bg-gray-300 h-1/3 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() =>
							resetData() || setIsEditParentInfo(false)
						}
						disabled={editLoading}
					>
						<XMarkIcon className="size-5 text-text" />
					</Button>
					<Button
						className="bg-main/30 h-1/3 rounded-none  hover:opacity-80 px-3"
						onClick={handleSaveParentInfo}
						disabled={editLoading}
					>
						{editLoading ? (
							<Spinner color="indigo" className="size-5" />
						) : (
							<CheckIcon className="size-5 text-main" />
						)}
					</Button>
					<Button
						className="px-3 h-1/3 bg-error/25 rounded-none rounded-br-md hover:opacity-80"
						onClick={toggleDeleteDialog}
						disabled={deleteLoading}
					>
						{deleteLoading ? (
							<Spinner color="red" className="size-5" />
						) : (
							<TrashIcon className="size-5 text-error" />
						)}
					</Button>
				</div>
			) : (
				<Button
					className="h-full bg-main/30 rounded-md rounded-l-none hover:opacity-80 px-3"
					onClick={() => setIsEditParentInfo(true)}
				>
					<PencilSquareIcon className="size-5 text-main" />
				</Button>
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
						onClick={handleDeleteParent}
					>
						Xác nhận
					</Button>
				}
			/>
			{(editLoading || deleteLoading) && (
				<div className="absolute w-full h-full"></div>
			)}
		</div>
	);
};

export default ParentItem;
