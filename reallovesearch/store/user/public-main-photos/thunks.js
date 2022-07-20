import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import { toast } from "react-toastify";
import requestProcessing from "services/requestsProcessing";

const deletePhoto = createAsyncThunk('user/delete-public-main-photo', async (photoId) => {
  try {
    const res = await api.userProfile.deletePhoto(photoId);
    toast.success('Photo has been deleted');
    return photoId;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const addPhoto = createAsyncThunk('user/add-public-main-photo', async (payload) => {
  try {
    const res = await api.userProfile.addPhoto(payload);
    toast.success(`Photo has been saved!`);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const getPhotos = createAsyncThunk('user/get-all-public-main-photos', async (userId) => {
  try {
    const res = await api.userProfile.getPhotos(userId);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  deletePhoto,
  addPhoto,
  getPhotos
};

export { thunks };
