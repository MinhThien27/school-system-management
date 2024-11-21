import { createSlice } from '@reduxjs/toolkit';
import { NOTIFY_STYLE } from '../../config/constants';

const notificationSlice = createSlice({
	name: 'notification',
	initialState: { content: '', type: NOTIFY_STYLE.ERROR, id: '' },
	reducers: {
		notify: (state, action) => {
			if (!action.payload?.content || action.payload.content === '')
				return state;

			state.content = action.payload.content;
			state.type = action.payload.type;
			state.id = Date.now();
		},
		removeNotify: (state) => {
			state.content = '';
			state.id = '';
		},
	},
});

export const { notify, removeNotify } = notificationSlice.actions;

export default notificationSlice.reducer;

export const selectNotify = (state) => state.notification;
