import { createSlice } from "@reduxjs/toolkit";
import { selectors } from "./selectors";
import { thunks } from "./thunks";

const initialState = {
  contactStatus: 'idle'
};

export const slice = createSlice({
  name: 'contactUs',
  initialState: { ...initialState },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(thunks.contact.pending, (state) => {
        state.contactStatus = 'pending';
      })
      .addCase(thunks.contact.fulfilled, (state) => {
        state.contactStatus = 'success';
      })
      .addCase(thunks.contact.rejected, (state) => {
        state.contactStatus = 'fail';
      })
  },
});

const contactUs = {
  actions: slice.actions,
  selectors,
  thunks,
};

export { contactUs };

export default slice.reducer;
