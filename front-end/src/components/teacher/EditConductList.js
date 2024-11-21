import React from 'react';
import { CONDUCT } from '../../config/constants';
import {
	Button,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Typography,
} from '@material-tailwind/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const EditConductList = ({ conductData, handleChangeConduct }) => {
	return (
		<div className="w-full flex flex-col shadow-around">
			{conductData.map((item) => (
				<Menu placement="left-start" className="w-full" allowHover>
					<MenuHandler>
						<Button
							variant="text"
							className="flex h-11 items-center justify-center hover:bg-transparent rounded-none gap-1 text-sm font-medium capitalize tracking-normal outline-none bg-upperBg p-0 border-solid border-[1px] border-t-0 border-gray-300 aria-expanded:bg-main/20"
						>
							<span className="whitespace-nowrap font-semibold">
								{item.value}
							</span>
							<ChevronDownIcon
								strokeWidth={2.5}
								className={`h-3.5 w-3.5 transition-transform `}
							/>
						</Button>
					</MenuHandler>
					<MenuList className="shadow-top min-w-fit p-0 rounded-sm">
						{Object.values(CONDUCT).map((conduct, index, arr) => (
							<MenuItem
								key={conduct}
								onClick={() =>
									handleChangeConduct(item.id, conduct)
								}
								className={`py-2 px-4 rounded-none ${
									index !== arr.length - 1 &&
									'border-b-[1px] border-solid border-gray-300'
								}`}
							>
								<Typography className="text-sm font-medium text-text">
									{conduct}
								</Typography>
							</MenuItem>
						))}
					</MenuList>
				</Menu>
			))}
		</div>
	);
};

export default EditConductList;
