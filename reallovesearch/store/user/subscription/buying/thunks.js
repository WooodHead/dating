import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";

const buySubscription = createAsyncThunk('user/buySubscription', async (data) => {
  try {
    const res = await api.userProfile.changeEmail(data); // TODO: will change
    console.log('=> RES', res.data);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  buySubscription,
};

export { thunks };
