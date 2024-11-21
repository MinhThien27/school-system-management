import { Spinner } from '@material-tailwind/react';
import React from 'react';

const SpinnerLoading = ({ className }) => {
	return (
		<div
			className={
				'w-full min-h-52 h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex justify-center items-center ' +
				className
			}
		>
			<Spinner color="indigo" className="size-10" />
		</div>
	);
};

export default SpinnerLoading;
