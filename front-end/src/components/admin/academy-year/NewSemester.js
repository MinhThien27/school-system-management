import {
	Button,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Spinner,
	Typography,
} from '@material-tailwind/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
	CheckIcon,
	ChevronDownIcon,
	PlusIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE, SEMESTERS_NAME } from '../../../config/constants';
import { useAddSemesterMutation } from '../../../services/academy-year/academyYearApiSlice';
import { formatTimestampToValue } from '../../../utils';

const NewSemester = ({ academyYearId }) => {
	const dispatch = useDispatch();
	const [isActiveNewSemester, setIsActiveNewSemester] = useState(false);
	const [semesterData, setSemesterData] = useState({
		name: '',
		startDate: null,
		endDate: null,
		status: 'Active',
	});

	const resetData = () => {
		setSemesterData({
			name: '',
			startDate: null,
			endDate: null,
			status: 'Active',
		});
	};

	const isValidNewSemester = () => {
		return (
			semesterData.name &&
			semesterData.startDate &&
			semesterData.endDate &&
			semesterData.status
		);
	};

	//submit
	const [addSemester, { isLoading: editLoading }] = useAddSemesterMutation();

	const handleAddSemester = async () => {
		try {
			await addSemester({
				id: academyYearId,
				body: {
					...semesterData,
				},
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsActiveNewSemester(false);
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

	return (
		<div
			className={`w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row relative pr-11 ${
				isActiveNewSemester && 'shadow-top'
			}`}
		>
			{isActiveNewSemester ? (
				<div className="flex flex-col py-6 px-6 w-full border-solid border-l-[1px] border-gray-300 ">
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
				<div className="w-full min-h-40 flex justify-center items-center ml-11">
					<Button
						color="indigo"
						className="py-2 px-4 bg-main/60"
						onClick={(e) => {
							e.preventDefault();
							setIsActiveNewSemester(true);
						}}
					>
						<PlusIcon className="size-5" />
					</Button>
				</div>
			)}

			{isActiveNewSemester && (
				<div className="flex flex-col absolute right-0 top-0 bottom-0">
					<Button
						className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() =>
							setIsActiveNewSemester(false) || resetData()
						}
						disabled={editLoading}
					>
						<XMarkIcon className="size-5 text-error" />
					</Button>
					<Button
						className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
						onClick={handleAddSemester}
						disabled={editLoading || !isValidNewSemester()}
					>
						{editLoading ? (
							<Spinner color="indigo" className="size-5" />
						) : (
							<CheckIcon className="size-5 text-main" />
						)}
					</Button>
				</div>
			)}

			{editLoading && <div className="absolute w-full h-full"></div>}
		</div>
	);
};

export default NewSemester;
