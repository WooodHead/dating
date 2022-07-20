import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import { additionalData } from "./additionalData";
import requestProcessing from "services/requestsProcessing";

const getAdditionalEnums = createAsyncThunk('additional/enums', async () => {
  try {
    const res = await api.additionalData.getAdditionalEnums();
    // console.log('=> RES ENUMS', res.data);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const getAdditionalNational = createAsyncThunk('additional/nationals', async () => {
  try {
    const res = await api.additionalData.getAdditionalNational();
    // console.log('=> RES NATION', res.data);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const getAdditionalLang = createAsyncThunk('additional/lang', async () => {
  try {
    const res = await api.additionalData.getAdditionalLang();
    // console.log('=> RES NATION', res.data);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const getAdditionalLocation = createAsyncThunk('additional/location', async (params, { dispatch, getState }) => {
  try {
    dispatch(additionalData.actions.RESET_LOCATION());
    const { offset, take } = additionalData.selectors.locationPag(getState());
    const res = await api.additionalData.getAdditionalLocation({ ...params, offset, take });
    // console.log('=> RES LOCATION', res.data);
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  getAdditionalEnums,
  getAdditionalNational,
  getAdditionalLang,
  getAdditionalLocation,
};

export { thunks };
