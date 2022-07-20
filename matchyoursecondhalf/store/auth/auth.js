import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { thunks } from "./thunks";
import { thunks as userEditProfileThunks } from "store/user/edit-profile/thunks";
import { thunks as emailVerificationThunks } from "store/emailVerification/thunks";
import { selectors } from "./selectors";

const initialState = {
  token: Cookies.get('token') || '',
  loginStatus: 'idle'
};

export const slice = createSlice({
  name: 'auth',
  initialState: { ...initialState },
  reducers: {
    RESET_TOKEN: state => {
      state.token = '';
      state.loginStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.login.pending, (state) => {
        state.loginStatus = 'pending';
      })
      .addCase(thunks.login.fulfilled, (state, action) => {
        const { token } = action.payload;
        state.token = token;
        state.loginStatus = 'success';
      })
      .addCase(thunks.login.rejected, (state) => {
        state.loginStatus = 'fail';
      })
      .addCase(thunks.logout.fulfilled, (state) => {
        state.token = '';
        state.loginStatus = 'idle';
      })
      .addCase(userEditProfileThunks.changeEmail.fulfilled, (state, { payload }) => {
        state.token = payload.newLoginToken;
      })

      .addCase(emailVerificationThunks.emailVerification.fulfilled, (state, { payload }) => {
        const { token } = payload;
        state.token = token;
        state.loginStatus = 'success';
      });
  },
});

const auth = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { auth };

export default slice.reducer;
