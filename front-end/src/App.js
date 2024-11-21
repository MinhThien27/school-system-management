import { RouterProvider } from 'react-router-dom';
import AppRouter from './routes';
import Notification from './components/notification/Notification';

function App() {
	return (
		<div className="bg-underBg relative w-full min-h-screen text-text font-sans *:selection:!text-upperBg *:selection:!bg-main">
			<RouterProvider router={AppRouter} />
			<Notification />
		</div>
	);
}

export default App;
