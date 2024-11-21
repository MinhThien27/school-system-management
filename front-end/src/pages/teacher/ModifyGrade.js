import React, { useEffect, useState } from 'react';
import LargeWrapper from '../../layouts/LargeWrapper';
import {
	Button,
	IconButton,
	Spinner,
	Typography,
} from '@material-tailwind/react';
import {
	ArrowLeftIcon,
	CheckIcon,
	PencilSquareIcon,
} from '@heroicons/react/24/solid';
import EditGradeEachTypeItem from '../../components/teacher/EditGradeEachTypeItem';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '../../hooks/useQuery';
import {
	useEditGradeByClassMutation,
	useGetGradeByClassQuery,
} from '../../services/grade/gradeApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser } from '../../services/auth/authSlice';
import { useGetClassesByTeacherIdQuery } from '../../services/teacher/teacherApiSlice';
import ListLoading from '../../components/loading/ListLoading';
import EmptyItem from '../../components/empty/EmptyItem';
import { notify } from '../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../config/constants';

const ModifyGradePage = () => {
	const dispatch = useDispatch();
	const query = useQuery();
	const navigate = useNavigate();
	let classId = query.get('q1');
	let classSubjectId = query.get('q2');
	const { id: teacherID } = useSelector(selectCurrentUser);

	//thông tin lớp
	const { data: classListDataApi } = useGetClassesByTeacherIdQuery({
		id: teacherID,
		page: 0,
		quantity: 100,
	});
	const [classData, setClassData] = useState(null);
	useEffect(() => {
		if (classListDataApi)
			setClassData(
				classListDataApi?.items.filter(
					(c) => c.classSubjectId === classSubjectId
				)[0]
			);
	}, [classListDataApi, classSubjectId]);

	//điểm
	const {
		data: gradeDataApi,
		isError: gradeDataError,
		isLoading: gradeDataLoading,
	} = useGetGradeByClassQuery({
		classId: classId,
		classSubjectId: classSubjectId,
	});
	const [gradeData, setGradeData] = useState(null);

	//filter
	const [searchValue, setSearchValue] = useState({
		studentName: '',
	});
	const handleSubmitSearchByStudentName = (e) => {
		setSearchValue({ ...searchValue, studentName: e.target.value });
	};
	useEffect(() => {
		if (gradeDataApi) {
			setGradeData(
				gradeDataApi?.items?.filter((item) =>
					item.student.firstName
						.concat(item.student.lastName)
						.toLowerCase()
						.includes(searchValue.studentName.toLowerCase())
				)
			);
		}
	}, [searchValue, gradeDataApi]);

	//edit
	const editBtnListData = [
		{ title: 'Thường xuyên', active: false },
		{ title: 'Điểm 15p', active: false },
		{ title: 'Điểm 45p', active: false },
		{ title: 'Giữa kỳ', active: false },
		{ title: 'Cuối kỳ', active: false },
	];
	const [editBtnList, setEditBtnList] = useState(editBtnListData);
	const handleActiveEdit = (title) => {
		setEditBtnList((prev) =>
			prev.map((item) => {
				if (item.title === title && item.active === false)
					return { ...item, active: true };
				return { ...item, active: false };
			})
		);
	};
	const handleSetOralTest = (data) => {
		setGradeData((prev) =>
			prev.map((item, index) => {
				return { ...item, oralTest: data[index] };
			})
		);
	};
	const handleSetSmallTest = (data) => {
		setGradeData((prev) =>
			prev.map((item, index) => {
				return { ...item, smallTest: data[index] };
			})
		);
	};
	const handleSetBigTest = (data) => {
		setGradeData((prev) =>
			prev.map((item, index) => {
				return { ...item, bigTest: data[index] };
			})
		);
	};
	const handleSetMidtermExam = (data) => {
		setGradeData((prev) =>
			prev.map((item, index) => {
				return { ...item, midtermExam: data[index] };
			})
		);
	};
	const handleSetFinalExam = (data) => {
		setGradeData((prev) =>
			prev.map((item, index) => {
				return { ...item, finalExam: data[index] };
			})
		);
	};

	//trạng thái
	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		setIsEdit(editBtnList.some((x) => x.active === true));
	}, [editBtnList]);

	//nhấn ESC thì thoát edit
	const handleKeyDownEscape = (event) => {
		if (event.key === 'Escape') {
			setEditBtnList((prev) =>
				prev.map((item) => ({ ...item, active: false }))
			);
		}
	};
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDownEscape);
		return () => {
			window.removeEventListener('keydown', handleKeyDownEscape);
		};
	}, []);

	//submit
	const [editGradeByClass, { isLoading: editLoading }] =
		useEditGradeByClassMutation();

	const handleSaveGrade = async () => {
		const data = gradeData.map((grade) => ({
			studentId: grade.studentId,
			updateGradeDto: {
				oralTest:
					grade.oralTest !== null ? Number(grade.oralTest) : null,
				smallTest:
					grade.smallTest !== null ? Number(grade.smallTest) : null,
				bigTest: grade.bigTest !== null ? Number(grade.bigTest) : null,
				midtermExam:
					grade.midtermExam !== null
						? Number(grade.midtermExam)
						: null,
				finalExam:
					grade.finalExam !== null ? Number(grade.finalExam) : null,
			},
		}));
		try {
			await editGradeByClass({
				classId: classId,
				classSubjectId: classSubjectId,
				body: data,
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Thông tin không hợp lệ';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	return (
		<LargeWrapper>
			<div className="w-full flex flex-col mb-10">
				{/* header  */}
				<div className="flex justify-between items-center mb-2">
					<div className="flex flex-row gap-4 items-center">
						<IconButton
							size="sm"
							variant="text"
							className="bg-upperBg border-text/30 text-text/70 border-solid border-[1px] focus:ring-transparent rounded-sm"
							onClick={() => navigate(-1)}
						>
							<ArrowLeftIcon
								strokeWidth={2}
								className="h-4 w-4"
							/>
						</IconButton>
						<Typography className="text-lg text-text font-semibold my-2">
							Lớp{' '}
							<span className="text-main">
								{classData?.classSubject?.class?.name}
							</span>
							<span className="text-sm font-normal ml-2">
								({classData?.classSubject?.semester?.name})
							</span>
						</Typography>
					</div>
				</div>
				<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center relative">
					{/* đề mục  */}
					<div className="w-full grid grid-cols-[80px_280px_repeat(6,140px)] border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
						<Typography className="whitespace-nowrap font-bold text-sm flex justify-center py-2 px-3  border-solid border-gray-500">
							STT
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center pt-3 pb-2 px-3  border-solid border-gray-500 flex flex-col items-center">
							<span>Họ và tên</span>
							<input
								type="text"
								spellCheck="false"
								className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
								onKeyDown={(e) =>
									e.keyCode === 13 &&
									handleSubmitSearchByStudentName(e)
								}
								onBlur={(e) =>
									handleSubmitSearchByStudentName(e)
								}
							></input>
						</Typography>
						{editBtnList.map((editItem) => (
							<Typography
								key={editItem.title}
								className={`whitespace-nowrap h-fit font-bold text-sm text-center flex py-2 justify-center pt-3 gap-1 ${
									editItem.active
										? 'text-main'
										: 'pl-2 hover:opacity-80  hover:text-main cursor-pointer'
								}`}
								onClick={() => handleActiveEdit(editItem.title)}
							>
								{editItem.active ? (
									<Button className="py-1 bg-main/80">
										<CheckIcon className="size-5" />
									</Button>
								) : (
									<>
										{editItem.title}
										<PencilSquareIcon className="size-4 mb-[2px]" />
									</>
								)}
							</Typography>
						))}
						<Typography className="whitespace-nowrap font-bold text-sm flex justify-center py-3 px-3 border-solid border-gray-400 border-l-[1px]">
							Trung bình môn
						</Typography>
					</div>
					{gradeDataLoading && <ListLoading value={4} />}
					{gradeData?.length === 0 && (
						<EmptyItem content={'Danh sách trống'} />
					)}
					{gradeDataError && (
						<EmptyItem content={'Đã có lỗi xảy ra'} />
					)}
					{/* điểm môn  */}
					{gradeData && (
						<div
							className={`w-full grid grid-cols-[80px_280px_repeat(6,140px)]`}
						>
							{/* số thứ tự  */}
							<div className="w-full h-fit flex flex-col">
								{gradeData?.map((grade, index) => (
									<Typography
										className={`h-11 whitespace-nowrap text-sm py-3 text-center font-semibold border-r-[1px] border-b-[1px] border-solid border-gray-300  ${
											index % 2 === 0 && 'bg-main/5'
										} `}
										key={grade?.studentId}
									>
										{index + 1}
									</Typography>
								))}
							</div>
							{/* tên  */}
							<div className="w-full h-fit flex flex-col">
								{gradeData?.map((grade, index) => (
									<Typography
										className={`h-11 whitespace-nowrap text-sm py-3 pl-4 font-semibold border-r-[1px] border-b-[1px] border-solid border-gray-300  ${
											index % 2 === 0 && 'bg-main/5'
										} `}
										key={'student_name_' + grade?.studentId}
									>
										{grade?.student?.firstName +
											' ' +
											grade?.student?.lastName}
										&nbsp;
									</Typography>
								))}
							</div>
							{/* điểm thường xuyên */}
							{editBtnList[0].active ? (
								<EditGradeEachTypeItem
									gradeData={gradeData?.map(
										(item) => item.oralTest
									)}
									setGradeData={handleSetOralTest}
								/>
							) : (
								<div className="w-full h-fit flex flex-col">
									{gradeData?.map((grade, index) => (
										<Typography
											className={`h-11 whitespace-nowrap text-sm py-3 text-center font-semibold border-r-[1px] border-b-[1px] border-solid border-gray-300 ${
												index % 2 === 0 && 'bg-main/5'
											} ${
												grade?.oralTest <= 5 &&
												'text-error'
											}`}
											key={
												'student_oral_' +
												grade?.studentId
											}
										>
											{grade?.oralTest}&nbsp;
										</Typography>
									))}
								</div>
							)}
							{/* điểm 15p */}
							{editBtnList[1].active ? (
								<EditGradeEachTypeItem
									gradeData={gradeData?.map(
										(item) => item.smallTest
									)}
									setGradeData={handleSetSmallTest}
								/>
							) : (
								<div className="w-full h-fit flex flex-col">
									{gradeData?.map((grade, index) => (
										<Typography
											className={`h-11 whitespace-nowrap text-sm py-3 text-center font-semibold border-r-[1px] border-b-[1px] border-solid border-gray-300 ${
												index % 2 === 0 && 'bg-main/5'
											} ${
												grade?.smallTest <= 5 &&
												'text-error'
											}`}
											key={
												'student_smallTest_' +
												grade?.studentId
											}
										>
											{grade?.smallTest}&nbsp;
										</Typography>
									))}
								</div>
							)}

							{/* điểm 45p */}
							{editBtnList[2].active ? (
								<EditGradeEachTypeItem
									gradeData={gradeData?.map(
										(item) => item.bigTest
									)}
									setGradeData={handleSetBigTest}
								/>
							) : (
								<div className="w-full h-fit flex flex-col">
									{gradeData?.map((grade, index, arr) => (
										<Typography
											className={`h-11 whitespace-nowrap text-sm py-3 text-center font-semibold border-r-[1px] border-b-[1px] border-solid border-gray-300 ${
												index % 2 === 0 && 'bg-main/5'
											} ${
												grade?.bigTest <= 5 &&
												'text-error'
											}`}
											key={
												'student_bigTest_' +
												grade?.studentId
											}
										>
											{grade?.bigTest}&nbsp;
										</Typography>
									))}
								</div>
							)}

							{/* điểm giữa kỳ */}
							{editBtnList[3].active ? (
								<EditGradeEachTypeItem
									gradeData={gradeData?.map(
										(item) => item.midtermExam
									)}
									setGradeData={handleSetMidtermExam}
								/>
							) : (
								<div className="w-full h-fit flex flex-col">
									{gradeData?.map((grade, index) => (
										<Typography
											className={`h-11 whitespace-nowrap text-sm py-3 text-center font-semibold border-r-[1px] border-b-[1px] border-solid border-gray-300 ${
												index % 2 === 0 && 'bg-main/5'
											} ${
												grade?.midtermExam <= 5 &&
												'text-error'
											}`}
											key={
												'student_midterm_' +
												grade?.studentId
											}
										>
											{grade?.midtermExam}&nbsp;
										</Typography>
									))}
								</div>
							)}

							{/* điểm cuối kì */}
							{editBtnList[4].active ? (
								<EditGradeEachTypeItem
									gradeData={gradeData?.map(
										(item) => item.finalExam
									)}
									setGradeData={handleSetFinalExam}
								/>
							) : (
								<div className="w-full h-fit flex flex-col">
									{gradeData?.map((grade, index) => (
										<Typography
											className={`h-11 whitespace-nowrap text-sm py-3 text-center font-semibold border-b-[1px] border-solid border-gray-300 ${
												index % 2 === 0 && 'bg-main/5'
											} ${
												grade?.finalExam <= 5 &&
												'text-error'
											}`}
											key={
												'student_final_' +
												grade?.studentId
											}
										>
											{grade?.finalExam}&nbsp;
										</Typography>
									))}
								</div>
							)}

							{/* trung bình môn  */}
							<div className="w-full h-fit flex flex-col">
								{gradeData?.map((grade, index, arr) => (
									<Typography
										className={`h-11 whitespace-nowrap text-sm py-3 text-center bg-main/20 font-semibold border-l-[1px] border-b-[1px] border-solid border-white border-l-gray-400  ${
											index === arr.length - 1 &&
											'border-b-gray-300'
										} ${
											grade?.subjectAverage <= 5 &&
											'text-error'
										}`}
										key={
											'student_average_' +
											grade?.studentId
										}
									>
										{grade?.subjectAverage}&nbsp;
									</Typography>
								))}
							</div>
						</div>
					)}

					{gradeData?.length > 0 && (
						<div className="w-[140px] self-end flex flex-row justify-center py-2">
							<Button
								onClick={handleSaveGrade}
								className="bg-main/80 py-2 px-6 rounded-md"
								disabled={isEdit || editLoading}
							>
								{editLoading ? (
									<Spinner
										color="indigo"
										className="size-5"
									/>
								) : (
									'Lưu'
								)}
							</Button>
						</div>
					)}
					{editLoading && (
						<div className="absolute w-full h-full"></div>
					)}
				</div>
			</div>
		</LargeWrapper>
	);
};

export default ModifyGradePage;
