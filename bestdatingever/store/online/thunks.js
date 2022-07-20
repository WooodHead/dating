// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { api } from "api";
// import requestProcessing from "services/requestsProcessing";
// import { toast } from "react-toastify";

// const getUserSettings = createAsyncThunk('user/get-settings', async () => {
//   try {
//     const res = await api.userSettings.getUserSettings();
//     return res.data;
//   } catch (err) {
//     requestProcessing(err);
//     throw err;
//   }
// });

const thunks = {
  // getUserSettings,
  // saveUserSettings,
};

export { thunks };
