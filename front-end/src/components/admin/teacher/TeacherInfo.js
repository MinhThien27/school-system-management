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
import { useDispatch } from 'react-redux';
import { useEditTeacherInfoMutation } from '../../../services/teacher/teacherApiSlice';
import { notify } from '../../../services/notification/notificationSlice';
import { GENDER, NOTIFY_STYLE } from '../../../config/constants';
import {
	CheckIcon,
	ChevronDownIcon,
	PencilSquareIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';
import { formatTimestamp, formatTimestampToValue } from '../../../utils';

const TeacherInfo = ({ data }) => {
	const dispatch = useDispatch();
	const [teacherData, setTeacherData] = useState(null);
	useEffect(() => {
		if (data) {
			setTeacherData({
				...data,
				gender: data.gender === 'Female' ? GENDER.FEMALE : GENDER.MALE,
			});
		}
	}, [data]);
	const [isEditTeacherInfo, setIsEditTeacherInfo] = useState(false);
	const [editTeacherInfo, { isLoading: editLoading }] =
		useEditTeacherInfoMutation();

	const handleSaveTeacherInfo = async () => {
		try {
			await editTeacherInfo({
				id: data.id,
				body: {
					...teacherData,
					gender: teacherData.gender.send,
					...teacherData.user,
				},
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsEditTeacherInfo(false);
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

	const resetData = () => {
		setTeacherData(
			data
				? {
						...data,
						gender:
							data.gender === 'Female'
								? GENDER.FEMALE
								: GENDER.MALE,
				  }
				: null
		);
	};
	return (
		<div
			className={`w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row relative ${
				isEditTeacherInfo && 'shadow-top'
			}`}
		>
			{isEditTeacherInfo ? (
				<div className="grid grid-cols-5 gap-x-14 py-6 px-12 w-full border-solid border-l-[1px] border-gray-300">
					<div className="col-span-3">
						{/* họ tên  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="name"
								className="text-sm font-normal whitespace-nowrap "
							>
								Họ và tên đệm:
							</label>
							<div className="flex gap-2">
								<input
									id="name"
									type="text"
									spellCheck="false"
									className="w-2/3 text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
									value={teacherData.firstName}
									onChange={(e) =>
										setTeacherData((prev) => {
											return {
												...prev,
												firstName: e.target.value,
											};
										})
									}
								/>
								<input
									type="text"
									spellCheck="false"
									className="w-1/3 text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
									value={teacherData.lastName}
									onChange={(e) =>
										setTeacherData((prev) => {
											return {
												...prev,
												lastName: e.target.value,
											};
										})
									}
								/>
							</div>
						</div>
						{/* email  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label className="text-sm font-normal whitespace-nowrap">
								Email:
							</label>
							<Typography className="w-full text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none cursor-not-allowed">
								{teacherData?.user?.email}&nbsp;
							</Typography>
						</div>
						{/* giới tính  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Giới tính:
							</Typography>
							<Menu placement="bottom" allowHover>
								<MenuHandler>
									<Button
										variant="text"
										className="flex min-w-24 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium capitalize text-text outline-none bg-upperBg py-1 px-2 border-solid border-[1px] border-gray-400 rounded-sm"
									>
										{teacherData.gender.show}
										<ChevronDownIcon
											strokeWidth={2.5}
											className={`h-3.5 w-3.5 transition-transform `}
										/>
									</Button>
								</MenuHandler>
								<MenuList className="shadow-top min-w-fit p-0 rounded-none h-fit">
									{[GENDER.MALE, GENDER.FEMALE].map(
										(gender, index, arr) => (
											<MenuItem
												key={gender.send}
												onClick={() =>
													setTeacherData((prev) => ({
														...prev,
														gender: gender,
													}))
												}
												className={`py-1 px-3 rounded-none ${
													index !== arr.length - 1 &&
													'border-b-[1px] border-solid border-gray-300'
												}`}
											>
												<Typography className="text-sm font-medium text-text">
													{gender.show}&nbsp;
												</Typography>
											</MenuItem>
										)
									)}
								</MenuList>
							</Menu>
						</div>
						{/* địa chỉ  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="address"
								className="text-sm font-normal whitespace-nowrap"
							>
								Địa chỉ:
							</label>
							<textarea
								id="address"
								type="text"
								spellCheck="false"
								className="w-full text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
								value={teacherData.address}
								onChange={(e) =>
									setTeacherData((prev) => {
										return {
											...prev,
											address: e.target.value,
										};
									})
								}
							/>
						</div>
					</div>
					<div className="col-span-2">
						{/* số điện thoại  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="phone"
								className="text-sm font-normal whitespace-nowrap"
							>
								Số điện thoại:
							</label>
							<input
								id="phone"
								type="text"
								spellCheck="false"
								className="w-full text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
								value={teacherData?.user?.phoneNumber}
								onChange={(e) =>
									setTeacherData((prev) => {
										return {
											...prev,
											user: {
												...prev.user,
												phoneNumber: e.target.value,
											},
										};
									})
								}
							/>
						</div>
						{/* mã định danh  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="cid"
								className="text-sm font-normal whitespace-nowrap"
							>
								Mã đinh danh:
							</label>
							<input
								id="cid"
								type="text"
								spellCheck="false"
								className="w-full text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
								value={teacherData?.user?.citizenIdentification}
								onChange={(e) =>
									setTeacherData((prev) => {
										return {
											...prev,
											user: {
												...prev.user,
												citizenIdentification:
													e.target.value,
											},
										};
									})
								}
							/>
						</div>
						{/* ngày sinh  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="dob"
								className="text-sm font-normal whitespace-nowrap "
							>
								Ngày sinh:
							</label>
							<input
								id="dob"
								type="date"
								defaultValue={formatTimestampToValue(
									teacherData?.dob
								)}
								onChange={(e) =>
									setTeacherData({
										...teacherData,
										dob: e.target.value,
									})
								}
								className="w-min h-[30px] p-1 text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
							/>
						</div>
						{/* ngày bắt đầu  */}
						<div className="flex flex-row gap-2 py-1 items-center">
							<label
								htmlFor="startDate"
								className="text-sm font-normal whitespace-nowrap "
							>
								Ngày bắt đầu:
							</label>
							<input
								id="startDate"
								type="date"
								defaultValue={formatTimestampToValue(
									teacherData?.startDate
								)}
								onChange={(e) =>
									setTeacherData({
										...teacherData,
										startDate: e.target.value,
									})
								}
								className="w-min h-[30px] p-1 text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-5 gap-x-14 py-6 px-12 w-full border-solid border-l-[1px] border-gray-300">
					<div className="col-span-3">
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Họ và tên:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{teacherData?.firstName +
									' ' +
									teacherData?.lastName}
								&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap">
								Email:
							</Typography>
							<Typography className="text-sm font-semibold text-blue-900 cursor-pointer">
								<a href={'mailTo:' + teacherData?.user?.email}>
									{teacherData?.user?.email}&nbsp;
								</a>
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Giới tính:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{teacherData?.gender.show}&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap">
								Địa chỉ:
							</Typography>
							<Typography className="text-sm font-semibold">
								{teacherData?.address}&nbsp;
							</Typography>
						</div>
					</div>
					<div className="col-span-2">
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Số điện thoại:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{teacherData?.user?.phoneNumber}&nbsp;
							</Typography>
						</div>

						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Mã định danh:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{teacherData?.user?.citizenIdentification}&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Ngày sinh:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{formatTimestamp(teacherData?.dob)}&nbsp;
							</Typography>
						</div>
						<div className="flex flex-row gap-4 py-2">
							<Typography className="text-sm font-normal whitespace-nowrap ">
								Ngày bắt đầu:
							</Typography>
							<Typography className="text-sm font-semibold ">
								{formatTimestamp(teacherData?.startDate)}&nbsp;
							</Typography>
						</div>
					</div>
				</div>
			)}

			{isEditTeacherInfo ? (
				<div className="flex flex-col">
					<Button
						className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() =>
							resetData() || setIsEditTeacherInfo(false)
						}
						disabled={editLoading}
					>
						<XMarkIcon className="size-5 text-error" />
					</Button>
					<Button
						className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
						onClick={handleSaveTeacherInfo}
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
					className="h-full bg-main/30 rounded-md rounded-l-none hover:opacity-80 px-3"
					onClick={() => setIsEditTeacherInfo(true)}
				>
					<PencilSquareIcon className="size-5 text-main" />
				</Button>
			)}
			{editLoading && <div className="absolute w-full h-full"></div>}
		</div>
	);
};

export default TeacherInfo;
