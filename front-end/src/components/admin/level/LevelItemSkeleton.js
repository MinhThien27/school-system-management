import { Typography } from '@material-tailwind/react';
import React from 'react';

const LevelItemSkeleton = ({ levelData }) => {
	return (
		<div className="w-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center">
			<div className="flex flex-col h-full justify-center animate-pulse py-4">
				<Typography
					as="div"
					variant="h1"
					className="mb-4 h-3 w-56 rounded-full bg-gray-300"
				>
					&nbsp;
				</Typography>
				<Typography
					as="div"
					variant="paragraph"
					className="mb-2 h-2 w-72 rounded-full bg-gray-300"
				>
					&nbsp;
				</Typography>
				<Typography
					as="div"
					variant="paragraph"
					className="mb-2 h-2 w-72 rounded-full bg-gray-300"
				>
					&nbsp;
				</Typography>
				<Typography
					as="div"
					variant="paragraph"
					className="mb-2 h-2 w-72 rounded-full bg-gray-300"
				>
					&nbsp;
				</Typography>
				<Typography
					as="div"
					variant="paragraph"
					className="mb-2 h-2 w-72 rounded-full bg-gray-300"
				>
					&nbsp;
				</Typography>
				<Typography
					as="div"
					variant="paragraph"
					className="mb-2 h-2 w-72 rounded-full bg-gray-300"
				>
					&nbsp;
				</Typography>
				<Typography
					as="div"
					variant="paragraph"
					className="mb-2 h-2 w-72 rounded-full bg-gray-300"
				>
					&nbsp;
				</Typography>
			</div>
		</div>
	);
};

export default LevelItemSkeleton;
