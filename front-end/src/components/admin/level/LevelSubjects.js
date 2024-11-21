import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import {
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Typography,
	Spinner,
} from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useGetSubjectsQuery } from '../../../services/subject/subjectApiSlice';

const LevelSubjects = ({ data, isEdit, remove, add }) => {
	const [levelSubjects, setLevelSubjects] = useState(null);
	useEffect(() => {
		if (data) setLevelSubjects(data);
	}, [data]);

	//danh sách môn có thể thêm
	const { data: subjectListDataApi, isLoading: subjectListLoading } =
		useGetSubjectsQuery({
			page: 0,
			quantity: 100,
		});
	const [subjectListData, setSubjectListData] = useState(null);
	useEffect(() => {
		if (subjectListDataApi)
			setSubjectListData(
				subjectListDataApi.items.filter((s) => s.status === 'Active')
			);
	}, [subjectListDataApi]);

	useEffect(() => {
		if (levelSubjects && subjectListDataApi?.items) {
			const levelSubjectsIdList = levelSubjects
				.filter((s) => s.isRemove === false)
				.map((s) => s.id);
			setSubjectListData(
				subjectListDataApi.items.filter(
					(s) =>
						!levelSubjectsIdList.includes(s.id) &&
						s.status === 'Active'
				)
			);
		}
	}, [levelSubjects, subjectListDataApi?.items]);

	return (
		<div className="mx-8 mb-2 bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row relative">
			<Typography className="absolute -top-2 right-3 bg-inherit px-2 font-medium text-xs uppercase">
				Môn bắt buộc
			</Typography>
			{isEdit ? (
				<div className="flex flex-col px-6 py-5 w-full justify-center items-center">
					{levelSubjects?.length > 0 ? (
						<div className="w-full h-full ">
							{levelSubjects
								.filter((s) => s.isRemove === false)
								.map((subject) => (
									<div
										key={subject.id}
										className="w-fit h-fit bg-main/85 text-white py-1 px-2 rounded-md shadow-lg shadow-gray-400 inline-flex flex-row items-center gap-1 mr-4 mb-3"
									>
										<Typography className=" font-medium text-sm ">
											{subject?.name}&nbsp;
										</Typography>
										<TrashIcon
											className="size-5 hover:text-error cursor-pointer"
											onClick={() => remove(subject.id)}
										/>
									</div>
								))}

							{subjectListData && subjectListData.length > 0 && (
								<Menu placement="bottom" allowHover>
									<MenuHandler>
										<div className="w-fit h-fit inline-block bg-main/85 text-white py-1 px-2 rounded-md shadow-lg shadow-gray-400 mr-4 -mb-2 aria-expanded:bg-main/70">
											{subjectListLoading ? (
												<Spinner
													className="size-4"
													color="indigo"
												/>
											) : (
												<PlusIcon className="size-5" />
											)}
										</div>
									</MenuHandler>
									<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
										{subjectListData?.map(
											(subject, index, arr) => (
												<MenuItem
													key={subject.id}
													onClick={() => add(subject)}
													className={`py-1 px-3 rounded-none ${
														index !==
															arr.length - 1 &&
														'border-b-[1px] border-solid border-gray-300'
													}`}
												>
													<Typography className="text-sm font-medium text-text">
														{subject.name}&nbsp;
													</Typography>
												</MenuItem>
											)
										)}
									</MenuList>
								</Menu>
							)}
						</div>
					) : (
						subjectListData &&
						subjectListData.length > 0 && (
							<Menu placement="bottom" allowHover>
								<MenuHandler>
									<div className="w-fit h-fit inline-block bg-main/85 text-white py-1 px-2 rounded-md shadow-lg shadow-gray-400 mr-4 -mb-2 aria-expanded:bg-main/70">
										{subjectListLoading ? (
											<Spinner
												className="size-4"
												color="indigo"
											/>
										) : (
											<PlusIcon className="size-5" />
										)}
									</div>
								</MenuHandler>
								<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
									{subjectListData?.map(
										(subject, index, arr) => (
											<MenuItem
												key={subject.id}
												onClick={() => add(subject)}
												className={`py-1 px-3 rounded-none ${
													index !== arr.length - 1 &&
													'border-b-[1px] border-solid border-gray-300'
												}`}
											>
												<Typography className="text-sm font-medium text-text">
													{subject.name}&nbsp;
												</Typography>
											</MenuItem>
										)
									)}
								</MenuList>
							</Menu>
						)
					)}
				</div>
			) : (
				<div className="flex flex-col px-6 py-5 w-full justify-center items-center ">
					{levelSubjects && levelSubjects?.length > 0 ? (
						<div className="w-full h-full">
							{levelSubjects
								.filter((s) => s.isRemove === false)
								.map((subject) => (
									<Typography
										key={subject.id}
										className="w-fit h-fit inline-block font-medium text-sm bg-main/85 text-white py-1 px-2 rounded-md shadow-md shadow-gray-400 mr-4 mb-3"
									>
										{subject?.name}&nbsp;
									</Typography>
								))}
						</div>
					) : (
						<Typography className="text-base font-medium">
							Hiện chưa có môn học
						</Typography>
					)}
				</div>
			)}
		</div>
	);
};

export default LevelSubjects;
