import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
	selectCurrentToken,
	selectUserRole,
} from '../../services/auth/authSlice';

const RequireAuthWrapper = ({ allowedRoles }) => {
	const token = useSelector(selectCurrentToken);
	const userRole = useSelector(selectUserRole);
	const location = useLocation();

	return token && allowedRoles?.includes(userRole) ? (
		<Outlet />
	) : (
		<Navigate
			to={userRole ? '/' + userRole?.toString()?.toLowerCase() : '/'}
			state={{ from: location }}
			replace
		/>
	);
};
export default RequireAuthWrapper;
