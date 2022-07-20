import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";

const setUserLike = createAsyncThunk('userVote/setUserLike', async (targetUserId) => {
  try {
    const res = await api.userVote.setUserLike(targetUserId);
    return { ...res.data, targetUserId };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const setUserHeart = createAsyncThunk('userVote/setUserHeart', async (targetUserId) => {
  try {
    const res = await api.userVote.setUserHeart(targetUserId);
    return { ...res.data, targetUserId };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const setPhotoLike = createAsyncThunk('userVote/setPhotoLike', async (photoId) => {
  try {
    const res = await api.userVote.setPhotoLike(photoId);
    return { ...res.data, photoId };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const setPhotoHeart = createAsyncThunk('userVote/setPhotoHeart', async (photoId) => {
  try {
    const res = await api.userVote.setPhotoHeart(photoId);
    return { ...res.data, photoId };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  setUserLike,
  setUserHeart,
  setPhotoLike,
  setPhotoHeart,
};

export { thunks };
