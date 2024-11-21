import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Sidebar from '../components/sidebar/SideBar';

const SideBarLayout = () => {
	return (
		<div className="flex min-h-screen bg-underBg">
			<div className="fixed top-0 left-0 right-0 h-14 shadow-md shadow-gray-300 z-20">
				<Header />
			</div>
			<div className="w-1/6 fixed top-0 left-0 bottom-0 pt-14 z-10">
				<Sidebar />
			</div>
			<div className="flex-1 pl-[calc(100%/6)] pt-14 flex flex-col">
				<div className="py-4 flex-1 max-w-screen-desktop mx-auto">
					<Outlet />
				</div>
				<Footer />
			</div>
		</div>
	);
};
export default SideBarLayout;
