import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "api";
import requestProcessing from "services/requestsProcessing";
import { selectors } from "store/chats/room/selectors";
import { thunks as chatsThunks } from "store/chats/thunks";
import { chats } from "../index";
import { toast } from "react-toastify";
import Router from "next/router";

const getMessages = createAsyncThunk('chat/get-messages', async (params, { getState, rejectWithValue }) => {
  try {
    const { take, offset } = selectors.listMsgPag(getState());
    const chatLink = selectors.currentRoomId(getState());
    
    const res = await api.chats.getMessages({ take, offset, chatLink, ...params });
    
    return res.data;
  } catch (err) {
    const res = err.response.data;
    if (res?.statusCode === 406) { // if chat not found | statusCode: 406
      return rejectWithValue(res);
    } else {
      requestProcessing(err);
      throw err;
    }
  }
});

const loadOldMessages = createAsyncThunk('user/load-old-messages', async (params, { getState }) => {
  try {
    const { take, offset } = selectors.listOldMsgPag(getState());
    const chatLink = selectors.currentRoomId(getState());
    
    const res = await api.chats.loadOldMessages({ take, offset, chatLink, ...params });
    
    return res.data;
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const sendMessage = createAsyncThunk('chat/send-message', async (msg, { getState, dispatch, rejectWithValue }) => {
  try {
    const targetUserId = selectors.targetUserId(getState());
    const currentRoomId = selectors.currentRoomId(getState());
    
    const res = await api.chats.sendMessage({ targetUserId, message: msg });
    
    if (!currentRoomId) {
      dispatch(chats.actions.RESET_STATE());
      dispatch(chatsThunks.getChats());
      Router.push(`/chat/${res.data.chatId}`);
    }
    
    return { ...res.data, msg };
  } catch (err) {
    const res = err.response.data;
    if (res?.statusCode === 403) {
      return rejectWithValue(res);
    } else {
      requestProcessing(err);
      throw err;
    }
  }
});

const muteChat = createAsyncThunk('chat/mute-chat', async (data, { getState }) => {
  try {
    const roomId = selectors.currentRoomId(getState());
    const profile = selectors.profile(getState());
    const currentRoomConfig = selectors.currentRoomConfig(getState());
    const isMute = !currentRoomConfig.isMute;
    
    const res = await api.chats.muteOrArchiveChat(roomId, { isMute });
    
    if (isMute) toast.success(`Chat with ${profile.name} was muted`);
    else toast.success(`Chat with ${profile.name} was unmuted`);
    
    return { ...res.data, ...data, roomId, isMute };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const archiveChat = createAsyncThunk('chat/archive-chat', async (data, { getState }) => {
  try {
    const roomId = selectors.currentRoomId(getState());
    const profile = selectors.profile(getState());
    const currentRoomConfig = selectors.currentRoomConfig(getState());
    const isArchived = !currentRoomConfig.isArchived;
    
    const res = await api.chats.muteOrArchiveChat(roomId, { isArchived });
    
    if (isArchived) toast.success(`Chat with ${profile.name} was archived`);
    else toast.success(`Chat with ${profile.name} was de-archived`);
    
    return { ...res.data, ...data, roomId, isArchived };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const removeChat = createAsyncThunk('chat/remove-chat', async (data, { getState }) => {
  try {
    const roomId = selectors.currentRoomId(getState());
    const profile = selectors.profile(getState());
    
    const res = await api.chats.removeChat(roomId);
    
    toast.success(`Chat with ${profile.name} was deleted`);
    Router.push('/chat');
    
    return { ...res.data, ...data, roomId };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const markAsRead = createAsyncThunk('chat/mark-as-read', async (messagesIds, { getState }) => {
  try {
    const roomId = selectors.currentRoomId(getState());
    
    await api.chats.markAsRead({ chatLink: roomId, messagesIds });
    
    return { messagesIds, chatLink: roomId };
  } catch (err) {
    requestProcessing(err);
    throw err;
  }
});

const thunks = {
  getMessages,
  loadOldMessages,
  sendMessage,
  muteChat,
  archiveChat,
  removeChat,
  markAsRead,
};

export { thunks };
