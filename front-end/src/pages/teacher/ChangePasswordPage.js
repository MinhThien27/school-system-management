import React, { useEffect, useRef, useState } from 'react';
import SmallWrapper from '../../layouts/SmallWrapper';
import { Button, Spinner, Typography } from '@material-tailwind/react';
import { NOTIFY_STYLE, PWD_REGEX } from '../../config/constants';
import {
	CheckIcon,
	InformationCircleIcon,
	XMarkIcon,
} from '@heroicons/react/24/solid';

import { useDispatch } from 'react-redux';
import { notify } from '../../services/notification/notificationSlice';
import { useLogoutMutation } from '../../services/auth/authApiSlice';
import { logOut } from '../../services/auth/authSlice';
import { useChangeTeacherPasswordMutation } from '../../services/teacher/teacherApiSlice';

const ChangePasswordPage = () => {
	const prevPassRef = useRef();

	const [prevPass, setPrevPass] = useState('');
	const [validPrevPass, setValidPrevPass] = useState(false);

	const [pass, setPass] = useState('');
	const [validPass, setValidPass] = useState(false);
	const [passFocus, setPassFocus] = useState(false);

	const [matchPass, setMatchPass] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	useEffect(() => {
		prevPassRef.current.focus();
	}, []);

	useEffect(() => {
		setValidPrevPass(prevPass !== '');
	}, [prevPass]);

	useEffect(() => {
		setValidPass(PWD_REGEX.test(pass));
		setValidMatch(PWD_REGEX.test(matchPass) && pass === matchPass);
	}, [pass, matchPass]);

	const [changePassword, { isLoading }] = useChangeTeacherPasswordMutation();
	const [logout] = useLogoutMutation();
	const dispatch = useDispatch();
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!PWD_REGEX.test(pass)) {
			dispatch(
				notify({ type: NOTIFY_STYLE.ERROR, content: 'Không hợp lệ' })
			);
			return;
		}
		try {
			await changePassword({
				oldPassword: prevPass,
				newPassword: pass,
			}).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Cập nhật mật khẩu thành công! Hãy đăng nhập lại',
				})
			);
			setPrevPass('');
			setPass('');
			setMatchPass('');
			await logout().unwrap();
			dispatch(logOut());
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				mess = 'Không có phản hồi từ máy chủ';
			} else if (err.status === 400) {
				mess = 'Thiếu thông tin';
			} else if (err.status === 401) {
				mess = 'Mật khẩu cũ không đúng';
			} else {
				mess = 'Thay đổi thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
			prevPassRef.current.focus();
		}
	};
	return (
		<SmallWrapper>
			<div className="w-full flex flex-col">
				<Typography className="text-lg text-text font-semibold my-2">
					Cập nhật mật khẩu
				</Typography>
				<div className="w-[520px] h-min bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center pt-6 pb-8 px-14">
					<form onSubmit={handleSubmit} className="w-full">
						{/* mật khẩu cũ  */}
						<div className="flex flex-col">
							<label
								htmlFor="previous-password"
								className="flex flex-row gap-2 items-center mb-2"
							>
								<Typography className="text-base font-medium">
									Mật khẩu hiện tại:
								</Typography>
								<CheckIcon
									className={`size-5 mb-1 ${
										validPrevPass
											? 'text-success'
											: 'hidden'
									}`}
								/>
								<XMarkIcon
									className={`size-4 ${
										validPrevPass || !prevPass
											? 'hidden'
											: 'text-error'
									}`}
								/>
							</label>
							<input
								type="password"
								id="previous-password"
								className={`w-full rounded-lg text-text font-medium p-2 bg-upperBg border-solid border-[1px] border-blue-gray-600 outline-none ${
									validPrevPass &&
									'border-success border-[2px]'
								}`}
								ref={prevPassRef}
								autoComplete="off"
								onChange={(e) => setPrevPass(e.target.value)}
								value={prevPass}
								required
							/>
						</div>
						{/* mật khẩu mới  */}
						<div className="flex flex-col mt-4">
							<label
								htmlFor="password"
								className="flex flex-row gap-2 items-center mb-2"
							>
								<Typography className="text-base font-medium">
									Mật khẩu mới:
								</Typography>
								<CheckIcon
									className={`size-5 mb-1 ${
										validPass ? 'text-success' : 'hidden'
									}`}
								/>
								<XMarkIcon
									className={`size-4 ${
										validPass || !pass
											? 'hidden'
											: 'text-error'
									}`}
								/>
							</label>

							<input
								type="password"
								id="password"
								className={`w-full rounded-lg text-text font-medium p-2 bg-upperBg border-solid  outline-none 
                                    ${
										passFocus || !!pass
											? 'border-[2px]'
											: 'border-[1px] !border-blue-gray-600'
									} ${
									validPass
										? 'border-success'
										: 'border-error'
								} `}
								autoComplete="off"
								onChange={(e) => setPass(e.target.value)}
								value={pass}
								required
								onFocus={() => setPassFocus(true)}
								onBlur={() => setPassFocus(false)}
							/>

							<Typography
								className={`text-sm font-medium text-text rounded-lg bg-underBg  p-1 px-2 mt-2 ${
									passFocus && !validPass ? 'block' : 'hidden'
								}`}
							>
								<InformationCircleIcon className="size-4 inline-block mr-2" />
								8 đến 24 ký tự.
								<br />
								Phải bao gồm chữ in hoa, in thường, số và ký tự
								đặc biệt.
								<br />
								Ký tự đặc biệt hợp lệ:{' '}
								<span aria-label="exclamation mark">
									!
								</span>{' '}
								<span aria-label="at symbol">@</span>{' '}
								<span aria-label="hashtag">#</span>{' '}
								<span aria-label="dollar sign">$</span>{' '}
								<span aria-label="percent">%</span>
							</Typography>
						</div>
						{/* xác nhận mật khẩu  */}
						<div className="flex flex-col mt-4">
							<label
								htmlFor="confirm-password"
								className="flex flex-row gap-2 items-center mb-2"
							>
								<Typography className="text-base font-medium">
									Xác nhận mật khẩu:
								</Typography>
								<CheckIcon
									className={`size-5 mb-1 ${
										validMatch ? 'text-success' : 'hidden'
									}`}
								/>
								<XMarkIcon
									className={`size-4 ${
										validMatch || !matchPass
											? 'hidden'
											: 'text-error'
									}`}
								/>
							</label>

							<input
								type="password"
								id="confirm-password"
								className={`w-full rounded-lg text-text font-medium p-2 bg-upperBg border-solid  outline-none 
                                    ${
										matchFocus || !!matchPass
											? 'border-[2px]'
											: 'border-[1px] !border-blue-gray-600'
									} ${
									validMatch
										? 'border-success'
										: 'border-error'
								} `}
								autoComplete="off"
								onChange={(e) => setMatchPass(e.target.value)}
								value={matchPass}
								required
								onFocus={() => setMatchFocus(true)}
								onBlur={() => setMatchFocus(false)}
							/>

							<Typography
								className={`text-sm font-medium text-text rounded-lg bg-underBg  p-1 px-2 mt-2 ${
									matchFocus && !validMatch
										? 'block'
										: 'hidden'
								}`}
							>
								<InformationCircleIcon className="size-4 inline-block mr-2" />
								Mật khẩu không khớp.
							</Typography>
						</div>
						<Button
							type="submit"
							className={`bg-main text-textWhite text-sm mt-8 py-2 flex justify-center items-center gap-2 pointer-events-none opacity-60 ${
								validMatch &&
								validPass &&
								validPrevPass &&
								!isLoading &&
								'pointer-events-auto opacity-100'
							} `}
							fullWidth
						>
							{isLoading ? <Spinner color="indigo" /> : 'Lưu'}
						</Button>
					</form>
				</div>
			</div>
		</SmallWrapper>
	);
};

export default ChangePasswordPage;
