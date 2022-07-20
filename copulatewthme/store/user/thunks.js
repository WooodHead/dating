import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";
import { toast } from "react-toastify";

const getUserProfile = createAsyncThunk('user/profile', async () => {
  try {
    const res = await api.userProfile.getUserProfile();
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const changeAvatar = createAsyncThunk('user/avatar', async ({ file, values }) => {
  try {
    const res = await api.userProfile.changeAvatar(file);
    // console.log('=> RES AVATAR', res.data);
    toast.success('Avatar has been updated!');
    return {
      data: res.data,
      values
    };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const addAlbum = createAsyncThunk('user/album', async (payload) => {
  try {
    const res = await api.userProfile.addAlbum(payload);
    toast.success(`Album ${payload.name} has been created!`);
    return {
      data: res.data,
    };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const addPhoto = createAsyncThunk('user/addPhoto', async (payload) => {
  try {
    const res = await api.userProfile.addPhoto(payload);
    console.log('=> RES ADD PHOTO', res.data);
    const albumId = payload.get('albumId');
    toast.success(`Photo has been saved!`);
    return {
      data: res.data,
      ...(albumId && { albumId }),
    };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const getPhoto = createAsyncThunk('user/getPhoto', async ({photoId, albumId}) => {
  try {
    const res = await api.userProfile.getPhoto(photoId);
    return {
      data: res.data,
      photoId: photoId,
      albumId
    };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const deletePhoto = createAsyncThunk('user/deletePhoto', async ({ photoId, albumId }) => {
  try {
    const res = await api.userProfile.deletePhoto(photoId);
    toast.success(`Photo has been deleted!`);
    return {
      photoId,
      albumId
    };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  getUserProfile,
  changeAvatar,
  addAlbum,
  addPhoto,
  getPhoto,
  deletePhoto
};

export { thunks };
