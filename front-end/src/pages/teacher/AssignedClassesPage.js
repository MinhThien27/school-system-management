import React, { useEffect, useState } from 'react';
import LargeWrapper from '../../layouts/LargeWrapper';
import { Typography } from '@material-tailwind/react';
import { CheckIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { useGetClassesByTeacherIdQuery } from '../../services/teacher/teacherApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../services/auth/authSlice';
import ListLoading from '../../components/loading/ListLoading';
import EmptyItem from '../../components/empty/EmptyItem';

const AssignedClassesPage = () => {
	const { id: teacherID } = useSelector(selectCurrentUser);

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

	//filter
	const [searchValue, setSearchValue] = useState({
		name: '',
		year: '',
		semester: '',
	});
	const handleSubmitSearchByName = (e) => {
		setSearchValue({ ...searchValue, name: e.target.value });
	};
	const handleSubmitSearchByYear = (e) => {
		setSearchValue({ ...searchValue, year: e.target.value });
	};
	const handleSubmitSearchBySemester = (e) => {
		setSearchValue({ ...searchValue, semester: e.target.value });
	};

	useEffect(() => {
		if (classListDataApi)
			setClassListData(
				classListDataApi?.items?.filter(
					(item) =>
						item?.classSubject?.class?.name
							.toLowerCase()
							.includes(searchValue.name.toLowerCase()) &&
						item?.classSubject?.class?.academicYear?.name
							.toLowerCase()
							.includes(searchValue.year.toLowerCase()) &&
						item?.classSubject?.semester?.name
							.toLowerCase()
							.includes(searchValue.semester.toLowerCase())
				)
			);
	}, [searchValue, classListDataApi]);

	return (
		<LargeWrapper>
			<div className="w-[1200px] flex flex-col mb-10">
				<div className="flex justify-between items-center mb-4">
					<Typography className="text-lg text-text font-semibold my-2">
						Danh sách lớp
					</Typography>
				</div>
				<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
					{/* đề mục  */}
					<div className="w-full grid grid-cols-[80px_120px_120px_repeat(2,1fr)_100px_100px_100px] gap-4 p-4 pt-3 pb-2 border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							STT
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
							<span>Lớp</span>
							<input
								type="text"
								spellCheck="false"
								className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
								onKeyDown={(e) =>
									e.keyCode === 13 &&
									handleSubmitSearchByName(e)
								}
								onBlur={(e) => handleSubmitSearchByName(e)}
							></input>
						</Typography>

						<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
							<span>Năm học</span>
							<input
								type="text"
								spellCheck="false"
								className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
								onKeyDown={(e) =>
									e.keyCode === 13 &&
									handleSubmitSearchByYear(e)
								}
								onBlur={(e) => handleSubmitSearchByYear(e)}
							></input>
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
							<span>Học kỳ</span>
							<input
								type="text"
								spellCheck="false"
								className="h-min w-full font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
								onKeyDown={(e) =>
									e.keyCode === 13 &&
									handleSubmitSearchBySemester(e)
								}
								onBlur={(e) => handleSubmitSearchBySemester(e)}
							></input>
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
							Liên hệ
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
							Phòng
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
					{/* điểm môn  */}
					{classListData?.map((classItem, index, arr) => (
						<div
							key={classItem.id}
							className={`w-full grid grid-cols-[80px_120px_120px_repeat(2,1fr)_100px_100px_100px] gap-4 p-4 pt-3 pb-2 border-b-[1px] border-solid border-gray-300 hover:bg-main/20 ${
								index % 2 === 0 && 'bg-main/5'
							} ${index === arr.length - 1 && 'border-none'}`}
						>
							<Typography className="whitespace-nowrap text-sm text-center">
								{index + 1}
							</Typography>
							<Link
								to={
									'/teacher/assigned-classes/class?q1=' +
									classItem?.classSubject?.classId +
									'&q2=' +
									classItem?.classSubject?.id
								}
							>
								<Typography className="whitespace-nowrap text-sm text-center font-semibold">
									{classItem?.classSubject?.class?.name}&nbsp;
								</Typography>
							</Link>
							<Typography className="whitespace-nowrap text-sm text-center font-normal">
								{
									classItem?.classSubject?.class?.academicYear
										?.name
								}
								&nbsp;
							</Typography>
							<Typography className="whitespace-nowrap text-sm text-center font-normal">
								{classItem?.classSubject?.semester?.name}
								&nbsp;
							</Typography>
							<Typography className="whitespace-nowrap text-sm text-center text-blue-900 hover:opacity-70 cursor-pointer font-semibold">
								<a
									href={
										'mailTo:' +
										classItem?.classSubject?.class
											?.formTeacher?.user?.email
									}
								>
									{
										classItem?.classSubject?.class
											?.formTeacher?.user?.email
									}
								</a>
								&nbsp;
							</Typography>
							<Typography className="whitespace-nowrap text-sm text-center">
								{classItem?.classSubject?.class?.roomCode}&nbsp;
							</Typography>
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
		</LargeWrapper>
	);
};

export default AssignedClassesPage;
