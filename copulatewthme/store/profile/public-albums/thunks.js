import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";
import { publicAlbums } from "./index";

const getPublicAlbums = createAsyncThunk('user/public-albums', async ({ userId }, { getState }) => {
  try {
    const { offset, take } = publicAlbums.selectors.pagination(getState());
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

const thunks = {
  getPublicAlbums,
  getPublicAlbumInfo,
};

export { thunks };
