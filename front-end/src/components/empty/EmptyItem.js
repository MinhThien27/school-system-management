import { Typography } from '@material-tailwind/react';
import React from 'react';

const EmptyItem = ({ className, content }) => {
	return (
		<div
			className={
				'w-full h-11 px-5 border-t-[1px] border-solid border-gray-300 flex items-center ' +
				className
			}
		>
			<Typography
				as="div"
				variant="h1"
				className="h-4 text-sm font-medium text-gray-400 text-center w-full rounded-md"
			>
				{content}
			</Typography>
		</div>
	);
};

export default EmptyItem;
