import React, { useEffect, useState } from 'react';
import SmallWrapper from '../../layouts/SmallWrapper';
import { IconButton, Typography } from '@material-tailwind/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import ClassInfo from '../../components/admin/class/ClassInfo';
import FormTeacherInfo from '../../components/admin/class/FormTeacherInfo';
import ClassStudentList from '../../components/admin/class/ClassStudentList';
import { useGetClassByIdQuery } from '../../services/class/classApiSlice';
import SpinnerLoading from '../../components/loading/SpinnerLoading';
import ClassSubjectList from '../../components/admin/class/ClassSubjectList';

const DetailStudentPage = () => {
	const { classID } = useParams();
	const navigate = useNavigate();

	const { data: classDataApi, isError: classError } =
		useGetClassByIdQuery(classID);
	const [classData, setClassData] = useState(null);
	useEffect(() => {
		if (classDataApi) setClassData(classDataApi);
	}, [classDataApi]);

	return (
		<SmallWrapper>
			{classError && <Navigate to={'/not-found'} />}
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
						Lớp:{' '}
						<span className="text-main ml-2">
							{classData?.name}
						</span>
					</Typography>
				</div>
				<div className="w-full grid grid-cols-2 gap-4">
					{/* thông tin lớp  */}
					<div className="col-span-1">
						{!classData ? (
							<SpinnerLoading />
						) : (
							<ClassInfo data={classData} />
						)}
					</div>

					{/* thông tin chủ nhiệm  */}
					<div className="col-span-1">
						{!classData ? (
							<SpinnerLoading />
						) : (
							<FormTeacherInfo data={classData} />
						)}
					</div>
				</div>

				{/* danh sách học sinh  */}
				<ClassStudentList />

				{/* danh sách môn  */}
				<ClassSubjectList />
			</div>
		</SmallWrapper>
	);
};

export default DetailStudentPage;
