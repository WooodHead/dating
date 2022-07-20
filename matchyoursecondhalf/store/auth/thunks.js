import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import { auth } from "./auth";
import { authService } from "services/auth";
import Router from "next/router";
import { toast } from "react-toastify";
import requestProcessing from "services/requestsProcessing";

const login = createAsyncThunk('auth/login', async (data, {rejectWithValue}) => {
  try {
    const res = await api.auth.login(data);
    // console.log('=> RES LOGIN', res.data);
    authService.setCookies({ token: res.data.token });
    res.data.user.isFirstLogin ? Router.push('/subscription') : Router.push('/');
    return res.data;
  } catch (err) {
    const res = err.response.data;

    if (res?.statusCode === 400) {
      toast.warning(res?.message);
      throw err;
    } else if (res?.statusCode === 403) {
      return rejectWithValue(res);
    } else if (res?.statusCode === 418) {
      return rejectWithValue(res);
    } else {
      requestProcessing(err);
      throw err;
    }
  }
});

const logoutImmediately = () => dispatch => {
  dispatch(auth.actions.RESET_TOKEN());
  authService.removeCookies();
  Router.push('/');
};

const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await api.auth.logout();
    authService.removeCookies();
    Router.push('/');
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  login,
  logout,
  logoutImmediately,
};

export { thunks };
