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
	EllipsisHorizontalIcon,
	PencilSquareIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import { useEditClassInfoMutation } from '../../../services/class/classApiSlice';
import { useGetLevelsQuery } from '../../../services/level/levelApiSlice';
import { useGetAcademyYearsQuery } from '../../../services/academy-year/academyYearApiSlice';
import { Link } from 'react-router-dom';

const ClassInfo = ({ data }) => {
	const dispatch = useDispatch();

	const [classData, setClassData] = useState(null);
	useEffect(() => {
		if (data) {
			setClassData(data);
		}
	}, [data]);

	const [isEditClassInfo, setIsEditClassInfo] = useState(false);
	const [editClassInfo, { isLoading: editLoading }] =
		useEditClassInfoMutation();

	const handleSaveClassInfo = async () => {
		try {
			await editClassInfo({
				id: classData?.id,
				body: classData,
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsEditClassInfo(false);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess =
					'Khối chưa đủ thông tin, giáo viên đã có lớp chủ nhiệm hoặc đã trùng tên lớp!';
			} else if (err.status === 409) {
				mess = 'Đã tồn tại!';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn.';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	const resetData = () => {
		setClassData(data);
	};

	//danh sách khối
	const { data: levelListDataApi, isLoading: levelsLoading } =
		useGetLevelsQuery({
			page: 0,
			quantity: 100,
		});
	const [levelListData, setLevelListData] = useState(null);
	useEffect(() => {
		if (levelListDataApi) setLevelListData(levelListDataApi?.items);
	}, [levelListDataApi]);

	useEffect(() => {
		if (levelListData && data)
			setChosenLevel(
				levelListData.filter((t) => t.id === data.levelId)[0]
			);
	}, [levelListData, data]);

	const [chosenLevel, setChosenLevel] = useState(null);
	const handleChooseLevel = (id) => {
		setClassData((prev) => {
			return { ...prev, levelId: id };
		});
		setChosenLevel(levelListData.filter((s) => s.id === id)[0]);
	};

	//danh sách năm học
	const { data: academyYearListDataApi, isLoading: academyYearsLoading } =
		useGetAcademyYearsQuery({
			page: 0,
			quantity: 100,
		});
	const [academyYearListData, setAcademyYearListData] = useState(null);
	useEffect(() => {
		if (academyYearListDataApi)
			setAcademyYearListData(academyYearListDataApi?.items);
	}, [academyYearListDataApi]);
	useEffect(() => {
		if (academyYearListData && data)
			setChosenAcademyYear(
				academyYearListData.filter(
					(t) => t.id === data.academicYearId
				)[0]
			);
	}, [academyYearListData, data]);
	const [chosenAcademyYear, setChosenAcademyYear] = useState(null);
	const handleChooseAcademyYear = (id) => {
		setClassData((prev) => {
			return { ...prev, academicYearId: id };
		});
		setChosenAcademyYear(academyYearListData.filter((s) => s.id === id)[0]);
	};

	return (
		<div
			className={`w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row relative ${
				isEditClassInfo && 'shadow-top'
			}`}
		>
			{classData &&
				(isEditClassInfo ? (
					<div className="flex flex-col py-6 px-12 w-full border-solid border-l-[1px] border-gray-300">
						{/* tên lớp  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="name"
								className="text-sm font-normal whitespace-nowrap "
							>
								Tên lớp:
							</label>
							<input
								id="name"
								type="text"
								spellCheck="false"
								className="w-full text-sm text-center font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
								value={classData?.name}
								onChange={(e) =>
									setClassData((prev) => {
										return {
											...prev,
											name: e.target.value,
										};
									})
								}
							/>
						</div>
						{/* khối  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="level"
								className="text-sm font-normal whitespace-nowrap"
							>
								Khối:
							</label>
							{levelListData && (
								<Menu placement="bottom" allowHover>
									<MenuHandler>
										<Button
											variant="text"
											className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
										>
											{chosenLevel ? (
												chosenLevel?.levelNumber
											) : (
												<EllipsisHorizontalIcon className="size-4" />
											)}
										</Button>
									</MenuHandler>
									<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
										{levelListData.map(
											(level, index, arr) => (
												<MenuItem
													key={level.id}
													onClick={() =>
														handleChooseLevel(
															level.id
														)
													}
													className={`py-1 px-3 rounded-none ${
														index !==
															arr.length - 1 &&
														'border-b-[1px] border-solid border-gray-300'
													}`}
												>
													<Typography className="text-sm font-medium text-text">
														{level?.levelNumber}
														&nbsp;
													</Typography>
												</MenuItem>
											)
										)}
									</MenuList>
								</Menu>
							)}
							{levelsLoading && (
								<div className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
									<Spinner
										color="indigo"
										className="size-5"
									/>
								</div>
							)}
						</div>
						{/* năm học  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="academic-year"
								className="text-sm font-normal whitespace-nowrap"
							>
								Năm học:
							</label>
							{academyYearListData && (
								<Menu placement="bottom" allowHover>
									<MenuHandler>
										<Button
											variant="text"
											className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
										>
											{chosenAcademyYear ? (
												chosenAcademyYear?.name
											) : (
												<EllipsisHorizontalIcon className="size-4" />
											)}
										</Button>
									</MenuHandler>
									<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
										{academyYearListData?.map(
											(academyYear, index, arr) => (
												<MenuItem
													key={academyYear.id}
													onClick={() =>
														handleChooseAcademyYear(
															academyYear.id
														)
													}
													className={`py-1 px-3 rounded-none ${
														index !==
															arr.length - 1 &&
														'border-b-[1px] border-solid border-gray-300'
													}`}
												>
													<Typography className="text-sm font-medium text-text">
														{academyYear?.name}
														&nbsp;
													</Typography>
												</MenuItem>
											)
										)}
									</MenuList>
								</Menu>
							)}
							{academyYearsLoading && (
								<div className="flex w-full items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
									<Spinner
										color="indigo"
										className="size-5"
									/>
								</div>
							)}
						</div>
						{/* phòng học  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="room"
								className="text-sm font-normal whitespace-nowrap"
							>
								Phòng học:
							</label>
							<input
								id="room"
								type="text"
								spellCheck="false"
								className="w-full text-sm text-center font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
								value={classData?.roomCode}
								onChange={(e) =>
									setClassData((prev) => {
										return {
											...prev,
											roomCode: e.target.value,
										};
									})
								}
							/>
						</div>
						{/* Sỉ số  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="capacity"
								className="text-sm font-normal whitespace-nowrap"
							>
								Sỉ số:
							</label>
							<input
								id="capacity"
								type="number"
								spellCheck="false"
								className="w-full text-sm text-center font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
								value={classData.capacity}
								onChange={(e) =>
									setClassData((prev) => {
										return {
											...prev,
											capacity: Number(e.target.value),
										};
									})
								}
							/>
						</div>

						{/* Trạng thái  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="status"
								className="text-sm font-normal whitespace-nowrap"
							>
								Trạng thái:
							</label>
							<Menu placement="bottom" allowHover>
								<MenuHandler>
									<Button
										variant="text"
										className="flex w-full min-w-24 items-center justify-between whitespace-nowrap text-sm font-medium capitalize text-text outline-none bg-upperBg py-1 px-2 border-solid border-[1px] border-gray-400 rounded-sm"
									>
										<span className="flex-1 ml-3.5">
											{classData?.status === 'Active'
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
												setClassData((prev) => ({
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
								Tên lớp:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{classData?.name}&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap">
								Khối:
							</Typography>
							<Link to={'/admin/manage-levels'}>
								<Typography className="text-sm font-semibold text-blue-900 cursor-pointer">
									{classData?.level?.levelNumber}&nbsp;
								</Typography>
							</Link>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap">
								Năm học:
							</Typography>
							<Link
								to={
									'/admin/manage-academy-years/' +
									classData?.academicYearId
								}
							>
								<Typography className="text-sm font-semibold text-blue-900 cursor-pointer">
									{classData?.academicYear?.name}&nbsp;
								</Typography>
							</Link>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Phòng học:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{classData?.roomCode}&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap">
								Sỉ số:
							</Typography>
							<Typography className="text-sm font-semibold">
								{classData?.capacity}&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Trạng thái:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{classData?.status === 'Active'
									? 'Đang diễn ra'
									: 'Đã hoàn thành'}
								&nbsp;
							</Typography>
						</div>
					</div>
				))}

			{/* button  */}
			{isEditClassInfo ? (
				<div className="flex flex-col">
					<Button
						className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() => resetData() || setIsEditClassInfo(false)}
						disabled={editLoading}
					>
						<XMarkIcon className="size-5 text-error" />
					</Button>
					<Button
						className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
						onClick={handleSaveClassInfo}
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
					className="h-full bg-main/30 rounded-md rounded-l-none hover:opacity-80 px-3"
					onClick={() => setIsEditClassInfo(true)}
				>
					<PencilSquareIcon className="size-5 text-main" />
				</Button>
			)}
			{editLoading && <div className="absolute w-full h-full"></div>}
		</div>
	);
};

export default ClassInfo;
