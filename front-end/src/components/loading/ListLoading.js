import React from 'react';
import ListItemLoading from './ListItemLoading';

const ListLoading = ({ value }) => {
	const loopList = [];
	for (let index = 0; index < value; index++) {
		loopList.push(index);
	}
	return (
		<div className="w-full">
			{loopList.map((item) => (
				<ListItemLoading
					key={item}
					className={item % 2 === 0 ? 'bg-main/5' : ''}
				/>
			))}
		</div>
	);
};

export default ListLoading;
