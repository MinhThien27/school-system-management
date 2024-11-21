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
import { NOTIFY_STYLE } from '../../../config/constants';
import {
	CheckIcon,
	ChevronDownIcon,
	PencilSquareIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import { formatTimestamp, formatTimestampToValue } from '../../../utils';
import { useEditAcademyYearMutation } from '../../../services/academy-year/academyYearApiSlice';

const AcademyYearInfo = ({ data }) => {
	const dispatch = useDispatch();
	const [academyYearData, setAcademyYearData] = useState(null);
	useEffect(() => {
		if (data) {
			setAcademyYearData(data);
		}
	}, [data]);
	const [isEditAcademyYearInfo, setIsEditAcademyYearInfo] = useState(false);
	const [editAcademyYear, { isLoading: editLoading }] =
		useEditAcademyYearMutation();
	const handleSaveAcademyYearInfo = async () => {
		try {
			await editAcademyYear({
				id: academyYearData?.id,
				body: academyYearData,
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsEditAcademyYearInfo(false);
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

	const resetData = () => {
		setAcademyYearData(data);
	};
	return (
		<div
			className={`w-full h-fit bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row relative ${
				isEditAcademyYearInfo && 'shadow-top'
			}`}
		>
			{isEditAcademyYearInfo ? (
				<div className="grid grid-cols-2 gap-x-14 py-6 px-12 w-full border-solid border-l-[1px] border-gray-300">
					<div className="col-span-1">
						{/* name  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="name"
								className="text-sm font-normal whitespace-nowrap "
							>
								Năm học:
							</label>
							<input
								id="name"
								type="text"
								spellCheck="false"
								className="w-full text-sm font-medium text-center px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
								value={academyYearData?.name}
								onChange={(e) =>
									setAcademyYearData((prev) => {
										return {
											...prev,
											name: e.target.value,
										};
									})
								}
							/>
						</div>

						{/* trạng thái  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label className="text-sm font-normal whitespace-nowrap">
								Trạng thái:
							</label>
							<Menu placement="bottom" allowHover>
								<MenuHandler>
									<Button
										variant="text"
										className="flex w-full min-w-24 items-center justify-between whitespace-nowrap text-sm font-medium capitalize text-text outline-none bg-upperBg py-1 px-2 border-solid border-[1px] border-gray-400 rounded-sm"
									>
										<span className="flex-1 ml-3.5">
											{academyYearData?.status ===
											'Active'
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
										{
											show: 'Đang diễn ra',
											send: 'Active',
										},
										{
											show: 'Đã hoàn thành',
											send: 'Inactive',
										},
									].map((status, index, arr) => (
										<MenuItem
											key={status.send}
											onClick={() =>
												setAcademyYearData((prev) => ({
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
					<div className="col-span-1">
						{/* ngày bắt đầu  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="startDate"
								className="text-sm font-normal whitespace-nowrap "
							>
								Ngày bắt đầu:
							</label>
							<input
								id="startDate"
								type="date"
								defaultValue={formatTimestampToValue(
									academyYearData?.startDate
								)}
								onChange={(e) =>
									setAcademyYearData({
										...academyYearData,
										startDate: e.target.value,
									})
								}
								className="w-full h-[30px] p-1 text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
							/>
						</div>
						{/* ngày kết thúc  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="endDate"
								className="text-sm font-normal whitespace-nowrap "
							>
								Ngày nhập học:
							</label>
							<input
								id="endDate"
								type="date"
								defaultValue={formatTimestampToValue(
									academyYearData?.endDate
								)}
								onChange={(e) =>
									setAcademyYearData({
										...academyYearData,
										endDate: e.target.value,
									})
								}
								className="w-full h-[30px] p-1 text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-x-14 py-6 px-12 w-full border-solid border-l-[1px] border-gray-300">
					<div className="col-span-1">
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Năm học:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{academyYearData?.name}&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap">
								Trạng thái:
							</Typography>

							<Typography className="text-sm font-semibold ">
								{academyYearData?.status === 'Active'
									? 'Đang diễn ra'
									: 'Đã hoàn thành'}
								&nbsp;
							</Typography>
						</div>
					</div>
					<div className="col-span-1">
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Ngày bắt đầu:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{formatTimestamp(academyYearData?.startDate)}
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Ngày kết thúc:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{formatTimestamp(academyYearData?.endDate)}
							</Typography>
						</div>
					</div>
				</div>
			)}

			{isEditAcademyYearInfo ? (
				<div className="flex flex-col">
					<Button
						className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() =>
							resetData() || setIsEditAcademyYearInfo(false)
						}
						disabled={editLoading}
					>
						<XMarkIcon className="size-5 text-error" />
					</Button>
					<Button
						className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
						onClick={handleSaveAcademyYearInfo}
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
					onClick={() => setIsEditAcademyYearInfo(true)}
				>
					<PencilSquareIcon className="size-5 text-main" />
				</Button>
			)}
			{editLoading && <div className="absolute w-full h-full"></div>}
		</div>
	);
};

export default AcademyYearInfo;
