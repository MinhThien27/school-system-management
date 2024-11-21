import { Typography } from '@material-tailwind/react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/img/header-icon.png';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useSelector } from 'react-redux';

// import Search from './Search';
import { selectUserRole } from '../../services/auth/authSlice';

const Header = () => {
	const searchInputRef = useRef();
	const [searchValue, setSearchValue] = useState('');
	const [isSearchInputFocus, setIsSearchInputFocus] = useState(false);
	const [openSearch, setOpenSearch] = useState(false);

	const location = useLocation();

	useEffect(() => {
		let timeOut;
		if (isSearchInputFocus) setOpenSearch(true);
		else {
			timeOut = setTimeout(() => setOpenSearch(false), 100);
		}
		return () => clearTimeout(timeOut);
	}, [location, isSearchInputFocus]);

	//input
	const handleSearchInputChange = (e) => {
		setSearchValue(e.target.value.toString().trim());
	};

	//focus
	const handleSearchInputFocus = (value) => {
		let isOpen = openSearch;
		setIsSearchInputFocus(value);
		if (value) setOpenSearch(!isOpen);
		// else setOpenSearch(false);
	};

	const userRole = useSelector(selectUserRole);

	return (
		<div className="flex justify-between w-full h-full bg-white">
			{/* logo  */}
			<div className="w-1/6 h-full flex items-center">
				<Link
					to={'/' + userRole?.toString().toLowerCase()}
					className="inline-block"
				>
					<div className="flex gap-2 items-center h-full p-2 ml-8">
						<img
							className="w-7 h-7 object-cover"
							src={logo}
							alt="logo"
						/>
						<Typography className="uppercase text-base font-bold text-admin">
							manas
						</Typography>
					</div>
				</Link>
			</div>
			{/* search  */}
			<div className="flex items-center justify-between max-w-[600px] relative flex-1 mx-auto">
				<div
					className={`overflow-hidden px-3 h-min gap-2 w-full flex border-2 border-transparent border-solid bg-main/10 ${
						isSearchInputFocus &&
						'!border-indigo-100 !bg-transparent shadow-lg'
					}  rounded-md`}
				>
					<input
						type="text"
						placeholder="Tìm kiếm"
						spellCheck="false"
						className="h-min flex-1 font-sans transition-all text-base font-medium leading-4 outline-none shadow-none bg-transparent py-2 text-text placeholder:text-gray-700 placeholder:font-light"
						value={searchValue}
						onFocus={() => handleSearchInputFocus(true)}
						ref={searchInputRef}
						onBlur={() => handleSearchInputFocus(false)}
						onChange={handleSearchInputChange}
						// onKeyDown={(e) =>
						// 	e.keyCode === 13 && handleSubmitSearchAction()
						// }
					></input>
					<MagnifyingGlassIcon className="w-6 text-text" />
				</div>
				{/* {searchValue !== '' && openSearch && (
					<Search searchKey={searchValue} />
				)} */}
			</div>
			{/* admin avt menu */}
			{/* <div className="flex items-center w-16">
				<Menu placement="bottom-end">
					<MenuHandler>
						<Avatar
							variant="circular"
							size="sm"
							alt="tania andrew"
							className="cursor-pointer border border-main shadow-xl shadow-green-900/20 ring-2 ring-main/30 "
							src="https://mas.edu.vn/wp-content/uploads/2022/05/63af987a2cf528462ae90e36c72f6e96.jpg"
						/>
					</MenuHandler>
					<MenuList className="shadow-sm shadow-gray-500 border-[1px] border-gray-700 text-text">
						<Typography
							variant="small"
							className="font-medium pointer-events-none ml-2"
						>
							Xin chào
							<span className="text-main block">Admin!</span>
						</Typography>
						<hr className="my-2 border-blue-gray-50 pointer-events-none" />
						<Link
							to="/"
							className="focus-visible:border-none focus-visible:outline-none focus-visible:ring-0"
						>
							<MenuItem className="flex items-center gap-2">
								<Cog8ToothIcon className="w-5 h-5" />

								<Typography
									variant="small"
									className="font-medium"
								>
									Cài đặt
								</Typography>
							</MenuItem>
						</Link>

						<hr className="my-2 border-blue-gray-50 pointer-events-none" />

						<MenuItem
							className="flex items-center gap-2"
							onClick={handleLogout}
						>
							<ArrowRightStartOnRectangleIcon className="w-5 h-5" />
							<Typography variant="small" className="font-medium">
								Đăng xuất
							</Typography>
						</MenuItem>
					</MenuList>
				</Menu>
			</div> */}
		</div>
	);
};

export default Header;
