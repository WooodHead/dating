import { createSlice } from "@reduxjs/toolkit";
import { selectors } from "./selectors";

const initialState = {
  windowSize: {
    width: 1920,
    height: 1080,
  }
};

const slice = createSlice({
  name: 'windowActions',
  initialState: { ...initialState },
  reducers: {
    SET_WINDOW_RESIZE: (state, { payload }) => {
      state.windowSize = {
        width: payload.width,
        height: payload.height,
      };
    },
    RESET_STATE: () => initialState
  }
});

const windowActions = {
  actions: slice.actions,
  selectors,
};

export { windowActions };
export default slice.reducer;
