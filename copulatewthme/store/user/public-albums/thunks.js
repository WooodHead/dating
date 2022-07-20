import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";
import { userPublicAlbums } from "./index";
import { toast } from "react-toastify";

const createAlbum = createAsyncThunk('user/create-public-albums', async (data) => {
  try {
    const res = await api.userPublicAlbums.addAlbum(data)
    toast.success('Album has been created');
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const getPublicAlbums = createAsyncThunk('user/public-albums', async ({ userId, type }, { getState }) => {
  try {
    const { offset, take } = userPublicAlbums.selectors.pagination(getState());
    const res = await api.userPublicAlbums.getPublicAlbums({ userId, offset, take });
    // console.log('=> RES ALBUMS', res.data);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const getPublicAlbumInfo = createAsyncThunk('user/public-album-info', async (albumId) => {
  try {
    const res = await api.userPublicAlbums.getPublicAlbumInfo(albumId);
    // console.log('=> RES ALBUM INFO', res.data);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const deletePublicAlbum = createAsyncThunk('user/delete-public-album', async ({ albumId, userId, page }, { dispatch, getState }) => {
  try {
    const res = await api.userPublicAlbums.deletePublicAlbum({ albumId });
    toast.success('Album has been deleted');
    const currentAlbumsCount = userPublicAlbums.selectors.albums(getState()).length;
    let responsePage = page;
    if(currentAlbumsCount <= 1 && page > 1) {
      responsePage -= 1;
      dispatch(userPublicAlbums.actions.CHANGE_PAGE(responsePage))
    }
    dispatch(userPublicAlbums.actions.RESET_ALBUMS());
    dispatch(userPublicAlbums.thunks.getPublicAlbums({ userId }));
    return responsePage;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  createAlbum,
  getPublicAlbums,
  getPublicAlbumInfo,
  deletePublicAlbum,
};

export { thunks };
