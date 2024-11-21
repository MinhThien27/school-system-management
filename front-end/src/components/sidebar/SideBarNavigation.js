import { Typography } from '@material-tailwind/react';
import React from 'react';
import { NavLink } from 'react-router-dom';

const SideBarNavigation = ({ list }) => {
	return (
		<div className="flex flex-col text-text overflow-y-scroll flex-1 pb-6 pt-1">
			{list.map((navigateItem) => (
				<div
					key={'navigate' + navigateItem.title}
					className="flex flex-col"
				>
					<Typography className="text-xs uppercase font-semibold pt-3 pb-3 pl-4 pointer-events-none select-none">
						{navigateItem.title}
					</Typography>
					<div className="flex flex-col gap-1">
						{navigateItem.list.map((item) => (
							<NavLink
								key={'navigate-item-' + item.title}
								to={item.path}
								className={({ isActive }) =>
									`flex gap-3 ml-2 mr-1 pl-6 py-3 rounded-md hover:bg-main/5 hover:text-main relative items-center ${
										isActive &&
										'bg-main/10 hover:bg-main/20 text-main before:contents-[""] before:absolute before:h-full before:w-1 before:bg-main before:left-0 before:top-0 before:rounded-md'
									}`
								}
								end={item?.end}
							>
								<span>{item.icon}</span>
								<Typography className="text-sm font-semibold">
									{item.title}
								</Typography>
							</NavLink>
						))}
					</div>
				</div>
			))}
		</div>
	);
};

export default SideBarNavigation;
