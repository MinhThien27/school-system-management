import React, { useEffect, useState } from 'react';
import { Typography } from '@material-tailwind/react';
import SmallWrapper from '../../layouts/SmallWrapper';
import AddLevel from '../../components/admin/level/AddLevel';
import { useDispatch } from 'react-redux';
import {
	useAddLevelMutation,
	useGetLevelsQuery,
} from '../../services/level/levelApiSlice';
import { notify } from '../../services/notification/notificationSlice';
import { NOTIFY_STYLE } from '../../config/constants';
import LevelList from '../../components/admin/level/LevelList';

const ManageLevelsPage = () => {
	const dispatch = useDispatch();

	// danh sách
	const {
		data: levelListDataApi,
		isLoading,
		isError,
	} = useGetLevelsQuery({
		page: 0,
		quantity: 100,
	});
	const [levelListData, setLevelListData] = useState(null);
	useEffect(() => {
		if (levelListDataApi) setLevelListData(levelListDataApi.items);
	}, [levelListDataApi]);

	// thêm mới
	const [addLevel, { isLoading: addLoading }] = useAddLevelMutation();
	const handleAddLevel = async (level) => {
		try {
			await addLevel({ body: level }).unwrap();
			dispatch(
				notify({
					type: NOTIFY_STYLE.SUCCESS,
					content: 'Thêm thành công!',
				})
			);
		} catch (err) {
			let mess = '';
			if (!err?.status) {
				// isLoading: true until timeout occurs
				mess = 'Server không phản hồi';
			} else if (err.status === 400) {
				mess = 'Sai thông tin';
			} else if (err.status === 409) {
				mess = 'Khối đã tồn tại';
			} else if (err.status === 401) {
				mess = 'Phiên đã hết hạn';
			} else {
				mess = 'Hành động thất bại';
			}
			dispatch(notify({ type: NOTIFY_STYLE.ERROR, content: mess }));
		}
	};
	return (
		<SmallWrapper>
			<div className="w-full flex flex-col mb-10">
				<div className="flex justify-between items-center mb-4">
					<Typography className="text-lg text-text font-semibold">
						Danh sách khối
					</Typography>
					{/* thêm khối mới */}
					<AddLevel
						disable={addLoading || isError}
						submit={handleAddLevel}
						data={
							levelListData !== null
								? levelListData.map((l) => l.levelNumber)
								: []
						}
					/>
				</div>

				{/* danh sách  */}
				<LevelList
					isAddLoading={addLoading}
					isLoading={isLoading}
					isError={isError}
					data={levelListData}
				/>
			</div>
		</SmallWrapper>
	);
};

export default ManageLevelsPage;
