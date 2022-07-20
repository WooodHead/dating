import { createSlice } from "@reduxjs/toolkit";
import { selectors } from "./selectors";
import { thunks } from "./thunks";
import { thunks as authThunks } from "store/auth/thunks";

const initialState = {
  registerStatus: 'idle'
};

export const slice = createSlice({
  name: 'register',
  initialState: { ...initialState },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(thunks.register.pending, (state) => {
        state.registerStatus = 'pending';
      })
      .addCase(thunks.register.fulfilled, (state) => {
        state.registerStatus = 'success';
      })
      .addCase(thunks.register.rejected, (state) => {
        state.registerStatus = 'fail';
      })
      .addCase(authThunks.logout.fulfilled, (state) => {
        state.registerStatus = 'idle';
      });
  },
});

const register = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { register };

export default slice.reducer;
