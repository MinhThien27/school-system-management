import { Typography } from '@material-tailwind/react';
import React from 'react';

const PublicFooter = () => {
	return (
		<footer className="absolute left-0 right-0 bottom-0 mx-auto bg-main pt-2 shadow-top shadow-shadow px-4 pb-1 overflow-visible">
			<div className="max-w-screen-desktop mx-auto flex flex-row justify-between">
				<Typography className="w-fit text-textWhite font-bold text-lg uppercase tracking-wider">
					SchoolMana@2024
				</Typography>
				<Typography className="w-fit text-textWhite font-semibold text-base italic">
					OOSE.Group7
				</Typography>
			</div>
		</footer>
	);
};

export default PublicFooter;
