import React, { useEffect, useState } from 'react';
import LargeWrapper from '../../layouts/LargeWrapper';
import { Button, Typography } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { NUMBER_ITEM_PER_PAGE } from '../../config/constants';
import ListLoading from '../../components/loading/ListLoading';
import AcademyYearItem from '../../components/admin/academy-year/AcademyYearItem';
import { useGetAcademyYearsQuery } from '../../services/academy-year/academyYearApiSlice';
import NewAcademyYear from '../../components/admin/academy-year/NewAcademyYear';
import EmptyItem from '../../components/empty/EmptyItem';
import { Pagination } from '../../components/pagination/Pagination';
import { useQuery } from '../../hooks/useQuery';

const ManageAcademyYearsPage = () => {
	const query = useQuery();
	const [active, setActive] = useState(1);
	useEffect(() => {
		setActive(query.get('page'));
	}, [query]);

	const {
		data: academyYearListDataApi,
		isLoading,
		isError,
	} = useGetAcademyYearsQuery({
		page: active - 1,
		quantity: NUMBER_ITEM_PER_PAGE,
	});
	const [academyYearListData, setAcademyYearListData] = useState(null);
	useEffect(() => {
		if (academyYearListDataApi)
			setAcademyYearListData(academyYearListDataApi.items);
	}, [academyYearListDataApi]);

	//pagination
	const lengthOfPage = Math.ceil(
		academyYearListDataApi?.totalItems / NUMBER_ITEM_PER_PAGE
	);

	//new
	const [activeAddNewAcademyYear, setActiveAddNewAcademyYear] =
		useState(false);

	return (
		<LargeWrapper>
			<div className="w-[1200px] flex flex-col mb-10">
				<div className="flex justify-between items-center mb-2">
					<Typography className="text-lg text-text font-semibold my-2">
						Danh sách năm học
					</Typography>
					{/* thêm kỳ mới */}
					<Button
						color="indigo"
						className="py-2 px-4 bg-main/70"
						disabled={activeAddNewAcademyYear || isError}
						onClick={() => setActiveAddNewAcademyYear(true)}
					>
						<PlusIcon className="size-5" />
					</Button>
				</div>
				<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
					{/* đề mục  */}
					<div className="w-full grid grid-cols-[100px_repeat(3,1fr)_140px_140px] gap-4 p-4 pt-3 pb-2 border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							STT
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
							<span>Tên</span>
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Ngày bắt đầu
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Ngày kết thúc
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Trạng thái
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							Thao tác
						</Typography>
					</div>
					{isLoading && <ListLoading value={8} />}
					{isError && <EmptyItem content={'Đã có lỗi xảy ra'} />}

					{academyYearListData?.length === 0 &&
						!activeAddNewAcademyYear && (
							<EmptyItem content={'Danh sách trống'} />
						)}
					{/* thêm mới  */}

					<NewAcademyYear
						isActive={activeAddNewAcademyYear}
						setActive={setActiveAddNewAcademyYear}
					/>
					{/* danh sách  */}
					{academyYearListData?.map((semesterItem, index, arr) => (
						<AcademyYearItem
							className={`w-full grid grid-cols-[100px_repeat(3,1fr)_140px_140px] gap-4 p-3 border-b-[1px] border-solid border-gray-300 hover:bg-main/20  ${
								index === arr.length - 1 && 'border-none '
							} ${index % 2 === 0 && 'bg-main/5'}`}
							key={semesterItem.id}
							data={semesterItem}
							index={
								(active - 1) * NUMBER_ITEM_PER_PAGE + index + 1
							}
						/>
					))}
					{academyYearListData?.length > 0 && (
						<Pagination
							active={active}
							lengthOfPage={lengthOfPage}
							total={academyYearListDataApi?.totalItems}
						/>
					)}
				</div>
			</div>
		</LargeWrapper>
	);
};

export default ManageAcademyYearsPage;
