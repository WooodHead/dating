import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";

const initialState = {
  usersSharedAlbums: [],
  shareAlbumsStatus: 'idle',
  getShareAlbumsStatus: 'idle',
  loadingUsersSharedAlbumsStatus: 'idle',
  refuseSharingFromUserStatus: 'idle',
  pagination: {
    take: 99,
    offset: 0,
  },
};

const slice = createSlice({
    name: 'userShareAlbums',
    initialState: { ...initialState },
    reducers: {
      RESET_STATE: () => initialState
    },
    extraReducers: (builder) => {
      builder
        .addCase(thunks.shareAlbumsThunk.pending, (state) => {
          state.shareAlbumsStatus = 'pending';
        })
        .addCase(thunks.shareAlbumsThunk.fulfilled, (state) => {
          state.shareAlbumsStatus = 'success';
        })
        .addCase(thunks.shareAlbumsThunk.rejected, (state) => {
          state.shareAlbumsStatus = 'fail';
        })
        .addCase(thunks.getShareAlbums.pending, (state) => {
          state.getShareAlbumsStatus = 'pending';
        })
        .addCase(thunks.getShareAlbums.fulfilled, (state) => {
          state.getShareAlbumsStatus = 'success';
        })
        .addCase(thunks.getShareAlbums.rejected, (state) => {
          state.getShareAlbumsStatus = 'fail';
        })

        .addCase(thunks.getUsersSharedAlbums.pending, (state) => {
          state.loadingUsersSharedAlbumsStatus = 'pending';
        })
        .addCase(thunks.getUsersSharedAlbums.fulfilled, (state, { payload }) => {
          state.usersSharedAlbums = payload;
          state.loadingUsersSharedAlbumsStatus = 'success';
        })
        .addCase(thunks.getUsersSharedAlbums.rejected, (state) => {
          state.loadingUsersSharedAlbumsStatus = 'fail';
        })

        .addCase(thunks.refuseSharingFromUser.pending, (state) => {
          state.refuseSharingFromUserStatus = 'pending';
        })
        .addCase(thunks.refuseSharingFromUser.fulfilled, (state) => {
          state.refuseSharingFromUserStatus = 'success';
        })
        .addCase(thunks.refuseSharingFromUser.rejected, (state) => {
          state.refuseSharingFromUserStatus = 'fail';
        });
}});

const userShareAlbums = {
    actions: slice.actions,
    thunks,
    selectors,
};

export { userShareAlbums };
export default slice.reducer;
