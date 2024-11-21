import { Typography } from '@material-tailwind/react';
import React from 'react';

const ListItemLoading = ({ className }) => {
	return (
		<div
			className={
				'w-full h-11 animate-pulse px-5 border-t-[1px] border-solid border-gray-300 flex items-center ' +
				className
			}
		>
			<Typography
				as="div"
				variant="h1"
				className="h-4 w-full rounded-md bg-gray-300"
			>
				&nbsp;
			</Typography>
		</div>
	);
};

export default ListItemLoading;
