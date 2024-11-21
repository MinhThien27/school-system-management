import React, { useEffect, useState } from 'react';
import SmallWrapper from '../../layouts/SmallWrapper';
import { IconButton, Typography } from '@material-tailwind/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import SpinnerLoading from '../../components/loading/SpinnerLoading';
import { useGetAcademyYearByIdQuery } from '../../services/academy-year/academyYearApiSlice';
import AcademyYearInfo from '../../components/admin/academy-year/AcademyYearInfo';
import SemestersInfo from '../../components/admin/academy-year/SemesterInfo';

const DetailAcademyYearPage = () => {
	const { academyYearId } = useParams();

	const { data: academyYearDataApi, isError: academyYearError } =
		useGetAcademyYearByIdQuery(academyYearId);
	const [academyYearData, setAcademyYearData] = useState(null);
	useEffect(() => {
		if (academyYearDataApi) setAcademyYearData(academyYearDataApi);
	}, [academyYearDataApi]);

	const navigate = useNavigate();

	return (
		<SmallWrapper>
			{academyYearError && <Navigate to={'/not-found'} />}
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
						Năm học:{' '}
						<span className="text-main ml-2">
							{academyYearData?.name}&nbsp;
						</span>
					</Typography>
				</div>

				{/* thông tin năm học  */}
				<div className="w-full">
					{!academyYearData ? (
						<SpinnerLoading />
					) : (
						<AcademyYearInfo data={academyYearData} />
					)}
				</div>

				{/* học kì  */}
				<SemestersInfo />
			</div>
		</SmallWrapper>
	);
};

export default DetailAcademyYearPage;
