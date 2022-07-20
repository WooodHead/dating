import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";

const initialState = {
  enums: {},
  enumsStatus: 'idle',
  nationals: [],
  nationalsStatus: 'idle',
  lang: [],
  langStatus: 'idle',
  location: [],
  locationPag: { take: 9999, offset: 0 },
  locationStatus: 'idle'
};

export const slice = createSlice({
  name: 'additionalData',
  initialState: { ...initialState },
  reducers: {
    RESET_LOCATION: state => { state.location = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.getAdditionalEnums.pending, (state) => {
        state.enumsStatus = 'pending';
      })
      .addCase(thunks.getAdditionalEnums.fulfilled, (state, { payload }) => {
        state.enums = payload;
        state.enumsStatus = 'success';
      })
      .addCase(thunks.getAdditionalEnums.rejected, (state) => {
        state.enumsStatus = 'fail';
      })

      .addCase(thunks.getAdditionalNational.pending, (state) => {
        state.nationalsStatus = 'pending';
      })
      .addCase(thunks.getAdditionalNational.fulfilled, (state, { payload }) => {
        state.nationals = payload;
        state.nationalsStatus = 'success';
      })
      .addCase(thunks.getAdditionalNational.rejected, (state) => {
        state.nationalsStatus = 'fail';
      })

      .addCase(thunks.getAdditionalLang.pending, (state) => {
        state.langStatus = 'pending';
      })
      .addCase(thunks.getAdditionalLang.fulfilled, (state, { payload }) => {
        state.lang = payload;
        state.langStatus = 'success';
      })
      .addCase(thunks.getAdditionalLang.rejected, (state) => {
        state.langStatus = 'fail';
      })

      .addCase(thunks.getAdditionalLocation.pending, (state) => {
        state.locationStatus = 'pending';
      })
      .addCase(thunks.getAdditionalLocation.fulfilled, (state, { payload }) => {
        state.location = payload;
        state.locationStatus = 'success';
      })
      .addCase(thunks.getAdditionalLocation.rejected, (state) => {
        state.locationStatus = 'fail';
      });
  },
});

const additionalData = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { additionalData };
export default slice.reducer;
