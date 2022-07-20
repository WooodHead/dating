import requestProcessing from "services/requestsProcessing";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { userShareAlbums } from "./index";
import { api } from "api";

const getShareAlbums = createAsyncThunk('user/getShareAlbums', async ({ userId }, { getState }) => {
    try {
        const { offset, take } = userShareAlbums.selectors.pagination(getState());
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

const getUsersSharedAlbums = createAsyncThunk('user/getUsersSharedAlbums', async () => {
    try {
        const { data } = await api.userPrivateAlbums.getUsersSharedAlbums();
        return data;
    } catch (err) {
        requestProcessing(err);
        throw err;
    }
});

const thunks = {
    getShareAlbums,
    shareAlbumsThunk,
    getUsersSharedAlbums,
};

export { thunks };