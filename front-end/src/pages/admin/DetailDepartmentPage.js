import React, { useEffect, useState } from 'react';
import { IconButton, Typography } from '@material-tailwind/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import SmallWrapper from '../../layouts/SmallWrapper';
import DepartmentInfo from '../../components/admin/department/DepartmentInfo';
import DepartmentSubjects from '../../components/admin/department/DepartmentSubjects';
import DepartmentTeachers from '../../components/admin/department/DepartmentTeachers';
import { useGetDepartmentByIdQuery } from '../../services/department/departmentApiSlice';
import SpinnerLoading from '../../components/loading/SpinnerLoading';

const DetailDepartmentPage = () => {
	const { departmentId } = useParams();
	const navigate = useNavigate();

	const { data: departmentDataApi, isError: departmentError } =
		useGetDepartmentByIdQuery(departmentId);
	const [departmentData, setDepartmentData] = useState(null);
	useEffect(() => {
		if (departmentDataApi) setDepartmentData(departmentDataApi);
	}, [departmentDataApi]);

	return (
		<SmallWrapper>
			{departmentError && <Navigate to={'/not-found'} />}
			<div className="w-[940px] mb-10 h-full flex flex-col">
				<div className="flex flex-row gap-4 items-center mb-2">
					<IconButton
						size="sm"
						variant="text"
						className="bg-upperBg border-text/30 text-text/70 border-solid border-[1px] focus:ring-transparent rounded-sm"
						onClick={() => navigate(-1)}
					>
						<ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
					</IconButton>
					<Typography className="text-lg text-text font-semibold my-2 ">
						Tổ bộ môn:{' '}
						<span className="text-main ml-2">
							{departmentData?.name}
						</span>
					</Typography>
				</div>
				<div className="grid grid-cols-2 gap-8">
					{/* thông tin phòng ban  */}
					{!departmentData ? (
						<SpinnerLoading />
					) : (
						<DepartmentInfo data={departmentData} />
					)}

					{/* các môn của phòng ban  */}
					<DepartmentSubjects />
				</div>
			</div>

			{/* Danh sách giáo viên trong phòng ban  */}
			<DepartmentTeachers />
		</SmallWrapper>
	);
};

export default DetailDepartmentPage;
