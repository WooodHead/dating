import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
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
  name: 'userPublicPhotosByAlbum',
  initialState: { ...initialState },
  reducers: {
    POP_PHOTOS: (state) => {
      state.photos.pop();
    },
    SET_PHOTOS: (state, { payload }) => {
      state.photos = payload.map((photo, key) => {
        const photoCard = new PhotoCard({ photo, key });
        return photoCard.getPhoto();
      });
      state.status = 'success';
    },
    SET_STATUS_REQUEST: (state, { payload }) => {
      state.status = payload;
    },
    ADD_PHOTO: (state, { payload }) => {
      const photo = new PhotoCard({});
      const photoDefault = photo.getPhotoDefault();
      photoDefault._id = payload.photoId;
      state.photos.push(photoDefault);
    },
    SET_PHOTO: (state, { payload }) => {
      const photoIdx = state.photos.findIndex(photo => photo._id === payload.photoId);
      const photoCard = new PhotoCard({ photo: {
          _id: payload.photoId,
          img: payload.img,
        }
      });
      state.photos[photoIdx] = photoCard.getPhoto();
    },
    DELETE_PHOTO: (state, { payload }) => {
      state.photos = state.photos.filter(photo => photo._id !== payload);
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
      .addCase(thunks.addPhoto.fulfilled, (state, {payload}) => {
        state.addPhotoStatus = 'success';
        const { photoId: _id, path: img } = payload;
        const photoCard = new PhotoCard({ photo: { _id, img } }).getPhoto();
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
  
      .addCase(thunks.getPhotosByAlbum.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(thunks.getPhotosByAlbum.fulfilled, (state, { payload }) => {
        state.status = 'success';
        state.photos = payload.photos.map(({photoId: _id, link: img}, key) => {
          return new PhotoCard({photo: {_id, img}, key}).getPhoto();
        })
      })
      .addCase(thunks.getPhotosByAlbum.rejected, (state) => {
        state.status = 'fail';
      })
      
      .addCase(thunks.editAlbum.pending, (state) => {
        state.getPhotoStatus = 'pending';
      })
      .addCase(thunks.editAlbum.fulfilled, (state) => {
        state.getPhotoStatus = 'success';
      })
      .addCase(thunks.editAlbum.rejected, (state) => {
        state.getPhotoStatus = 'fail';
      });
  }
});

const userPublicPhotosByAlbum = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { userPublicPhotosByAlbum };
export default slice.reducer;
