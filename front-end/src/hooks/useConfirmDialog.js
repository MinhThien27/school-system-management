import { useState } from 'react';

const useConfirmDialog = (initState) => {
	const [open, setOpen] = useState(initState);
	const toggle = () => {
		setOpen((prev) => !prev);
	};
	return [open, toggle];
};

export default useConfirmDialog;
