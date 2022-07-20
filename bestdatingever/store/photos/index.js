import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";

const initialState = {
  photosById: [],
  status: 'idle',
};

const slice = createSlice({
  name: 'photos',
  initialState: { ...initialState },
  reducers: {
    SET_PHOTOS_LENGTH: (state, { payload }) => {
      state.photosById = new Array(payload);
    },
    RESET_STATE: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getPhotoById.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(thunks.getPhotoById.fulfilled, (state, { payload }) => {
        state.status = 'success';
        state.photosById[payload.index] = {original: payload.link};
      })
      .addCase(thunks.getPhotoById.rejected, (state) => {
        state.status = 'fail';
      })
  }
});

const photos = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { photos };
export default slice.reducer;
