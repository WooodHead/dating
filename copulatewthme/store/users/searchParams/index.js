import { createSlice } from "@reduxjs/toolkit";
import { selectors } from "./selectors";
import { thunks as authThunk } from "../../auth/thunks";

const initialState = {
  list: {},
};

const slice = createSlice({
  name: 'searchParams',
  initialState: { ...initialState },
  reducers: {
    SET_SEARCH_PARAMS: (state, { payload }) => {
      state.list = { ...payload };
    },
    CHANGE_SEARCH_PARAMS: (state, { payload }) => {
      state.list = { ...state.list, ...payload };
    },
    RESET_STATE: () => initialState
  },
  extraReducers: (builder => {
    builder
      .addCase(authThunk.logout.fulfilled, () =>  initialState)
  })
});

const searchParams = {
  actions: slice.actions,
  selectors,
};

export { searchParams };
export default slice.reducer;
