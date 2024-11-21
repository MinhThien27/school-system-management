import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { notify } from '../../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../../config/constants';
import { Checkbox, Spinner, Typography } from '@material-tailwind/react';
import { CheckIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAddSubjectMutation } from '../../../services/subject/subjectApiSlice';

const NewSubject = ({ isActive, setActive }) => {
	const dispatch = useDispatch();

	const [newSubject, setNewSubject] = useState({
		name: '',
		description: '',
		status: 'Active',
	});
	const [addSubject, { isLoading: addLoading }] = useAddSubjectMutation();
	const handleAddNewSubject = async () => {
		try {
			await addSubject(newSubject).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Thêm thành công!',
				})
			);
			setNewSubject({
				name: '',
				description: '',
				status: 'Active',
			});
			setActive(false);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Vui lòng nhập đầy đủ thông tin!';
			} else if (err.status === 409) {
				mess = 'Đã tồn tại môn!';
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
			<div className="w-full grid grid-cols-[80px_repeat(5,1fr)] gap-4 p-2 px-3 border-b-[1px] border-solid border-gray-300 shadow-around">
				<Typography className="whitespace-nowrap text-sm flex justify-center items-center">
					<PlusIcon className="size-4" />
				</Typography>
				<input
					value={newSubject?.name}
					onChange={(e) =>
						setNewSubject({
							...newSubject,
							name: e.target.value,
						})
					}
					ref={(el) => (inputRefs.current[0] = el)}
					onKeyDown={(e) => handleKeyDown(e, 0)}
					className={`w-full text-center text-sm font-semibold border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>

				<input
					value={newSubject?.description}
					onChange={(e) =>
						setNewSubject({
							...newSubject,
							description: e.target.value,
						})
					}
					ref={(el) => (inputRefs.current[2] = el)}
					onKeyDown={(e) => handleKeyDown(e, 2)}
					className={`w-full col-span-2 text-center text-sm font-normal border-solid border-gray-400 border-[1px] rounded-sm outline-none focus:shadow-around`}
					spellCheck="false"
				/>

				<div className="w-full text-center">
					<Checkbox
						color="green"
						className="hover:before:opacity-0 hover:opacity-70 border-gray-500 border-[2px] w-5 h-5 mx-auto"
						containerProps={{
							className: 'p-1',
						}}
						checked={newSubject.status === 'Active'}
						onChange={(e) =>
							setNewSubject({
								...newSubject,
								status:
									newSubject.status === 'Active'
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
							onClick={handleAddNewSubject}
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

export default NewSubject;
