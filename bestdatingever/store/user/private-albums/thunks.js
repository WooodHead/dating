import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";
import { userPrivateAlbums } from "./index";
import { toast } from "react-toastify";

const getPrivateAlbums = createAsyncThunk('user/private-albums', async ({ userId, isOwner }, { getState }) => {
  try {
    const { offset, take } = userPrivateAlbums.selectors.pagination(getState());
    const res = await api.userPrivateAlbums.getPrivateAlbums({ userId, offset, take });
    // console.log('=> RES ALBUMS', res.data);
    return {...res.data, isOwner};
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const deletePrivateAlbum = createAsyncThunk('user/delete-public-album', async ({ albumId, userId, page }, { dispatch, getState }) => {
  try {
    const res = await api.userPublicAlbums.deletePublicAlbum({ albumId });
    toast.success('Album has been deleted');
    const currentAlbumsCount = userPrivateAlbums.selectors.albums(getState()).length;
    let responsePage = page;
    if(currentAlbumsCount <= 1 && page > 1) {
      responsePage -= 1;
      dispatch(userPrivateAlbums.actions.CHANGE_PAGE(responsePage))
    }
    dispatch(userPrivateAlbums.actions.RESET_ALBUMS());
    dispatch(userPrivateAlbums.thunks.getPrivateAlbums({ userId, isOwner: true }));
    return responsePage;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  getPrivateAlbums,
  deletePrivateAlbum,
};

export { thunks };
