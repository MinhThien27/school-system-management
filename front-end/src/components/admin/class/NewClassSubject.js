import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
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
import {
	useAddSubjectToClassMutation,
	useGetClassByIdQuery,
} from '../../../services/class/classApiSlice';
import { useGetSubjectsQuery } from '../../../services/subject/subjectApiSlice';
import { useParams } from 'react-router-dom';

const NewClassSubject = ({ isActive, setActive }) => {
	const dispatch = useDispatch();
	const { classID } = useParams();

	//thông tin lớp
	const { data: classDataApi, isLoading: classDataLoading } =
		useGetClassByIdQuery(classID);
	const [classSemesterData, setClassSemesterData] = useState(null);
	useEffect(() => {
		if (classDataApi)
			setClassSemesterData(classDataApi?.academicYear?.semesters);
	}, [classDataApi]);
	const [chosenSemester, setChosenSemester] = useState(null);
	const handleChooseSemester = (id) => {
		setChosenSemester(classSemesterData.filter((s) => s.id === id)[0]);
	};

	//danh sách môn
	const { data: subjectListDataApi, isLoading: subjectsLoading } =
		useGetSubjectsQuery({
			page: 0,
			quantity: 100,
		});
	const [subjectListData, setSubjectListData] = useState(null);
	useEffect(() => {
		if (subjectListDataApi)
			setSubjectListData(
				subjectListDataApi?.items?.map((s) => ({
					...s,
					status: 'Active',
				}))
			);
	}, [subjectListDataApi]);

	const [chosenSubject, setChosenSubject] = useState(null);
	const handleChooseStudent = (id) => {
		setChosenSubject(subjectListData.filter((s) => s.id === id)[0]);
	};

	const [addSubjectToClass, { isLoading: addLoading }] =
		useAddSubjectToClassMutation();
	const handleAddNewDepartment = async () => {
		try {
			await addSubjectToClass({
				id: classID,
				body: {
					subjectId: chosenSubject?.id,
					status: chosenSubject?.status,
					semesterId: chosenSemester?.id,
				},
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Thêm thành công!',
				})
			);
			setActive(false);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Vui lòng nhập đầy đủ thông tin!';
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

	return (
		isActive && (
			<div className="w-full grid grid-cols-[80px_repeat(3,1fr)_140px_140px] gap-4 p-3 border-b-[1px] border-solid border-gray-300 shadow-around">
				<Typography className="whitespace-nowrap text-sm flex justify-center items-center">
					<PlusIcon className="size-4" />
				</Typography>

				{/* chọn môn  */}
				{subjectListData && (
					<Menu placement="bottom" allowHover>
						<MenuHandler>
							<Button
								variant="text"
								className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
							>
								{chosenSubject ? (
									chosenSubject?.name
								) : (
									<EllipsisHorizontalIcon className="size-4" />
								)}
							</Button>
						</MenuHandler>
						<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
							{subjectListData.map((student, index, arr) => (
								<MenuItem
									key={student.id}
									onClick={() =>
										handleChooseStudent(student.id)
									}
									className={`py-1 px-3 rounded-none ${
										index !== arr.length - 1 &&
										'border-b-[1px] border-solid border-gray-300'
									}`}
								>
									<Typography className="text-sm font-medium text-text">
										{student?.name}&nbsp;
									</Typography>
								</MenuItem>
							))}
						</MenuList>
					</Menu>
				)}
				{subjectsLoading && (
					<div className="flex items-center justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
						<Spinner color="indigo" className="size-5" />
					</div>
				)}

				{/* chọn kì  */}
				{classSemesterData && (
					<Menu placement="bottom" allowHover>
						<MenuHandler>
							<Button
								variant="text"
								className="flex mx-12 items-center col-span-2 justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm"
							>
								{chosenSemester ? (
									chosenSemester?.name
								) : (
									<EllipsisHorizontalIcon className="size-4" />
								)}
							</Button>
						</MenuHandler>
						<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
							{classSemesterData.map((semester, index, arr) => (
								<MenuItem
									key={semester.id}
									onClick={() =>
										handleChooseSemester(semester.id)
									}
									className={`py-1 px-3 rounded-none ${
										index !== arr.length - 1 &&
										'border-b-[1px] border-solid border-gray-300'
									}`}
								>
									<Typography className="text-sm font-medium text-text">
										{semester?.name}&nbsp;
									</Typography>
								</MenuItem>
							))}
						</MenuList>
					</Menu>
				)}
				{classDataLoading && (
					<div className="flex items-center col-span-2 justify-center gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-400 rounded-sm">
						<Spinner color="indigo" className="size-5" />
					</div>
				)}

				<div className="w-full text-center">
					<Checkbox
						color="green"
						className="hover:before:opacity-0 hover:opacity-70 border-gray-500 border-[2px] w-5 h-5 mx-auto"
						containerProps={{
							className: 'p-1',
						}}
						checked={chosenSubject?.status === 'Active'}
						onChange={(e) =>
							setChosenSubject({
								...chosenSubject,
								status:
									chosenSubject.status === 'Active'
										? 'Inactive'
										: 'Active',
							})
						}
					/>
				</div>

				<Typography className="whitespace-nowrap text-sm text-center flex justify-center items-center gap-4">
					{addLoading ? (
						<Spinner color="gray" className="size-5" />
					) : (
						<CheckIcon
							className="size-6 text-indigo-900 cursor-pointer hover:opacity-70"
							onClick={handleAddNewDepartment}
						/>
					)}

					<XMarkIcon
						className="size-6 text-error cursor-pointer hover:opacity-70"
						onClick={() =>
							setActive(false) || setChosenSubject(null)
						}
					/>
				</Typography>
			</div>
		)
	);
};

export default NewClassSubject;
