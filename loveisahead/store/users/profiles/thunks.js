import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import { usersProfiles } from "./index";
import { searchParams } from "../searchParams";
import { userProfile } from "../../user/profile";
import { preferences } from "utils/constants";
import requestProcessing from "services/requestsProcessing";

const getUsers = async (params, getState) => {
  try {
    const { offset, take } = usersProfiles.selectors.pagination(getState());
    const { location, languages, nationality, gender, ...paramsList } = searchParams.selectors.list(getState());
    const myProfile = userProfile.selectors.profile(getState());
    const defaultParams = { ...paramsList, offset, take };

    if (location && Object.keys(location).length > 0) defaultParams.location = location._id;
    if (!location) defaultParams.location = myProfile.location?._id;

    if (languages) defaultParams.languages = languages.map(lang => lang._id);
    if (nationality) defaultParams.nationality = nationality._id;

    if (gender !== undefined) {
      if (gender !== preferences.ALL) defaultParams.gender = gender;
    } else {
      if (myProfile.preference !== preferences.ALL) defaultParams.gender = myProfile.preference;
    }

    const res = await api.usersProfiles.getUsersProfiles({ ...defaultParams, ...params });

    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
};

const getUsersProfiles = createAsyncThunk('user/getProfiles', (params, { getState }) => {
  return getUsers(params, getState);
});

const loadMore = createAsyncThunk('user/loadMoreProfiles', (params, { getState }) => {
  return getUsers(params, getState);
});

const thunks = {
  getUsersProfiles,
  loadMore
};

export { thunks };
