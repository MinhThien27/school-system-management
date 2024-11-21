import {
	Button,
	Card,
	CardBody,
	Checkbox,
	Spinner,
	Typography,
} from '@material-tailwind/react';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../services/auth/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../services/auth/authSlice';
import { notify } from '../services/notification/notificationSlice';
import { NOTIFY_STYLE, ROLES } from '../config/constants';
import { decodeToken } from '../utils/authUtils';

const HomePage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userRef = useRef();

	const rememberEmail = localStorage.getItem('rememberEmail') ?? '';
	const [isRemember, setIsRemember] = useState(rememberEmail !== '');
	const [user, setUser] = useState(rememberEmail);
	const [pwd, setPwd] = useState('');

	const [login, { isLoading }] = useLoginMutation();

	useEffect(() => {
		userRef.current.focus();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { accessToken } = await login({
				email: user,
				password: pwd,
			}).unwrap();
			const { UserInfo } = decodeToken(accessToken);
			dispatch(setCredentials({ UserInfo, accessToken }));
			setUser('');
			setPwd('');

			switch (UserInfo.role) {
				case ROLES.ADMIN:
					navigate('/admin');
					break;
				case ROLES.TEACHER:
					navigate('/teacher');
					break;
				case ROLES.STUDENT:
					navigate('/student');
					break;
				default:
					break;
			}
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				mess = 'Không có phản hồi từ máy chủ';
			} else if (err.status === 400) {
				mess = 'Email và mật khẩu không được trống';
			} else if (err.status === 401) {
				mess = 'Sai tên đăng nhập hoặc mật khẩu';
			} else {
				mess = 'Đăng nhập thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
			userRef.current.focus();
		}
	};

	const handleUserInput = (e) => {
		setUser(e.target.value);
		if (isRemember) localStorage.setItem('rememberEmail', e.target.value);
	};

	const handlePwdInput = (e) => setPwd(e.target.value);

	const handleChangeRemember = () => {
		!isRemember
			? localStorage.setItem('rememberEmail', user)
			: localStorage.removeItem('rememberEmail');
		setIsRemember(!isRemember);
	};

	return (
		<div className="w-full h-full flex items-center justify-center">
			<Card className="mx-auto w-[460px] glassmorphism text-text p-4">
				<CardBody className="flex flex-col gap-6 py-0 mb-4">
					<Typography className="text-main font-extrabold text-4xl mt-6 mb-2">
						Chào mừng trở lại
					</Typography>
					<form className="flex flex-col" onSubmit={handleSubmit}>
						<input
							name="email"
							required={true}
							spellCheck="false"
							autoComplete="false"
							ref={userRef}
							className={`rounded-lg text-text font-medium p-2 w-full bg-upperBg border-solid border-[1px] border-blue-gray-600 outline-none ${
								user && 'border-main border-[2px]'
							}`}
							placeholder="Email"
							onChange={handleUserInput}
							value={user}
						/>

						<input
							name="password"
							type="password"
							required={true}
							className={`rounded-lg mt-6 text-text font-medium p-2 w-full bg-upperBg border-solid border-[1px] border-blue-gray-600 outline-none ${
								pwd && 'border-main border-[2px]'
							}`}
							placeholder="Mật khẩu"
							spellCheck="false"
							onChange={handlePwdInput}
							value={pwd}
						/>

						<div className="mt-4">
							<Checkbox
								name="rate"
								color="indigo"
								className="hover:before:opacity-0 hover:opacity-70 border-main border-[2px] w-5 h-5"
								containerProps={{
									className: 'p-1',
								}}
								checked={isRemember}
								onChange={handleChangeRemember}
								label={
									<Typography className="text-main font-medium text-base ml-1">
										Nhớ tài khoản
									</Typography>
								}
							/>
						</div>

						<Button
							type="submit"
							className={`bg-main text-textWhite text-base mt-6  flex justify-center items-center gap-2 pointer-events-none opacity-60 ${
								user &&
								pwd &&
								!isLoading &&
								'pointer-events-auto opacity-100'
							} `}
							fullWidth
						>
							{isLoading ? (
								<Spinner color="indigo" />
							) : (
								<>
									<ArrowLeftEndOnRectangleIcon className="w-5 h-5 text-textWhite" />
									Đăng nhập
								</>
							)}
						</Button>
					</form>
				</CardBody>
			</Card>
		</div>
	);
};

export default HomePage;
