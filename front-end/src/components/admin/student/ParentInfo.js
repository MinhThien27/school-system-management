import { Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import ParentItem from './ParentItem';
import NewParent from './NewParent';
import { MAX_PARENT } from '../../../config/constants';
import { useGetParentByStudentQuery } from '../../../services/student/studentApiSlice';
import { useParams } from 'react-router-dom';

const ParentInfo = () => {
	const { studentID } = useParams();
	//phụ huynh
	const { data: parentDataApi } = useGetParentByStudentQuery(studentID);
	const [parentData, setParentData] = useState(null);
	useEffect(() => {
		if (parentDataApi) setParentData(parentDataApi);
	}, [parentDataApi]);

	return (
		<div className="w-full flex flex-col my-10">
			<div className="flex justify-between items-center mb-1">
				<Typography className="text-lg text-text font-semibold my-2">
					Phụ huynh
				</Typography>
			</div>
			<div className="w-full h-min grid grid-cols-2 gap-4">
				{parentData?.totalItems > 0 ? (
					<>
						{parentData?.items?.map((parent) => (
							<ParentItem
								key={parent.id}
								data={parent}
								studentID={studentID}
							/>
						))}

						{parentData?.totalItems < MAX_PARENT && (
							<NewParent studentID={studentID} />
						)}
					</>
				) : (
					<NewParent studentID={studentID} />
				)}
			</div>
		</div>
	);
};

export default ParentInfo;
