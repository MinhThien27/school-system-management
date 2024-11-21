import { Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const FormClass = ({ data }) => {
	const [teacherData, setTeacherData] = useState(null);
	useEffect(() => {
		if (data) setTeacherData(data?.length === 0 ? null : data[0]);
	}, [data]);
	return (
		<div className="w-full h-full bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col">
			<Typography className="w-full py-2 text-sm font-semibold text-text bg-main/30 text-center rounded-t-md ">
				Lớp chủ nhiệm
			</Typography>
			{teacherData ? (
				<div className="w-full flex-1 px-10 pt-2 pb-4 flex flex-col">
					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Lớp:
						</Typography>
						<Link
							to={
								'/admin/manage-classes/' +
								teacherData?.id +
								'?page=1'
							}
						>
							<Typography className="text-sm text-blue-900 font-semibold hover:opacity-70">
								{teacherData?.name}&nbsp;
							</Typography>
						</Link>
					</div>
					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Sĩ số:
						</Typography>
						<Typography className="text-sm font-semibold ">
							{teacherData?.capacity}&nbsp;
						</Typography>
					</div>
					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Phòng:
						</Typography>
						<Typography className="text-sm font-semibold ">
							{teacherData?.roomCode}&nbsp;
						</Typography>
					</div>
					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Năm học:
						</Typography>
						<Typography className="text-sm font-semibold ">
							{teacherData?.academicYear?.name}&nbsp;
						</Typography>
					</div>
					<div className="flex flex-row gap-4 py-2">
						<Typography className="text-sm font-normal whitespace-nowrap ">
							Trạng thái:
						</Typography>
						<Typography className="text-sm font-semibold whitespace-nowrap">
							{teacherData?.status === 'Active'
								? 'Đang diễn ra'
								: 'Đã hoàn thành'}
							&nbsp;
						</Typography>
					</div>
				</div>
			) : (
				<div className="w-full flex-1 px-10 pt-2 pb-4 flex flex-col gap-2 items-center justify-center">
					<Typography className="text-base font-semibold text-center">
						Chưa có lớp chủ nhiệm.
					</Typography>
					<Link to={'/admin/manage-classes?page=1'}>
						<Typography className="text-sm font-semibold text-blue-900 underline text-center hover:opacity-80">
							Đến danh sách lớp
						</Typography>
					</Link>
				</div>
			)}
		</div>
	);
};

export default FormClass;
