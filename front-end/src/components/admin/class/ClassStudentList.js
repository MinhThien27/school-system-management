import React, { useEffect, useState } from 'react';
import { Button, Typography } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import ClassStudentItem from './ClassStudentItem';
import NewClassStudent from './NewClassStudent';
import { useParams } from 'react-router-dom';
import { useGetStudentsByClassIdQuery } from '../../../services/class/classApiSlice';
import { NUMBER_ITEM_PER_PAGE } from '../../../config/constants';
import ListLoading from '../../loading/ListLoading';
import EmptyItem from '../../empty/EmptyItem';
import { Pagination } from '../../pagination/Pagination';
import { useQuery } from '../../../hooks/useQuery';

const ClassStudentList = () => {
	const { classID } = useParams();
	const query = useQuery();
	const [active, setActive] = useState(1);
	useEffect(() => {
		setActive(query.get('page'));
	}, [query]);
	const {
		data: studentListDataApi,
		isLoading,
		isError,
	} = useGetStudentsByClassIdQuery({
		page: active - 1,
		quantity: NUMBER_ITEM_PER_PAGE,
		id: classID,
	});
	const [studentListData, setStudentListData] = useState(null);
	useEffect(() => {
		if (studentListDataApi) setStudentListData(studentListDataApi.items);
	}, [studentListDataApi]);

	//pagination
	const lengthOfPage = Math.ceil(
		studentListDataApi?.totalItems / NUMBER_ITEM_PER_PAGE
	);

	//filter
	const [searchValue, setSearchValue] = useState({
		name: '',
		cid: '',
		phone: '',
	});
	const handleSubmitSearchByName = (e) => {
		setSearchValue({ ...searchValue, name: e.target.value });
	};
	const handleSubmitSearchByCID = (e) => {
		setSearchValue({ ...searchValue, cid: e.target.value });
	};
	const handleSubmitSearchByPhone = (e) => {
		setSearchValue({ ...searchValue, phone: e.target.value });
	};

	useEffect(() => {
		setStudentListData(
			studentListDataApi?.items?.filter(
				(item) =>
					item?.student?.firstName
						.concat(item?.student?.lastName)
						.toLowerCase()
						.includes(searchValue.name.toLowerCase()) &&
					item?.student?.user?.citizenIdentification
						.toLowerCase()
						.includes(searchValue.cid.toLowerCase()) &&
					item?.student?.user?.phoneNumber
						.toLowerCase()
						.includes(searchValue.phone.toLowerCase())
			)
		);
	}, [searchValue, studentListDataApi]);

	//new
	const [activeAddNewStudent, setActiveAddNewStudent] = useState(false);

	return (
		<div className="w-full flex flex-col my-10">
			<div className="flex justify-between items-center mb-2">
				<Typography className="text-lg text-text font-semibold my-2">
					Danh sách học sinh
				</Typography>
				{/* thêm học sinh mới */}
				<Button
					color="indigo"
					className="py-2 px-4 bg-main/70"
					disabled={activeAddNewStudent}
					onClick={() => setActiveAddNewStudent(true)}
				>
					<PlusIcon className="size-5" />
				</Button>
			</div>
			<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
				{/* đề mục  */}
				<div className="w-full grid grid-cols-[80px_repeat(3,1fr)_100px] gap-4 p-4 pt-3 pb-2 border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
					<Typography className="whitespace-nowrap font-bold text-sm text-center">
						STT
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						<span>Tên</span>
						<input
							type="text"
							spellCheck="false"
							className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
							onKeyDown={(e) =>
								e.keyCode === 13 && handleSubmitSearchByName(e)
							}
							onBlur={(e) => handleSubmitSearchByName(e)}
						></input>
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						<span>Mã định danh</span>
						<input
							type="text"
							spellCheck="false"
							className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
							onKeyDown={(e) =>
								e.keyCode === 13 && handleSubmitSearchByCID(e)
							}
							onBlur={(e) => handleSubmitSearchByCID(e)}
						></input>
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						<span>Số điện thoại</span>
						<input
							type="text"
							spellCheck="false"
							className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
							onKeyDown={(e) =>
								e.keyCode === 13 && handleSubmitSearchByPhone(e)
							}
							onBlur={(e) => handleSubmitSearchByPhone(e)}
						></input>
					</Typography>

					<Typography className="whitespace-nowrap font-bold text-sm text-center">
						Thao tác
					</Typography>
				</div>
				{isLoading && <ListLoading value={8} />}
				{studentListData?.length === 0 && !activeAddNewStudent && (
					<EmptyItem content={'Danh sách trống'} />
				)}
				{isError && <EmptyItem content={'Đã có lỗi xảy ra'} />}
				<NewClassStudent
					isActive={activeAddNewStudent}
					setActive={setActiveAddNewStudent}
				/>
				{studentListData?.map((student, index, arr) => (
					<ClassStudentItem
						className={`w-full grid grid-cols-[80px_repeat(3,1fr)_100px] gap-4 p-3 border-b-[1px] border-solid border-gray-300 hover:bg-main/20  ${
							index === arr.length - 1 && 'border-none'
						} ${index % 2 === 0 && 'bg-main/5'}`}
						key={student.id}
						data={student}
						classId={classID}
						index={(active - 1) * NUMBER_ITEM_PER_PAGE + index + 1}
					/>
				))}
				{studentListData?.length > 0 && (
					<Pagination
						active={1}
						lengthOfPage={lengthOfPage}
						total={studentListDataApi?.totalItems}
					/>
				)}
			</div>
		</div>
	);
};

export default ClassStudentList;
