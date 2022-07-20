import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";

const initialState = {
    shareUsers: [],
    shareAlbums: [],
    usersAlbumSharedTo: [],
    loadingShareUsersStatus: 'idle',
    loadingShareAlbumsStatus: 'idle',
    loadingUsersAlbumSharedTo: 'idle',
    deleteUserStatus: 'idle',
    shareAlbumsStatus: 'idle',
    pagination: {
        current: 0,
        take: 99,
        offset: 0,
    },
};

const slice = createSlice({
    name: 'shareAlbums',
    initialState: { ...initialState },
    reducers: {
        RESET_USERS: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(thunks.getShareUsers.pending, (state) => {
                state.loadingShareUsersStatus = 'pending';
            })
            .addCase(thunks.getShareUsers.fulfilled, (state, { payload }) => {
                state.shareUsers = payload;
                state.pagination = {
                    ...state.pagination,
                    offset: state.pagination.offset + state.pagination.current
                };
                state.loadingShareUsersStatus = 'success';
            })
            .addCase(thunks.getShareUsers.rejected, (state) => {
                state.loadingShareUsersStatus = 'fail';
            })

            .addCase(thunks.getShareAlbums.pending, (state) => {
                state.loadingShareAlbumsStatus = 'pending';
            })
            .addCase(thunks.getShareAlbums.fulfilled, (state, { payload: { album } }) => {
                state.shareAlbums = album;
                state.pagination = {
                    ...state.pagination,
                    offset: state.pagination.offset + state.pagination.current
                };
                state.loadingShareAlbumsStatus = 'success';
            })
            .addCase(thunks.getShareAlbums.rejected, (state) => {
                state.loadingShareAlbumsStatus = 'fail';
            })

            .addCase(thunks.getUsersAlbumSharedTo.pending, (state) => {
                state.loadingUsersAlbumSharedTo = 'pending';
            })
            .addCase(thunks.getUsersAlbumSharedTo.fulfilled, (state, { payload }) => {
                state.usersAlbumSharedTo = payload;
                state.pagination = {
                    ...state.pagination,
                    offset: state.pagination.offset + state.pagination.current
                };
                state.loadingUsersAlbumSharedTo = 'success';
            })
            .addCase(thunks.getUsersAlbumSharedTo.rejected, (state) => {
                state.loadingUsersAlbumSharedTo = 'fail';
            })

            .addCase(thunks.shareAlbumsThunk.pending, (state) => {
                state.shareAlbumsStatus = 'pending';
            })
            .addCase(thunks.shareAlbumsThunk.fulfilled, (state) => {
                state.shareAlbumsStatus = 'success';
            })
            .addCase(thunks.shareAlbumsThunk.rejected, (state) => {
                state.shareAlbumsStatus = 'fail';
            })

            .addCase(thunks.deleteSharedUser.pending, (state) => {
                state.deleteUserStatus = 'pending';
            })
            .addCase(thunks.deleteSharedUser.fulfilled, (state) => {
                state.deleteUserStatus = 'success';
            })
            .addCase(thunks.deleteSharedUser.rejected, (state) => {
                state.deleteUserStatus = 'fail';
            })
}});

const shareAlbums = {
    actions: slice.actions,
    thunks,
    selectors,
};

export { shareAlbums };
export default slice.reducer;
