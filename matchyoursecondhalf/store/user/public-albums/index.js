import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";
import AlbumCard from "resources/Cards/AlbumCard";

const initialState = {
  albums: [],
  albumsCount: 0,
  pagination: {
    take: 7,
    offset: 0,
  },
  createAlbumStatus: 'idle',
  getAlbumsStatus: 'idle',
  deleteAlbumStatus: 'idle',
  //
  currentAlbum: {},
  currentAlbumStatus: 'idle',
};

export const slice = createSlice({
  name: 'userPublicAlbums',
  initialState: { ...initialState },
  reducers: {
    CHANGE_PAGE: (state, { payload }) => {
      state.pagination.offset = state.pagination.take * (payload - 1)
    },
    RESET_ALBUMS: (state) => {
      state.albums = initialState.albums;
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
  
      .addCase(thunks.deletePublicAlbum.pending, (state) => {
        state.deleteAlbumStatus = 'pending';
      })
      .addCase(thunks.deletePublicAlbum.fulfilled, (state) => {
        state.deleteAlbumStatus = 'success';
      })
      .addCase(thunks.deletePublicAlbum.rejected, (state) => {
        state.deleteAlbumStatus = 'fail';
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

      .addCase(thunks.createAlbum.pending, (state) => {
        state.createAlbumStatus = 'pending';
      })
      .addCase(thunks.createAlbum.fulfilled, (state) => {
        state.createAlbumStatus = 'success';
      })
      .addCase(thunks.createAlbum.rejected, (state) => {
        state.createAlbumStatus = 'fail';
      });
  },
});

const userPublicAlbums = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { userPublicAlbums };
export default slice.reducer;
