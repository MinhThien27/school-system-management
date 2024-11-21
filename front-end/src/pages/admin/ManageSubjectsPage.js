import React, { useEffect, useState } from 'react';
import LargeWrapper from '../../layouts/LargeWrapper';
import { Button, Typography } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { NUMBER_ITEM_PER_PAGE } from '../../config/constants';
import { useGetSubjectsQuery } from '../../services/subject/subjectApiSlice';
import SubjectItem from '../../components/admin/subject/SubjectItem';
import ListLoading from '../../components/loading/ListLoading';
import NewSubject from '../../components/admin/subject/NewSubject';
import { Pagination } from '../../components/pagination/Pagination';
import EmptyItem from '../../components/empty/EmptyItem';
import { useQuery } from '../../hooks/useQuery';

const ManageSubjectsPage = () => {
	const query = useQuery();
	const [active, setActive] = useState(1);
	useEffect(() => {
		setActive(query.get('page'));
	}, [query]);

	const {
		data: subjectListDataApi,
		isLoading,
		isError,
	} = useGetSubjectsQuery({
		page: active - 1,
		quantity: NUMBER_ITEM_PER_PAGE,
	});
	const [subjectListData, setSubjectListData] = useState(null);
	useEffect(() => {
		if (subjectListDataApi) setSubjectListData(subjectListDataApi.items);
	}, [subjectListDataApi]);

	//pagination
	const lengthOfPage = Math.ceil(
		subjectListDataApi?.totalItems / NUMBER_ITEM_PER_PAGE
	);

	//filter
	const [searchValue, setSearchValue] = useState({
		subjectName: '',
	});
	const handleSubmitSearchBySubjectName = (e) => {
		setSearchValue({ ...searchValue, subjectName: e.target.value });
	};

	useEffect(() => {
		setSubjectListData(
			subjectListDataApi?.items?.filter((item) =>
				item.name
					.toLowerCase()
					.includes(searchValue.subjectName.toLowerCase())
			)
		);
	}, [searchValue, subjectListDataApi]);

	//new subject
	const [activeAddNewSubject, setActiveAddNewSubject] = useState(false);

	return (
		<LargeWrapper>
			<div className="w-[1200px] flex flex-col mb-10">
				<div className="flex justify-between items-center mb-2">
					<Typography className="text-lg text-text font-semibold my-2">
						Danh sách môn học
					</Typography>
					{/* thêm kỳ mới */}
					<Button
						color="indigo"
						className="py-2 px-4 bg-main/70"
						disabled={activeAddNewSubject || isError}
						onClick={() => setActiveAddNewSubject(true)}
					>
						<PlusIcon className="size-5" />
					</Button>
				</div>
				<div className="w-full h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
					{/* đề mục  */}
					<div className="w-full grid grid-cols-[80px_repeat(5,1fr)] gap-4 p-4 py-3 border-b-[1px] border-solid border-gray-400 bg-main/30 rounded-t-md">
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
							STT
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center flex flex-col items-center">
							<span>Môn</span>
							<input
								type="text"
								spellCheck="false"
								className="h-min w-[70%] font-sans text-center transition-all text-sm font-semibold leading-4 outline-none shadow-none bg-white/50 py-1 px-2 mt-1 text-text  border-[1px] border-solid border-gray-500 rounded-md focus:border-white"
								onKeyDown={(e) =>
									e.keyCode === 13 &&
									handleSubmitSearchBySubjectName(e)
								}
								onBlur={(e) =>
									handleSubmitSearchBySubjectName(e)
								}
							></input>
						</Typography>
						<Typography className="whitespace-nowrap col-span-2 font-bold text-sm text-center">
							Mô tả
						</Typography>
						<Typography className="whitespace-nowrap font-bold text-sm text-center">
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

					{/* thêm mới  */}
					<NewSubject
						isActive={activeAddNewSubject}
						setActive={setActiveAddNewSubject}
					/>
					{/* danh sách môn  */}
					{subjectListData?.map((subjectItem, index, arr) => (
						<SubjectItem
							className={`w-full grid grid-cols-[80px_repeat(5,1fr)] gap-4 p-3 border-b-[1px] border-solid border-gray-300 hover:bg-main/20  ${
								index === arr.length - 1 && 'border-none'
							} ${index % 2 === 0 && 'bg-main/5'}`}
							key={subjectItem.id}
							data={subjectItem}
							index={
								(active - 1) * NUMBER_ITEM_PER_PAGE + index + 1
							}
						/>
					))}
					{subjectListData?.length > 0 && (
						<Pagination
							active={active}
							lengthOfPage={lengthOfPage}
							total={subjectListDataApi?.totalItems}
						/>
					)}
				</div>
			</div>
		</LargeWrapper>
	);
};

export default ManageSubjectsPage;
