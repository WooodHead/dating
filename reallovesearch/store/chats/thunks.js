import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";
import { chats } from "./index";

const getChats = createAsyncThunk('user/get-chats', async (params, { getState }) => {
  try {
    const { take, offset } = chats.selectors.listPag(getState());
    
    const res = await api.chats.getChats({ take, offset, ...params });
    
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const getChatsMore = createAsyncThunk('user/get-chats-more', async (params, { getState }) => {
  try {
    const { take, offset } = chats.selectors.listPag(getState());
    
    const res = await api.chats.getChats({ take, offset, ...params });
    
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  getChats,
  getChatsMore,
};

export { thunks };
