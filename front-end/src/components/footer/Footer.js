import { Typography } from '@material-tailwind/react';
import React from 'react';

const Footer = () => {
	return (
		<div className="flex flex-row justify-between bg-gray-100 pb-3 pt-2 px-6 border-t-[1px] border-solid border-gray-300 pointer-events-none select-none">
			<Typography className="text-gray-600 text-sm leading-6">
				Copyright © 2024 MANAS
			</Typography>
			<Typography className="text-gray-600 text-sm leading-6">
				Version 1.0
			</Typography>
		</div>
	);
};

export default Footer;
