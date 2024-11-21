import React, { useEffect, useState } from 'react';
import SmallWrapper from '../../layouts/SmallWrapper';
import { Avatar, Typography } from '@material-tailwind/react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../services/auth/authSlice';
import {
	useGetParentByStudentQuery,
	useGetStudentByIdQuery,
} from '../../services/student/studentApiSlice';
import { Navigate } from 'react-router-dom';
import SpinnerLoading from '../../components/loading/SpinnerLoading';
import { GENDER } from '../../config/constants';
import { formatTimestamp } from '../../utils';

const StudentDashboard = () => {
	const { id: studentId } = useSelector(selectCurrentUser);

	//thông tin học sinh
	const { data: studentDataApi, isError: studentError } =
		useGetStudentByIdQuery(studentId);

	const [studentData, setStudentData] = useState(null);
	useEffect(() => {
		if (studentDataApi) setStudentData(studentDataApi);
	}, [studentDataApi]);

	//thông tin phụ huynh
	const { data: parentDataApi } = useGetParentByStudentQuery(studentId);
	const [parentData, setParentData] = useState(null);
	useEffect(() => {
		if (parentDataApi) setParentData(parentDataApi);
	}, [parentDataApi]);

	return (
		<SmallWrapper>
			{studentError && <Navigate to={'/not-found'} />}
			{/* thông tin học sinh  */}
			<div className="w-full flex flex-col">
				<Typography className="text-lg text-text font-semibold my-2">
					Thông tin cá nhân
				</Typography>
				<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
					{!studentData ? (
						<SpinnerLoading />
					) : (
						<Avatar
							variant="circular"
							alt="student"
							className="h-36 w-36 border border-main shadow-xl shadow-blue-900/20 ring-2 ring-main/30 m-8 mx-12"
							src={studentData?.imageUrl}
						/>
					)}

					<hr className="border-blue-gray-100 pointer-events-none w-full" />
					<div className="grid grid-cols-2 gap-x-14 py-6 px-12 w-full">
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
								Giới tính:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{studentData?.gender === 'Female'
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
								{formatTimestamp(studentData?.dob)}
								&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Lớp:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{studentData?.classStudents.length > 0
									? studentData?.classStudents[0]?.class?.name
									: 'Chưa có'}
								&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Số điện thoại:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{studentData?.user?.phoneNumber}&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap">
								Email:
							</Typography>
							<Typography className="text-sm font-semibold text-blue-900 cursor-pointer hover:opacity-70">
								<a href={'mailTo:' + studentData?.user?.email}>
									{studentData?.user?.email}&nbsp;
								</a>
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Mã định danh:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{studentData?.user?.citizenIdentification}
								&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap">
								Địa chỉ:
							</Typography>
							<Typography className="text-sm font-semibold">
								{studentData?.address}&nbsp;
							</Typography>
						</div>
					</div>
				</div>
			</div>
			{/* thông tin phụ huynh  */}
			<div className="w-full flex flex-col my-6 mb-12">
				<Typography className="text-lg text-text font-semibold my-2">
					Phụ huynh
				</Typography>

				{parentData?.totalItems > 0 ? (
					<div className="w-full grid grid-cols-2 gap-4">
						{parentData?.items?.map((parent) => (
							<div
								key={parent?.id}
								className="h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center"
							>
								<div className="py-6 px-12 w-full">
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
											{formatTimestamp(parent?.dob)}&nbsp;
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
											<a href={'mailTo:' + parent?.email}>
												{parent?.email}&nbsp;
											</a>
										</Typography>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<Typography className="text-sm text-gray-400 font-semibold">
						Chưa có thông tin
					</Typography>
				)}
			</div>
		</SmallWrapper>
	);
};

export default StudentDashboard;
