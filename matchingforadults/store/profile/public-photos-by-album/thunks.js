import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";

const getPhotosByAlbum = createAsyncThunk('user/get-photos-by-album', async (albumId) => {
  try {
    const res = await api.userProfile.getPhotosByAlbum(albumId);
    // console.log('=> RES GET PHOTO', res.data);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  getPhotosByAlbum,
};

export { thunks };
