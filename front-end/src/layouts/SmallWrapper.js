import React, { useEffect } from 'react';
import { ScrollToTop } from '../utils/ScrollToTop';

const SmallWrapper = ({ children }) => {
	useEffect(() => {
		ScrollToTop();
	}, []);
	return <div className="max-w-[940px] mx-auto">{children}</div>;
};

export default SmallWrapper;
