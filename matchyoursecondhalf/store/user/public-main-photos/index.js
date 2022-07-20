import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { thunks as authThunk } from "store/auth/thunks";
import { selectors } from "./selectors";
import PhotoCard from "resources/Cards/PhotoCard";

const initialState = {
  photos: [],
  status: 'idle',
  addPhotoStatus: 'idle',
  deletePhotoStatus: 'idle',
  getPhotoStatus: 'idle',
};

const slice = createSlice({
  name: 'userPublicMainPhotos',
  initialState: { ...initialState },
  reducers: {
    POP_PHOTOS: (state) => {
      state.photos.pop();
    },
    RESET_STATE: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.addPhoto.pending, (state) => {
        state.addPhotoStatus = 'pending';
        const photoCard = new PhotoCard({}).getPhotoDefault();
        state.photos.push(photoCard);
      })
      .addCase(thunks.addPhoto.fulfilled, (state, { payload}) => {
        state.addPhotoStatus = 'success';
        const { path, photoId } = payload;
        const photo = { img: path, _id: photoId };
        const photoCard = new PhotoCard({ photo }).getPhoto();
        const index = state.photos.findIndex((item) => item.inProcess);
        state.photos[index] = photoCard;
      })
      .addCase(thunks.addPhoto.rejected, (state) => {
        state.addPhotoStatus = 'fail';
        const photoCard = new PhotoCard({});
        photoCard.setPhotoError();
        state.photos[state.photos.length - 1] = photoCard.getPhotoDefault();
      })
      
      .addCase(thunks.deletePhoto.pending, (state) => {
        state.deletePhotoStatus = 'pending';
      })
      .addCase(thunks.deletePhoto.fulfilled, (state, { payload }) => {
        state.deletePhotoStatus = 'success';
        state.photos = state.photos.filter(photo => photo._id !== payload);
      })
      .addCase(thunks.deletePhoto.rejected, (state) => {
        state.deletePhotoStatus = 'fail';
      })

      .addCase(thunks.getPhotos.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(thunks.getPhotos.fulfilled, (state, { payload }) => {
        state.status = 'success';
        const transformResponse = payload.photos.map(({link, photoId}) => ({img: link, _id: photoId}))
        state.photos = transformResponse.map((photo, key) => {
          const photoCard = new PhotoCard({ photo, key });
          return photoCard.getPhoto();
        });
      })
      .addCase(thunks.getPhotos.rejected, (state) => {
        state.status = 'fail';
      })

      .addCase(authThunk.logout.fulfilled, (state) =>  initialState)
  }
});

const userPublicMainPhotos = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { userPublicMainPhotos };
export default slice.reducer;
