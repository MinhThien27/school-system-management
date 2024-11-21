import React, { useEffect, useState } from 'react';
import SmallWrapper from '../../layouts/SmallWrapper';
import { IconButton, Typography } from '@material-tailwind/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import StudentAvatar from '../../components/admin/student/StudentAvatar';
import StudentInfo from '../../components/admin/student/StudentInfo';
import ParentInfo from '../../components/admin/student/ParentInfo';
import { useGetStudentByIdQuery } from '../../services/student/studentApiSlice';
import SpinnerLoading from '../../components/loading/SpinnerLoading';

const DetailStudentPage = () => {
	const { studentID } = useParams();

	const { data: studentDataApi, isError: studentError } =
		useGetStudentByIdQuery(studentID);
	const [studentData, setStudentData] = useState(null);
	useEffect(() => {
		if (studentDataApi) setStudentData(studentDataApi);
	}, [studentDataApi]);

	const navigate = useNavigate();

	return (
		<SmallWrapper>
			{studentError && <Navigate to={'/not-found'} />}
			<div className="w-[940px]">
				<div className="flex flex-row gap-4 items-center mb-2">
					<IconButton
						size="sm"
						variant="text"
						className="bg-upperBg border-text/30 text-text/70 border-solid border-[1px] focus:ring-transparent rounded-sm"
						onClick={() => navigate(-1)}
					>
						<ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
					</IconButton>
					<Typography className="text-lg text-text font-semibold my-2">
						Học sinh:{' '}
						<span className="text-main ml-2">
							{studentData?.firstName +
								' ' +
								studentData?.lastName}
							&nbsp;
						</span>
					</Typography>
				</div>
				<div className="w-full grid grid-cols-7 gap-4">
					{/* avt  */}
					<div className="col-span-2 w-full flex flex-col">
						{!studentData ? (
							<SpinnerLoading />
						) : (
							<StudentAvatar
								data={{
									image: studentData?.imageUrl,
									id: studentID,
								}}
							/>
						)}
					</div>

					{/* lớp  */}
					<div className="col-span-5 w-full flex flex-col">
						{!studentData ? (
							<SpinnerLoading />
						) : (
							<div className="h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
								<Typography className="w-full py-2 text-sm font-semibold text-text bg-main/30 text-center rounded-t-md ">
									Lớp
								</Typography>
								{studentData?.classStudents?.length !== 0 ? (
									<div className="px-10 pt-2 pb-4 w-full grid grid-cols-2">
										<div className="flex flex-col">
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Tên lớp:
												</Typography>
												<Link
													to={
														'/admin/manage-classes/' +
														studentData
															?.classStudents[0]
															?.classId
													}
												>
													<Typography className="text-sm font-semibold text-blue-900 hover:opacity-70">
														{
															studentData
																?.classStudents[0]
																?.class?.name
														}
														&nbsp;
													</Typography>
												</Link>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Chủ nhiệm:
												</Typography>
												<Link
													to={
														'/admin/manage-teachers/' +
														studentData
															?.classStudents[0]
															?.class
															?.formTeacherId
													}
												>
													<Typography className="text-sm font-semibold text-blue-900 hover:opacity-70">
														{studentData
															?.classStudents[0]
															?.class?.formTeacher
															?.firstName +
															' ' +
															studentData
																?.classStudents[0]
																?.class
																?.formTeacher
																?.lastName}
														&nbsp;
													</Typography>
												</Link>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap">
													Email:
												</Typography>
												<Typography className="text-sm font-semibold text-blue-900 cursor-pointer hover:opacity-80">
													<a
														href={
															'mailTo:' +
															studentData
																?.classStudents[0]
																?.class
																?.formTeacher
																?.user?.email
														}
													>
														{
															studentData
																?.classStudents[0]
																?.class
																?.formTeacher
																?.user?.email
														}
														&nbsp;
													</a>
												</Typography>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Năm học:
												</Typography>
												<Link
													to={
														'/admin/manage-academy-years/' +
														studentData
															?.classStudents[0]
															?.class
															?.academicYearId
													}
												>
													<Typography className="text-sm font-semibold text-blue-900 cursor-pointer hover:opacity-70">
														{
															studentData
																?.classStudents[0]
																?.class
																?.academicYear
																?.name
														}
														&nbsp;
													</Typography>
												</Link>
											</div>
										</div>
										<div className="flex flex-col">
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Phòng học:
												</Typography>
												<Typography className="text-sm font-semibold ">
													{
														studentData
															?.classStudents[0]
															?.class?.roomCode
													}
													&nbsp;
												</Typography>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Sĩ số:
												</Typography>
												<Typography className="text-sm font-semibold ">
													{
														studentData
															?.classStudents[0]
															?.class?.capacity
													}
													&nbsp;
												</Typography>
											</div>
											<div className="flex flex-row gap-4 py-2">
												<Typography className="text-sm font-normal whitespace-nowrap ">
													Trạng thái:
												</Typography>
												<Typography className="text-sm font-semibold ">
													{studentData
														?.classStudents[0]
														?.class?.status ===
													'Active'
														? 'Đang diễn ra'
														: 'Đã hoàn thành'}
													&nbsp;
												</Typography>
											</div>
										</div>
									</div>
								) : (
									<div className="px-10 pt-2 pb-4 w-full h-full flex flex-col gap-2 items-center justify-center">
										<Typography className="text-base font-semibold text-center">
											Học sinh chưa thuộc lớp nào.
										</Typography>
										<Link
											to={'/admin/manage-classes?page=1'}
										>
											<Typography className="text-sm font-semibold text-blue-900 hover:opacity-80 underline text-center">
												Đến danh sách lớp
											</Typography>
										</Link>
									</div>
								)}
							</div>
						)}
					</div>

					{/* thông tin cá nhân  */}
					<div className="col-span-7">
						{!studentData ? (
							<SpinnerLoading />
						) : (
							<StudentInfo
								data={studentData}
								// submit={editStudentInfo}
								// isLoading={editLoading}
							/>
						)}
					</div>
				</div>

				{/* phụ huynh  */}
				<ParentInfo />
			</div>
		</SmallWrapper>
	);
};

export default DetailStudentPage;
