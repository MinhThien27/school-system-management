import React, { useEffect, useState } from 'react';
import LargeWrapper from '../../layouts/LargeWrapper';
import {
	Button,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Typography,
} from '@material-tailwind/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../services/auth/authSlice';
import { useGetGradeByStudentQuery } from '../../services/grade/gradeApiSlice';
import ListLoading from '../../components/loading/ListLoading';
import EmptyItem from '../../components/empty/EmptyItem';

const LearningResultPage = () => {
	const { id: studentId } = useSelector(selectCurrentUser);
	//điểm số -> done
	const {
		data: gradeDataApi,
		isError: gradeDataError,
		isLoading: gradeDataLoading,
	} = useGetGradeByStudentQuery(studentId);
	const [gradeData, setGradeData] = useState(null);

	//chọn kì ->done
	const [openSemesterMenu, setOpenSemesterMenu] = React.useState(false);
	const semesterData = [
		{ value: 1, name: 'Học kỳ I' },
		{ value: 2, name: 'Học kỳ II' },
	];
	const [chosenSemester, setChosenSemester] = useState(semesterData[0]);
	const handleChooseSemester = (value) => {
		setChosenSemester(semesterData.filter((s) => s.value === value)[0]);
	};

	useEffect(() => {
		if (gradeDataApi)
			setGradeData(
				gradeDataApi?.items.filter(
					(s) =>
						s?.classSubject?.semester?.semesterNumber ===
						chosenSemester.value
				)
			);
	}, [gradeDataApi, chosenSemester]);

	// const semesterResultData = {
	// 	finalAverage: 8.5,
	// 	classification: 'Giỏi',
	// 	conduct: 'Tốt',
	// 	title: 'Học sinh giỏi',
	// };

	return (
		<LargeWrapper>
			<div className="w-full flex flex-col mb-10">
				<div className="flex justify-between items-center">
					<Typography className="text-lg text-text font-semibold my-2">
						Kết quả học tập
					</Typography>
					{/* chọn kỳ */}
					<Menu open={openSemesterMenu} handler={setOpenSemesterMenu}>
						<MenuHandler>
							<Button
								variant="text"
								className="flex items-center rounded-none gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-300"
							>
								{chosenSemester.name}
								<ChevronDownIcon
									strokeWidth={2.5}
									className={`h-3.5 w-3.5 transition-transform ${
										openSemesterMenu ? 'rotate-180' : ''
									}`}
								/>
							</Button>
						</MenuHandler>
						<MenuList className="shadow-top min-w-fit p-0 rounded-none">
							{semesterData.map((semester, index, arr) => (
								<MenuItem
									key={semester.value}
									onClick={() =>
										handleChooseSemester(semester.value)
									}
									className={`py-1 px-3 rounded-none ${
										index !== arr.length - 1 &&
										'border-b-[1px] border-solid border-gray-300'
									}`}
								>
									<Typography className="text-sm font-medium text-text">
										{semester.name}
									</Typography>
								</MenuItem>
							))}
						</MenuList>
					</Menu>
				</div>
				<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center mb-8">
					{/* đề mục  */}
					<div className="w-full grid grid-cols-7 gap-2 p-4 py-3 border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Môn
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Thường xuyên
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Điểm 15p
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Điểm 45p
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Giữa kì
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Cuối kì
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center px-3">
							Trung bình môn
						</Typography>
					</div>
					{gradeDataLoading && <ListLoading value={8} />}
					{gradeData?.length === 0 && (
						<EmptyItem content={'Danh sách trống'} />
					)}
					{gradeDataError && (
						<EmptyItem content={'Đã có lỗi xảy ra'} />
					)}
					{/* điểm môn  */}
					{gradeData &&
						gradeData?.map((grade, index) => (
							<div
								className={`w-full grid grid-cols-7 px-4 gap-2 border-b-[1px] border-solid border-gray-300 ${
									index % 2 !== 0 && 'bg-main/5'
								} `}
								key={grade?.id}
							>
								<Typography className="whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300">
									{grade?.classSubject?.subject?.name}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300 ${
										grade?.oralTest <= 5 &&
										'font-medium text-error'
									}`}
								>
									{grade?.oralTest}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300 ${
										grade?.smallTest <= 5 &&
										'font-medium text-error'
									}`}
								>
									{grade?.smallTest}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300 ${
										grade?.bigTest <= 5 &&
										'font-medium text-error'
									}`}
								>
									{grade?.bigTest}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300 ${
										grade?.midtermExam <= 5 &&
										'font-medium text-error'
									}`}
								>
									{grade?.midtermExam}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm text-center font-semibold py-3 border-r-[1px] border-solid border-gray-300 ${
										grade?.finalExam <= 5 &&
										'font-medium text-error'
									}`}
								>
									{grade?.finalExam}&nbsp;
								</Typography>
								<Typography
									className={`whitespace-nowrap text-sm font-semibold text-center py-3  ${
										grade?.subjectAverage <= 5 &&
										' text-error'
									}`}
								>
									{grade?.subjectAverage}&nbsp;
								</Typography>
							</div>
						))}
				</div>

				{/* Tổng kết  */}
				{/* <div className="flex flex-col">
					<Typography className="text-lg text-text font-semibold my-2">
						Tổng kết
					</Typography>

					<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 grid grid-cols-3">
						
						<div className="flex flex-col border-solid border-r-[1px] border-gray-400">
							<Typography className="font-bold text-sm text-center uppercase border-solid border-b-[1px] border-gray-400 p-2 bg-main/30 rounded-tl-md">
								Học kỳ I
							</Typography>
							<div className="flex flex-col gap-4 p-4">
								<Typography className="font-normal text-sm">
									Trung bình cuối kỳ:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.finalAverage}
									</span>
								</Typography>
								<Typography className="font-normal text-sm">
									Xếp loại:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.classification}
									</span>
								</Typography>
								<Typography className="font-normal text-sm">
									Hạnh kiểm:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.conduct}
									</span>
								</Typography>
								<Typography className="font-normal text-sm">
									Danh hiệu:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.title}
									</span>
								</Typography>
							</div>
						</div>
						
						<div className="flex flex-col border-solid border-r-[1px] border-gray-400">
							<Typography className="font-bold text-sm text-center uppercase border-solid border-b-[1px] border-gray-400 p-2 bg-main/30">
								Học kỳ II
							</Typography>
							<div className="flex flex-col gap-4 p-4">
								<Typography className="font-normal text-sm">
									Trung bình cuối kỳ:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.finalAverage}
									</span>
								</Typography>
								<Typography className="font-normal text-sm">
									Xếp loại:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.classification}
									</span>
								</Typography>
								<Typography className="font-normal text-sm">
									Hạnh kiểm:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.conduct}
									</span>
								</Typography>
								<Typography className="font-normal text-sm">
									Danh hiệu:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.title}
									</span>
								</Typography>
							</div>
						</div>
						
						<div className="flex flex-col ">
							<Typography className="font-bold text-sm text-center uppercase border-solid border-b-[1px] border-gray-400 p-2 bg-main/30 rounded-tr-md">
								Cả năm
							</Typography>
							<div className="flex flex-col gap-4 p-4">
								<Typography className="font-normal text-sm">
									Trung bình cuối kỳ:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.finalAverage}
									</span>
								</Typography>
								<Typography className="font-normal text-sm">
									Xếp loại:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.classification}
									</span>
								</Typography>
								<Typography className="font-normal text-sm">
									Hạnh kiểm:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.conduct}
									</span>
								</Typography>
								<Typography className="font-normal text-sm">
									Danh hiệu:{' '}
									<span className="font-bold text-[15px]">
										{semesterResultData?.title}
									</span>
								</Typography>
							</div>
						</div>
					</div>
				</div> */}
			</div>
		</LargeWrapper>
	);
};

export default LearningResultPage;
