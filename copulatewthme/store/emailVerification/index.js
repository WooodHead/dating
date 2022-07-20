import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";


const initialState = {
  verificationStatus: 'idle'
};

export const slice = createSlice({
  name: 'verification',
  initialState: { ...initialState },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.emailVerification.pending, (state) => {
        state.verificationStatus = 'pending';
      })
      .addCase(thunks.emailVerification.fulfilled, (state) => {
        state.verificationStatus = 'success';
      })
      .addCase(thunks.emailVerification.rejected, (state) => {
        state.verificationStatus = 'fail';
      })
      .addCase(thunks.emailVerificationResend.pending, (state) => {
        state.verificationStatus = 'pending';
      })
      .addCase(thunks.emailVerificationResend.fulfilled, (state) => {
        state.verificationStatus = 'success';
      })
      .addCase(thunks.emailVerificationResend.rejected, (state) => {
        state.verificationStatus = 'fail';
      })

  },
});

const emailVerification = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { emailVerification };

export default slice.reducer;
