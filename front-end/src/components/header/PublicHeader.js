import { Typography } from '@material-tailwind/react';
import React from 'react';

const PublicHeader = () => {
	return (
		<header className="absolute left-0 right-0 top-0 mx-auto bg-main pt-3 shadow-md shadow-shadow px-4 pb-2 rounded-b-[100px] overflow-visible">
			<div className="max-w-screen-desktop mx-auto flex flex-row justify-between">
				<Typography className="w-fit text-textWhite font-bold text-2xl uppercase tracking-wider">
					SchoolMana
				</Typography>
				<Typography className="w-fit text-textWhite font-semibold text-xl italic">
					Học Viện LiQi
				</Typography>
			</div>
		</header>
	);
};

export default PublicHeader;
