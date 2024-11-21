import React, { useEffect, useState } from 'react';
import LargeWrapper from '../../layouts/LargeWrapper';
import { Button, Typography } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import DepartmentItem from '../../components/admin/department/DepartmentItem';
import NewDepartment from '../../components/admin/department/NewDepartment';
import { useGetDepartmentsQuery } from '../../services/department/departmentApiSlice';
import { NUMBER_ITEM_PER_PAGE } from '../../config/constants';
import ListLoading from '../../components/loading/ListLoading';
import EmptyItem from '../../components/empty/EmptyItem';
import { Pagination } from '../../components/pagination/Pagination';
import { useQuery } from '../../hooks/useQuery';

const ManageDepartmentsPage = () => {
	const query = useQuery();
	const [active, setActive] = useState(1);
	useEffect(() => {
		setActive(query.get('page'));
	}, [query]);

	const {
		data: departmentListDataApi,
		isLoading,
		isError,
	} = useGetDepartmentsQuery({
		page: active - 1,
		quantity: NUMBER_ITEM_PER_PAGE,
	});
	const [departmentListData, setDepartmentListData] = useState(null);
	useEffect(() => {
		if (departmentListDataApi)
			setDepartmentListData(departmentListDataApi.items);
	}, [departmentListDataApi]);

	//pagination
	const lengthOfPage = Math.ceil(
		departmentListDataApi?.totalItems / NUMBER_ITEM_PER_PAGE
	);

	//filter
	const [searchValue, setSearchValue] = useState({
		name: '',
		headTeacher: '',
	});
	const handleSubmitSearchByName = (e) => {
		setSearchValue({ ...searchValue, name: e.target.value });
	};
	const handleSubmitSearchByHeadTeacher = (e) => {
		setSearchValue({ ...searchValue, headTeacher: e.target.value });
	};

	useEffect(() => {
		setDepartmentListData(
			departmentListDataApi?.items?.filter(
				(item) =>
					item?.name
						.toLowerCase()
						.includes(searchValue.name.toLowerCase()) &&
					item?.headTeacher?.firstName
						.concat(item?.headTeacher?.lastNamw)
						.toLowerCase()
						.includes(searchValue.headTeacher.toLowerCase())
			)
		);
	}, [searchValue, departmentListDataApi]);

	//new department
	const [activeAddNewDepartment, setActiveAddNewDepartment] = useState(false);

	return (
		<LargeWrapper>
			<div className="w-[1200px] flex flex-col mb-10">
				<div className="flex justify-between items-center mb-2">
					<Typography className="text-lg text-text font-semibold my-2">
						Danh sách tổ bộ môn
					</Typography>
					{/* thêm tổ mới */}
					<Button
						color="indigo"
						className="py-2 px-4 bg-main/70"
						disabled={activeAddNewDepartment || isError}
						onClick={() => setActiveAddNewDepartment(true)}
					>
						<PlusIcon className="size-5" />
					</Button>
				</div>
				<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
					{/* đề mục  */}
					<div className="w-full grid grid-cols-[80px_repeat(4,1fr)_180px] gap-4 p-4 py-3 border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							STT
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
							<span>Tổ</span>
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
							<span>Tổ trưởng</span>
							<input
								type="text"
								spellCheck="false"
								className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
								onKeyDown={(e) =>
									e.keyCode === 13 &&
									handleSubmitSearchByHeadTeacher(e)
								}
								onBlur={(e) =>
									handleSubmitSearchByHeadTeacher(e)
								}
							></input>
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center col-span-2">
							Mô tả
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Thao tác
						</Typography>
					</div>
					{isLoading && <ListLoading value={8} />}
					{departmentListData?.length === 0 &&
						!activeAddNewDepartment && (
							<EmptyItem content={'Danh sách trống'} />
						)}
					{isError && <EmptyItem content={'Đã có lỗi xảy ra'} />}

					{/* thêm mới  */}
					<NewDepartment
						isActive={activeAddNewDepartment}
						setActive={setActiveAddNewDepartment}
					/>
					{/* danh sách phòng ban  */}
					{departmentListData?.map((departmentItem, index, arr) => (
						<DepartmentItem
							className={`w-full grid grid-cols-[80px_repeat(4,1fr)_180px] gap-4 p-3 border-b-[1px] border-solid border-gray-300 hover:bg-main/20 place-items-center ${
								index === arr.length - 1 && 'border-none'
							} ${index % 2 === 0 && 'bg-main/5'}`}
							key={departmentItem?.id}
							data={departmentItem}
							index={
								(active - 1) * NUMBER_ITEM_PER_PAGE + index + 1
							}
						/>
					))}
					{departmentListData?.length > 0 && (
						<Pagination
							active={active}
							lengthOfPage={lengthOfPage}
							total={departmentListDataApi?.totalItems}
						/>
					)}
				</div>
			</div>
		</LargeWrapper>
	);
};

export default ManageDepartmentsPage;
