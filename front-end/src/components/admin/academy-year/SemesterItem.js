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
import { NOTIFY_STYLE, SEMESTERS_NAME } from '../../../config/constants';
import {
	CheckIcon,
	ChevronDownIcon,
	PencilSquareIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import { formatTimestamp, formatTimestampToValue } from '../../../utils';
import { ConfirmDialog } from '../../comfirm/ConfirmDialog';
import useConfirmDialog from '../../../hooks/useConfirmDialog';
import {
	useDeleteSemesterMutation,
	useEditSemesterInfoMutation,
} from '../../../services/academy-year/academyYearApiSlice';

const SemesterItem = ({ data, academyYearId }) => {
	const dispatch = useDispatch();
	const [semesterData, setSemesterData] = useState(null);
	useEffect(() => {
		if (data) setSemesterData(data);
	}, [data]);

	const [isEditSemesterInfo, setIsEditSemesterInfo] = useState(false);

	//edit
	const [editSemesterInfo, { isLoading: editLoading }] =
		useEditSemesterInfoMutation();
	const handleSaveSemesterInfo = async () => {
		try {
			await editSemesterInfo({
				id: academyYearId,
				semesterId: data.id,
				body: semesterData,
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsEditSemesterInfo(false);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Ngày bắt đầu hoặc kết thúc không hợp lệ';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	//delete
	const [openConfirmDeleteDialogState, toggleDeleteDialog] =
		useConfirmDialog(false);
	const [deleteSemester, { isLoading: deleteLoading }] =
		useDeleteSemesterMutation();
	const handleDeleteSemester = async () => {
		try {
			await deleteSemester({
				id: academyYearId,
				semesterId: data.id,
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã xóa!',
				})
			);
			setIsEditSemesterInfo(false);
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
		setSemesterData(data);
	};
	return (
		<div
			className={`w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row relative ${
				isEditSemesterInfo && 'shadow-top'
			}`}
		>
			{isEditSemesterInfo ? (
				<div className="flex flex-col py-6 px-6 w-full border-solid border-l-[1px] border-gray-300">
					{/* tên  */}
					<div className="flex flex-row gap-2 py-1 items-center">
						<label
							htmlFor="semesterName"
							className="text-sm font-normal whitespace-nowrap "
						>
							Tên học kỳ:
						</label>
						<Menu placement="bottom" allowHover>
							<MenuHandler>
								<Button
									variant="text"
									className="flex w-full min-w-24 items-center justify-between whitespace-nowrap text-sm font-medium capitalize text-text outline-none bg-upperBg py-1 px-2 border-solid border-[1px] border-gray-400 rounded-sm"
								>
									<span className="flex-1 ml-3.5">
										{semesterData?.name}
										&nbsp;
									</span>
									<ChevronDownIcon
										strokeWidth={2.5}
										className={`h-3.5 w-3.5 transition-transform justify-self-end`}
									/>
								</Button>
							</MenuHandler>
							<MenuList className="shadow-top min-w-fit p-0 rounded-none h-fit">
								{SEMESTERS_NAME.map((semester, index, arr) => (
									<MenuItem
										key={semester}
										onClick={() =>
											setSemesterData((prev) => ({
												...prev,
												name: semester,
											}))
										}
										className={`py-1 px-3 rounded-none ${
											index !== arr.length - 1 &&
											'border-b-[1px] border-solid border-gray-300'
										}`}
									>
										<Typography className="text-sm font-medium text-text">
											{semester}&nbsp;
										</Typography>
									</MenuItem>
								))}
							</MenuList>
						</Menu>
					</div>
					{/* ngày bắt đầu  */}
					<div className="flex flex-row gap-2 py-1 items-center">
						<label
							htmlFor="semesterStartDate"
							className="text-sm font-normal whitespace-nowrap"
						>
							Ngày bắt đầu:
						</label>
						<input
							id="semesterStartDate"
							type="date"
							defaultValue={formatTimestampToValue(
								semesterData?.startDate
							)}
							onChange={(e) =>
								setSemesterData({
									...semesterData,
									startDate: e.target.value,
								})
							}
							className="w-full h-[30px] p-1 text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
						/>
					</div>
					{/* ngày kết thúc  */}
					<div className="flex flex-row gap-2 py-1 items-center">
						<label
							htmlFor="semesterEndDate"
							className="text-sm font-normal whitespace-nowrap"
						>
							Ngày kết thúc:
						</label>
						<input
							id="semesterEndDate"
							type="date"
							defaultValue={formatTimestampToValue(
								semesterData?.endDate
							)}
							onChange={(e) =>
								setSemesterData({
									...semesterData,
									endDate: e.target.value,
								})
							}
							className="w-full h-[30px] p-1 text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
						/>
					</div>
					{/* trạng thái  */}
					<div className="flex flex-row gap-2 py-1 items-center">
						<label className="text-sm font-normal whitespace-nowrap ">
							Trạng thái:
						</label>
						<Menu placement="bottom" allowHover>
							<MenuHandler>
								<Button
									variant="text"
									className="flex w-full min-w-24 items-center justify-between whitespace-nowrap text-sm font-medium capitalize text-text outline-none bg-upperBg py-1 px-2 border-solid border-[1px] border-gray-400 rounded-sm"
								>
									<span className="flex-1 ml-3.5">
										{semesterData?.status === 'Active'
											? 'Đang diễn ra'
											: 'Đã hoàn thành'}
										&nbsp;
									</span>
									<ChevronDownIcon
										strokeWidth={2.5}
										className={`h-3.5 w-3.5 transition-transform justify-self-end`}
									/>
								</Button>
							</MenuHandler>
							<MenuList className="shadow-top min-w-fit p-0 rounded-none h-fit">
								{[
									{ show: 'Đang diễn ra', send: 'Active' },
									{
										show: 'Đã hoàn thành',
										send: 'Inactive',
									},
								].map((status, index, arr) => (
									<MenuItem
										key={status.send}
										onClick={() =>
											setSemesterData((prev) => ({
												...prev,
												status: status.send,
											}))
										}
										className={`py-1 px-3 rounded-none ${
											index !== arr.length - 1 &&
											'border-b-[1px] border-solid border-gray-300'
										}`}
									>
										<Typography className="text-sm font-medium text-text">
											{status.show}&nbsp;
										</Typography>
									</MenuItem>
								))}
							</MenuList>
						</Menu>
					</div>
				</div>
			) : (
				<div className="flex flex-col py-6 px-12 w-full border-solid border-l-[1px] border-gray-300">
					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Tên học kì:
						</Typography>
						<Typography className="text-sm font-semibold ">
							{semesterData?.name}&nbsp;
						</Typography>
					</div>
					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Ngày bắt đầu:
						</Typography>
						<Typography className="text-sm font-semibold ">
							{formatTimestamp(semesterData?.startDate)}&nbsp;
						</Typography>
					</div>
					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Ngày kết thúc:
						</Typography>
						<Typography className="text-sm font-semibold ">
							{formatTimestamp(semesterData?.endDate)}&nbsp;
						</Typography>
					</div>
					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap">
							Trạng thái:
						</Typography>

						<Typography className="text-sm font-semibold ">
							{semesterData?.status === 'Active'
								? 'Đang diễn ra'
								: 'Đã hoàn thành'}
							&nbsp;
						</Typography>
					</div>
				</div>
			)}

			{isEditSemesterInfo ? (
				<div className="flex flex-col">
					<Button
						className="bg-gray-300 h-1/3 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() =>
							resetData() || setIsEditSemesterInfo(false)
						}
						disabled={editLoading}
					>
						<XMarkIcon className="size-5 text-text" />
					</Button>
					<Button
						className="bg-main/30 h-1/3 rounded-none  hover:opacity-80 px-3"
						onClick={handleSaveSemesterInfo}
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
					onClick={() => setIsEditSemesterInfo(true)}
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
						onClick={handleDeleteSemester}
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

export default SemesterItem;
