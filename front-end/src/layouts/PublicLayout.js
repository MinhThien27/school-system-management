// import PublicHeader from '../components/header/PublicHeader';
// import PublicFooter from '../components/footer/PublicFooter';

import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
	return (
		<div className="h-screen relative bg-publicBg bg-no-repeat bg-cover bg-center">
			{/* <PublicHeader /> */}
			<Outlet />
			{/* <PublicFooter /> */}
		</div>
	);
};

export default PublicLayout;
