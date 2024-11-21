import { Button, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import NewClass from '../../components/admin/class/NewClass';
import { PlusIcon } from '@heroicons/react/24/solid';
import ClassItem from '../../components/admin/class/ClassItem';
import { useGetClassesQuery } from '../../services/class/classApiSlice';
import { NUMBER_ITEM_PER_PAGE } from '../../config/constants';
import ListLoading from '../../components/loading/ListLoading';
import EmptyItem from '../../components/empty/EmptyItem';
import { Pagination } from '../../components/pagination/Pagination';
import { useQuery } from '../../hooks/useQuery';

const ManageClassesPage = () => {
	const query = useQuery();
	const [active, setActive] = useState(1);
	useEffect(() => {
		setActive(query.get('page'));
	}, [query]);

	const {
		data: classListDataApi,
		isLoading,
		isError,
	} = useGetClassesQuery({
		page: active - 1,
		quantity: NUMBER_ITEM_PER_PAGE,
	});
	const [classListData, setClassListData] = useState(null);
	useEffect(() => {
		if (classListDataApi) setClassListData(classListDataApi.items);
	}, [classListDataApi]);

	//pagination
	const lengthOfPage = Math.ceil(
		classListDataApi?.totalItems / NUMBER_ITEM_PER_PAGE
	);

	//filter
	const [searchValue, setSearchValue] = useState({
		name: '',
		room: '',
		teacherName: '',
		level: '',
		year: '',
	});
	const handleSubmitSearchByName = (e) => {
		setSearchValue({ ...searchValue, name: e.target.value });
	};
	const handleSubmitSearchByRoom = (e) => {
		setSearchValue({ ...searchValue, room: e.target.value });
	};
	const handleSubmitSearchByLevel = (e) => {
		setSearchValue({ ...searchValue, teacherName: e.target.value });
	};
	const handleSubmitSearchByYear = (e) => {
		setSearchValue({ ...searchValue, teacherName: e.target.value });
	};
	const handleSubmitSearchByTeacherName = (e) => {
		setSearchValue({ ...searchValue, teacherName: e.target.value });
	};
	useEffect(() => {
		setClassListData(
			classListDataApi?.items?.filter(
				(item) =>
					item.name
						.toLowerCase()
						.includes(searchValue.name.toLowerCase()) &&
					item.roomCode
						.toLowerCase()
						.includes(searchValue.room.toLowerCase()) &&
					item.formTeacher.firstName
						.concat(item.formTeacher.lastName)
						.toLowerCase()
						.includes(searchValue.teacherName.toLowerCase()) &&
					item.academicYear.name
						.toString()
						.toLowerCase()
						.includes(searchValue.year.toLowerCase()) &&
					item.level.levelNumber
						.toString()
						.toLowerCase()
						.includes(searchValue.level.toLowerCase())
			)
		);
	}, [searchValue, classListDataApi]);

	//new class
	const [activeAddNewClass, setActiveAddNewClass] = useState(false);

	return (
		<div className="w-[1200px] flex flex-col mb-10">
			<div className="flex justify-between items-center mb-2">
				<Typography className="text-lg text-text font-semibold my-2">
					Danh sách lớp
				</Typography>
				{/* thêm tổ mới */}
				<Button
					color="indigo"
					className="py-2 px-4 bg-main/70"
					disabled={activeAddNewClass || isError}
					onClick={() => setActiveAddNewClass(true)}
				>
					<PlusIcon className="size-5" />
				</Button>
			</div>
			<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
				{/* đề mục  */}
				<div className="w-full grid grid-cols-[60px_100px_100px_100px_100px_1fr_100px_100px_100px] gap-4 p-4 pt-3 pb-2 border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
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
								e.keyCode === 13 && handleSubmitSearchByName(e)
							}
							onBlur={(e) => handleSubmitSearchByName(e)}
						></input>
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						<span>Phòng</span>
						<input
							type="text"
							spellCheck="false"
							className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
							onKeyDown={(e) =>
								e.keyCode === 13 && handleSubmitSearchByRoom(e)
							}
							onBlur={(e) => handleSubmitSearchByRoom(e)}
						></input>
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						<span>Khối</span>
						<input
							type="text"
							spellCheck="false"
							className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
							onKeyDown={(e) =>
								e.keyCode === 13 && handleSubmitSearchByLevel(e)
							}
							onBlur={(e) => handleSubmitSearchByLevel(e)}
						></input>
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						<span>Năm học</span>
						<input
							type="text"
							spellCheck="false"
							className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
							onKeyDown={(e) =>
								e.keyCode === 13 && handleSubmitSearchByYear(e)
							}
							onBlur={(e) => handleSubmitSearchByYear(e)}
						></input>
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
						<span>Chủ nhiệm</span>
						<input
							type="text"
							spellCheck="false"
							className="h-min w-full font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
							onKeyDown={(e) =>
								e.keyCode === 13 &&
								handleSubmitSearchByTeacherName(e)
							}
							onBlur={(e) => handleSubmitSearchByTeacherName(e)}
						></input>
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center">
						Sĩ số
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center">
						Trạng thái
					</Typography>
					<Typography className="whitespace-nowrap font-bold text-sm text-center">
						Thao tác
					</Typography>
				</div>
				{isLoading && <ListLoading value={8} />}
				{classListData?.length === 0 && !activeAddNewClass && (
					<EmptyItem content={'Danh sách trống'} />
				)}
				{isError && <EmptyItem content={'Đã có lỗi xảy ra'} />}
				{/* thêm mới  */}
				<NewClass
					isActive={activeAddNewClass}
					setActive={setActiveAddNewClass}
				/>
				{/* danh sách lớp  */}
				{classListData?.map((classItem, index, arr) => (
					<ClassItem
						className={`w-full grid grid-cols-[60px_100px_100px_100px_100px_1fr_100px_100px_100px] gap-4 py-3 px-4 border-b-[1px] border-solid border-gray-300 hover:bg-main/20 ${
							index === arr.length - 1 && 'border-none'
						} ${index % 2 === 0 && 'bg-main/5'}`}
						key={classItem?.id}
						data={classItem}
						index={(active - 1) * NUMBER_ITEM_PER_PAGE + index + 1}
					/>
				))}
				{classListData?.length > 0 && (
					<Pagination
						active={active}
						lengthOfPage={lengthOfPage}
						total={classListDataApi?.totalItems}
					/>
				)}
			</div>
		</div>
	);
};

export default ManageClassesPage;
