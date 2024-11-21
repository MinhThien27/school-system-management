export const removeDiacritics = (str) => {
	return str
		.normalize('NFD') // Chuyển sang dạng phân tách
		.replace(/[\u0300-\u036f]/g, ''); // Loại bỏ các ký tự dấu
};
