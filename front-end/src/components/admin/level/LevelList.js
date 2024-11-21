import React, { useEffect, useState } from 'react';
import LevelItem from './LevelItem';
import LevelItemSkeleton from './LevelItemSkeleton';
import { Typography } from '@material-tailwind/react';

const LevelList = ({ isAddLoading, isLoading, isError, data }) => {
	const [levelListData, setLevelListData] = useState(null);
	useEffect(() => {
		if (data) setLevelListData(data);
	}, [data]);

	return (
		<div className="w-[940px] grid grid-cols-2 gap-4">
			{isAddLoading && <LevelItemSkeleton />}
			{isLoading && (
				<>
					<LevelItemSkeleton />
					<LevelItemSkeleton />
					<LevelItemSkeleton />
					<LevelItemSkeleton />
				</>
			)}
			{levelListData &&
				levelListData?.map((level) => (
					<LevelItem key={level?.id} data={level} />
				))}

			{levelListData && !levelListData?.length > 0 && (
				<Typography className="font-semibold text-sm text-gray-500">
					Danh sách rỗng. Hãy thêm khối mới!
				</Typography>
			)}
			{(!levelListData || isError) && (
				<Typography className="font-semibold text-sm text-gray-500">
					Đã có lỗi xảy ra :((
				</Typography>
			)}
		</div>
	);
};

export default LevelList;
