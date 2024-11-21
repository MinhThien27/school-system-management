import React from 'react';
import {
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
} from '@material-tailwind/react';

export function ConfirmDialog({
	open,
	toggle,
	type,
	header,
	content,
	confirmButton,
}) {
	return (
		<Dialog size="xs" open={open} handler={toggle}>
			<DialogHeader className="justify-center">{header}</DialogHeader>
			<DialogBody className="text-center font-normal text-lg">
				{content}
			</DialogBody>
			<DialogFooter>
				<Button
					variant="text"
					color="gray"
					onClick={toggle}
					className="mr-1"
				>
					<span>Hủy</span>
				</Button>
				{confirmButton}
			</DialogFooter>
		</Dialog>
	);
}
