import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";
import { privateAlbums } from "./index";

const getPrivateAlbums = createAsyncThunk('user/private-albums', async ({ userId, isOwner }, { getState }) => {
  try {
    const { offset, take } = privateAlbums.selectors.pagination(getState());
    console.log(privateAlbums.selectors.pagination(getState()))
    const res = await api.userPrivateAlbums.getPrivateAlbums({ userId, offset, take });
    // console.log('=> RES ALBUMS', res.data);
    return {...res.data, isOwner};
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  getPrivateAlbums,
};

export { thunks };
