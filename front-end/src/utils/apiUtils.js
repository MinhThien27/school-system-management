export const providesId = (id, tagType) => {
	return [{ type: tagType, id: id }];
};

export const providesList = (resultsWithIds, tagType) => {
	return resultsWithIds
		? [
				{ type: tagType, id: 'LIST' },
				...resultsWithIds?.map(({ id }) => ({ type: tagType, id })),
		  ]
		: [{ type: tagType, id: 'LIST' }];
};

export const invalidatesId = (id, tagType) => {
	return [{ type: tagType, id: id }];
};

export const invalidatesList = (tagType) => {
	return [{ type: tagType, id: 'LIST' }];
};
