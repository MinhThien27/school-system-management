import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import {
	DEFAULT_CLASS_CAPACITY,
	MAX_CLASS_CAPACITY,
	MIN_CLASS_CAPACITY,
	NOTIFY_STYLE,
} from '../../../config/constants';
import {
	Button,
	Checkbox,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Spinner,
	Typography,
} from '@material-tailwind/react';
import {
	CheckIcon,
	EllipsisHorizontalIcon,
	PlusIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import { useAddClassMutation } from '../../../services/class/classApiSlice';
import { useGetTeachersQuery } from '../../../services/teacher/teacherApiSlice';
import { useGetLevelsQuery } from '../../../services/level/levelApiSlice';
import { useGetAcademyYearsQuery } from '../../../services/academy-year/academyYearApiSlice';

const NewClass = ({ isActive, setActive }) => {
	const dispatch = useDispatch();
	const [newClass, setNewClass] = useState({
		name: '',
		roomCode: '',
		capacity: DEFAULT_CLASS_CAPACITY,
		academicYearId: null,
		formTeacherId: null,
		levelId: null,
		status: 'Active',
	});

	//submit
	const [addClass, { isLoading: addLoading }] = useAddClassMutation();
	const handleAddNewClass = async () => {
		try {
			await addClass(newClass).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Thêm thành công!',
				})
			);
			setNewClass({
				name: '',
				roomCode: '',
				capacity: DEFAULT_CLASS_CAPACITY,
				academicYearId: null,
				formTeacherId: null,
				levelId: null,
				status: 'Active',
			});
			setActive(false);
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

	//danh sách giáo viên
	const { data: teacherListDataApi, isLoading: teachersLoading } =
		useGetTeachersQuery({
			page: 0,
			quantity: 100,
		});
	const [teacherListData, setTeacherListData] = useState(null);
	useEffect(() => {
		if (teacherListDataApi) setTeacherListData(teacherListDataApi?.items);
	}, [teacherListDataApi]);

	const [chosenTeacher, setChosenTeacher] = useState(null);
	const handleChooseTeacher = (id) => {
		setNewClass((prev) => {
			return { ...prev, formTeacherId: id };
		});
		setChosenTeacher(teacherListData.filter((s) => s.id === id)[0]);
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

	const [chosenLevel, setChosenLevel] = useState(null);
	const handleChooseLevel = (id) => {
		setNewClass((prev) => {
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
	const [chosenAcademyYear, setChosenAcademyYear] = useState(null);
	useEffect(() => {
		if (academyYearListDataApi)
			setAcademyYearListData(academyYearListDataApi?.items);
	}, [academyYearListDataApi]);

	const handleChooseAcademyYear = (id) => {
		setNewClass((prev) => {
			return { ...prev, academicYearId: id };
		});
		setChosenAcademyYear(academyYearListData.filter((s) => s.id === id)[0]);
	};

	return (
		isActive && (
			<div className="w-full grid grid-cols-[60px_100px_100px_100px_100px_1fr_100px_100px_100px] gap-4 py-3 px-4 border-b-[1px] border-solid border-gray-300 shadow-around">
				<Typography className="whitespace-nowrap text-sm flex justify-center items-center">
					<PlusIcon className="size-4" />
				</Typography>
				{/* tên  */}
				<input
					value={newClass?.name}
					onChange={(e) =>
						setNewClass({ ...newClass, name: e.target.value })
					}
					className={`w-full text-center text-sm font-semibold border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>
				{/* phòng học  */}
				<input
					value={newClass?.roomCode}
					onChange={(e) =>
						setNewClass({ ...newClass, roomCode: e.target.value })
					}
					className={`w-full text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>
				{/* Khối  */}
				{levelListData && (
					<Menu placement="bottom" allowHover>
						<MenuHandler>
							<Button
								variant="text"
								className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
							>
								{chosenLevel ? (
									chosenLevel?.levelNumber
								) : (
									<EllipsisHorizontalIcon className="size-4" />
								)}
							</Button>
						</MenuHandler>
						<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
							{levelListData.map((level, index, arr) => (
								<MenuItem
									key={level.id}
									onClick={() => handleChooseLevel(level.id)}
									className={`py-1 px-3 rounded-none ${
										index !== arr.length - 1 &&
										'border-b-[1px] border-solid border-gray-300'
									}`}
								>
									<Typography className="text-sm font-medium text-text">
										{level?.levelNumber}&nbsp;
									</Typography>
								</MenuItem>
							))}
						</MenuList>
					</Menu>
				)}
				{levelsLoading && (
					<div className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
						<Spinner color="indigo" className="size-5" />
					</div>
				)}
				{/* Năm học  */}
				{academyYearListData && (
					<Menu placement="bottom" allowHover>
						<MenuHandler>
							<Button
								variant="text"
								className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
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
											index !== arr.length - 1 &&
											'border-b-[1px] border-solid border-gray-300'
										}`}
									>
										<Typography className="text-sm font-medium text-text">
											{academyYear?.name}&nbsp;
										</Typography>
									</MenuItem>
								)
							)}
						</MenuList>
					</Menu>
				)}
				{academyYearsLoading && (
					<div className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
						<Spinner color="indigo" className="size-5" />
					</div>
				)}
				{/* chọn chủ nhiệm  */}
				{teacherListData && (
					<Menu placement="bottom" allowHover>
						<MenuHandler>
							<Button
								variant="text"
								className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
							>
								{chosenTeacher ? (
									chosenTeacher?.firstName +
									' ' +
									chosenTeacher?.lastName
								) : (
									<EllipsisHorizontalIcon className="size-4" />
								)}
							</Button>
						</MenuHandler>
						<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
							{teacherListData.map((teacher, index, arr) => (
								<MenuItem
									key={teacher.id}
									onClick={() =>
										handleChooseTeacher(teacher.id)
									}
									className={`py-1 px-3 rounded-none ${
										index !== arr.length - 1 &&
										'border-b-[1px] border-solid border-gray-300'
									}`}
								>
									<Typography className="text-sm font-medium text-text">
										{teacher?.firstName +
											' ' +
											teacher?.lastName}
									</Typography>
								</MenuItem>
							))}
						</MenuList>
					</Menu>
				)}
				{teachersLoading && (
					<div className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
						<Spinner color="indigo" className="size-5" />
					</div>
				)}
				{/* sỉ số  */}
				<input
					type="number"
					min={MIN_CLASS_CAPACITY}
					max={MAX_CLASS_CAPACITY}
					value={newClass?.capacity}
					onChange={(e) =>
						setNewClass({
							...newClass,
							capacity: Number(e.target.value),
						})
					}
					className={`w-full pl-4 text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>
				{/* trạng thái  */}
				<div className="w-full text-center">
					<Checkbox
						color="green"
						className="hover:before:opacity-0 hover:opacity-70 border-gray-500 border-[2px] w-5 h-5 mx-auto"
						containerProps={{
							className: 'p-1',
						}}
						checked={newClass.status === 'Active'}
						onChange={(e) =>
							setNewClass({
								...newClass,
								status:
									newClass.status === 'Active'
										? 'Inactive'
										: 'Active',
							})
						}
					/>
				</div>
				{/* thao tác  */}
				<Typography className="whitespace-nowrap text-sm text-center flex justify-center items-center gap-4">
					{addLoading ? (
						<Spinner color="gray" className="size-5" />
					) : (
						<CheckIcon
							className="size-6 text-indigo-900 cursor-pointer hover:opacity-70"
							onClick={handleAddNewClass}
						/>
					)}

					<XMarkIcon
						className="size-6 text-error cursor-pointer hover:opacity-70"
						onClick={() => setActive(false)}
					/>
				</Typography>
			</div>
		)
	);
};

export default NewClass;
