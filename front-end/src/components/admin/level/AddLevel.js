import { ChevronDownIcon, PlusIcon } from '@heroicons/react/24/solid';
import {
	Button,
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Typography,
} from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { MAX_LEVEL, MIN__LEVEL } from '../../../config/constants';

const AddLevel = ({ submit, disable, data }) => {
	const [existedLevelList, setExistedLevelList] = useState(null);
	useEffect(() => {
		if (data) setExistedLevelList(data);
	}, [data]);

	const levelList = [];
	for (let i = MIN__LEVEL; i <= MAX_LEVEL; i++) {
		if (existedLevelList && !existedLevelList.includes(i))
			levelList.push(i);
	}

	const [openMenu, setOpenMenu] = React.useState(false);
	return (
		<Menu placement="bottom" open={openMenu} handler={setOpenMenu}>
			<MenuHandler>
				<Button
					color="indigo"
					className="py-2 px-4 bg-main/70 aria-expanded:opacity-60 focus-visible:outline-none"
					disabled={disable}
				>
					{openMenu ? (
						<ChevronDownIcon className="size-5" />
					) : (
						<PlusIcon className="size-5" />
					)}
				</Button>
			</MenuHandler>
			<MenuList className="shadow-top min-w-fit p-0 rounded-none max-h-48 overflow-y-auto">
				{levelList.map((level, index, arr) => (
					<MenuItem
						key={level}
						onClick={() => submit(level)}
						className={`py-1 px-3 rounded-none ${
							index !== arr.length - 1 &&
							'border-b-[1px] border-solid border-gray-300'
						}`}
					>
						<Typography className="text-sm font-medium text-text">
							{level}
						</Typography>
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	);
};

export default AddLevel;
