import { Avatar, Button, Spinner } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useChangeTeacherAvatarMutation } from '../../../services/teacher/teacherApiSlice';
import { CheckIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { notify } from '../../../services/notification/notificationSlice';
import { IMAGE_FILE_TYPES, NOTIFY_STYLE } from '../../../config/constants';
import { FileUploader } from 'react-drag-drop-files';

const TeacherAvatar = ({ data }) => {
	const dispatch = useDispatch();
	const [isEditTeacherAvatar, setIsEditTeacherAvatar] = useState(false);

	//image
	const [image, setImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);

	useEffect(() => {
		if (image === null) {
			setImagePreview((prev) => {
				URL.revokeObjectURL(prev);
				return null;
			});
			return;
		}
		setImagePreview(URL.createObjectURL(image));
	}, [image]);

	const handleChangeImage = (file) => {
		setImage(file);
	};

	//submit
	const [changeTeacherAvatar, { isLoading: editLoading }] =
		useChangeTeacherAvatarMutation();

	const handleSaveChangeTeacherAvatar = async () => {
		try {
			await changeTeacherAvatar({ id: data.id, image: image }).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsEditTeacherAvatar(false);
		} catch (err) {
			let mess = '';
			if (!err?.originalStatus) {
				// isLoading: true until timeout occurs
				mess = 'No Server Response';
			} else if (err.originalStatus === 400) {
				mess = 'Missing Username or Password';
			} else if (err.originalStatus === 401) {
				mess = 'Unauthorized';
			} else {
				mess = 'Login Failed';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	return (
		<div
			className={`w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 py-8 flex flex-row relative ${
				isEditTeacherAvatar && 'shadow-top'
			}`}
		>
			{isEditTeacherAvatar ? (
				<div className="w-full h-full flex justify-center items-center pr-11">
					<FileUploader
						name="file"
						types={IMAGE_FILE_TYPES}
						handleChange={handleChangeImage}
						children={
							imagePreview ? (
								<img
									src={imagePreview}
									alt="variantImg"
									className="object-cover rounded-full size-32 border-dashed border-[3px] border-gray-300"
								/>
							) : (
								<div className="w-full rounded-md border-dashed border-[3px] border-gray-300 flex flex-col justify-center items-center p-3 cursor-pointer">
									<div className="p-4 ">
										<PhotoIcon className="text-admin w-8 h-8" />
									</div>
								</div>
							)
						}
					/>
				</div>
			) : (
				<Avatar
					variant="circular"
					alt="tania andrew"
					className="h-32 w-32 border border-main shadow-xl shadow-blue-900/20 ring-2 ring-main/30 m-auto"
					src={data.image}
				/>
			)}

			{isEditTeacherAvatar ? (
				<div className="flex flex-col absolute top-0 bottom-0 right-0">
					<Button
						className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() =>
							setIsEditTeacherAvatar(false) || setImage(null)
						}
						disabled={editLoading}
					>
						<XMarkIcon className="size-5 text-error" />
					</Button>
					<Button
						className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
						onClick={handleSaveChangeTeacherAvatar}
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
					className="!absolute h-32 w-32 opacity-0 hover:opacity-100 flex border justify-center items-center rounded-full bg-transparent backdrop-blur-sm border-main shadow-xl shadow-blue-900/20 ring-2 ring-main/30 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
					onClick={(e) => {
						e.preventDefault();
						setIsEditTeacherAvatar(true);
					}}
				>
					<PhotoIcon className="size-7 text-gray-200" />
				</Button>
			)}

			{editLoading && <div className="absolute w-full h-full"></div>}
		</div>
	);
};

export default TeacherAvatar;
