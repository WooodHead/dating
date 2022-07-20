import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import { authService } from "services/auth";
import Router from "next/router";
import { toast } from "react-toastify";
import requestProcessing from "services/requestsProcessing";

const register = createAsyncThunk('auth/register', async (data) => {
  try {
    const res = await api.auth.register(data);
    Router.push('account-verified');
    return res.data;
  } catch (err) {
    if (err?.response?.status === 400) {
      err.response.data.message.forEach(errMsg => {
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
