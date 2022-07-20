import { createSlice } from "@reduxjs/toolkit";
import { thunks } from "./thunks";
import { selectors } from "./selectors";

const initialState = {};

const slice = createSlice({
  name: 'userVote',
  initialState: { ...initialState },
  reducers: {},
  extraReducers: (builder) => {
  },
});

const userVote = {
  actions: slice.actions,
  thunks,
  selectors,
};

export { userVote };
export default slice.reducer;
