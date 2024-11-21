import { Button, Spinner } from '@material-tailwind/react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { CheckIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import { useAddParentMutation } from '../../../services/student/studentApiSlice';

const NewParent = ({ studentID }) => {
	const dispatch = useDispatch();
	const [isActiveNewParent, setIsActiveNewParent] = useState(false);
	const [parentData, setParentData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		// relationship: PARENT[0],
		phoneNumber: '',
		dob: null,
	});

	const resetData = () => {
		setParentData({
			firstName: '',
			lastName: '',
			email: '',
			// relationship: PARENT[0],
			phoneNumber: '',
			dob: null,
		});
	};

	const isValidNewParent = () => {
		return (
			parentData.firstName &&
			parentData.lastName &&
			parentData.email &&
			parentData.phoneNumber &&
			// parentData.relationship &&
			parentData.dob
		);
	};

	//submit
	const [addParent, { isLoading: editLoading }] = useAddParentMutation();

	const handleAddParent = async () => {
		try {
			await addParent({
				id: studentID,
				body: {
					...parentData,
					// relationship: parentData.relationship.send,
				},
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Đã lưu!',
				})
			);
			setIsActiveNewParent(false);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Thông tin không đúng định dạng';
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
			className={`w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-row relative pr-11 ${
				isActiveNewParent && 'shadow-top'
			}`}
		>
			{isActiveNewParent ? (
				<div className="flex flex-col py-6 px-6 w-full border-solid border-l-[1px] border-gray-300 ">
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
								value={parentData.firstName}
								onChange={(e) =>
									setParentData((prev) => {
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
								value={parentData.lastName}
								onChange={(e) =>
									setParentData((prev) => {
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
						<label
							htmlFor="email"
							className="text-sm font-normal whitespace-nowrap"
						>
							Email:
						</label>
						<input
							id="email"
							type="text"
							spellCheck="false"
							className="w-full text-sm font-medium px-2 py-1 border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
							value={parentData.email}
							onChange={(e) =>
								setParentData((prev) => {
									return {
										...prev,
										email: e.target.value,
									};
								})
							}
						/>
					</div>
					{/* quan hệ  */}
					{/* <div className="flex flex-row gap-2 py-1 items-center">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Quan hệ:
						</Typography>
						<Menu placement="bottom" allowHover>
							<MenuHandler>
								<Button
									variant="text"
									className="flex min-w-24 items-center justify-center gap-2 whitespace-nowrap text-sm font-medium capitalize text-text outline-none bg-upperBg py-1 px-2 border-solid border-[1px] border-gray-400 rounded-sm"
								>
									{parentData.relationship.show}
									<ChevronDownIcon
										strokeWidth={2.5}
										className={`h-3.5 w-3.5 transition-transform `}
									/>
								</Button>
							</MenuHandler>
							<MenuList className="shadow-top min-w-fit p-0 rounded-none h-fit">
								{PARENT.map((parent, index, arr) => (
									<MenuItem
										key={parent.send}
										onClick={() =>
											setParentData((prev) => ({
												...prev,
												relationship: parent,
											}))
										}
										className={`py-1 px-3 rounded-none ${
											index !== arr.length - 1 &&
											'border-b-[1px] border-solid border-gray-300'
										}`}
									>
										<Typography className="text-sm font-medium text-text">
											{parent.show}
										</Typography>
									</MenuItem>
								))}
							</MenuList>
						</Menu>
					</div> */}
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
							value={parentData.phoneNumber}
							onChange={(e) =>
								setParentData((prev) => {
									return {
										...prev,
										phoneNumber: e.target.value,
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
							// defaultValue={parentData?.dob}
							onChange={(e) =>
								setParentData({
									...parentData,
									dob: e.target.value,
								})
							}
							className="w-min h-[30px] p-1 text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
						/>
					</div>
				</div>
			) : (
				<div className="w-full min-h-40 flex justify-center items-center ml-11">
					<Button
						color="indigo"
						className="py-2 px-4 bg-main/60"
						onClick={(e) => {
							e.preventDefault();
							setIsActiveNewParent(true);
						}}
					>
						<PlusIcon className="size-5" />
					</Button>
				</div>
			)}

			{isActiveNewParent && (
				<div className="flex flex-col absolute right-0 top-0 bottom-0">
					<Button
						className="bg-error/30 h-1/2 rounded-none rounded-tr-md hover:opacity-80 px-3"
						onClick={() =>
							setIsActiveNewParent(false) || resetData()
						}
						disabled={editLoading}
					>
						<XMarkIcon className="size-5 text-error" />
					</Button>
					<Button
						className="bg-main/30 h-1/2 rounded-none rounded-br-md hover:opacity-80 px-3"
						onClick={handleAddParent}
						disabled={editLoading || !isValidNewParent()}
					>
						{editLoading ? (
							<Spinner color="indigo" className="size-5" />
						) : (
							<CheckIcon className="size-5 text-main" />
						)}
					</Button>
				</div>
			)}

			{editLoading && <div className="absolute w-full h-full"></div>}
		</div>
	);
};

export default NewParent;
