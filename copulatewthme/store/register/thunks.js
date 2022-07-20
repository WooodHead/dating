import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import Router from "next/router";
import { toast } from "react-toastify";
import requestProcessing from "services/requestsProcessing";

const register = createAsyncThunk('auth/register', async (data) => {
  try {
    const res = await api.auth.register(data);
    Router.push({
      pathname: '/account-verified',
      query: {email: res.data.user.email}
    });
    return res.data;
  } catch (err) {
    const res = err.response;
    if (res?.status === 400) {
      res.data.message.forEach(errMsg => {
        toast.warning(errMsg);
      });
    } else {
      requestProcessing(err);
    }
    throw err;
  }
});

const thunks = {
  register
};

export { thunks };
