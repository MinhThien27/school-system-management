import { Button, Spinner, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import {
	// ArrowRightStartOnRectangleIcon,
	CheckIcon,
	PencilSquareIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import { ConfirmDialog } from '../../comfirm/ConfirmDialog';
import useConfirmDialog from '../../../hooks/useConfirmDialog';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import {
	useDeleteLevelMutation,
	useEditLevelSubjectsMutation,
	useGetLevelSubjectsQuery,
} from '../../../services/level/levelApiSlice';
import LevelSubjects from './LevelSubjects';
import SpinnerLoading from '../../loading/SpinnerLoading';

const LevelItem = ({ data }) => {
	const [levelData, setLevelData] = useState(null);
	useEffect(() => {
		if (data) setLevelData(data);
	}, [data]);
	const dispatch = useDispatch();

	//danh sách môn
	const { data: levelSubjectsApi, isLoading: levelSubjectsLoading } =
		useGetLevelSubjectsQuery(data.id);
	const [levelSubjects, setLevelSubjects] = useState(null);
	useEffect(() => {
		if (levelSubjectsApi)
			setLevelSubjects(
				levelSubjectsApi?.items
					?.filter(
						(obj, index, self) =>
							index ===
							self.findIndex(
								(t) => t.subject.id === obj.subject.id
							)
					)
					?.map((subject) => ({
						...subject?.subject,
						isRemove: false,
					}))
			);
	}, [levelSubjectsApi]);

	//chỉnh sửa môn
	const [isEditLevel, setIsEditLevel] = useState(false);
	const handleRemoveSubject = (id) => {
		setLevelSubjects((prev) =>
			prev.map((s) => {
				return s.id === id ? { ...s, isRemove: true } : s;
			})
		);
	};
	const handleAddSubject = (subject) => {
		setLevelSubjects((prev) => {
			if (prev.map((s) => s.id).includes(subject.id)) {
				return prev.map((s) => {
					return s.id === subject.id ? { ...s, isRemove: false } : s;
				});
			}
			return [...prev, { ...subject, isRemove: false }];
		});
	};

	const [editLevelSubjects, { isLoading: editLoading }] =
		useEditLevelSubjectsMutation();

	const handleSaveLevelSubjects = async () => {
		try {
			await editLevelSubjects({
				id: data.id,
				body: levelSubjects
					.filter((s) => s.isRemove === false)
					.map((s) => [
						{ subjectId: s.id, semesterNumber: 1 },
						{ subjectId: s.id, semesterNumber: 2 },
					])
					.flat(),
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsEditLevel(false);
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

	//xóa khối
	const [deleteLevel, { isLoading: deleteLoading }] =
		useDeleteLevelMutation();
	const [openConfirmDeleteDialogState, toggleDeleteDialog] =
		useConfirmDialog(false);

	const handleDeleteLevel = async () => {
		toggleDeleteDialog();
		try {
			await deleteLevel({ deleteId: levelData.id }).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã xóa thành công!',
				})
			);
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
			className={`w-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center ${
				isEditLevel && 'shadow-top'
			}`}
		>
			<div className="w-full h-full flex flex-row relative">
				<div className="flex flex-col py-3 w-full border-solid border-l-[1px] border-gray-300 relative">
					<div className="flex flex-row gap-2 py-2 ml-8">
						<Typography className="text-lg font-normal whitespace-nowrap">
							Khối:
						</Typography>
						<Typography className="text-xl font-bold text-blue-900">
							{levelData?.levelNumber}&nbsp;
						</Typography>
					</div>
					{/* <hr className="border-gray-300 mb-4" /> */}
					{/* môn  */}
					{levelSubjectsLoading && (
						<div className="w-full absolute h-full z-10 top-0">
							<SpinnerLoading className={'min-h-full'} />
						</div>
					)}
					<LevelSubjects
						data={levelSubjects}
						isEdit={isEditLevel}
						remove={handleRemoveSubject}
						add={handleAddSubject}
					/>
					{/* thao tác  */}
					{isEditLevel && (
						<div className="w-full flex justify-center items-center gap-4 mb-1 col-start-2">
							{/* <Button className="bg-main/30 rounded-md hover:opacity-80 px-3 text-main flex gap-1 items-center">
								Chuyển
								<ArrowRightStartOnRectangleIcon className="size-4 mb-[1px]" />
							</Button> */}
							<Button
								className="bg-error/30 rounded-md hover:opacity-80 px-4 py-2 text-error flex gap-1 items-center"
								onClick={toggleDeleteDialog}
							>
								{deleteLoading ? (
									<Spinner color="red" className="size-4" />
								) : (
									<>
										Xóa
										<TrashIcon className="size-4 mb-[2px]" />
									</>
								)}
							</Button>
						</div>
					)}
				</div>
				{isEditLevel ? (
					<div className="flex flex-col">
						<Button
							className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
							onClick={() =>
								setLevelSubjects(
									levelSubjectsApi?.items
										?.filter(
											(obj, index, self) =>
												index ===
												self.findIndex(
													(t) =>
														t.subject.id ===
														obj.subject.id
												)
										)
										?.map((subject) => ({
											...subject?.subject,
											isRemove: false,
										}))
								) || setIsEditLevel(false)
							}
							disabled={editLoading}
						>
							<XMarkIcon className="size-5 text-error" />
						</Button>
						<Button
							className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
							onClick={handleSaveLevelSubjects}
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
						onClick={() => setIsEditLevel(true)}
					>
						<PencilSquareIcon className="size-5 text-main" />
					</Button>
				)}
				{editLoading && <div className="absolute w-full h-full"></div>}
			</div>
			{/* xác nhận xóa  */}
			<ConfirmDialog
				open={openConfirmDeleteDialogState}
				toggle={toggleDeleteDialog}
				type={'Err'}
				header={
					<Typography className="text-error text-2xl p-4 pb-0 font-bold text-center">
						Xóa khối này?
					</Typography>
				}
				content={
					'Thao tác này sẽ không thể khôi phục. Bạn có muốn tiếp tục?'
				}
				confirmButton={
					<Button
						className="bg-error text-textWhite"
						onClick={handleDeleteLevel}
					>
						Xác nhận
					</Button>
				}
			/>
		</div>
	);
};

export default LevelItem;
