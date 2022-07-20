import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";
import PhotoCard from "resources/Cards/PhotoCard";
import { thunks as userVoteThunks } from "store/vote/thunks";
import { changingUserOrPhotoHeart, changingUserOrPhotoLike } from "utils/userVote";

const initialState = {
  photos: [],
  status: 'idle',
};

const findIdxCurrentPhoto = (photos, photoId) => {
  return photos.findIndex(photo => photo._id === photoId);
};

const slice = createSlice({
  name: 'publicPhotosByAlbum',
  initialState: { ...initialState },
  reducers: {
    SET_STATUS_REQUEST: (state, { payload }) => {
      state.status = payload;
    },
    RESET_STATE: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getPhotosByAlbum.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(thunks.getPhotosByAlbum.fulfilled, (state, { payload }) => {
        state.status = 'success';
        state.photos = payload.photos.map(({photoId: _id, link: img, likes}, key) => {
          return new PhotoCard({photo: {_id, img, likes}, key}).getPhoto();
        })
      })
      .addCase(thunks.getPhotosByAlbum.rejected, (state) => {
        state.status = 'fail';
      })
  
      .addCase(userVoteThunks.setPhotoHeart.fulfilled, (state, { payload: { statusCode, photoId } }) => {
        if (state.photos.length > 0 && statusCode === 200) {
          const idx = findIdxCurrentPhoto(state.photos, photoId);
          if (idx !== -1) changingUserOrPhotoHeart(state.photos[idx], 'likes', 'add');
        }
    
        if (state.photos.length > 0 && statusCode === 202) {
          const idx = findIdxCurrentPhoto(state.photos, photoId);
          if (idx !== -1) changingUserOrPhotoHeart(state.photos[idx], 'likes', 'remove');
        }
      })
  
      .addCase(userVoteThunks.setPhotoLike.fulfilled, (state, { payload: { statusCode, photoId } }) => {
        if (state.photos.length > 0 && statusCode === 200) {
          const idx = findIdxCurrentPhoto(state.photos, photoId);
          if (idx !== -1) changingUserOrPhotoLike(state.photos[idx], 'likes', 'add');
        }
    
        if (state.photos.length > 0 && statusCode === 202) {
          const idx = findIdxCurrentPhoto(state.photos, photoId);
          if (idx !== -1) changingUserOrPhotoLike(state.photos[idx], 'likes', 'remove');
        }
      });
  }
});

const publicPhotosByAlbum = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { publicPhotosByAlbum };
export default slice.reducer;
