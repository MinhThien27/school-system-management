import { useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../services/auth/authSlice';
import { ROLES } from '../../config/constants';

const Redirect = () => {
	const userRole = useSelector(selectUserRole);
	const location = useLocation();

	return userRole === ROLES.ADMIN ? (
		<Navigate to="/admin" state={{ from: location }} replace />
	) : userRole === ROLES.STUDENT ? (
		<Navigate to="/student" state={{ from: location }} replace />
	) : userRole === ROLES.TEACHER ? (
		<Navigate to="/teacher" state={{ from: location }} replace />
	) : (
		<Navigate to="/" state={{ from: location }} replace />
	);
};
export default Redirect;
