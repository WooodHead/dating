import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";
import { toast } from "react-toastify";
import { userRelations } from "utils/userActions";

const getPublicProfile = createAsyncThunk('public/profile', async (userId, { rejectWithValue }) => {
  try {
    const res = await api.publicProfile.getPublicProfile(userId);
    return res.data;
  } catch (err) {
    const res = err.response.data;
    if (res?.statusCode === 406) {
      return rejectWithValue(res);
    } else {
      requestProcessing(err);
      throw err;
    }
  }
});

const relationsUser = createAsyncThunk('public/relations-user', async (data) => {
  try {
    const res = await api.publicProfile.relationsUser(data);
  
    if (userRelations(data.relation)) toast.success('User has been blocked');
    else toast.success('User has been unblocked');
    
    return { ...res.data, relation: data.relation };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const getListOfReasons = createAsyncThunk('public/list-of-reasons', async () => {
  try {
    const res = await api.publicProfile.getListOfReasons();
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const reportUser = createAsyncThunk('user/report-user', async (data) => {
  try {
    const res = await api.publicProfile.reportUser(data);
  
    toast.success('User has been reported');
    
    return { ...res.data, status: true };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  getPublicProfile,
  relationsUser,
  getListOfReasons,
  reportUser,
};

export { thunks };
