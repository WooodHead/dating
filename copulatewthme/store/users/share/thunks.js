import requestProcessing from "services/requestsProcessing";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { shareAlbums } from "./index";
import { api } from "api";

const getShareUsers = createAsyncThunk('user/getShareUsers', async ({ name }, { getState }) => {
    try {
        const { offset, take } = shareAlbums.selectors.pagination(getState());
        const res = await api.usersProfiles.getShareUsers({ offset, take, name });
        return res.data;
    } catch (err) {
        requestProcessing(err);
        throw err;
    }
});

const getUsersAlbumSharedTo = createAsyncThunk('user/getUsersAlbumSharedTo', async (albumId, { getState }) => {
    try {
        const { offset, take } = shareAlbums.selectors.pagination(getState());
        const { data } = await api.userPrivateAlbums.getUsersAlbumSharedTo({ offset, take, albumId });
        return data;
    } catch (err) {
        requestProcessing(err);
        throw err;
    }
});

const getShareAlbums = createAsyncThunk('user/getShareAlbums', async ({ userId }, { getState }) => {
    try {
        const { offset, take } = shareAlbums.selectors.pagination(getState());
        const res = await api.userPrivateAlbums.getPrivateAlbums({ userId, offset, take });
        return {...res.data};
    } catch (err) {
        requestProcessing(err);
        throw err;
    }
});

const shareAlbumsThunk = createAsyncThunk('user/shareAlbums', async ({ albumsIds, userId }, { rejectWithValue }) => {
    try {
        const { data } = await api.userPrivateAlbums.shareAlbums({ albumsIds, userId });
        toast.success(data.message);
        return data;
    } catch (err) {
        const res = err.response.data;
        if (res?.statusCode === 400) {
            toast.warning(res?.message);
            throw err;
        } else if (res?.statusCode === 403) {
            return rejectWithValue(res);
        } else if (res?.statusCode === 418) {
            return rejectWithValue(res)
        } else {
            requestProcessing(err);
            throw err;
        }
    }
});

const deleteSharedUser = createAsyncThunk('user/deleteSharedUser', async ({ userId, albumId }, { rejectWithValue }) => {
    try {
        const { data } = await api.userPrivateAlbums.deleteSharedUser({ userId, albumId });
        toast.success(data.message);
        return data;
    } catch (err) {
        const res = err.response.data;
        if (res?.statusCode === 400) {
            toast.warning(res?.message);
            throw err;
        } else if (res?.statusCode === 403) {
            return rejectWithValue(res);
        } else if (res?.statusCode === 418) {
            return rejectWithValue(res)
        } else {
            requestProcessing(err);
            throw err;
        }
    }
});

const thunks = {
    getShareUsers,
    getShareAlbums,
    shareAlbumsThunk,
    deleteSharedUser,
    getUsersAlbumSharedTo,
};

export { thunks };