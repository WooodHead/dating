import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";

const getPhotoById = createAsyncThunk('photos/get-photo-by-id', async ({photoId, index}) => {
  try {
    const res = await api.userProfile.getPhoto(photoId);
    return {...res.data, index};
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  getPhotoById
};

export { thunks };
