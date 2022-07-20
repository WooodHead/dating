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
  name: 'publicPhotos',
  initialState: { ...initialState },
  reducers: {
    RESET_STATE: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getPhotos.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(thunks.getPhotos.fulfilled, (state, { payload }) => {
        state.status = 'success';
        const transformResponse = payload.photos.map(({link, photoId, likes, type}) => ({img: link, _id: photoId, likes, type}))
        state.photos = transformResponse.map((photo, key) => {
          const photoCard = new PhotoCard({ photo, key });
          return photoCard.getPhoto();
        });
      })
      .addCase(thunks.getPhotos.rejected, (state) => {
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
  },
});

const publicPhotos = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { publicPhotos };
export default slice.reducer;
