import React, { useEffect, useState } from 'react';
import {
	Button,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Typography,
} from '@material-tailwind/react';
import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useParams } from 'react-router-dom';
import { useGetSubjectsByClassIdQuery } from '../../../services/class/classApiSlice';
import ListLoading from '../../loading/ListLoading';
import EmptyItem from '../../empty/EmptyItem';
import ClassSubjectItem from './ClassSubjectItem';
import NewClassSubject from './NewClassSubject';

const ClassSubjectList = () => {
	const { classID } = useParams();

	const {
		data: subjectListDataApi,
		isLoading,
		isError,
	} = useGetSubjectsByClassIdQuery({
		page: 0,
		quantity: 100,
		id: classID,
	});
	const [subjectListData, setSubjectListData] = useState(null);

	//chọn kì
	const [openMenu, setOpenMenu] = React.useState(false);
	const semesterData = [
		{ value: 1, name: 'Học kỳ I' },
		{ value: 2, name: 'Học kỳ II' },
	];
	const [chosenSemester, setChosenSemester] = useState(semesterData[0]);
	const handleChooseSemester = (value) => {
		setChosenSemester(semesterData.filter((s) => s.value === value)[0]);
	};

	useEffect(() => {
		if (subjectListDataApi)
			setSubjectListData(
				subjectListDataApi.items.filter(
					(s) => s.semester.semesterNumber === chosenSemester.value
				)
			);
	}, [subjectListDataApi, chosenSemester]);

	//new
	const [activeAddNewSubject, setActiveAddNewSubject] = useState(false);

	return (
		<div className="w-full flex flex-col my-10">
			<div className="flex justify-between items-center mb-2">
				<div className="flex gap-4 items-center">
					<Typography className="text-lg text-text font-semibold my-2">
						Danh sách môn
					</Typography>
					{/* chọn kỳ */}
					<Menu open={openMenu} handler={setOpenMenu}>
						<MenuHandler>
							<Button
								variant="text"
								className="flex h-fit items-center rounded-none gap-2 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg py-1 px-3 border-solid border-[1px] border-gray-300"
							>
								{chosenSemester.name}
								<ChevronDownIcon
									strokeWidth={2.5}
									className={`h-3.5 w-3.5 transition-transform ${
										openMenu ? 'rotate-180' : ''
									}`}
								/>
							</Button>
						</MenuHandler>
						<MenuList className="shadow-top min-w-fit p-0 rounded-none">
							{semesterData.map((semester, index, arr) => (
								<MenuItem
									key={'semester-' + semester.value}
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
				{/* thêm môn mới */}
				<Button
					color="indigo"
					className="py-2 px-4 bg-main/70"
					disabled={activeAddNewSubject}
					onClick={() => setActiveAddNewSubject(true)}
				>
					<PlusIcon className="size-5" />
				</Button>
			</div>
			<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
				{/* đề mục  */}
				<div className="w-full grid grid-cols-[80px_repeat(3,1fr)_140px_140px] place-items-center gap-4 p-4 pt-3 pb-2 border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
					<Typography className="whitespace-nowrap font-bold text-sm text-center">
						STT
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						Môn
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center col-span-2">
						{activeAddNewSubject ? 'Học kỳ' : 'Giáo viên giảng dạy'}
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						Trạng thái
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center">
						Thao tác
					</Typography>
				</div>
				{isLoading && <ListLoading value={8} />}
				{subjectListData?.length === 0 && !activeAddNewSubject && (
					<EmptyItem content={'Danh sách trống'} />
				)}
				{isError && <EmptyItem content={'Đã có lỗi xảy ra'} />}
				<NewClassSubject
					isActive={activeAddNewSubject}
					setActive={setActiveAddNewSubject}
				/>
				{subjectListData?.map((subject, index, arr) => (
					<ClassSubjectItem
						className={`w-full grid grid-cols-[80px_repeat(3,1fr)_140px_140px] place-items-center gap-4 p-4 pt-3 pb-2 border-b-[1px] border-solid border-gray-300 hover:bg-main/20  ${
							index === arr.length - 1 &&
							'border-none rounded-b-md'
						} ${index % 2 === 0 && 'bg-main/5'}`}
						key={subject.id}
						data={subject}
						classId={classID}
						index={index + 1}
					/>
				))}
			</div>
		</div>
	);
};

export default ClassSubjectList;
