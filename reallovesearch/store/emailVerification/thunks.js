import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import Router from "next/router";
import { toast } from "react-toastify";
import requestProcessing from "services/requestsProcessing";
import { authService } from "services/auth";

const emailVerification = createAsyncThunk('email-verification', async (token, {rejectWithValue}) => {
  try {
    const res = await api.userProfile.emailVerification(token);
    authService.setCookies({token: res.data.token})
    res.data.user.isFirstLogin ? Router.push('/subscription') : Router.push('/')
    toast.success('Your account successfully verificated');
    return res.data;
  } catch (err) {
    const res = err.response.data;
    
    if (res?.statusCode === 400) {
      toast.warning(res?.message);
      throw err;
    } else if (res?.statusCode === 403) {
      return rejectWithValue(res);
    } else {
      requestProcessing(err);
      throw err;
    }
  }
});

const emailVerificationResend = createAsyncThunk('email-verification-resend', async (data, {rejectWithValue}) => {
  try {
    const res = await api.userProfile.emailVerificationResend(data);
    toast.success('Email has been resent');
    return res.data;
  } catch (err) {
    const res = err.response.data;

    if (res?.statusCode === 400) {
      toast.warning(res?.message);
      throw err;
    } else if (res?.statusCode === 403) {
      return rejectWithValue(res);
    } else {
      requestProcessing(err);
      throw err;
    }
  }
});


const thunks = {
  emailVerification,
  emailVerificationResend
};

export { thunks };
