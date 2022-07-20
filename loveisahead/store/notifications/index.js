import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";

const initialState = {
  list: [],
  listCount: 0,
  listStatus: 'idle',
  listIsVisible: false,
  deleteNotificationStatus: 'idle',
  deleteAllNotificationsStatus: 'idle',
  socketStatus: 'idle',
};

const slice = createSlice({
  name: 'userNotifications',
  initialState: { ...initialState },
  reducers: {
    SET_NEW_NOTIFICATION: (state, { payload }) => {
      state.list.unshift({ ...payload.data, type: payload.type });
      state.listCount++;
    },
    DELETE_NOTIFICATION: (state, { payload }) => {
      state.list = state.list.filter(notification => !payload.includes(notification._id));
      state.listCount = state.list.length;
    },
    SET_LIST_VISIBLE: (state, { payload }) => {
      state.listIsVisible = payload;
    },
    SET_SOCKET_STATUS: (state, { payload }) => {
      state.socketStatus = payload;
    },
    RESET_STATE: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getNotifications.pending, (state) => {
        state.listStatus = 'pending';
      })
      .addCase(thunks.getNotifications.fulfilled, (state, { payload }) => {
        // TODO: reverse and sort by date
        state.list = payload.messages.map(msg => ({ ...msg, type: 'Chat' })).reverse();
        // TODO: check type 'Album' when we will receive
        state.listCount = payload.messages.length;
        state.listStatus = 'success';
      })
      .addCase(thunks.getNotifications.rejected, (state) => {
        state.listStatus = 'fail';
      })
      
      .addCase(thunks.deleteNotification.pending, (state) => {
        state.deleteNotificationStatus = 'pending';
      })
      .addCase(thunks.deleteNotification.fulfilled, (state, { payload }) => {
        const msgIdx = state.list.findIndex(msg => msg._id === payload.notificationId);
        if (msgIdx !== -1) {
          state.list.splice(msgIdx, 1);
          state.listCount--;
        }
        state.deleteNotificationStatus = 'success';
      })
      .addCase(thunks.deleteNotification.rejected, (state) => {
        state.deleteNotificationStatus = 'fail';
      })
      
      .addCase(thunks.deleteAllNotifications.pending, (state) => {
        state.deleteAllNotificationsStatus = 'pending';
      })
      .addCase(thunks.deleteAllNotifications.fulfilled, (state) => {
        state.list = [];
        state.listCount = 0;
        state.deleteAllNotificationsStatus = 'success';
      })
      .addCase(thunks.deleteAllNotifications.rejected, (state) => {
        state.deleteAllNotificationsStatus = 'fail';
      });
  },
});

const userNotifications = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { userNotifications };
export default slice.reducer;
