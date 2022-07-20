import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";
import AlbumCard from "resources/Cards/AlbumCard";

const initialState = {
  albums: [],
  albumsCount: 0,
  pagination: {
    take: 5,
    offset: 0,
  },
  getAlbumsStatus: 'idle',
  deleteAlbumStatus: 'idle',
};

export const slice = createSlice({
  name: 'privateAlbums',
  initialState: { ...initialState },
  reducers: {
    CHANGE_PAGE: (state, { payload }) => {
      state.pagination.offset = state.pagination.take * (payload - 1)
      console.log(state.pagination.offset)
    },
    RESET_STATE: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getPrivateAlbums.pending, (state) => {
        state.getAlbumsStatus = 'pending';
      })
      .addCase(thunks.getPrivateAlbums.fulfilled, (state, { payload }) => {
        state.albums = payload.album.map(album => {
          const publicAlbum = new AlbumCard(album, payload.isOwner);
          return publicAlbum.getAlbum();
        });
        state.albumsCount = payload.count;
        state.getAlbumsStatus = 'success';
      })
      .addCase(thunks.getPrivateAlbums.rejected, (state) => {
        state.getAlbumsStatus = 'fail';
      })
  },
});

const privateAlbums = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { privateAlbums };
export default slice.reducer;
