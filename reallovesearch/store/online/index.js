import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";

const initialState = {
  list: [],
  status: 'idle',
};

const slice = createSlice({
  name: 'usersOnline',
  initialState: { ...initialState },
  reducers: {
    HANDLE_USER: (state, { payload }) => {
      const userIdIdx = state.list.findIndex(userId => userId === payload.id);
      
      if (payload.action === 'add') {
        if (userIdIdx === -1) state.list.push(payload.id);
      }
      
      if (payload.action === 'remove') {
        if (userIdIdx !== -1) state.list.splice(userIdIdx, 1);
      }
    },
    SET_SOCKET_STATUS: (state, { payload }) => {
      state.status = payload;
    },
    RESET_STATE: () => initialState
  },
});

const usersOnline = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { usersOnline };
export default slice.reducer;
