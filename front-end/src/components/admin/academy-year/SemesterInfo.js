import { Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { MAX_SEMESTERS } from '../../../config/constants';
import { useParams } from 'react-router-dom';
import { useGetSemesterByAcademyYearQuery } from '../../../services/academy-year/academyYearApiSlice';
import NewSemester from './NewSemester';
import SemesterItem from './SemesterItem';

const SemestersInfo = () => {
	const { academyYearId } = useParams();
	//phụ huynh
	const { data: semestersDataApi, isError } =
		useGetSemesterByAcademyYearQuery(academyYearId);
	const [semestersData, setSemestersData] = useState(null);
	useEffect(() => {
		if (semestersDataApi) setSemestersData(semestersDataApi);
	}, [semestersDataApi]);
	return (
		<div className="w-full flex flex-col my-10">
			<div className="flex justify-between items-center mb-1">
				<Typography className="text-lg text-text font-semibold my-2">
					Học kì
				</Typography>
			</div>
			<div className="w-full h-min grid grid-cols-2 gap-4">
				{isError ? (
					<Typography className="font-semibold text-sm text-gray-500">
						Đã có lỗi xảy ra
					</Typography>
				) : semestersData?.totalItems > 0 ? (
					<>
						{semestersData?.items?.map((parent) => (
							<SemesterItem
								key={parent.id}
								data={parent}
								academyYearId={academyYearId}
							/>
						))}

						{semestersData?.totalItems < MAX_SEMESTERS && (
							<NewSemester academyYearId={academyYearId} />
						)}
					</>
				) : (
					<NewSemester academyYearId={academyYearId} />
				)}
			</div>
		</div>
	);
};

export default SemestersInfo;
