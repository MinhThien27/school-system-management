import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectNotify } from '../../services/notification/notificationSlice';
import { Alert } from '@material-tailwind/react';
import {
	CheckCircleIcon,
	ExclamationCircleIcon,
	ExclamationTriangleIcon,
} from '@heroicons/react/24/solid';
import { NOTIFY_DURATION, NOTIFY_STYLE } from '../../config/constants';

function Notification() {
	const data = useSelector(selectNotify);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		data.content === '' ? setIsVisible(false) : setIsVisible(true);
	}, [data]);

	useLayoutEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, NOTIFY_DURATION);

		return () => {
			clearTimeout(timer);
		};
	}, [data]);

	return (
		<div className={`fixed top-5 right-0 z-[10000]`}>
			<Alert
				icon={
					data.type === NOTIFY_STYLE.ERROR ? (
						<ExclamationCircleIcon className="w-5 h-5" />
					) : data.type === NOTIFY_STYLE.SUCCESS ? (
						<CheckCircleIcon className="w-5 h-5" />
					) : (
						<ExclamationTriangleIcon className="w-5 h-5" />
					)
				}
				className={`relative flex flex-row items-center rounded-r-md rounded-l-none border-l-8 border-solid bg-white/80 backdrop-blur-sm font-medium transition-transform duration-500 transform ease-in-out  shadow-top ${
					isVisible
						? '-translate-x-5 max-w-fit max-h-fit'
						: 'translate-x-full'
				} ${
					data.type === NOTIFY_STYLE.ERROR
						? 'border-error text-error'
						: data.type === NOTIFY_STYLE.SUCCESS
						? 'border-success text-success'
						: 'border-warning text-warning'
				}`}
			>
				{data.content}
			</Alert>
		</div>
	);
}

export default Notification;
