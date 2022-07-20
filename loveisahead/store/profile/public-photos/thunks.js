import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";

const getPhotos = createAsyncThunk('public/get-main-photos', async (userId) => {
  try {
    const res = await api.userProfile.getPhotos(userId);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  getPhotos,
};

export { thunks };
