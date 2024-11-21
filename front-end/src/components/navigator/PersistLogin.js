import { useState, useEffect } from 'react';
import { useRefreshMutation } from '../../services/auth/authApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectCurrentToken,
	setCredentials,
} from '../../services/auth/authSlice';
import { decodeToken } from '../../utils/authUtils';
import { Spinner } from '@material-tailwind/react';

const PersistLogin = ({ children }) => {
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [refresh] = useRefreshMutation();
	const token = useSelector(selectCurrentToken);

	useEffect(() => {
		let isMounted = true;

		const verifyRefreshToken = async () => {
			try {
				const { accessToken } = await refresh().unwrap();
				const { UserInfo } = decodeToken(accessToken);
				dispatch(setCredentials({ UserInfo, accessToken }));
			} catch (err) {
				console.error(err);
			} finally {
				isMounted && setIsLoading(false);
			}
		};

		// persist added here AFTER tutorial video
		// Avoids unwanted call to verifyRefreshToken
		!token ? verifyRefreshToken() : setIsLoading(false);

		return () => (isMounted = false);
	}, [token, refresh, dispatch]);

	return (
		<>
			{isLoading ? (
				<div className="w-full h-screen flex justify-center items-center">
					<Spinner className="size-20" color="indigo" />
				</div>
			) : (
				children
			)}
		</>
	);
};

export default PersistLogin;
