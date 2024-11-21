import { Typography } from '@material-tailwind/react';
import React from 'react';

const AdminDashboard = () => {
	return (
		<div className="w-[660px] h-[200px] col-span-2 bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col gap-1 items-center justify-center mt-40 px-10">
			<Typography className="font-semibold text-xl uppercase">
				Chào mừng đến với hệ thống quản lý giáo dục
			</Typography>
			<Typography className="font-semibold text-lg text-gray-600 mt-4">
				Manas - Management School
			</Typography>
		</div>
	);
};

export default AdminDashboard;
