import React from 'react';
import { IconButton, Typography } from '@material-tailwind/react';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';

export function Pagination({ active, lengthOfPage, total }) {
	const { pathname } = useLocation();
	const navigate = useNavigate();

	return (
		<div className="w-full py-4 flex items-center gap-8 justify-center border-solid border-t-[1px] border-gray-300 relative">
			<Typography className="text-sm text-text font-normal absolute left-4">
				Tổng: <strong className="text-text">{total}</strong>
			</Typography>
			<IconButton
				size="sm"
				variant="outlined"
				onClick={() => navigate(pathname + '?page=' + --active)}
				// onClick={prev}
				disabled={active.toString() === (1).toString()}
				className="border-text disabled:border-gray-300 focus:ring-transparent"
			>
				<ArrowLeftIcon strokeWidth={2} className="h-4 w-4 text-text" />
			</IconButton>
			<Typography className="font-normal text-text">
				Trang <strong className="text-text">{active}</strong> trên{' '}
				<strong className="text-text">{lengthOfPage}</strong>
			</Typography>
			<IconButton
				size="sm"
				variant="outlined"
				// onClick={next}
				onClick={() => navigate(pathname + '?page=' + ++active)}
				disabled={active.toString() === lengthOfPage.toString()}
				className="border-text disabled:border-gray-300 focus:ring-transparent"
			>
				<ArrowRightIcon strokeWidth={2} className="h-4 w-4 text-text" />
			</IconButton>
		</div>
	);
}
