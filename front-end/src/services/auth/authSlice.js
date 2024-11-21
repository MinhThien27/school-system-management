import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
	name: 'auth',
	initialState: { user: null, token: null, role: null },
	reducers: {
		setCredentials: (state, action) => {
			const { UserInfo, accessToken } = action.payload;
			state.user = UserInfo;
			state.token = accessToken;
			state.role = UserInfo.role;
		},
		logOut: (state) => {
			state.user = null;
			state.token = null;
			state.role = null;
		},
	},
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectUserRole = (state) => state.auth.role;
