import {
	Button,
	Dialog,
	DialogBody,
	DialogFooter,
	DialogHeader,
	Radio,
	Spinner,
	Typography,
} from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import {
	GENDER,
	IMAGE_FILE_TYPES,
	NOTIFY_STYLE,
} from '../../../config/constants';
import { PhotoIcon } from '@heroicons/react/16/solid';
import { FileUploader } from 'react-drag-drop-files';
import { useAddTeacherMutation } from '../../../services/teacher/teacherApiSlice';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';

const NewTeacher = ({ isActive, toggleActive }) => {
	const dispatch = useDispatch();
	const [newTeacher, setNewTeacher] = useState({
		firstName: '',
		lastName: '',
		citizenIdentification: '',
		// email: '',
		phoneNumber: '',
		address: '',
		dob: null,
		startDate: null,
		gender: GENDER.MALE,
	});

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

	const resetState = () => {
		setNewTeacher({
			firstName: '',
			lastName: '',
			citizenIdentification: '',
			// email: '',
			phoneNumber: '',
			address: '',
			dob: null,
			startDate: null,
			gender: GENDER.MALE,
		});
		setImage(null);
	};

	// submit
	const [addTeacher, { isLoading: addLoading }] = useAddTeacherMutation();
	const handleAddNewTeacher = async () => {
		try {
			await addTeacher({
				...newTeacher,
				gender: newTeacher.gender.send,
				image: image,
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Thêm thành công!',
				})
			);
			resetState();
			toggleActive();
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'No Server Response';
			} else if (err.status === 400) {
				mess = 'Vui lòng nhập đúng định dạnh';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn. Vui lòng đăng nhập lại.';
			} else {
				mess = 'Thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	return (
		<Dialog
			size="md"
			className="focus-visible:outline-none z-10"
			open={isActive}
			handler={toggleActive}
		>
			<DialogHeader className="relative m-0 p-2 pt-3 block rounded-t-lg bg-main/40 shadow-top">
				<Typography className="text-lg font-bold text-center uppercase">
					Thêm giáo viên mới
				</Typography>
			</DialogHeader>
			<DialogBody className="px-6 pb-0 pt-4 flex flex-col gap-4 text-text">
				{/* tên  */}
				<div className="flex flex-col ">
					<label
						htmlFor="name"
						className="w-fit text-sm font-semibold mb-1 "
					>
						Họ và tên:
					</label>
					<div className="flex flex-row gap-2">
						<input
							id="name"
							value={newTeacher?.firstName}
							onChange={(e) =>
								setNewTeacher({
									...newTeacher,
									firstName: e.target.value,
								})
							}
							className={`w-5/6 p-2 px-3 text-sm font-normal border-solid border-gray-400 border-[1px] rounded-md outline-none focus:shadow-around`}
							spellCheck="false"
						/>
						<input
							value={newTeacher?.lastName}
							onChange={(e) =>
								setNewTeacher({
									...newTeacher,
									lastName: e.target.value,
								})
							}
							className={`p-2 px-3 text-sm font-normal border-solid border-gray-400 border-[1px] rounded-md outline-none focus:shadow-around`}
							spellCheck="false"
						/>
					</div>
				</div>
				{/* ngày sinh, ngày bắt đầu */}
				<div className="grid grid-cols-2 gap-x-2">
					<label
						htmlFor="dob"
						className="w-fit text-sm font-semibold mb-1 "
					>
						Ngày sinh:
					</label>
					<label
						htmlFor="start-date"
						className="w-fit text-sm font-semibold mb-1 "
					>
						Ngày bắt đầu:
					</label>

					<input
						id="dob"
						type="date"
						// value={newTeacher?.dob}
						onChange={(e) =>
							setNewTeacher({
								...newTeacher,
								dob: e.target.value,
							})
						}
						className="w-full p-1 h-fit text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-md outline-none focus:shadow-around"
					/>
					<input
						id="start-date"
						type="date"
						// value={newTeacher?.startDate}
						onChange={(e) =>
							setNewTeacher({
								...newTeacher,
								startDate: e.target.value,
							})
						}
						className="w-full p-1 h-fit text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-md outline-none focus:shadow-around"
					/>
				</div>
				{/* mã định danh, số điện thoại */}
				<div className="grid grid-cols-2 gap-x-2">
					<label
						htmlFor="cid"
						className="w-fit text-sm font-semibold mb-1 "
					>
						Mã định danh:
					</label>
					<label
						htmlFor="phone"
						className="w-fit text-sm font-semibold mb-1 "
					>
						Số điện thoại:
					</label>

					<input
						id="cid"
						value={newTeacher?.citizenIdentification}
						onChange={(e) =>
							setNewTeacher({
								...newTeacher,
								citizenIdentification: e.target.value,
							})
						}
						className={`w-full p-2 px-3 text-sm font-normal border-solid border-gray-400 border-[1px] rounded-md outline-none focus:shadow-around`}
						spellCheck="false"
					/>
					<input
						id="phone"
						value={newTeacher?.phoneNumber}
						onChange={(e) =>
							setNewTeacher({
								...newTeacher,
								phoneNumber: e.target.value,
							})
						}
						className={`w-full p-2 px-3 text-sm font-normal border-solid border-gray-400 border-[1px] rounded-md outline-none focus:shadow-around`}
						spellCheck="false"
					/>
				</div>
				{/* Email */}
				{/* <div className="flex flex-col text-text">
					<label
						htmlFor="email"
						className="w-fit text-sm font-semibold mb-1 "
					>
						Email:
					</label>
					<input
						id="email"
						value={newTeacher?.email}
						onChange={(e) =>
							setNewTeacher({
								...newTeacher,
								email: e.target.value,
							})
						}
						className={`w-full p-2 px-3 text-sm font-normal border-solid border-gray-400 border-[1px] rounded-md outline-none focus:shadow-around`}
						spellCheck="false"
					/>
				</div> */}
				{/* địa chỉ */}
				<div className="flex flex-col text-text">
					<label
						htmlFor="address"
						className="w-fit text-sm font-semibold mb-1 "
					>
						Địa chỉ:
					</label>
					<input
						id="address"
						value={newTeacher?.address}
						onChange={(e) =>
							setNewTeacher({
								...newTeacher,
								address: e.target.value,
							})
						}
						className={`w-full p-2 px-3 text-sm font-normal border-solid border-gray-400 border-[1px] rounded-md outline-none focus:shadow-around`}
						spellCheck="false"
					/>
				</div>
				{/* giới tính, ảnh */}
				<div className="grid grid-cols-2 gap-x-2">
					<div className="flex gap-8 items-center">
						<label className="text-sm font-semibold mb-1">
							Ảnh:
						</label>
						<FileUploader
							name="file"
							types={IMAGE_FILE_TYPES}
							handleChange={handleChangeImage}
							children={
								imagePreview ? (
									<img
										src={imagePreview}
										alt="variantImg"
										className="object-cover rounded-full size-28 border-dashed border-[3px] border-gray-300"
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
					<div className="flex gap-4 items-center">
						<label className="text-sm font-semibold">
							Giới tính:
						</label>
						<div className="flex gap-4">
							<Radio
								name="gender"
								ripple={true}
								color="indigo"
								checked={
									newTeacher.gender.send === GENDER.MALE.send
								}
								onChange={(e) =>
									setNewTeacher({
										...newTeacher,
										gender: GENDER.MALE,
									})
								}
								className="border-gray-900/50 p-0 transition-all hover:before:opacity-0"
								label={
									<Typography className="font-normal text-sm">
										{GENDER.MALE.show}
									</Typography>
								}
							/>
							<Radio
								name="gender"
								ripple={true}
								color="indigo"
								checked={
									newTeacher.gender.send ===
									GENDER.FEMALE.send
								}
								onChange={(e) =>
									setNewTeacher({
										...newTeacher,
										gender: GENDER.FEMALE,
									})
								}
								className="border-gray-900/50 p-0 transition-all hover:before:opacity-0"
								label={
									<Typography className="font-normal text-sm">
										{GENDER.FEMALE.show}
									</Typography>
								}
							/>
						</div>
					</div>
				</div>
			</DialogBody>
			<DialogFooter className="space-x-2 mt-4 border-solid border-t-[1px] border-gray-300">
				<Button
					variant="text"
					color="gray"
					className="py-2"
					onClick={toggleActive}
				>
					Hủy
				</Button>
				<Button
					disabled={
						!(
							newTeacher.firstName &&
							newTeacher.lastName &&
							newTeacher.address &&
							newTeacher.citizenIdentification &&
							newTeacher.dob &&
							// newTeacher.email &&
							newTeacher.phoneNumber &&
							newTeacher.gender &&
							newTeacher.dob &&
							newTeacher.startDate &&
							image &&
							!addLoading
						)
					}
					className="bg-main text-white py-2"
					onClick={handleAddNewTeacher}
				>
					{addLoading ? (
						<Spinner color="indigo" className="size-5" />
					) : (
						'Lưu'
					)}
				</Button>
			</DialogFooter>
		</Dialog>
	);
};

export default NewTeacher;
