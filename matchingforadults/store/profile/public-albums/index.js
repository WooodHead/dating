import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";
import AlbumCard from "resources/Cards/AlbumCard";

const initialState = {
  albums: [],
  albumsCount: 0,
  pagination: {
    take: 6,
    offset: 0,
  },
  getAlbumsStatus: 'idle',
  currentAlbum: {},
  currentAlbumStatus: 'idle',
};

export const slice = createSlice({
  name: 'publicAlbums',
  initialState: { ...initialState },
  reducers: {
    CHANGE_PAGE: (state, {payload}) => {
      state.pagination.offset = state.pagination.take * (payload - 1)
    },
    RESET_CURRENT_ALBUM: (state) => {
      state.currentAlbum = initialState.currentAlbum;
      state.currentAlbumStatus = 'idle';
    },
    RESET_STATE: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getPublicAlbums.pending, (state) => {
        state.getAlbumsStatus = 'pending';
      })
      .addCase(thunks.getPublicAlbums.fulfilled, (state, { payload }) => {
        state.albums = payload.album.map(album => {
          const publicAlbum = new AlbumCard(album);
          return publicAlbum.getAlbum();
        });
        state.albumsCount = payload.count;
        state.getAlbumsStatus = 'success';
      })
      .addCase(thunks.getPublicAlbums.rejected, (state) => {
        state.getAlbumsStatus = 'fail';
      })
      
      .addCase(thunks.getPublicAlbumInfo.pending, (state) => {
        state.currentAlbumStatus = 'pending';
      })
      .addCase(thunks.getPublicAlbumInfo.fulfilled, (state, { payload }) => {
        const { _id, name, type } = payload;
        state.currentAlbum = { _id, name, type };
        state.currentAlbumStatus = 'success';
      })
      .addCase(thunks.getPublicAlbumInfo.rejected, (state) => {
        state.currentAlbumStatus = 'fail';
      })
  },
});

const publicAlbums = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { publicAlbums };
export default slice.reducer;
