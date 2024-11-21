export const formatTimestamp = (timestamp) => {
	if (!timestamp) return '';
	const date = new Date(timestamp);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	const formattedDate = `${day} / ${month} / ${year}`;
	return formattedDate;
};

export const formatTimestampToValue = (timestamp) => {
	if (!timestamp) return '';
	const date = new Date(timestamp);

	// Chuyển đổi thành định dạng yyyy-MM-dd
	const formattedDate = date.toISOString().split('T')[0];

	return formattedDate;
};
