import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import { Checkbox, Spinner, Typography } from '@material-tailwind/react';
import { CheckIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAddAcademyYearMutation } from '../../../services/academy-year/academyYearApiSlice';

const NewAcademyYear = ({ isActive, setActive }) => {
	const dispatch = useDispatch();

	const [newAcademyYear, setNewAcademyYear] = useState({
		name: '',
		startDate: null,
		endDate: null,
		status: 'Active',
	});

	const [addAcademyYear, { isLoading: addLoading }] =
		useAddAcademyYearMutation();
	const handleAddNewAcademyYear = async () => {
		try {
			await addAcademyYear(newAcademyYear).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Thêm thành công!',
				})
			);
			setNewAcademyYear({
				name: '',
				startDate: null,
				endDate: null,
				status: 'Active',
			});
			setActive(false);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Thông tin không hợp lệ!';
			} else if (err.status === 409) {
				mess = 'Đã tồn tại!';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn.';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};

	//input control
	const inputRefs = useRef([]);
	const handleKeyDown = (event, index) => {
		const len = inputRefs.current.length;
		if (event.key === 'Enter') {
			event.preventDefault();
			if (index < len - 1) {
				inputRefs.current[index + 1].focus();
				inputRefs.current[index + 1].select();
			} else if (index === len - 1) {
				inputRefs.current[0].focus();
				inputRefs.current[0].select();
			}
		}
	};

	useEffect(() => {
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus();
			inputRefs.current[0].select();
		}
	}, [isActive]);

	return (
		isActive && (
			<div className="w-full grid grid-cols-[100px_repeat(3,1fr)_140px_140px] gap-4 p-2 px-3 border-b-[1px] border-solid border-gray-300 shadow-around">
				<Typography className="whitespace-nowrap text-sm flex justify-center items-center">
					<PlusIcon className="size-4" />
				</Typography>
				<input
					value={newAcademyYear?.name}
					onChange={(e) =>
						setNewAcademyYear({
							...newAcademyYear,
							name: e.target.value,
						})
					}
					ref={(el) => (inputRefs.current[0] = el)}
					onKeyDown={(e) => handleKeyDown(e, 0)}
					className={`w-full text-center text-sm font-semibold border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>
				<input
					type="date"
					onChange={(e) =>
						setNewAcademyYear({
							...newAcademyYear,
							startDate: e.target.value,
						})
					}
					ref={(el) => (inputRefs.current[1] = el)}
					onKeyDown={(e) => handleKeyDown(e, 2)}
					className="w-full p-1 text-center text-sm border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
				/>
				<input
					type="date"
					onChange={(e) =>
						setNewAcademyYear({
							...newAcademyYear,
							endDate: e.target.value,
						})
					}
					ref={(el) => (inputRefs.current[2] = el)}
					onKeyDown={(e) => handleKeyDown(e, 3)}
					className="w-full p-1 text-center text-sm border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around"
				/>
				<div className="w-full text-center">
					<Checkbox
						color="green"
						className="hover:before:opacity-0 hover:opacity-70 border-gray-500 border-[2px] w-5 h-5 mx-auto"
						containerProps={{
							className: 'p-1',
						}}
						checked={newAcademyYear.status === 'Active'}
						onChange={(e) =>
							setNewAcademyYear({
								...newAcademyYear,
								status:
									newAcademyYear.status === 'Active'
										? 'Inactive'
										: 'Active',
							})
						}
					/>
				</div>
				<Typography className="whitespace-nowrap text-sm text-center flex justify-center items-center gap-4">
					{addLoading ? (
						<Spinner color="gray" className="size-5" />
					) : (
						<CheckIcon
							className="size-6 text-indigo-900 cursor-pointer hover:opacity-70"
							onClick={handleAddNewAcademyYear}
						/>
					)}

					<XMarkIcon
						className="size-6 text-error cursor-pointer hover:opacity-70"
						onClick={() => setActive(false)}
					/>
				</Typography>
			</div>
		)
	);
};

export default NewAcademyYear;
