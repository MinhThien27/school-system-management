import React, { useEffect, useState } from 'react';
import LargeWrapper from '../../layouts/LargeWrapper';
import { Button, Typography } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import StudentItem from '../../components/admin/student/StudentItem';
import NewStudent from '../../components/admin/student/NewStudent';
import { useGetStudentsQuery } from '../../services/student/studentApiSlice';
import { NUMBER_ITEM_PER_PAGE } from '../../config/constants';
import ListLoading from '../../components/loading/ListLoading';
import EmptyItem from '../../components/empty/EmptyItem';
import { Pagination } from '../../components/pagination/Pagination';
import { useQuery } from '../../hooks/useQuery';

const ManageStudentsPage = () => {
	const query = useQuery();
	const [active, setActive] = useState(1);
	useEffect(() => {
		setActive(query.get('page'));
	}, [query]);

	const {
		data: studentListDataApi,
		isLoading,
		isError,
	} = useGetStudentsQuery({
		page: active - 1,
		quantity: NUMBER_ITEM_PER_PAGE,
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
		email: '',
		phone: '',
		class: '',
	});
	const handleSubmitSearchByName = (e) => {
		setSearchValue({ ...searchValue, name: e.target.value });
	};
	const handleSubmitSearchByEmail = (e) => {
		setSearchValue({ ...searchValue, email: e.target.value });
	};
	const handleSubmitSearchByPhone = (e) => {
		setSearchValue({ ...searchValue, phone: e.target.value });
	};
	const handleSubmitSearchByClass = (e) => {
		setSearchValue({ ...searchValue, class: e.target.value });
	};

	useEffect(() => {
		setStudentListData(
			studentListDataApi?.items
				?.filter(
					(item) =>
						item.firstName
							.concat(item.lastName)
							.toLowerCase()
							.includes(searchValue.name.toLowerCase()) &&
						item?.user.email
							.toLowerCase()
							.includes(searchValue.email.toLowerCase()) &&
						item.user.phoneNumber
							.toLowerCase()
							.includes(searchValue.phone.toLowerCase())
				)
				.filter((item) => {
					if (item.classStudents.length > 0) {
						return item.classStudents[0].class.name
							.toLowerCase()
							.includes(searchValue.class.toLowerCase());
					}
					return searchValue.class === '';
				})
		);
	}, [searchValue, studentListDataApi]);

	//new
	const [activeAddNewStudent, setActiveAddNewStudent] = useState(false);

	return (
		<LargeWrapper>
			<div className="w-[1200px] flex flex-col mb-10">
				<div className="flex justify-between items-center mb-2">
					<Typography className="text-lg text-text font-semibold my-2">
						Danh sách học sinh
					</Typography>
					{/* thêm học sinh mới */}
					<Button
						color="indigo"
						className="py-2 px-4 bg-main/70"
						disabled={activeAddNewStudent || isError}
						onClick={() => setActiveAddNewStudent(true)}
					>
						<PlusIcon className="size-5" />
					</Button>
				</div>
				<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
					{/* đề mục  */}
					<div className="w-full grid grid-cols-[80px_repeat(4,1fr)_100px] gap-4 p-4 pt-3 pb-2 border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
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
									e.keyCode === 13 &&
									handleSubmitSearchByName(e)
								}
								onBlur={(e) => handleSubmitSearchByName(e)}
							></input>
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
							<span>Email</span>
							<input
								type="text"
								spellCheck="false"
								className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
								onKeyDown={(e) =>
									e.keyCode === 13 &&
									handleSubmitSearchByEmail(e)
								}
								onBlur={(e) => handleSubmitSearchByEmail(e)}
							></input>
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
							<span>Số điện thoại</span>
							<input
								type="text"
								spellCheck="false"
								className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
								onKeyDown={(e) =>
									e.keyCode === 13 &&
									handleSubmitSearchByPhone(e)
								}
								onBlur={(e) => handleSubmitSearchByPhone(e)}
							></input>
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
							<span>Lớp</span>
							<input
								type="text"
								spellCheck="false"
								className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
								onKeyDown={(e) =>
									e.keyCode === 13 &&
									handleSubmitSearchByClass(e)
								}
								onBlur={(e) => handleSubmitSearchByClass(e)}
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

					{studentListData?.map((student, index, arr) => (
						<StudentItem
							className={`w-full grid grid-cols-[80px_repeat(4,1fr)_100px] gap-4 p-3 border-b-[1px] border-solid border-gray-300 hover:bg-main/20  ${
								index === arr.length - 1 && 'border-none'
							} ${index % 2 === 0 && 'bg-main/5'}`}
							key={student.id}
							data={student}
							index={
								(active - 1) * NUMBER_ITEM_PER_PAGE + index + 1
							}
						/>
					))}
					{studentListData?.length > 0 && (
						<Pagination
							active={active}
							lengthOfPage={lengthOfPage}
							total={studentListDataApi?.totalItems}
						/>
					)}
				</div>
				<NewStudent
					isActive={activeAddNewStudent}
					toggleActive={() => setActiveAddNewStudent((prev) => !prev)}
				/>
			</div>
		</LargeWrapper>
	);
};

export default ManageStudentsPage;
