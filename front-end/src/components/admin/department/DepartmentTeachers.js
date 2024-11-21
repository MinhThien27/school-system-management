import React, { useEffect, useState } from 'react';
import DepartmentTeacherItem from './DepartmentTeacherItem';
import { useParams } from 'react-router-dom';
import { useGetDepartmentTeachersQuery } from '../../../services/department/departmentApiSlice';
import SpinnerLoading from '../../loading/SpinnerLoading';
import { Button, Typography } from '@material-tailwind/react';
import { PlusIcon } from '@heroicons/react/24/solid';
import AddTeacher from './AddTeacher';
import { useGetTeachersForDepartmentQuery } from '../../../services/teacher/teacherApiSlice';

const DepartmentTeachers = () => {
	const { departmentId } = useParams();
	const {
		data: departmentTeachersApi,
		isError: departmentTeacherError,
		isLoading: departmentTeacherLoading,
	} = useGetDepartmentTeachersQuery(departmentId);
	const [departmentTeachers, setDepartmentTeachers] = useState(null);
	useEffect(() => {
		if (departmentTeachersApi)
			setDepartmentTeachers(departmentTeachersApi?.items);
	}, [departmentTeachersApi]);
	const [activeAddNewTeacher, setActiveAddNewTeacher] = useState(false);

	//danh sách giáo viên để thêm vào
	const {
		data: teacherListDataApi,
		isLoading: teacherListLoading,
		refetch: refreshTeacherList,
	} = useGetTeachersForDepartmentQuery({
		page: 0,
		quantity: 100,
	});

	return (
		<div className="w-full flex flex-col mb-10">
			<div className="flex justify-between items-center mb-4">
				<Typography className="text-lg text-text font-semibold">
					Danh sách giáo viên
				</Typography>
				{/* thêm tổ mới */}
				<Button
					color="indigo"
					className="py-2 px-4 bg-main/70"
					disabled={activeAddNewTeacher}
					onClick={() => setActiveAddNewTeacher(true)}
				>
					<PlusIcon className="size-5" />
				</Button>
			</div>
			{activeAddNewTeacher && (
				<AddTeacher
					// isActive={activeAddNewTeacher}
					setActive={setActiveAddNewTeacher}
					data={teacherListDataApi}
					loading={teacherListLoading}
					refetch={refreshTeacherList}
				/>
			)}
			<div className="w-full">
				{departmentTeacherLoading && <SpinnerLoading />}
				{departmentTeachers?.length > 0 && !departmentTeacherLoading ? (
					departmentTeachers?.map((teacher) => (
						<DepartmentTeacherItem
							key={teacher?.id}
							data={teacher}
							setInactive={() => setActiveAddNewTeacher(false)}
						/>
					))
				) : (
					<Typography
						className={`w-full h-min py-4 bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center mb-4 ${
							(activeAddNewTeacher || departmentTeacherLoading) &&
							'hidden'
						}`}
					>
						Danh sách rỗng
					</Typography>
				)}
				{departmentTeacherError && !activeAddNewTeacher && (
					<Typography
						className={`w-full h-min py-4 bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col items-center mb-4`}
					>
						Đã có lỗi xảy ra!
					</Typography>
				)}
			</div>
		</div>
	);
};

export default DepartmentTeachers;
