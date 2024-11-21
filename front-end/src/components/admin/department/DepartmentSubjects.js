import {
	CheckIcon,
	PencilSquareIcon,
	PlusIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import {
	Button,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Spinner,
	Typography,
} from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import {
	useEditDepartmentSubjectsMutation,
	useGetDepartmentSubjectsQuery,
} from '../../../services/department/departmentApiSlice';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import { useParams } from 'react-router-dom';
import SpinnerLoading from '../../loading/SpinnerLoading';
import { useGetSubjectsQuery } from '../../../services/subject/subjectApiSlice';

const DepartmentSubjects = () => {
	const { departmentId } = useParams();
	const dispatch = useDispatch();
	const [isEditDepartmentSubjects, setIsEditDepartmentSubjects] =
		useState(false);

	//danh sách môn của phòng
	const {
		data: departmentSubjectsApi,
		isError: departmentSubjectsError,
		isLoading: departmentSubjectsLoading,
	} = useGetDepartmentSubjectsQuery(departmentId);
	const [departmentSubjects, setDepartmentSubjects] = useState(null);
	useEffect(() => {
		if (departmentSubjectsApi)
			setDepartmentSubjects(
				departmentSubjectsApi?.items?.map((subject) => ({
					...subject?.subject,
					isRemove: false,
				}))
			);
	}, [departmentSubjectsApi]);

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
		if (departmentSubjects && subjectListDataApi?.items) {
			const departmentSubjectsIdList = departmentSubjects
				.filter((s) => s.isRemove === false)
				.map((s) => s.id);
			setSubjectListData(
				subjectListDataApi.items.filter(
					(s) =>
						!departmentSubjectsIdList.includes(s.id) &&
						s.status === 'Active'
				)
			);
		}
	}, [departmentSubjects, subjectListDataApi?.items]);

	//chỉnh sửa
	const handleRemoveSubject = (id) => {
		setDepartmentSubjects((prev) =>
			prev.map((s) => {
				return s.id === id ? { ...s, isRemove: true } : s;
			})
		);
	};
	const handleAddSubject = (subject) => {
		setDepartmentSubjects((prev) => {
			if (prev.map((s) => s.id).includes(subject.id)) {
				return prev.map((s) => {
					return s.id === subject.id ? { ...s, isRemove: false } : s;
				});
			}
			return [...prev, { ...subject, isRemove: false }];
		});
	};

	const [editDepartmentSubjects, { isLoading: editLoading }] =
		useEditDepartmentSubjectsMutation();

	const handleSaveDepartmentInfo = async () => {
		try {
			await editDepartmentSubjects({
				id: departmentId,
				body: departmentSubjects
					.filter((s) => s.isRemove === false)
					.map((s) => s.id),
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsEditDepartmentSubjects(false);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Sai thông tin';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	return (
		<div
			className={`w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row relative ${
				isEditDepartmentSubjects && 'shadow-top'
			}`}
		>
			{departmentSubjectsLoading && (
				<div className="w-full absolute h-full">
					<SpinnerLoading className={'min-h-full'} />
				</div>
			)}
			{isEditDepartmentSubjects ? (
				//chỉnh sửa
				<div className="flex flex-col px-8 py-5 w-full justify-center items-center">
					{departmentSubjects?.length > 0 ? (
						<div className="w-full h-full">
							{departmentSubjects
								.filter((s) => s.isRemove === false)
								.map((subject) => (
									<div
										key={subject.id}
										className="w-fit h-fit bg-main/85 text-white py-1 px-2 rounded-md shadow-lg shadow-gray-400 inline-flex flex-row items-center mr-4 mb-4"
									>
										<Typography className=" font-medium text-sm ">
											{subject?.name}&nbsp;
										</Typography>
										<TrashIcon
											className="size-5 hover:text-error cursor-pointer"
											onClick={() =>
												handleRemoveSubject(subject?.id)
											}
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
													onClick={() =>
														handleAddSubject(
															subject
														)
													}
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
												onClick={() =>
													handleAddSubject(subject)
												}
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
				// danh sách
				<div className="flex flex-col px-8 py-5 w-full justify-center items-center ">
					{departmentSubjects?.length > 0 &&
					!departmentSubjectsLoading ? (
						<div className="w-full h-full ">
							{departmentSubjects
								.filter((s) => s.isRemove === false)
								.map((subject) => (
									<Typography
										key={subject.id}
										className="w-fit h-fit inline-block font-medium text-sm bg-main/85 text-white py-1 px-2 rounded-md shadow-lg shadow-gray-400 mr-4 mb-4"
									>
										{subject?.name}&nbsp;
									</Typography>
								))}
						</div>
					) : (
						<Typography
							className={`text-base font-medium ${
								departmentSubjectsLoading && 'hidden'
							}`}
						>
							Hiện chưa có môn học
						</Typography>
					)}
				</div>
			)}
			{departmentSubjectsError && (
				<Typography
					className={`w-full h-min py-4 bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center mb-4`}
				>
					Đã có lỗi xảy ra!
				</Typography>
			)}
			{/* button  */}
			{isEditDepartmentSubjects ? (
				<div className="flex flex-col">
					<Button
						className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() =>
							setDepartmentSubjects(
								departmentSubjectsApi?.items?.map(
									(subject) => ({
										...subject.subject,
										isRemove: false,
									})
								)
							) || setIsEditDepartmentSubjects(false)
						}
						disabled={editLoading}
					>
						<XMarkIcon className="size-5 text-error" />
					</Button>
					<Button
						className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
						onClick={handleSaveDepartmentInfo}
						disabled={editLoading}
					>
						{editLoading ? (
							<Spinner color="indigo" className="size-5" />
						) : (
							<CheckIcon className="size-5 text-main" />
						)}
					</Button>
				</div>
			) : (
				<Button
					className="bg-main/30 rounded-md rounded-l-none hover:opacity-80 px-3"
					onClick={() => setIsEditDepartmentSubjects(true)}
				>
					<PencilSquareIcon className="size-5 text-main" />
				</Button>
			)}
			{editLoading && <div className="absolute w-full h-full"></div>}
		</div>
	);
};

export default DepartmentSubjects;
