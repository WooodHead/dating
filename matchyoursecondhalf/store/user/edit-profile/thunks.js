import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import { toast } from "react-toastify";
import Router from "next/router";
import requestProcessing from "services/requestsProcessing";

const userEditProfile = createAsyncThunk('user/edit-profile', async (userData) => {
  try {
    const res = await api.userProfile.userEditProfile(userData);
    // console.log('=> RES USER', res.data);
    toast.success('User data was saved!');
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const changeEmail = createAsyncThunk('user/change-email', async (data) => {
  try {
    const res = await api.userProfile.changeEmail(data);
    Router.push('/login');
    toast.success('A letter has been sent to your old email');
    return {
      ...res.data,
      ...data
    };
  } catch (err) {
    if (err?.response?.status === 400) {
      err.response.data.forEach(errMsg => {
        const formattedErrMsg = errMsg.split(' - ');
        toast.warning(formattedErrMsg[1]);
      });
    } else {
      requestProcessing(err);
    }
    throw err;
  }
});

const changePhone = createAsyncThunk('user/change-phone', async (data) => {
  try {
    const res = await api.userProfile.changePhone(data);
    toast.success(`Your phone has been successfully changed`);
    return res.data.phone;
  } catch (err) {
    if (err?.response?.status === 400) {
      err.response.data.forEach(errMsg => {
        const formattedErrMsg = errMsg.split(' - ');
        toast.warning(formattedErrMsg[1]);
      });
    } else {
      requestProcessing(err);
    }
    throw err;
  }
});

const changePassword = createAsyncThunk('user/change-password', async (data) => {
  try {
    const res = await api.userProfile.changePassword(data);
    // console.log('=> RES', res.data);
    return res.data;
  } catch (err) {
    const errData = err?.response?.data;
    if (errData?.statusCode === 400) {
      toast.warning(errData.message);
    } else {
      requestProcessing(err);
    }
    throw err;
  }
});

const resetPassword = createAsyncThunk('user/reset-password', async  (data) => {
  try {
    const res = await api.userProfile.resetPassword(data);
    return res.data;
  } catch (err) {
    const errData = err?.response?.data;
    if (errData?.statusCode === 400) {
      toast.warning(errData.message[0]);
    } else {
      requestProcessing(err);
    }
    throw err;
  }
});

const resendResetPassword = createAsyncThunk('user/resend-reset-password', async  (data) => {
  try {
    const res = await api.userProfile.resetPassword(data);
    return res.data;
  } catch (err) {
    const errData = err?.response?.data;
    if (errData?.statusCode === 400) {
      toast.warning(errData.message[0]);
    } else {
      requestProcessing(err);
    }
    throw err;
  }
});

const createNewPassword = createAsyncThunk('user/create-new-password', async  ({formData, token}) => {
  try {
    const { data } = await api.userProfile.createNewPassword(formData, token);
    Router.push('/login');
    toast.success(data.message);
    return data;
  } catch (err) {
    const errData = err?.response?.data;
    if (errData?.statusCode === 400) {
      toast.warning(errData.message[0]);
    } else {
      requestProcessing(err);
    }
    throw err;
  }
});

const thunks = {
  userEditProfile,
  changeEmail,
  changePhone,
  changePassword,
  resetPassword,
  resendResetPassword,
  createNewPassword,
};

export { thunks };
