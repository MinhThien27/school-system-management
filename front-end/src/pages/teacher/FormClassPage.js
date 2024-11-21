import React, { useEffect, useState } from 'react';
import LargeWrapper from '../../layouts/LargeWrapper';
import {
	Button,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Spinner,
	Typography,
} from '@material-tailwind/react';
import {
	ChevronDownIcon,
	EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../services/auth/authSlice';
import {
	useGetClassesByFormTeacherQuery,
	useGetSubjectsByClassIdQuery,
} from '../../services/class/classApiSlice';
import SpinnerLoading from '../../components/loading/SpinnerLoading';
import { formatTimestamp } from '../../utils';
import { GENDER } from '../../config/constants';
import { useGetGradeByClassQuery } from '../../services/grade/gradeApiSlice';
import ListLoading from '../../components/loading/ListLoading';
import EmptyItem from '../../components/empty/EmptyItem';

const FormClassPage = () => {
	const { id: teacherId } = useSelector(selectCurrentUser);

	//thông tin lớp
	const {
		data: formClassDataApi,
		isError: formClassDataError,
		isLoading: formClassDataLoading,
	} = useGetClassesByFormTeacherQuery(teacherId);

	const [formClassData, setFormClassData] = useState(null);
	const [classId, setClassId] = useState(null);

	useEffect(() => {
		if (formClassDataApi?.items) {
			setFormClassData(formClassDataApi.items[0]);
			setClassId(formClassDataApi?.items[0]?.id);
		}
	}, [formClassDataApi]);

	//danh sách môn ->done
	const { data: subjectListDataApi } = useGetSubjectsByClassIdQuery(
		{
			page: 0,
			quantity: 100,
			id: classId,
		},
		{
			skip: classId === null,
		}
	);
	const [subjectListData, setSubjectListData] = useState(null);
	useEffect(() => {
		if (subjectListDataApi?.items) {
			setSubjectListData(subjectListDataApi.items);
		}
	}, [subjectListDataApi]);

	//chọn kì ->done
	const [openSemesterMenu, setOpenSemesterMenu] = React.useState(false);
	const semesterData = [
		{ value: 1, name: 'Học kỳ I' },
		{ value: 2, name: 'Học kỳ II' },
	];
	const [chosenSemester, setChosenSemester] = useState(semesterData[0]);
	const handleChooseSemester = (value) => {
		setChosenSemester(semesterData.filter((s) => s.value === value)[0]);
	};

	useEffect(() => {
		if (subjectListDataApi)
			setSubjectListData(
				subjectListDataApi.items.filter(
					(s) => s.semester.semesterNumber === chosenSemester.value
				)
			);
	}, [subjectListDataApi, chosenSemester]);

	//chọn môn
	const [openSubjectMenu, setOpenSubjectMenu] = React.useState(false);
	const [chosenSubject, setChosenSubject] = useState(null);
	const [classSubjectId, setClassSubjectId] = useState(null);
	useEffect(() => {
		if (subjectListData) setChosenSubject(subjectListData[0]);
		if (
			subjectListData &&
			subjectListData[0].teacherClassSubjects.length > 0
		)
			setClassSubjectId(
				subjectListData[0].teacherClassSubjects[0].classSubjectId
			);
	}, [subjectListData]);
	useEffect(() => {
		if (chosenSubject && chosenSubject.teacherClassSubjects.length > 0) {
			setClassSubjectId(
				chosenSubject.teacherClassSubjects[0].classSubjectId
			);
		} else {
			setClassSubjectId(null);
		}
	}, [chosenSubject]);

	const handleChooseSubject = (id) => {
		setChosenSubject(subjectListData.filter((s) => s.id === id)[0]);
	};

	//điểm của lớp
	const {
		data: gradeDataApi,
		isError: gradeDataError,
		isLoading: gradeDataLoading,
		refetch: refetchGradeData,
	} = useGetGradeByClassQuery(
		{
			classId: classId,
			classSubjectId: classSubjectId,
		},
		{
			skip: classId === null || classSubjectId === null,
		}
	);

	useEffect(() => {
		if (classSubjectId) refetchGradeData();
		if (classSubjectId === null) setGradeData([]);
	}, [classSubjectId, refetchGradeData]);

	const [gradeData, setGradeData] = useState(null);

	//filter
	const [searchValue, setSearchValue] = useState({
		studentName: '',
	});
	const handleSubmitSearchByStudentName = (e) => {
		setSearchValue({ ...searchValue, studentName: e.target.value });
	};
	useEffect(() => {
		if (gradeDataApi) {
			setGradeData(
				gradeDataApi?.items?.filter((item) =>
					item.student.firstName
						.concat(item.student.lastName)
						.toLowerCase()
						.includes(searchValue.studentName.toLowerCase())
				)
			);
		}
	}, [searchValue, gradeDataApi]);

	return (
		<LargeWrapper>
			<div className="w-full flex flex-col mb-10">
				{formClassData ? (
					!formClassDataError ? (
						<>
							{/* thông tin lớp  */}
							<div className="flex justify-between items-center mb-1">
								<Typography className="text-lg text-text font-semibold my-2">
									Thông tin lớp
								</Typography>
								{/* chọn kỳ */}
								<Menu
									open={openSemesterMenu}
									placement="bottom"
									handler={setOpenSemesterMenu}
								>
									<MenuHandler>
										<Button
											variant="text"
											className="flex items-center rounded-none gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-300"
										>
											{chosenSemester.name}
											<ChevronDownIcon
												strokeWidth={2.5}
												className={`h-3.5 w-3.5 transition-transform ${
													openSemesterMenu
														? 'rotate-180'
														: ''
												}`}
											/>
										</Button>
									</MenuHandler>
									<MenuList className="shadow-top min-w-fit p-0 rounded-none">
										{semesterData.map(
											(semester, index, arr) => (
												<MenuItem
													key={
														'semester_' +
														semester.value
													}
													onClick={() =>
														handleChooseSemester(
															semester.value
														)
													}
													className={`py-1 px-3 rounded-none ${
														index !==
															arr.length - 1 &&
														'border-b-[1px] border-solid border-gray-300'
													}`}
												>
													<Typography className="text-sm font-medium text-text">
														{semester.name}
													</Typography>
												</MenuItem>
											)
										)}
									</MenuList>
								</Menu>
							</div>
							<div className="w-full grid grid-cols-3 gap-4 mb-8">
								{/* thông tin lớp  */}
								{!formClassData ? (
									<SpinnerLoading />
								) : (
									<div className="col-span-1 w-full h-full px-12 py-4 bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col">
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Tên lớp:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{formClassData?.name}&nbsp;
											</Typography>
										</div>
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap">
												Khối:
											</Typography>

											<Typography className="text-sm font-semibold ">
												{
													formClassData?.level
														?.levelNumber
												}
												&nbsp;
											</Typography>
										</div>
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap">
												Năm học:
											</Typography>

											<Typography className="text-sm font-semibold">
												{
													formClassData?.academicYear
														?.name
												}
												&nbsp;
											</Typography>
										</div>
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Phòng học:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{formClassData?.roomCode}&nbsp;
											</Typography>
										</div>
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap">
												Sỉ số:
											</Typography>
											<Typography className="text-sm font-semibold">
												{formClassData?.capacity}&nbsp;
											</Typography>
										</div>
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Trạng thái:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{formClassData?.status ===
												'Active'
													? 'Đang diễn ra'
													: 'Đã hoàn thành'}
												&nbsp;
											</Typography>
										</div>
									</div>
								)}

								{/* thông tin giáo viên chủ nhiệm  */}
								{!formClassData ? (
									<SpinnerLoading />
								) : (
									<div className="col-span-2 w-full h-full py-4 px-12 bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row items-center">
										<div className="grid grid-cols-2 gap-x-14 w-full">
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Chủ nhiệm:
												</Typography>
												<Typography className="text-sm font-semibold ">
													{formClassData?.formTeacher
														?.firstName +
														' ' +
														formClassData
															?.formTeacher
															?.lastName}
													&nbsp;
												</Typography>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Giới tính:
												</Typography>
												<Typography className="text-sm font-semibold ">
													{formClassData?.formTeacher
														?.gender === 'Female'
														? GENDER.FEMALE.show
														: GENDER.MALE.show}
													&nbsp; &nbsp;
												</Typography>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Ngày sinh:
												</Typography>
												<Typography className="text-sm font-semibold ">
													{formatTimestamp(
														formClassData
															?.formTeacher?.dob
													)}
													&nbsp;
												</Typography>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Ngày bắt đầu:
												</Typography>
												<Typography className="text-sm font-semibold ">
													{formatTimestamp(
														formClassData
															?.formTeacher
															?.startDate
													)}
													&nbsp;
												</Typography>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Số điện thoại:
												</Typography>
												<Typography className="text-sm font-semibold ">
													{
														formClassData
															?.formTeacher?.user
															?.phoneNumber
													}
													&nbsp;
												</Typography>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap">
													Email:
												</Typography>
												<Typography className="text-sm font-semibold text-blue-900 cursor-pointer hover:opacity-70">
													<a
														href={
															'mailTo:' +
															formClassData
																?.formTeacher
																?.user?.email
														}
													>
														{
															formClassData
																?.formTeacher
																?.user?.email
														}
														&nbsp;
													</a>
												</Typography>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Mã định danh:
												</Typography>
												<Typography className="text-sm font-semibold ">
													{
														formClassData
															?.formTeacher?.user
															?.citizenIdentification
													}
													&nbsp;
												</Typography>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap">
													Địa chỉ:
												</Typography>
												<Typography className="text-sm font-semibold">
													{
														formClassData
															?.formTeacher
															?.address
													}
													&nbsp;
												</Typography>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* danh sách học sinh  */}
							<div className="flex justify-between items-center mb-1">
								<Typography className="text-lg text-text font-semibold my-2">
									Danh sách lớp
								</Typography>
								{/* chọn môn học */}
								{subjectListData && (
									<Menu
										open={openSubjectMenu}
										placement="bottom"
										handler={setOpenSubjectMenu}
									>
										<MenuHandler>
											<Button
												variant="text"
												className="flex items-center rounded-none gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-300"
											>
												{chosenSubject?.subject?.name}
												<ChevronDownIcon
													strokeWidth={2.5}
													className={`h-3.5 w-3.5 transition-transform ${
														openSubjectMenu
															? 'rotate-180'
															: ''
													}`}
												/>
											</Button>
										</MenuHandler>
										<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
											{subjectListData?.map(
												(subject, index, arr) => (
													<MenuItem
														key={subject.id}
														onClick={() =>
															handleChooseSubject(
																subject.id
															)
														}
														className={`py-1 px-3 rounded-none ${
															index !==
																arr.length -
																	1 &&
															'border-b-[1px] border-solid border-gray-300'
														}`}
													>
														<Typography className="text-sm font-medium text-text">
															{
																subject?.subject
																	?.name
															}
														</Typography>
													</MenuItem>
												)
											)}
										</MenuList>
									</Menu>
								)}
							</div>
							<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
								{/* đề mục  */}
								<div className="w-full grid grid-cols-[80px_280px_repeat(6,1fr)] border-b-[1px] border-solid border-gray-500 bg-main/30 rounded-t-md">
									<Typography className="whitespace-nowrap font-bold text-sm text-center py-3 px-3">
										STT
									</Typography>
									<Typography className="whitespace-nowrap font-bold text-sm text-center pt-3 pb-2 px-3 flex flex-col items-center">
										<span>Họ và tên</span>
										<input
											type="text"
											spellCheck="false"
											className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
											onKeyDown={(e) =>
												e.keyCode === 13 &&
												handleSubmitSearchByStudentName(
													e
												)
											}
											onBlur={(e) =>
												handleSubmitSearchByStudentName(
													e
												)
											}
										></input>
									</Typography>
									<Typography className="whitespace-nowrap font-bold text-sm text-center py-3 px-3">
										Thường xuyên
									</Typography>
									<Typography className="whitespace-nowrap font-bold text-sm text-center py-3 px-3">
										Điểm 15p
									</Typography>
									<Typography className="whitespace-nowrap font-bold text-sm text-center py-3 px-3">
										Điểm 45p
									</Typography>
									<Typography className="whitespace-nowrap font-bold text-sm text-center py-3 px-3">
										Giữa kỳ
									</Typography>
									<Typography className="whitespace-nowrap font-bold text-sm text-center py-3 px-3">
										Cuối kì
									</Typography>
									<Typography className="whitespace-nowrap font-bold text-sm text-center py-3 px-3">
										TB môn
									</Typography>
									{/* <Typography
										className={`whitespace-nowrap h-fit font-bold text-sm text-center flex py-3 justify-center gap-1 ${
											conductEditActive
												? 'text-main'
												: 'hover:opacity-80 hover:text-main cursor-pointer'
										}`}
										onClick={() =>
											setConductEditActive(
												!conductEditActive
											)
										}
									>
										{conductEditActive ? (
											<Button className="py-1 bg-main/80">
												<CheckIcon className="size-5" />
											</Button>
										) : (
											<>
												<span>Hạnh kiểm</span>
												<PencilSquareIcon className="size-4 mb-[2px]" />
											</>
										)}
									</Typography> */}
								</div>

								<div className={`w-full flex flex-row`}>
									{gradeDataLoading && (
										<ListLoading value={4} />
									)}
									{gradeData?.length === 0 && (
										<EmptyItem
											content={
												'Môn hiện tại chưa được phân công giáo viên'
											}
										/>
									)}
									{gradeDataError && (
										<EmptyItem
											content={'Đã có lỗi xảy ra'}
										/>
									)}
									{gradeData &&  gradeData.length > 0 && (
										<div className="w-full">
											{gradeData?.map((grade, index) => (
												<div
													key={grade?.studentId}
													className={`w-full h-11 grid grid-cols-[80px_280px_repeat(6,1fr)] border-b-[1px] border-solid border-gray-300 hover:bg-main/10  ${
														index % 2 === 0 &&
														'bg-main/5'
													} `}
												>
													<Typography className="w-full whitespace-nowrap text-sm py-3 text-center font-semibold border-r-[1px] border-solid border-gray-300">
														{index + 1}
													</Typography>
													<Typography className="w-full pl-4 whitespace-nowrap text-sm py-3 text-left font-semibold border-r-[1px] border-solid border-gray-300">
														<Link
															to={
																'/teacher/form-class/' +
																grade?.studentId
															}
															className="hover:opacity-70 cursor-pointer text-blue-900"
														>
															{grade?.student
																?.firstName +
																' ' +
																grade?.student
																	?.lastName}
															&nbsp;
														</Link>
													</Typography>
													<Typography
														className={`w-full whitespace-nowrap text-sm py-3 text-center font-semibold border-r-[1px] border-solid border-gray-300 ${
															grade?.oralTest <=
																5 &&
															'text-error'
														}`}
													>
														{grade?.oralTest !== null ? (
															grade.oralTest
														) : (
															<span className="w-full flex justify-center items-center">
																<EllipsisHorizontalIcon className="size-5 text-text" />
															</span>
														)}
														&nbsp;
													</Typography>
													<Typography
														className={`w-full whitespace-nowrap text-sm py-3 text-center font-semibold border-r-[1px] border-solid border-gray-300 ${
															grade?.smallTest <=
																5 &&
															'text-error'
														}`}
													>
														{grade?.smallTest !== null ? (
															grade.smallTest
														) : (
															<span className="w-full flex justify-center items-center select-none">
																<EllipsisHorizontalIcon className="size-5 text-text" />
															</span>
														)}
														&nbsp;
													</Typography>
													<Typography
														className={`w-full whitespace-nowrap text-sm py-3 text-center font-semibold border-r-[1px] border-solid border-gray-300 ${
															grade?.bigTest <=
																5 &&
															'text-error'
														}`}
													>
														{grade?.bigTest !== null ? (
															grade.bigTest
														) : (
															<span className="w-full flex justify-center items-center select-none">
																<EllipsisHorizontalIcon className="size-5 text-text" />
															</span>
														)}
														&nbsp;
													</Typography>
													<Typography
														className={`w-full whitespace-nowrap text-sm py-3 text-center font-semibold border-r-[1px] border-solid border-gray-300 ${
															grade?.midtermExam <=
																5 &&
															'text-error'
														}`}
													>
														{grade?.midtermExam !== null ? (
															grade.midtermExam
														) : (
															<span className="w-full flex justify-center items-center select-none">
																<EllipsisHorizontalIcon className="size-5 text-text" />
															</span>
														)}
														&nbsp;
													</Typography>
													<Typography
														className={`w-full whitespace-nowrap text-sm py-3 text-center font-semibold border-r-[1px] border-solid border-gray-300 ${
															grade?.finalExam <=
																5 &&
															'text-error'
														}`}
													>
														{grade?.finalExam !== null ? (
															grade.finalExam
														) : (
															<span className="w-full flex justify-center items-center select-none">
																<EllipsisHorizontalIcon className="size-5 text-text" />
															</span>
														)}
														&nbsp;
													</Typography>
													<Typography
														className={`w-full whitespace-nowrap text-sm py-3 text-center font-semibold  ${
															grade?.subjectAverage <=
																5 &&
															'text-error'
														}`}
													>
														{grade?.subjectAverage !== null ? (
															grade.subjectAverage
														) : (
															<span className="w-full flex justify-center items-center select-none">
																<EllipsisHorizontalIcon className="size-5 text-text" />
															</span>
														)}
														&nbsp;
													</Typography>
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</>
					) : (
						<Typography className="text-sm font-semibold text-gray-400">
							Đã có lỗi xảy ra
						</Typography>
					)
				) : (
					<div className="w-[660px] h-[200px] col-span-2 bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col gap-1 items-center pt-16 mt-40">
						{!formClassDataLoading ? (
							<>
								<Typography className="font-semibold text-xl uppercase">
									Giáo viên chưa có lớp chủ nhiệm
								</Typography>
								<Link
									to="/redirect"
									className="inline-block rounded-lg border border-white py-2 text-center text-lg font-medium text-main bg-highlight transition hover:opacity-50  underline underline-offset-2"
								>
									Trang chủ
								</Link>{' '}
							</>
						) : (
							<Spinner className="w-20 h-20" color="indigo" />
						)}
					</div>
				)}
			</div>
		</LargeWrapper>
	);
};

export default FormClassPage;
