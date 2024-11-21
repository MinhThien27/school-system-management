import React, { useEffect, useState } from 'react';
import SmallWrapper from '../../layouts/SmallWrapper';
import { IconButton, Typography } from '@material-tailwind/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import TeacherAvatar from '../../components/admin/teacher/TeacherAvatar';
import TeacherInfo from '../../components/admin/teacher/TeacherInfo';
import FormClass from '../../components/admin/teacher/FormClass';
import AssignedClassList from '../../components/admin/teacher/AssignedClassList';
import { useGetTeacherByIdQuery } from '../../services/teacher/teacherApiSlice';
import SpinnerLoading from '../../components/loading/SpinnerLoading';
import { useGetClassesByFormTeacherQuery } from '../../services/class/classApiSlice';

const DetailTeacherPage = () => {
	const { teacherID } = useParams();

	const { data: teacherDataApi, isError: teacherError } =
		useGetTeacherByIdQuery(teacherID);
	const { data: formClassDataApi } =
		useGetClassesByFormTeacherQuery(teacherID);

	const [teacherData, setTeacherData] = useState(null);
	const [formClassData, setFormClassData] = useState(null);
	useEffect(() => {
		if (teacherDataApi) setTeacherData(teacherDataApi);
	}, [teacherDataApi]);
	useEffect(() => {
		if (formClassDataApi) setFormClassData(formClassDataApi);
	}, [formClassDataApi]);

	const navigate = useNavigate();

	return (
		<SmallWrapper>
			{teacherError && <Navigate to={'/not-found'} />}
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
						Giáo viên:{' '}
						<span className="text-main ml-2">
							{teacherData?.firstName +
								' ' +
								teacherData?.lastName || ' '}
						</span>
						&nbsp;
					</Typography>
				</div>
				<div className="w-full grid grid-cols-7 gap-4">
					{/* avt  */}
					<div className="col-span-2 w-full flex flex-col">
						{!teacherData ? (
							<SpinnerLoading />
						) : (
							<TeacherAvatar
								data={{
									image: teacherData?.imageUrl,
									id: teacherID,
								}}
							/>
						)}
					</div>
					{/* phòng ban  */}
					<div className="col-span-3 w-full flex flex-col">
						{!teacherData ? (
							<SpinnerLoading />
						) : (
							<div className="h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
								<Typography className="w-full py-2 text-sm font-semibold text-text bg-main/30 text-center rounded-t-md ">
									Phòng ban
								</Typography>
								{teacherData?.departmentTeachers.length !==
								0 ? (
									<div className="px-10 pt-2 pb-4 w-full">
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Tên phòng ban:
											</Typography>
											<Link
												to={
													'/admin/manage-departments/' +
													teacherData
														?.departmentTeachers[0]
														?.departmentId
												}
											>
												<Typography className="text-sm font-semibold text-blue-900 hover:opacity-70">
													{
														teacherData
															?.departmentTeachers[0]
															?.department?.name
													}
													&nbsp;
												</Typography>
											</Link>
										</div>
										{/* <div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Môn:
											</Typography>
											<Typography className="text-sm font-semibold ">
												{
													teacherData
														?.departmentTeachers
														?.subject
												}
											</Typography>
										</div> */}
										<div className="flex flex-row gap-4 py-2">
											<Typography className="text-sm font-normal whitespace-nowrap ">
												Trưởng ban:
											</Typography>
											<Link
												to={
													'/admin/manage-teachers/' +
													teacherData
														?.departmentTeachers[0]
														?.department
														?.headTeacherId
												}
											>
												<Typography className="text-sm font-semibold text-blue-900 hover:opacity-70">
													{teacherData
														?.departmentTeachers[0]
														?.department
														?.headTeacher
														?.firstName +
														' ' +
														teacherData
															?.departmentTeachers[0]
															?.department
															?.headTeacher
															?.lastName}
													&nbsp;
												</Typography>
											</Link>
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
														?.department
														?.description
												}
												&nbsp;
											</Typography>
										</div>
									</div>
								) : (
									<div className="px-10 pt-2 pb-4 w-full h-full flex flex-col gap-2 items-center justify-center">
										<Typography className="text-base font-semibold text-center">
											Giáo viên chưa thuộc tổ bộ môn nào.
										</Typography>
										<Link
											to={
												'/admin/manage-departments?page=1'
											}
										>
											<Typography className="text-sm font-semibold text-blue-900 underline text-center hover:opacity-80">
												Đến danh sách tổ bộ môn
											</Typography>
										</Link>
									</div>
								)}
							</div>
						)}
					</div>
					{/* lớp chủ nhiệm  */}
					<div className="col-span-2 h-full">
						{!formClassData ? (
							<SpinnerLoading />
						) : (
							<FormClass data={formClassData.items} />
						)}
					</div>
					{/* thông tin cá nhân  */}
					<div className="col-span-7">
						{!teacherData ? (
							<SpinnerLoading />
						) : (
							<TeacherInfo data={teacherData} />
						)}
					</div>
				</div>

				{/* lớp giảng dạy  */}
				<AssignedClassList />
			</div>
		</SmallWrapper>
	);
};

export default DetailTeacherPage;
