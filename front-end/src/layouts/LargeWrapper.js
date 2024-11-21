import React, { useEffect } from 'react';
import { ScrollToTop } from '../utils/ScrollToTop';

const LargeWrapper = ({ children }) => {
	useEffect(() => {
		ScrollToTop();
	}, []);
	return <div className="max-w-[1200px] mx-auto">{children}</div>;
};

export default LargeWrapper;
