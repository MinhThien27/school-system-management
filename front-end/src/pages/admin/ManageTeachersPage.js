import React, { useEffect, useState } from 'react';
import LargeWrapper from '../../layouts/LargeWrapper';
import { Button, Typography } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import TeacherItem from '../../components/admin/teacher/TeacherItem';
import NewTeacher from '../../components/admin/teacher/NewTeacher';
import { useGetTeachersQuery } from '../../services/teacher/teacherApiSlice';
import ListLoading from '../../components/loading/ListLoading';
import EmptyItem from '../../components/empty/EmptyItem';
import { Pagination } from '../../components/pagination/Pagination';
import { NUMBER_ITEM_PER_PAGE } from '../../config/constants';
import { useQuery } from '../../hooks/useQuery';

const ManageTeachersPage = () => {
	const query = useQuery();
	const [active, setActive] = useState(1);
	useEffect(() => {
		setActive(query.get('page'));
	}, [query]);

	const {
		data: teacherListDataApi,
		isLoading,
		isError,
	} = useGetTeachersQuery({
		page: active - 1,
		quantity: NUMBER_ITEM_PER_PAGE,
	});
	const [teacherListData, setTeacherListData] = useState(null);
	useEffect(() => {
		if (teacherListDataApi) setTeacherListData(teacherListDataApi.items);
	}, [teacherListDataApi]);

	//pagination
	const lengthOfPage = Math.ceil(
		teacherListDataApi?.totalItems / NUMBER_ITEM_PER_PAGE
	);

	//filter
	const [searchValue, setSearchValue] = useState({
		name: '',
		citizenIdentification: '',
		email: '',
		phone: '',
		department: '',
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
	const handleSubmitSearchByDepartment = (e) => {
		setSearchValue({ ...searchValue, department: e.target.value });
	};

	useEffect(() => {
		setTeacherListData(
			teacherListDataApi?.items
				?.filter(
					(item) =>
						item.firstName
							.concat(item.lastName)
							.toLowerCase()
							.includes(searchValue.name.toLowerCase()) &&
						item.user.email
							.toLowerCase()
							.includes(searchValue.email.toLowerCase()) &&
						item.user.phoneNumber
							.toLowerCase()
							.includes(searchValue.phone.toLowerCase())
				)
				.filter((item) => {
					if (
						item.departmentTeachers.length === 0 &&
						searchValue.department === ''
					)
						return true;
					else {
						return item.departmentTeachers[0]?.department?.name
							.toLowerCase()
							.includes(searchValue.department.toLowerCase());
					}
				})
		);
	}, [searchValue, teacherListDataApi]);

	//new
	const [activeAddNewTeacher, setActiveAddNewTeacher] = useState(false);

	return (
		<LargeWrapper>
			<div className="w-[1200px] flex flex-col mb-4">
				<div className="flex justify-between items-center mb-2">
					<Typography className="text-lg text-text font-semibold my-2">
						Danh sách giáo viên
					</Typography>
					{/* thêm giáo viên mới */}
					<Button
						color="indigo"
						className="py-2 px-4 bg-main/70"
						disabled={activeAddNewTeacher || isError}
						onClick={() => setActiveAddNewTeacher(true)}
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
							<span>Phòng ban</span>
							<input
								type="text"
								spellCheck="false"
								className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
								onKeyDown={(e) =>
									e.keyCode === 13 &&
									handleSubmitSearchByDepartment(e)
								}
								onBlur={(e) =>
									handleSubmitSearchByDepartment(e)
								}
							></input>
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Thao tác
						</Typography>
					</div>
					{isLoading && <ListLoading value={8} />}
					{teacherListData?.length === 0 && (
						<EmptyItem content={'Danh sách trống'} />
					)}
					{isError && <EmptyItem content={'Đã có lỗi xảy ra'} />}

					{teacherListData?.map((teacher, index, arr) => (
						<TeacherItem
							className={`w-full grid grid-cols-[80px_repeat(4,1fr)_100px] gap-4 p-3 border-b-[1px] border-solid border-gray-300 hover:bg-main/20  ${
								index === arr.length - 1 && 'border-none'
							} ${index % 2 === 0 && 'bg-main/5'}`}
							key={teacher.id}
							data={teacher}
							index={
								(active - 1) * NUMBER_ITEM_PER_PAGE + index + 1
							}
						/>
					))}
					{teacherListData?.length > 0 && (
						<Pagination
							active={active}
							lengthOfPage={lengthOfPage}
							total={teacherListDataApi?.totalItems}
						/>
					)}
				</div>
			</div>
			<NewTeacher
				isActive={activeAddNewTeacher}
				toggleActive={() => setActiveAddNewTeacher((prev) => !prev)}
			/>
		</LargeWrapper>
	);
};

export default ManageTeachersPage;
