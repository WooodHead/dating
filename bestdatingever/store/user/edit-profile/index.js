import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";

const initialState = {
  editProfileStatus: 'idle',
  changeEmailStatus: 'idle',
  changePhoneStatus: 'idle',
  changePasswordStatus: 'idle',
  resetPasswordStatus: 'idle',
  onResendStatus: 'idle',
  createNewPasswordStatus: 'idle',
};

export const slice = createSlice({
  name: 'userEditProfile',
  initialState: { ...initialState },
  reducers: {
    RESET_STATUS: (state, { payload }) => {
      state[payload] = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.userEditProfile.pending, (state) => {
        state.editProfileStatus = 'pending';
      })
      .addCase(thunks.userEditProfile.fulfilled, (state) => {
        state.editProfileStatus = 'success';
      })
      .addCase(thunks.userEditProfile.rejected, (state) => {
        state.editProfileStatus = 'fail';
      })
  
      .addCase(thunks.changeEmail.pending, (state) => {
        state.changeEmailStatus = 'pending';
      })
      .addCase(thunks.changeEmail.fulfilled, (state) => {
        state.changeEmailStatus = 'success';
      })
      .addCase(thunks.changeEmail.rejected, (state) => {
        state.changeEmailStatus = 'fail';
      })

      .addCase(thunks.changePhone.pending, (state) => {
        state.changePhoneStatus = 'pending';
      })
      .addCase(thunks.changePhone.fulfilled, (state) => {
        state.changePhoneStatus = 'success';
      })
      .addCase(thunks.changePhone.rejected, (state) => {
        state.changePhoneStatus = 'fail';
      })
      
      .addCase(thunks.changePassword.pending, (state) => {
        state.changePasswordStatus = 'pending';
      })
      .addCase(thunks.changePassword.fulfilled, (state) => {
        state.changePasswordStatus = 'success';
      })
      .addCase(thunks.changePassword.rejected, (state) => {
        state.changePasswordStatus = 'fail';
      })

      .addCase(thunks.resetPassword.pending, (state) => {
        state.resetPasswordStatus = 'pending';
      })
      .addCase(thunks.resetPassword.fulfilled, (state) => {
        state.resetPasswordStatus = 'success';
      })
      .addCase(thunks.resetPassword.rejected, (state) => {
        state.resetPasswordStatus = 'fail';
      })

      .addCase(thunks.resendResetPassword.pending, (state) => {
        state.onResendStatus = 'pending';
      })
      .addCase(thunks.resendResetPassword.fulfilled, (state) => {
        state.onResendStatus = 'success';
      })
      .addCase(thunks.resendResetPassword.rejected, (state) => {
        state.onResendStatus = 'fail';
      })

      .addCase(thunks.createNewPassword.pending, (state) => {
        state.createNewPasswordStatus = 'pending';
      })
      .addCase(thunks.createNewPassword.fulfilled, (state) => {
        state.createNewPasswordStatus = 'success';
      })
      .addCase(thunks.createNewPassword.rejected, (state) => {
        state.createNewPasswordStatus = 'fail';
      });
  },
});

const userEditProfile = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { userEditProfile };
export default slice.reducer;
