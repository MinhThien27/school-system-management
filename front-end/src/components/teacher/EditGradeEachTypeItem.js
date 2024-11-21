import React, { useEffect, useRef } from 'react';
import { MAX_POINT, MIN_POINT } from '../../config/constants';
import { isNumber } from '../../utils/IsNumber';

const EditGradeEachTypeItem = ({ gradeData, setGradeData }) => {
	//input control
	const inputRefs = useRef([]);
	const handleKeyDown = (event, index) => {
		const len = inputRefs.current.length;
		if (event.key === 'Enter' || event.key === 'ArrowDown') {
			event.preventDefault();
			if (index < len - 1) {
				inputRefs.current[index + 1].focus();
				inputRefs.current[index + 1].select();
			} else if (index === len - 1) {
				inputRefs.current[0].focus();
				inputRefs.current[0].select();
			}
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (index > 0) {
				inputRefs.current[index - 1].focus();
				inputRefs.current[index - 1].select();
			} else {
				inputRefs.current[len - 1].focus();
				inputRefs.current[len - 1].select();
			}
		}
	};
	useEffect(() => {
		inputRefs.current[0].focus();
		inputRefs.current[0].select();
	}, []);

	//handle change
	const handleChangeInput = (index, value) => {
		let x = value === '' ? null : value;

		if (x && x.toString().split('.').length > 2) {
			return;
		}

		if (x === null || x.toString().endsWith('.') || isNumber(value)) {
			setGradeData(
				gradeData.map((item, i) => (index === i ? value : item))
			);
		}
	};
	const handleFormat = () => {
		setGradeData(
			gradeData.map((item) => {
				if (item === null || item === '') return null;
				if (Number(item) > MAX_POINT) {
					return MAX_POINT;
				}
				if (Number(item) < MIN_POINT) {
					return MIN_POINT;
				}
				return Number.isInteger(item)
					? Number(item)
					: Number(item).toFixed(1);
			})
		);
	};

	return (
		<div className="w-full flex flex-col shadow-around">
			{gradeData.map((item, index) => (
				<input
					key={'edit_item_' + index}
					value={item !== null ? item : ''}
					onChange={(e) => handleChangeInput(index, e.target.value)}
					ref={(el) => (inputRefs.current[index] = el)}
					onKeyDown={(e) => handleKeyDown(e, index)}
					className={`w-full h-11 text-center text-sm font-semibold border-solid border-gray-200 border-[1px] border-t-none outline-none hover:bg-gray-100 focus:border-gray-500 ${
						index % 2 === 0 && 'bg-upperBg'
					}`}
					onBlur={handleFormat}
				/>
			))}
		</div>
	);
};

export default EditGradeEachTypeItem;
