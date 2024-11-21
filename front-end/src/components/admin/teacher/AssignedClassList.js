import { Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetClassesByTeacherIdQuery } from '../../../services/teacher/teacherApiSlice';
import ListLoading from '../../loading/ListLoading';
import EmptyItem from '../../empty/EmptyItem';
import { CheckIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';

const AssignedClassList = () => {
	const { teacherID } = useParams();

	const {
		data: classListDataApi,
		isLoading,
		isError,
	} = useGetClassesByTeacherIdQuery({
		id: teacherID,
		page: 0,
		quantity: 100,
	});
	const [classListData, setClassListData] = useState(null);
	useEffect(() => {
		if (classListDataApi)
			setClassListData(
				classListDataApi.items.filter(
					(obj, index, self) =>
						index ===
						self
							.map((s) => ({ ...s.classSubject }))
							.findIndex(
								(t) => t.classId === obj.classSubject.classId
							)
				)
			);
	}, [classListDataApi]);

	return (
		<div className="w-full flex flex-col my-10">
			<div className="flex justify-between items-center mb-1">
				<Typography className="text-lg text-text font-semibold my-2">
					Danh sách lớp phụ trách
				</Typography>
			</div>
			<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
				{/* đề mục  */}
				<div className="w-full grid grid-cols-[40px_80px_80px_140px_1fr_100px_100px] gap-4 p-4 pt-3 pb-2 border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
					<Typography className="whitespace-nowrap font-bold text-sm text-center">
						STT
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						Lớp
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						Phòng
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						Năm học
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						Chủ nhiệm
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center">
						Sĩ số
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center">
						Trạng thái
					</Typography>
				</div>
				{isLoading && <ListLoading value={4} />}
				{classListData?.length === 0 && (
					<EmptyItem content={'Danh sách trống'} />
				)}
				{isError && <EmptyItem content={'Đã có lỗi xảy ra'} />}
				{/* danh sách lớp  */}
				{classListData?.map((classItem, index, arr) => (
					<div
						key={classItem.id}
						className={`w-full grid grid-cols-[40px_80px_80px_140px_1fr_100px_100px] gap-4 p-4 pt-3 pb-2 border-b-[1px] border-solid border-gray-300 hover:bg-main/20 ${
							index === arr.length - 1 &&
							'border-none !round-b-md '
						} ${index % 2 === 0 && 'bg-main/5'}`}
					>
						<Typography className="whitespace-nowrap text-sm text-center">
							{index + 1}
						</Typography>
						<Link
							to={
								'/admin/manage-classes/' +
								classItem?.classSubject?.classId
							}
						>
							<Typography className="whitespace-nowrap text-sm text-center text-blue-900 font-semibold hover:opacity-70">
								{classItem?.classSubject?.class?.name}&nbsp;
							</Typography>
						</Link>
						<Typography className="whitespace-nowrap text-sm text-center">
							{classItem?.classSubject?.class?.roomCode}&nbsp;
						</Typography>
						<Link
							to={
								'/admin/manage-academy-years/' +
								classItem?.classSubject?.class?.academicYearId
							}
						>
							<Typography className="whitespace-nowrap text-sm text-center text-blue-900 font-semibold hover:opacity-70">
								{
									classItem?.classSubject?.class?.academicYear
										?.name
								}
								&nbsp;
							</Typography>
						</Link>
						<Link
							to={
								'/admin/manage-teachers/' +
								classItem?.classSubject?.class?.formTeacherId
							}
						>
							<Typography className="whitespace-nowrap font-semibold text-sm text-center text-blue-900 hover:opacity-70">
								{classItem?.classSubject?.class?.formTeacher
									.firstName +
									' ' +
									classItem?.classSubject?.class?.formTeacher
										.lastName}
								&nbsp;
							</Typography>
						</Link>

						<Typography className="whitespace-nowrap text-sm text-center">
							{classItem?.classSubject?.class?.capacity}&nbsp;
						</Typography>
						<Typography className="whitespace-nowrap text-sm text-center flex justify-center">
							{classItem?.classSubject?.class?.status ===
							'Active' ? (
								<CheckIcon className="size-5 text-success" />
							) : (
								<EllipsisHorizontalIcon className="size-5" />
							)}
						</Typography>
					</div>
				))}
			</div>
		</div>
	);
};

export default AssignedClassList;
