import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";

const initialState = {
  settings: {},
  status: 'idle',
  saveSettingsStatus: 'idle',
};

const slice = createSlice({
  name: 'userSettings',
  initialState: { ...initialState },
  reducers: {
    RESET_STATE: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getUserSettings.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(thunks.getUserSettings.fulfilled, (state, { payload }) => {
        const { _id, ...settings } = payload;
        state.settings = settings;
        state.status = 'success';
      })
      .addCase(thunks.getUserSettings.rejected, (state) => {
        state.status = 'fail';
      })
      
      .addCase(thunks.saveUserSettings.pending, (state) => {
        state.saveSettingsStatus = 'pending';
      })
      .addCase(thunks.saveUserSettings.fulfilled, (state, { payload }) => {
        const { _id, ...settings } = payload;
        state.settings = settings;
        state.saveSettingsStatus = 'success';
      })
      .addCase(thunks.saveUserSettings.rejected, (state) => {
        state.saveSettingsStatus = 'fail';
      });
  },
});

const userSettings = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { userSettings };
export default slice.reducer;
