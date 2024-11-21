export const isNumber = (input) => {
	const regex = /^(\d+(\.\d+)?|\.|\.\d+)$/;
	return regex.test(input);
};
