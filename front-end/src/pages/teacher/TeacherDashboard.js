import React, { useEffect, useState } from 'react';
import SmallWrapper from '../../layouts/SmallWrapper';
import { Avatar, Typography } from '@material-tailwind/react';
import { Navigate } from 'react-router-dom';
import { useGetTeacherByIdQuery } from '../../services/teacher/teacherApiSlice';

import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../services/auth/authSlice';
import SpinnerLoading from '../../components/loading/SpinnerLoading';
import { GENDER } from '../../config/constants';
import { formatTimestamp } from '../../utils';

const TeacherDashboard = () => {
	const { id: teacherId } = useSelector(selectCurrentUser);

	const { data: teacherDataApi, isError: teacherError } =
		useGetTeacherByIdQuery(teacherId);

	const [teacherData, setTeacherData] = useState(null);
	useEffect(() => {
		if (teacherDataApi) setTeacherData(teacherDataApi);
	}, [teacherDataApi]);

	return (
		<SmallWrapper>
			{teacherError && <Navigate to={'/not-found'} />}

			<div className="w-[720px] ">
				<Typography className="text-lg text-text font-semibold my-2">
					Thông tin giáo viên
				</Typography>
				<div className="w-full grid grid-cols-3 gap-4">
					{/* avt  */}
					<div className="col-span-1 w-full flex flex-col">
						<div className="w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row items-center justify-center">
							{!teacherData ? (
								<SpinnerLoading />
							) : (
								<Avatar
									variant="circular"
									alt="tania andrew"
									className="h-32 w-32 border border-main shadow-xl shadow-blue-900/20 ring-2 ring-main/30 m-8 mx-12"
									src={teacherData?.imageUrl}
								/>
							)}
						</div>
					</div>
					{/* phòng ban  */}
					<div className="col-span-2 w-full flex flex-col">
						{!teacherData ? (
							<SpinnerLoading />
						) : teacherData?.departmentTeachers.length !== 0 ? (
							<div className="h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
								<div className="py-6 px-12 w-full">
									<div className="flex flex-row gap-4 py-2">
										<Typography className="text-sm font-normal whitespace-nowrap ">
											Tên tổ bộ môn:
										</Typography>
										<Typography className="text-sm font-semibold ">
											{
												teacherData
													?.departmentTeachers[0]
													?.department?.name
											}
											&nbsp;
										</Typography>
									</div>
									<div className="flex flex-row gap-4 py-2">
										<Typography className="text-sm font-normal whitespace-nowrap ">
											Tổ trưởng:
										</Typography>
										<Typography className="text-sm font-semibold ">
											{teacherData?.departmentTeachers[0]
												?.department?.headTeacher
												?.firstName +
												' ' +
												teacherData
													?.departmentTeachers[0]
													?.department?.headTeacher
													?.lastName}
											&nbsp;
										</Typography>
									</div>
									<div className="flex flex-row gap-4 py-2">
										<Typography className="text-sm font-normal whitespace-nowrap">
											Email:
										</Typography>
										<Typography className="text-sm font-semibold text-blue-900 cursor-pointer">
											<a
												href={
													'mailTo:' +
													teacherData
														?.departmentTeachers[0]
														?.department
														?.headTeacher?.user
														?.email
												}
											>
												{
													teacherData
														?.departmentTeachers[0]
														?.department
														?.headTeacher?.user
														?.email
												}
												&nbsp;
											</a>
											&nbsp;
										</Typography>
									</div>
									<div className="flex flex-row gap-4 py-2">
										<Typography className="text-sm font-normal whitespace-nowrap ">
											Mô tả:
										</Typography>
										<Typography className="text-sm font-semibold ">
											{
												teacherData
													?.departmentTeachers[0]
													?.department?.description
											}
											&nbsp;
										</Typography>
									</div>
								</div>
							</div>
						) : (
							<div className="h-full px-12 py-8 bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex items-center justify-center">
								<Typography className="text-base font-semibold text-center">
									Chưa thuộc tổ bộ môn nào.
								</Typography>
							</div>
						)}
					</div>
					{/* thông tin cá nhân  */}
					<div className="col-span-3 w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row items-center">
						{!teacherData ? (
							<SpinnerLoading />
						) : (
							<div className="grid grid-cols-2 gap-x-14 py-6 px-12 w-full border-solid border-l-[1px] border-gray-300">
								<div className="flex flex-row gap-4 py-2">
									<Typography className="text-sm font-normal whitespace-nowrap ">
										Họ và tên:
									</Typography>
									<Typography className="text-sm font-semibold ">
										{teacherData?.firstName +
											' ' +
											teacherData?.lastName}
										&nbsp;
									</Typography>
								</div>
								<div className="flex flex-row gap-4 py-2">
									<Typography className="text-sm font-normal whitespace-nowrap ">
										Giới tính:
									</Typography>
									<Typography className="text-sm font-semibold ">
										{teacherData?.gender === 'Female'
											? GENDER.FEMALE.show
											: GENDER.MALE.show}
										&nbsp;
									</Typography>
								</div>
								<div className="flex flex-row gap-4 py-2">
									<Typography className="text-sm font-normal whitespace-nowrap ">
										Ngày sinh:
									</Typography>
									<Typography className="text-sm font-semibold ">
										{formatTimestamp(teacherData?.dob)}
										&nbsp;
									</Typography>
								</div>
								<div className="flex flex-row gap-4 py-2">
									<Typography className="text-sm font-normal whitespace-nowrap ">
										Ngày bắt đầu:
									</Typography>
									<Typography className="text-sm font-semibold ">
										{formatTimestamp(
											teacherData?.startDate
										)}
										&nbsp;
									</Typography>
								</div>
								<div className="flex flex-row gap-4 py-2">
									<Typography className="text-sm font-normal whitespace-nowrap ">
										Số điện thoại:
									</Typography>
									<Typography className="text-sm font-semibold ">
										{teacherData?.user?.phoneNumber}&nbsp;
									</Typography>
								</div>
								<div className="flex flex-row gap-4 py-2">
									<Typography className="text-sm font-normal whitespace-nowrap">
										Email:
									</Typography>
									<Typography className="text-sm font-semibold text-blue-900 cursor-pointer">
										<a
											href={
												'mailTo:' +
												teacherData?.user?.email
											}
										>
											{teacherData?.user?.email}&nbsp;
										</a>
									</Typography>
								</div>
								<div className="flex flex-row gap-4 py-2">
									<Typography className="text-sm font-normal whitespace-nowrap ">
										Mã định danh:
									</Typography>
									<Typography className="text-sm font-semibold ">
										{
											teacherData?.user
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
										{teacherData?.address}&nbsp;
									</Typography>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</SmallWrapper>
	);
};

export default TeacherDashboard;
