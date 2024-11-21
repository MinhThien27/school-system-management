import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { BASE_URL, TAG_TYPES } from '../config/constants';
import { logOut, setCredentials } from '../services/auth/authSlice';
import { decodeToken } from '../utils/authUtils';

const baseQuery = fetchBaseQuery({
	baseUrl: BASE_URL,
	credentials: 'include',
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;
		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result?.error?.originalStatus === 403) {
		// send refresh token to get new access token
		const { accessToken } = await baseQuery('/refresh', api, extraOptions);
		const { UserInfo } = decodeToken(accessToken);
		if (accessToken) {
			// store the new token
			api.dispatch(setCredentials({ UserInfo, accessToken }));
			// retry the original query with new access token
			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logOut());
		}
	}

	return result;
};

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithReAuth,
	tagTypes: TAG_TYPES,
	endpoints: (builder) => ({}),
});
