import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";

const initialState = {
  plan: {},
  planId: 1,
  buyStatus: 'idle',
};

export const slice = createSlice({
  name: 'buyingSubscription',
  initialState: { ...initialState },
  reducers: {
    SET_PLAN: (state, { payload }) => {
      state.plan = { ...payload };
    },
    SET_PLAN_ID: (state, { payload }) => {
      state.planId = payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(thunks.buySubscription.pending, (state) => {
        state.buyStatus = 'pending';
      })
      .addCase(thunks.buySubscription.fulfilled, (state) => {
        state.buyStatus = 'success';
      })
      .addCase(thunks.buySubscription.rejected, (state) => {
        state.buyStatus = 'fail';
      });
  },
});

const buyingSubscription = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { buyingSubscription };
export default slice.reducer;
