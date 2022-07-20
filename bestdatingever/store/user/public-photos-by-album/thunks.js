import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import { toast } from "react-toastify";
import requestProcessing from "services/requestsProcessing";

const deletePhoto = createAsyncThunk('user/delete-photo-by-album', async (photoId) => {
  try {
    const res = await api.userProfile.deletePhoto(photoId);
    // console.log('=> RES DEL PHOTO', res.data);
    toast.success('Photo has been deleted');
    return photoId;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const addPhoto = createAsyncThunk('user/add-photo-by-album', async (payload) => {
  try {
    const res = await api.userProfile.addPhotoByAlbum(payload);
    // console.log('=> RES ADD PHOTO', res.data);
    toast.success(`Photo has been saved!`);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

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

const editAlbum = createAsyncThunk('user/edit-album', async ({ albumId, data }) => {
  try {
    const res = await api.userPublicAlbums.editAlbum({ albumId, data });
    // console.log('=> RES EDIT ALBUM', res.data);
    toast.success('Album has been saved')
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  deletePhoto,
  addPhoto,
  getPhotosByAlbum,
  editAlbum,
};

export { thunks };
