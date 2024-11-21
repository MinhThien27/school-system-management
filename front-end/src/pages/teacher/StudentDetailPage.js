import React, { useEffect, useState } from 'react';
import {
	Avatar,
	Button,
	IconButton,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Typography,
} from '@material-tailwind/react';
import { ArrowLeftIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import LargeWrapper from '../../layouts/LargeWrapper';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { GENDER } from '../../config/constants';
import {
	useGetParentByStudentQuery,
	useGetStudentByIdQuery,
} from '../../services/student/studentApiSlice';
import SpinnerLoading from '../../components/loading/SpinnerLoading';
import { formatTimestamp } from '../../utils';
import { useGetGradeByStudentQuery } from '../../services/grade/gradeApiSlice';
import ListLoading from '../../components/loading/ListLoading';
import EmptyItem from '../../components/empty/EmptyItem';

const StudentDetailPage = () => {
	const { studentId } = useParams();
	const navigate = useNavigate();

	//thông tin học sinh -> done
	const { data: studentDataApi, isError: studentError } =
		useGetStudentByIdQuery(studentId);

	const [studentData, setStudentData] = useState(null);
	useEffect(() => {
		if (studentDataApi) setStudentData(studentDataApi);
	}, [studentDataApi]);

	//thông tin phụ huynh -> done
	const { data: parentDataApi } = useGetParentByStudentQuery(studentId);
	const [parentData, setParentData] = useState(null);
	useEffect(() => {
		if (parentDataApi) setParentData(parentDataApi);
	}, [parentDataApi]);

	//điểm số -> done
	const {
		data: gradeDataApi,
		isError: gradeDataError,
		isLoading: gradeDataLoading,
	} = useGetGradeByStudentQuery(studentId);
	const [gradeData, setGradeData] = useState(null);

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
		if (gradeDataApi)
			setGradeData(
				gradeDataApi?.items.filter(
					(s) =>
						s?.classSubject?.semester?.semesterNumber ===
						chosenSemester.value
				)
			);
	}, [gradeDataApi, chosenSemester]);

	//kết quả -> mock dataa, chưa hoàn thiện phần này
	// const semesterResultDataApi = [
	// 	{
	// 		semester: 'Học kỳ I',
	// 		finalAverage: 8.5,
	// 		classification: 'Giỏi',
	// 		conduct: 'Tốt',
	// 		title: 'Học sinh giỏi',
	// 	},
	// 	{
	// 		semester: 'Học kỳ II',
	// 		finalAverage: 8.5,
	// 		classification: 'Giỏi',
	// 		conduct: 'Tốt',
	// 		title: 'Học sinh giỏi',
	// 	},
	// 	{
	// 		semester: 'Cả năm',
	// 		finalAverage: 8.5,
	// 		classification: 'Giỏi',
	// 		conduct: 'Tốt',
	// 		title: 'Học sinh giỏi',
	// 	},
	// ];

	// const [semesterResultData, setSemesterResultData] = useState(
	// 	semesterResultDataApi
	// );
	// const handleChangeConduct = (semester, value) => {
	// 	setSemesterResultData((prev) =>
	// 		prev.map((item) => {
	// 			if (item.semester === semester) {
	// 				return { ...item, conduct: value };
	// 			} else return item;
	// 		})
	// 	);
	// };

	return (
		<LargeWrapper>
			{studentError && <Navigate to={'/not-found'} />}
			<div className="w-full grid grid-cols-2 gap-8 mb-10">
				{/* thông tin học sinh  */}
				<div className="w-full h-full flex flex-col">
					<div className="flex flex-row gap-4 items-center">
						<IconButton
							size="sm"
							variant="text"
							className="bg-upperBg border-text/30 text-text/70 border-solid border-[1px] focus:ring-transparent rounded-sm"
							onClick={() => navigate(-1)}
						>
							<ArrowLeftIcon
								strokeWidth={2}
								className="h-4 w-4"
							/>
						</IconButton>
						<Typography className="text-lg text-text font-semibold my-2">
							Học sinh:{' '}
							<span className="text-main">
								{studentData?.firstName +
									' ' +
									studentData?.lastName}
								&nbsp;
							</span>
						</Typography>
					</div>
					{studentData ? (
						<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
							<Avatar
								variant="circular"
								alt="student"
								className="h-[120px] w-[120px] border border-main shadow-xl shadow-blue-900/20 ring-2 ring-main/30 m-7"
								src={studentData?.imageUrl}
							/>
							<hr className="border-blue-gray-100 pointer-events-none w-full" />
							<div className="flex flex-col py-4 pt-3 px-12 w-full">
								<div className="w-full flex flex-row justify-between">
									<div>
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Họ và tên:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{studentData?.firstName +
													' ' +
													studentData?.lastName}
												&nbsp;
											</Typography>
										</div>
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Ngày sinh:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{formatTimestamp(
													studentData?.dob
												)}
												&nbsp;
											</Typography>
										</div>
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Mã định danh:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{
													studentData?.user
														?.citizenIdentification
												}
												&nbsp;
											</Typography>
										</div>
									</div>
									<div className="">
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Liên hệ:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{studentData?.user?.phoneNumber}
												&nbsp;
											</Typography>
										</div>
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Giới tính:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{studentData?.gender ===
												'Female'
													? GENDER.FEMALE.show
													: GENDER.MALE.show}
												&nbsp;
											</Typography>
										</div>
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Lớp:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{studentData?.classStudents
													.length > 0
													? studentData
															?.classStudents[0]
															?.class?.name
													: 'Chưa có'}
												&nbsp;
											</Typography>
										</div>
									</div>
								</div>

								<div className="flex flex-row gap-4 py-2">
									<Typography className="text-sm font-normal whitespace-nowrap">
										Email:
									</Typography>
									<Typography className="text-sm font-semibold text-blue-900 cursor-pointer hover:opacity-70">
										<a
											href={
												'mailTo:' +
												studentData?.user?.email
											}
										>
											{studentData?.user?.email}&nbsp;
										</a>
									</Typography>
								</div>
								<div className="flex flex-row gap-4 py-2">
									<Typography className="text-sm font-normal whitespace-nowrap">
										Địa chỉ:
									</Typography>
									<Typography className="text-sm font-semibold">
										{studentData?.address}
									</Typography>
								</div>
							</div>
						</div>
					) : (
						<SpinnerLoading />
					)}
				</div>
				{/* thông tin phụ huynh  */}
				<div className="w-full h-full flex flex-col">
					<Typography className="text-lg text-text font-semibold my-2">
						Phụ huynh
					</Typography>

					{!parentData ? (
						<SpinnerLoading />
					) : parentData?.totalItems > 0 ? (
						<div className="w-full flex-1 flex flex-col gap-8">
							{parentData?.items?.map((parent) => (
								<div
									key={parent?.id}
									className="h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center"
								>
									<div className="py-4 px-12 w-full">
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Họ và tên:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{parent?.firstName +
													' ' +
													parent?.lastName}
												&nbsp;
											</Typography>
										</div>

										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Ngày sinh:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{formatTimestamp(parent?.dob)}
												&nbsp;
											</Typography>
										</div>
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Số điện thoại:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{parent?.phoneNumber}&nbsp;
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
														parent?.email
													}
												>
													{parent?.email}&nbsp;
												</a>
											</Typography>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<Typography className="w-full h-full text-base font-semibold text-gray-500 bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex items-center justify-center">
							Chưa có thông tin
						</Typography>
					)}
				</div>
			</div>

			{/* Kết quả học tập  */}
			<div className="w-full flex flex-col mb-10">
				<div className="flex justify-between items-center">
					<Typography className="text-lg text-text font-semibold my-2">
						Kết quả học tập
					</Typography>
					{/* chọn kỳ */}
					<Menu open={openSemesterMenu} handler={setOpenSemesterMenu}>
						<MenuHandler>
							<Button
								variant="text"
								className="flex items-center rounded-none gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-300"
							>
								{chosenSemester.name}
								<ChevronDownIcon
									strokeWidth={2.5}
									className={`h-3.5 w-3.5 transition-transform ${
										openSemesterMenu ? 'rotate-180' : ''
									}`}
								/>
							</Button>
						</MenuHandler>
						<MenuList className="shadow-top min-w-fit p-0 rounded-none">
							{semesterData.map((semester, index, arr) => (
								<MenuItem
									key={semester.value}
									onClick={() =>
										handleChooseSemester(semester.value)
									}
									className={`py-1 px-3 rounded-none ${
										index !== arr.length - 1 &&
										'border-b-[1px] border-solid border-gray-300'
									}`}
								>
									<Typography className="text-sm font-medium text-text">
										{semester.name}
									</Typography>
								</MenuItem>
							))}
						</MenuList>
					</Menu>
				</div>
				<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
					{/* đề mục  */}
					<div className="w-full grid grid-cols-7 gap-2 p-4 py-3 border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Môn
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Thường xuyên
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Điểm 15p
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Điểm 45p
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Giữa kì
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Cuối kì
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center px-3">
							Trung bình môn
						</Typography>
					</div>
					{gradeDataLoading && <ListLoading value={8} />}
					{gradeData?.length === 0 && (
						<EmptyItem content={'Danh sách trống'} />
					)}
					{gradeDataError && (
						<EmptyItem content={'Đã có lỗi xảy ra'} />
					)}
					{/* điểm môn  */}
					{gradeData &&
						gradeData?.map((grade, index) => (
							<div
								className={`w-full grid grid-cols-7 px-4 gap-2 border-b-[1px] border-solid border-gray-300 ${
									index % 2 !== 0 && 'bg-main/5'
								} `}
								key={grade?.id}
							>
								<Typography className="whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300">
									{grade?.classSubject?.subject?.name}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300 ${
										grade?.oralTest <= 5 &&
										'font-medium text-error'
									}`}
								>
									{grade?.oralTest}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300 ${
										grade?.smallTest <= 5 &&
										'font-medium text-error'
									}`}
								>
									{grade?.smallTest}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300 ${
										grade?.bigTest <= 5 &&
										'font-medium text-error'
									}`}
								>
									{grade?.bigTest}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300 ${
										grade?.midtermExam <= 5 &&
										'font-medium text-error'
									}`}
								>
									{grade?.midtermExam}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300 ${
										grade?.finalExam <= 5 &&
										'font-medium text-error'
									}`}
								>
									{grade?.finalExam}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm font-semibold text-center py-3 ${
										grade?.subjectAverage <= 5 &&
										' text-error'
									}`}
								>
									{grade?.subjectAverage}&nbsp;
								</Typography>
							</div>
						))}
				</div>
			</div>
			{/* Tổng kết  */}
			{/* <div className="w-full flex flex-col mb-10">
				<Typography className="text-lg text-text font-semibold my-2">
					Tổng kết
				</Typography>

				<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 grid grid-cols-3">
					{semesterResultData.map((semesterItem, index, arr) => (
						<div
							key={semesterItem.semester}
							className={`flex flex-col  ${
								index !== arr.length - 1 &&
								'border-solid border-r-[1px] border-gray-400'
							}`}
						>
							<Typography
								className={`font-bold text-sm text-center uppercase border-solid border-b-[1px] border-gray-400 p-2 bg-main/30 
                                        ${index === 0 && 'rounded-tl-md'} 
                                        ${
											index === arr.length - 1 &&
											'rounded-tr-md'
										}`}
							>
								{semesterItem.semester}
							</Typography>
							<div className="flex flex-col gap-4 p-4">
								<Typography className="font-normal text-sm">
									Trung bình cuối kỳ:{' '}
									<span className="font-bold text-[15px]">
										{semesterItem?.finalAverage}
									</span>
								</Typography>
								<Typography className="font-normal text-sm">
									Xếp loại:{' '}
									<span className="font-bold text-[15px]">
										{semesterItem?.classification}
									</span>
								</Typography>
								<Typography className="font-normal text-sm">
									<span className="">Hạnh kiểm: </span>
									{index !== arr.length - 1 ? (
										<Menu
											placement="right"
											className="w-full"
											allowHover
										>
											<MenuHandler>
												<span className="font-bold text-[15px] inline-flex flex-row gap-1 items-center hover:text-main/80 cursor-pointer">
													{semesterItem?.conduct}
													<PencilSquareIcon className="size-4 inline-block mb-[2px]" />
												</span>
											</MenuHandler>
											<MenuList className="shadow-top min-w-fit p-0 rounded-sm">
												{Object.values(CONDUCT).map(
													(conduct, index, arr) => (
														<MenuItem
															key={conduct}
															onClick={() =>
																handleChangeConduct(
																	semesterItem.semester,
																	conduct
																)
															}
															className={`py-2 px-4 rounded-none ${
																index !==
																	arr.length -
																		1 &&
																'border-b-[1px] border-solid border-gray-300'
															}`}
														>
															<Typography className="text-sm font-medium text-text">
																{conduct}
															</Typography>
														</MenuItem>
													)
												)}
											</MenuList>
										</Menu>
									) : (
										<span className="font-bold text-[15px] inline-flex flex-row gap-1 items-center">
											{semesterItem?.conduct}
										</span>
									)}
								</Typography>
								<Typography className="font-normal text-sm">
									Danh hiệu:{' '}
									<span className="font-bold text-[15px]">
										{semesterItem?.title}
									</span>
								</Typography>
							</div>
						</div>
					))}
				</div>
			</div> */}
		</LargeWrapper>
	);
};

export default StudentDetailPage;
