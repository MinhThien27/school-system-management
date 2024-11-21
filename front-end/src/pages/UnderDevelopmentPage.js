import { Spinner, Typography } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const UnderDevelopmentPage = () => {
	const location = useLocation();
	const [loading, setLoading] = useState(true);
	const [previousUrl, setPreviousUrl] = useState('');

	useEffect(() => {
		if (location.pathname !== previousUrl) {
			setPreviousUrl(location.pathname);
		}
	}, [location, previousUrl]);

	useEffect(() => {
		if (location.pathname !== previousUrl) setLoading(true);
		const timer = setTimeout(
			() => setLoading(false),
			Math.floor(Math.random() * 1000 + 500)
		);
		return () => clearTimeout(timer);
	}, [previousUrl, location]);

	return (
		<div className="w-full h-full flex items-center justify-center">
			<div className="w-[660px] h-[200px] col-span-2 bg-white rounded-md border-[1px] border-solid border-gray-300 shadow-sm shadow-gray-400 flex flex-col gap-1 items-center pt-16 mb-10">
				{!loading ? (
					<>
						<Typography className="font-semibold text-xl uppercase">
							Chức năng đang trong quá trình phát triển
						</Typography>
						<Link
							to="/redirect"
							className="inline-block rounded-lg border border-white py-2 text-center text-lg font-medium text-main bg-highlight transition hover:opacity-50  underline underline-offset-2"
						>
							Trang chủ
						</Link>{' '}
					</>
				) : (
					<Spinner className="w-20 h-20" color="indigo" />
				)}
			</div>
		</div>
	);
};

export default UnderDevelopmentPage;
